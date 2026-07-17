import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ignoringIsolates } from '../../test/textMatchers';
import { LanguageProvider } from '../../context/LanguageProvider';
import type { TransitOption } from '../../types/transportation';
import TransportationScreen from './TransportationScreen';

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
    render(
      <LanguageProvider>
        <TransportationScreen />
      </LanguageProvider>,
    );

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
    render(
      <LanguageProvider>
        <TransportationScreen />
      </LanguageProvider>,
    );

    expect(screen.getByText(ignoringIsolates('120 min'))).toBeInTheDocument();
    expect(screen.queryByText('999 min')).not.toBeInTheDocument();
  });
});

describe('TransportationScreen — departure strategy', () => {
  it('disables "Plan my exit" until a destination is entered', () => {
    render(
      <LanguageProvider>
        <TransportationScreen />
      </LanguageProvider>,
    );

    expect(screen.getByRole('button', { name: 'Plan my exit' })).toBeDisabled();
  });

  it('plans a departure strategy and highlights the AI pick on the board', async () => {
    const user = userEvent.setup();
    getTransportationRecommendationMock.mockResolvedValueOnce({ data: STRATEGY, source: 'live' });
    render(
      <LanguageProvider>
        <TransportationScreen />
      </LanguageProvider>,
    );

    await planExit(user);

    expect(await screen.findByText(STRATEGY.summary)).toBeInTheDocument();
    expect(screen.getByText(STRATEGY.departureWindow)).toBeInTheDocument();
    expect(screen.getByText('4:50 PM — final whistle, stay seated.')).toBeInTheDocument();
    expect(screen.getByText('AI pick')).toBeInTheDocument();
    const [options, destination] = getTransportationRecommendationMock.mock.calls[0] ?? [];
    expect(options).toEqual(FIXED_OPTIONS);
    expect(destination).toBe('Penn Station, New York');
  });

  it('marks mock strategies with the Demo data badge', async () => {
    const user = userEvent.setup();
    getTransportationRecommendationMock.mockResolvedValueOnce({ data: STRATEGY, source: 'mock' });
    render(
      <LanguageProvider>
        <TransportationScreen />
      </LanguageProvider>,
    );

    await planExit(user);

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when planning fails', async () => {
    const user = userEvent.setup();
    getTransportationRecommendationMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: STRATEGY, source: 'live' });
    render(
      <LanguageProvider>
        <TransportationScreen />
      </LanguageProvider>,
    );

    await planExit(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be planned/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(STRATEGY.summary)).toBeInTheDocument();
  });
});
