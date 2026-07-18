import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ignoringIsolates } from '../../test/textMatchers';
import { LanguageProvider } from '../../context/LanguageProvider';
import { VenueProvider } from '../../context/VenueProvider';
import { useVenue } from '../../hooks/useVenue';
import { DEFAULT_VENUE } from '../../services/data/venues';
import NavigationScreen from './NavigationScreen';

/** Test-only sibling that can switch the active venue within the same provider. */
function VenueSwitchButton({ toVenueId }: { toVenueId: string }) {
  const { setVenueId } = useVenue();
  return (
    <button onClick={() => setVenueId(toVenueId)} type="button">
      Switch venue
    </button>
  );
}

vi.mock('../../services/gemini', () => ({
  getNavigationDirections: vi.fn(),
}));

import { getNavigationDirections } from '../../services/gemini';

const getNavigationDirectionsMock = vi.mocked(getNavigationDirections);

const DIRECTIONS = {
  summary: 'Enter at Gate C and follow the concourse to Section 118.',
  steps: ['Enter through Gate C.', 'Follow the concourse clockwise.', 'Turn in at Section 118.'],
  etaMinutes: 6,
};

function renderScreen(initialVenueId?: string) {
  return render(
    <VenueProvider initialVenueId={initialVenueId}>
      <LanguageProvider>
        <NavigationScreen />
      </LanguageProvider>
    </VenueProvider>,
  );
}

async function submitRoute(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText('Entry gate'), 'gate-c');
  await user.selectOptions(screen.getByLabelText('Your seating section'), 'sec-118');
  await user.click(screen.getByRole('button', { name: 'Get directions' }));
}

beforeEach(() => {
  getNavigationDirectionsMock.mockReset();
});

describe('NavigationScreen', () => {
  it('renders the module heading and the schematic stadium map', () => {
    renderScreen();

    expect(screen.getByRole('heading', { level: 1, name: 'Navigation' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /Schematic seating map of MetLife Stadium/ }),
    ).toBeInTheDocument();
  });

  it('disables "Get directions" until a section is chosen', () => {
    renderScreen();

    expect(screen.getByRole('button', { name: 'Get directions' })).toBeDisabled();
  });

  it('shows the closest restroom, food, and exit once a section is chosen', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.selectOptions(screen.getByLabelText('Your seating section'), 'sec-118');

    expect(
      screen.getByRole('heading', { name: ignoringIsolates('Closest to Section 118') }),
    ).toBeInTheDocument();
    expect(screen.getByText('Nearest restroom')).toBeInTheDocument();
    expect(screen.getByText('Nearest food')).toBeInTheDocument();
    expect(screen.getByText('Closest exit')).toBeInTheDocument();
  });

  it('fetches directions for the chosen gate, section, and active venue, and renders the steps', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock.mockResolvedValueOnce({ data: DIRECTIONS, source: 'live' });
    renderScreen();

    await submitRoute(user);

    expect(await screen.findByText(DIRECTIONS.summary)).toBeInTheDocument();
    expect(screen.getByText('Follow the concourse clockwise.')).toBeInTheDocument();
    expect(screen.getByText(ignoringIsolates('~6 min walk'))).toBeInTheDocument();
    const [gate, section, venue] = getNavigationDirectionsMock.mock.calls[0] ?? [];
    expect(gate?.id).toBe('gate-c');
    expect(section?.id).toBe('sec-118');
    expect(venue).toEqual(DEFAULT_VENUE);
  });

  it('highlights the route on the map after directions are requested', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock.mockResolvedValueOnce({ data: DIRECTIONS, source: 'live' });
    const { container } = renderScreen();

    expect(container.querySelector('[data-testid="route-overlay"]')).toBeNull();
    await submitRoute(user);

    expect(container.querySelector('[data-testid="route-overlay"]')).toBeInTheDocument();
  });

  it('marks mock directions with the Demo data badge', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock.mockResolvedValueOnce({ data: DIRECTIONS, source: 'mock' });
    renderScreen();

    await submitRoute(user);

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when directions fail', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: DIRECTIONS, source: 'live' });
    renderScreen();

    await submitRoute(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be fetched/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(DIRECTIONS.summary)).toBeInTheDocument();
  });

  it('renders a different venue’s own gates and sections when it is the active venue', () => {
    renderScreen('bmo-field');

    expect(
      screen.getByRole('group', { name: /Schematic seating map of BMO Field/ }),
    ).toBeInTheDocument();
    // MetLife's lower bowl runs to section 140; BMO Field's smaller ring does not.
    expect(screen.queryByRole('option', { name: 'Section 140' })).not.toBeInTheDocument();
  });

  it('clears the selected section and any in-progress plan when the venue changes', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock.mockResolvedValueOnce({ data: DIRECTIONS, source: 'live' });
    render(
      <VenueProvider>
        <LanguageProvider>
          <VenueSwitchButton toVenueId="bmo-field" />
          <NavigationScreen />
        </LanguageProvider>
      </VenueProvider>,
    );
    await submitRoute(user);
    await screen.findByText(DIRECTIONS.summary);

    await user.click(screen.getByRole('button', { name: 'Switch venue' }));

    expect(screen.queryByText(DIRECTIONS.summary)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get directions' })).toBeDisabled();
    expect(
      screen.getByRole('group', { name: /Schematic seating map of BMO Field/ }),
    ).toBeInTheDocument();
  });
});
