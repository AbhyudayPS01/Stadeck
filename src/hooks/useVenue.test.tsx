import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { DEFAULT_VENUE_ID } from '../config/constants';
import { VenueProvider } from '../context/VenueProvider';
import { findVenue } from '../services/data/venues';
import { useVenue } from './useVenue';

function wrapper({ children }: { children: ReactNode }) {
  return <VenueProvider>{children}</VenueProvider>;
}

describe('useVenue', () => {
  it('defaults to the app-wide default venue', () => {
    const { result } = renderHook(() => useVenue(), { wrapper });

    expect(result.current.venue.id).toBe(DEFAULT_VENUE_ID);
    expect(result.current.venue.name).toBe('MetLife Stadium');
  });

  it('switches to another registered venue', () => {
    const { result } = renderHook(() => useVenue(), { wrapper });

    act(() => result.current.setVenueId('bmo-field'));

    expect(result.current.venue.id).toBe('bmo-field');
    expect(result.current.venue.city).toBe('Toronto');
  });

  it('honours an initialVenueId for tests and previews', () => {
    const { result } = renderHook(() => useVenue(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <VenueProvider initialVenueId="estadio-azteca">{children}</VenueProvider>
      ),
    });

    expect(result.current.venue.id).toBe('estadio-azteca');
  });

  it('keeps a stable venue object reference across unrelated re-renders', () => {
    const { result, rerender } = renderHook(() => useVenue(), { wrapper });
    const firstVenue = result.current.venue;

    rerender();

    expect(result.current.venue).toBe(firstVenue);
  });

  it('falls back to the default venue for an unknown id rather than crashing', () => {
    const { result } = renderHook(() => useVenue(), { wrapper });

    act(() => result.current.setVenueId('camp-nou'));

    expect(result.current.venue.id).toBe(DEFAULT_VENUE_ID);
  });

  it('throws when used outside a VenueProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useVenue())).toThrow(/within a VenueProvider/);
  });

  it('never stores the venue outside React state (no localStorage)', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useVenue(), { wrapper });

    act(() => result.current.setVenueId('bc-place'));

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(findVenue('bc-place')).toBeDefined();
    setItemSpy.mockRestore();
  });
});
