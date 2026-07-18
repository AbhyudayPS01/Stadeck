import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ignoringIsolates } from '../../test/textMatchers';
import { LanguageProvider } from '../../context/LanguageProvider';
import { VenueProvider } from '../../context/VenueProvider';
import { useVenue } from '../../hooks/useVenue';
import { DEFAULT_VENUE, findVenue } from '../../services/data/venues';
import type { TransitOption } from '../../types/transportation';
import type { Venue } from '../../types/venue';
import TransportationScreen from './TransportationScreen';

/** Test-only sibling that can switch the active venue within the same provider. */
function VenueSwitchButton({ toVenueId }: { toVenueId: string }) {
  const { setVenueId } = useVenue();
  return (
    <button onClick={() => setVenueId(toVenueId)} type="button">
      Switch venue
    </button>
  );
}

function boardFor(venue: Venue): TransitOption[] {
  return [
    {
      id: 'venue-rail',
      mode: 'rail',
      label: `${venue.rail.service} — ${venue.rail.line}`,
      etaMinutes: 12,
      status: 'on-time',
      crowdingLevel: 'normal',
    },
  ];
}

vi.mock('../../services/gemini', () => ({
  getTransportationRecommendation: vi.fn(),
}));

vi.mock('../../services/data/transit', () => ({
  getTransitOptions: vi.fn(),
}));

import { getTransitOptions } from '../../services/data/transit';
import { getTransportationRecommendation } from '../../services/gemini';

const getTransportationRecommendationMock = vi.mocked(getTransportationRecommendation);
const getTransitOptionsMock = vi.mocked(getTransitOptions);

const FIXED_OPTIONS: TransitOption[] = [
  {
    id: 'venue-rail',
    mode: 'rail',
    label: 'NJ Transit Rail — Meadowlands Line',
    etaMinutes: 12,
    status: 'on-time',
    crowdingLevel: 'normal',
  },
  {
    id: 'coach-bus',
    mode: 'bus',
    label: 'Coach Express Bus',
    etaMinutes: 999, // out-of-range on purpose: the board must clamp untrusted feed values
    status: 'delayed',
    crowdingLevel: 'critical',
  },
];

const STRATEGY = {
  summary: 'Rail is your best option tonight.',
  recommendedOptionId: 'venue-rail',
  departureWindow: 'Leave your seat between 5:05 and 5:15 PM',
  steps: ['4:50 PM — final whistle, stay seated.', '5:15 PM — walk to the rail platform.'],
};

function renderScreen() {
  return render(
    <VenueProvider>
      <LanguageProvider>
        <TransportationScreen />
      </LanguageProvider>
    </VenueProvider>,
  );
}

async function planExit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText('Where are you headed after the match?'),
    'Penn Station, New York',
  );
  await user.click(screen.getByRole('button', { name: 'Plan my exit' }));
}

beforeEach(() => {
  getTransportationRecommendationMock.mockReset();
  getTransitOptionsMock.mockReset();
  getTransitOptionsMock.mockReturnValue(FIXED_OPTIONS);
});

describe('TransportationScreen — transit board', () => {
  it('lists every option with mode, status, and crowding as words — never color alone', () => {
    renderScreen();

    const board = within(screen.getByRole('list', { name: 'Transit options' }));
    const rows = board.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('RAIL');
    expect(rows[0]).toHaveTextContent('on time');
    expect(rows[0]).toHaveTextContent('calm');
    expect(rows[1]).toHaveTextContent('delayed');
    expect(rows[1]).toHaveTextContent('crowded');
  });

  it('clamps out-of-range ETAs from the untrusted feed before rendering', () => {
    renderScreen();

    expect(screen.getByText(ignoringIsolates('120 min'))).toBeInTheDocument();
    expect(screen.queryByText('999 min')).not.toBeInTheDocument();
  });

  it('shows the new venue’s board immediately on switch, not the old venue’s leftover options', async () => {
    const user = userEvent.setup();
    const bmoField = findVenue('bmo-field');
    if (!bmoField) {
      throw new Error('expected bmo-field in the venue registry');
    }
    getTransitOptionsMock.mockImplementation((venue = DEFAULT_VENUE) => boardFor(venue));
    render(
      <VenueProvider>
        <LanguageProvider>
          <VenueSwitchButton toVenueId="bmo-field" />
          <TransportationScreen />
        </LanguageProvider>
      </VenueProvider>,
    );
    expect(screen.getByText(/NJ Transit Rail/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Switch venue' }));

    // No interval tick has fired — the board must already reflect BMO Field, not linger on MetLife's.
    expect(screen.queryByText(/NJ Transit Rail/)).not.toBeInTheDocument();
    expect(screen.getByText(new RegExp(bmoField.rail.service))).toBeInTheDocument();
  });
});

describe('TransportationScreen — departure strategy', () => {
  it('disables "Plan my exit" until a destination is entered', () => {
    renderScreen();

    expect(screen.getByRole('button', { name: 'Plan my exit' })).toBeDisabled();
  });

  it('plans a departure strategy and highlights the AI pick on the board', async () => {
    const user = userEvent.setup();
    getTransportationRecommendationMock.mockResolvedValueOnce({ data: STRATEGY, source: 'live' });
    renderScreen();

    await planExit(user);

    expect(await screen.findByText(STRATEGY.summary)).toBeInTheDocument();
    expect(screen.getByText(STRATEGY.departureWindow)).toBeInTheDocument();
    expect(screen.getByText('4:50 PM — final whistle, stay seated.')).toBeInTheDocument();
    expect(screen.getByText('AI pick')).toBeInTheDocument();
    const [options, destination, venue] = getTransportationRecommendationMock.mock.calls[0] ?? [];
    expect(options).toEqual(FIXED_OPTIONS);
    expect(destination).toBe('Penn Station, New York');
    expect(venue).toEqual(DEFAULT_VENUE);
  });

  it('marks mock strategies with the Demo data badge', async () => {
    const user = userEvent.setup();
    getTransportationRecommendationMock.mockResolvedValueOnce({ data: STRATEGY, source: 'mock' });
    renderScreen();

    await planExit(user);

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when planning fails', async () => {
    const user = userEvent.setup();
    getTransportationRecommendationMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: STRATEGY, source: 'live' });
    renderScreen();

    await planExit(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be planned/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(STRATEGY.summary)).toBeInTheDocument();
  });
});
