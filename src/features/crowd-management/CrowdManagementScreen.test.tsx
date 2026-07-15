import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DensityReading } from '../../types/crowd';
import CrowdManagementScreen from './CrowdManagementScreen';

vi.mock('../../services/gemini', () => ({
  getCrowdManagementSummary: vi.fn(),
}));

vi.mock('../../services/data/density', () => ({
  generateDensityReadings: vi.fn(),
}));

import { generateDensityReadings } from '../../services/data/density';
import { getCrowdManagementSummary } from '../../services/gemini';

const getCrowdManagementSummaryMock = vi.mocked(getCrowdManagementSummary);
const generateDensityReadingsMock = vi.mocked(generateDensityReadings);

const FIXED_READINGS: DensityReading[] = [
  { zoneId: 'gate-c', level: 'critical', percentOfCapacity: 97, updatedAt: 'now' },
  { zoneId: 'sec-118', level: 'elevated', percentOfCapacity: 88, updatedAt: 'now' },
  { zoneId: 'sec-101', level: 'normal', percentOfCapacity: 45, updatedAt: 'now' },
];

const ANALYSIS = {
  summary: 'East side is under pressure.',
  gatesToOpen: ['Gate A', 'Gate B'],
  stewardRedeployment: ['Move two teams to Gate C.'],
  congestionForecast: 'Pressure peaks in 15 minutes, then eases.',
};

beforeEach(() => {
  getCrowdManagementSummaryMock.mockReset();
  generateDensityReadingsMock.mockReset();
  generateDensityReadingsMock.mockReturnValue(FIXED_READINGS);
});

describe('CrowdManagementScreen', () => {
  it('lists the busiest zones with badge words, labels, and occupancy — never color alone', () => {
    render(<CrowdManagementScreen />);

    const watchlist = within(screen.getByRole('list', { name: 'Busiest zones' }));
    const rows = watchlist.getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('critical');
    expect(rows[0]).toHaveTextContent('Gate C');
    expect(rows[0]).toHaveTextContent('97%');
    expect(rows[1]).toHaveTextContent('Section 118');
    expect(screen.getByText('1 critical · 1 elevated · 1 normal of 3 zones')).toBeInTheDocument();
  });

  it('renders the density heatmap overlay on the stadium map with a labeled legend', () => {
    render(<CrowdManagementScreen />);

    expect(
      screen.getByRole('group', { name: /Schematic seating map of MetLife Stadium/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Critical — hatch pattern/)).toBeInTheDocument();
    expect(screen.getByText(/Elevated — gold wash/)).toBeInTheDocument();
  });

  it('analyzes the current state and renders the structured recommendation cards', async () => {
    const user = userEvent.setup();
    getCrowdManagementSummaryMock.mockResolvedValueOnce({ data: ANALYSIS, source: 'live' });
    render(<CrowdManagementScreen />);

    await user.click(screen.getByRole('button', { name: 'Analyze current state' }));

    expect(await screen.findByText('East side is under pressure.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gates to open' })).toBeInTheDocument();
    expect(screen.getByText('Gate A')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Steward redeployment' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Congestion forecast' })).toBeInTheDocument();
    expect(getCrowdManagementSummaryMock).toHaveBeenCalledWith(FIXED_READINGS);
  });

  it('marks mock analyses with the Demo data badge', async () => {
    const user = userEvent.setup();
    getCrowdManagementSummaryMock.mockResolvedValueOnce({ data: ANALYSIS, source: 'mock' });
    render(<CrowdManagementScreen />);

    await user.click(screen.getByRole('button', { name: 'Analyze current state' }));

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when the analysis fails', async () => {
    const user = userEvent.setup();
    getCrowdManagementSummaryMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: ANALYSIS, source: 'live' });
    render(<CrowdManagementScreen />);

    await user.click(screen.getByRole('button', { name: 'Analyze current state' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be completed/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('East side is under pressure.')).toBeInTheDocument();
  });

  it('re-analyzes with fresh readings on demand', async () => {
    const user = userEvent.setup();
    getCrowdManagementSummaryMock.mockResolvedValue({ data: ANALYSIS, source: 'live' });
    render(<CrowdManagementScreen />);

    await user.click(screen.getByRole('button', { name: 'Analyze current state' }));
    await screen.findByText('East side is under pressure.');
    await user.click(screen.getByRole('button', { name: 'Re-analyze with latest readings' }));

    expect(getCrowdManagementSummaryMock).toHaveBeenCalledTimes(2);
  });
});
