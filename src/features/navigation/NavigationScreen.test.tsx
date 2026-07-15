import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationScreen from './NavigationScreen';

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
    render(<NavigationScreen />);

    expect(screen.getByRole('heading', { level: 1, name: 'Navigation' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /Schematic seating map of MetLife Stadium/ }),
    ).toBeInTheDocument();
  });

  it('disables "Get directions" until a section is chosen', () => {
    render(<NavigationScreen />);

    expect(screen.getByRole('button', { name: 'Get directions' })).toBeDisabled();
  });

  it('shows the closest restroom, food, and exit once a section is chosen', async () => {
    const user = userEvent.setup();
    render(<NavigationScreen />);

    await user.selectOptions(screen.getByLabelText('Your seating section'), 'sec-118');

    expect(screen.getByRole('heading', { name: 'Closest to Section 118' })).toBeInTheDocument();
    expect(screen.getByText('Nearest restroom')).toBeInTheDocument();
    expect(screen.getByText('Nearest food')).toBeInTheDocument();
    expect(screen.getByText('Closest exit')).toBeInTheDocument();
  });

  it('fetches directions for the chosen gate and section and renders the steps', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock.mockResolvedValueOnce({ data: DIRECTIONS, source: 'live' });
    render(<NavigationScreen />);

    await submitRoute(user);

    expect(await screen.findByText(DIRECTIONS.summary)).toBeInTheDocument();
    expect(screen.getByText('Follow the concourse clockwise.')).toBeInTheDocument();
    expect(screen.getByText('~6 min walk')).toBeInTheDocument();
    const [gate, section] = getNavigationDirectionsMock.mock.calls[0] ?? [];
    expect(gate?.id).toBe('gate-c');
    expect(section?.id).toBe('sec-118');
  });

  it('highlights the route on the map after directions are requested', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock.mockResolvedValueOnce({ data: DIRECTIONS, source: 'live' });
    const { container } = render(<NavigationScreen />);

    expect(container.querySelector('[data-testid="route-overlay"]')).toBeNull();
    await submitRoute(user);

    expect(container.querySelector('[data-testid="route-overlay"]')).toBeInTheDocument();
  });

  it('marks mock directions with the Demo data badge', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock.mockResolvedValueOnce({ data: DIRECTIONS, source: 'mock' });
    render(<NavigationScreen />);

    await submitRoute(user);

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when directions fail', async () => {
    const user = userEvent.setup();
    getNavigationDirectionsMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: DIRECTIONS, source: 'live' });
    render(<NavigationScreen />);

    await submitRoute(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be fetched/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(DIRECTIONS.summary)).toBeInTheDocument();
  });
});
