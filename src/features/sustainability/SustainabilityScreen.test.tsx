import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleProvider } from '../../context/RoleProvider';
import type { Role } from '../../types/role';
import type { SustainabilityMetrics } from '../../types/sustainability';
import SustainabilityScreen from './SustainabilityScreen';

vi.mock('../../services/gemini', () => ({
  getSustainabilityTips: vi.fn(),
  getSustainabilityReport: vi.fn(),
}));

vi.mock('../../services/data/sustainability', () => ({
  getSustainabilityMetrics: vi.fn(),
}));

import { getSustainabilityMetrics } from '../../services/data/sustainability';
import { getSustainabilityReport, getSustainabilityTips } from '../../services/gemini';

const getSustainabilityTipsMock = vi.mocked(getSustainabilityTips);
const getSustainabilityReportMock = vi.mocked(getSustainabilityReport);
const getSustainabilityMetricsMock = vi.mocked(getSustainabilityMetrics);

const FIXED_METRICS: SustainabilityMetrics = {
  timestamp: 'now',
  wasteDivertedPercent: 72,
  renewableEnergyPercent: 150, // out-of-range on purpose: the dashboard must clamp untrusted feed values
  waterUsageLiters: 214_000,
  carbonOffsetKg: 15_000,
  transitModeSharePercent: 80,
};

const TIPS = {
  summary: 'The venue is beating its diversion target.',
  tips: ['Refill a bottle at a hydration station.', 'Use the compost bins on your concourse.'],
};

const REPORT = {
  headline: 'A strong sustainability matchday.',
  highlights: ['Diversion held above target.'],
  recommendations: ['Add compost stations near the east concessions.'],
};

function renderScreen(role: Role = 'fan') {
  return render(
    <RoleProvider initialRole={role}>
      <SustainabilityScreen />
    </RoleProvider>,
  );
}

beforeEach(() => {
  getSustainabilityTipsMock.mockReset();
  getSustainabilityReportMock.mockReset();
  getSustainabilityMetricsMock.mockReset();
  getSustainabilityMetricsMock.mockReturnValue(FIXED_METRICS);
});

describe('SustainabilityScreen — venue dashboard', () => {
  it('renders every dashboard metric with a labeled tile', () => {
    renderScreen();

    expect(screen.getByRole('heading', { name: 'Waste diverted' })).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Water used' })).toBeInTheDocument();
    expect(screen.getByText('214,000 L')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Carbon offset' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Transit share' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Crowd carbon' })).toBeInTheDocument();
  });

  it('clamps out-of-range percentages from the untrusted feed before rendering', () => {
    renderScreen();

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.queryByText('150%')).not.toBeInTheDocument();
  });
});

describe('SustainabilityScreen — eco actions', () => {
  it('generates per-fan eco actions from a metrics snapshot', async () => {
    const user = userEvent.setup();
    getSustainabilityTipsMock.mockResolvedValueOnce({ data: TIPS, source: 'live' });
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Get my eco actions' }));

    expect(await screen.findByText(TIPS.summary)).toBeInTheDocument();
    expect(screen.getByText('Refill a bottle at a hydration station.')).toBeInTheDocument();
    expect(getSustainabilityTipsMock).toHaveBeenCalledWith(FIXED_METRICS);
  });

  it('marks mock eco actions with the Demo data badge', async () => {
    const user = userEvent.setup();
    getSustainabilityTipsMock.mockResolvedValueOnce({ data: TIPS, source: 'mock' });
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Get my eco actions' }));

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when eco actions fail', async () => {
    const user = userEvent.setup();
    getSustainabilityTipsMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: TIPS, source: 'live' });
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Get my eco actions' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be generated/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(TIPS.summary)).toBeInTheDocument();
  });
});

describe('SustainabilityScreen — organizer match report', () => {
  it('hides the match report panel from the fan view', () => {
    renderScreen('fan');

    expect(screen.queryByRole('heading', { name: 'Match report' })).not.toBeInTheDocument();
  });

  it('generates the match report for organizers', async () => {
    const user = userEvent.setup();
    getSustainabilityReportMock.mockResolvedValueOnce({ data: REPORT, source: 'live' });
    renderScreen('organizer');

    await user.click(screen.getByRole('button', { name: 'Generate match report' }));

    expect(await screen.findByText(REPORT.headline)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Highlights' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'For the next match' })).toBeInTheDocument();
    expect(getSustainabilityReportMock).toHaveBeenCalledWith(FIXED_METRICS);
  });
});
