import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../context/LanguageProvider';
import { VenueProvider } from '../../context/VenueProvider';
import { useVenue } from '../../hooks/useVenue';
import { VENUES } from '../../services/data/venues';
import { VenuePicker } from './VenuePicker';

/** Renders the venue name so tests can observe context propagation from the picker. */
function ActiveVenueName() {
  const { venue } = useVenue();
  return <p>Active: {venue.name}</p>;
}

function renderPicker() {
  return render(
    <VenueProvider>
      <LanguageProvider>
        <VenuePicker />
        <ActiveVenueName />
      </LanguageProvider>
    </VenueProvider>,
  );
}

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

describe('VenuePicker', () => {
  it('offers every registered venue', () => {
    renderPicker();

    expect(screen.getAllByRole('option')).toHaveLength(VENUES.length);
  });

  it('groups venues by host country', () => {
    renderPicker();

    const select = screen.getByLabelText('Match venue');
    const groupLabels = [...select.querySelectorAll('optgroup')].map((group) =>
      group.getAttribute('label'),
    );
    expect(groupLabels).toEqual(['United States', 'Canada', 'Mexico']);
  });

  it('shows capacity and roof as secondary detail on each option', () => {
    renderPicker();

    const option = screen.getByRole('option', { name: /MetLife Stadium/ });
    expect(option.textContent).toContain('82,500');
    expect(option.textContent).toContain('Open air');
  });

  it('switches the active venue through the labeled select', async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.selectOptions(screen.getByLabelText('Match venue'), 'bmo-field');

    expect(screen.getByText('Active: BMO Field')).toBeInTheDocument();
  });

  it('never prompts for location on mount', () => {
    const getCurrentPosition = vi.fn();
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    });

    renderPicker();

    expect(getCurrentPosition).not.toHaveBeenCalled();
  });

  it('switches to the nearby venue and confirms the switch', async () => {
    const user = userEvent.setup();
    stubGeolocation((success) => success(stubPosition(40.81, -74.07))); // near MetLife Stadium
    renderPicker();

    await user.click(screen.getByRole('button', { name: 'Find nearest venue' }));

    expect(await screen.findByText('Active: MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText(/Switched your view/)).toBeInTheDocument();
  });

  it('surfaces a far-away nearest venue as information without switching', async () => {
    const user = userEvent.setup();
    const initialActive = 'Active: MetLife Stadium';
    // Sydney, Australia — nowhere near any World Cup venue.
    stubGeolocation((success) => success(stubPosition(-33.8688, 151.2093)));
    renderPicker();
    expect(screen.getByText(initialActive)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Find nearest venue' }));

    expect(await screen.findByText(/planning ahead/)).toBeInTheDocument();
    expect(screen.getByText(initialActive)).toBeInTheDocument();
  });

  it('falls back silently with no error state when permission is denied', async () => {
    const user = userEvent.setup();
    stubGeolocation((_success, error) => {
      error({ code: 1, message: 'User denied', PERMISSION_DENIED: 1 } as GeolocationPositionError);
    });
    renderPicker();

    await user.click(screen.getByRole('button', { name: 'Find nearest venue' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Find nearest venue' })).toBeEnabled();
  });

  it('is keyboard reachable: label associates with the select', () => {
    renderPicker();

    const select = screen.getByLabelText('Match venue');
    expect(select.tagName).toBe('SELECT');
  });

  it('lists MetLife Stadium first within the United States group', () => {
    renderPicker();

    const select = screen.getByLabelText('Match venue');
    const usGroup = [...select.querySelectorAll('optgroup')].find(
      (group) => group.getAttribute('label') === 'United States',
    );
    expect(usGroup).toBeDefined();
    if (!usGroup) return;
    const firstOption = within(usGroup).getAllByRole('option')[0];
    expect(firstOption?.textContent).toContain('MetLife Stadium');
  });
});
