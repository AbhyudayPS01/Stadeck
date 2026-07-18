import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGeolocatedVenue } from './useGeolocatedVenue';

type GeolocationSuccess = (position: GeolocationPosition) => void;
type GeolocationError = (error: GeolocationPositionError) => void;

function stubGeolocation(
  implementation: (success: GeolocationSuccess, error: GeolocationError) => void,
): void {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition: vi.fn(implementation) },
  });
}

function stubPosition(latitude: number, longitude: number): GeolocationPosition {
  return {
    coords: {
      latitude,
      longitude,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ({}),
    },
    timestamp: Date.now(),
    toJSON: () => ({}),
  };
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'geolocation');
});

describe('useGeolocatedVenue', () => {
  it('never calls geolocation on mount — no auto-prompt', () => {
    const getCurrentPosition = vi.fn();
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    });
    renderHook(() => useGeolocatedVenue());

    expect(getCurrentPosition).not.toHaveBeenCalled();
  });

  it('starts idle', () => {
    const { result } = renderHook(() => useGeolocatedVenue());
    expect(result.current.state.status).toBe('idle');
  });

  it('reports locating while the request is pending', () => {
    stubGeolocation(() => {
      // never resolves in this test
    });
    const { result } = renderHook(() => useGeolocatedVenue());

    act(() => result.current.locate());

    expect(result.current.state.status).toBe('locating');
  });

  it('finds the nearest venue on success', () => {
    // Just outside MetLife Stadium.
    stubGeolocation((success) => success(stubPosition(40.81, -74.07)));
    const { result } = renderHook(() => useGeolocatedVenue());

    act(() => result.current.locate());

    expect(result.current.state.status).toBe('found');
    if (result.current.state.status !== 'found') return;
    expect(result.current.state.result.venue.id).toBe('metlife-stadium');
    expect(result.current.state.result.distanceKm).toBeLessThan(5);
  });

  it('reports the far-away nearest venue without treating it as an error', () => {
    // Sydney, Australia — nowhere near any World Cup venue.
    stubGeolocation((success) => success(stubPosition(-33.8688, 151.2093)));
    const { result } = renderHook(() => useGeolocatedVenue());

    act(() => result.current.locate());

    expect(result.current.state.status).toBe('found');
    if (result.current.state.status !== 'found') return;
    expect(result.current.state.result.distanceKm).toBeGreaterThan(10_000);
  });

  it('falls back to idle with no error state when permission is denied', () => {
    stubGeolocation((_success, error) => {
      error({ code: 1, message: 'User denied', PERMISSION_DENIED: 1 } as GeolocationPositionError);
    });
    const { result } = renderHook(() => useGeolocatedVenue());

    act(() => result.current.locate());

    expect(result.current.state.status).toBe('idle');
  });

  it('falls back to idle with no error state when the request times out', () => {
    stubGeolocation((_success, error) => {
      error({ code: 3, message: 'Timeout', TIMEOUT: 3 } as GeolocationPositionError);
    });
    const { result } = renderHook(() => useGeolocatedVenue());

    act(() => result.current.locate());

    expect(result.current.state.status).toBe('idle');
  });

  it('falls back to idle silently when geolocation is unavailable in this browser', () => {
    Reflect.deleteProperty(navigator, 'geolocation');
    const { result } = renderHook(() => useGeolocatedVenue());

    act(() => result.current.locate());

    expect(result.current.state.status).toBe('idle');
  });
});
