import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../context/LanguageProvider';
import type { KpiSnapshot } from '../../types/operational';
import OperationalIntelligenceScreen from './OperationalIntelligenceScreen';

vi.mock('../../services/gemini', () => ({
  getOperationalIntelligenceSummary: vi.fn(),
}));

vi.mock('../../services/data/kpis', () => ({
  getKpiSnapshot: vi.fn(),
}));

import { getKpiSnapshot } from '../../services/data/kpis';
import { getOperationalIntelligenceSummary } from '../../services/gemini';

const getOperationalIntelligenceSummaryMock = vi.mocked(getOperationalIntelligenceSummary);
const getKpiSnapshotMock = vi.mocked(getKpiSnapshot);

const FIXED_KPIS: KpiSnapshot[] = [
  {
    id: 'attendance',
    label: 'Attendance',
    value: 78_375,
    unit: 'fans',
    trend: 'up',
    severity: 'normal',
    timestamp: 'now',
  },
  {
    id: 'gate-wait-time',
    label: 'Avg. Gate Wait Time',
    value: -4, // out-of-range on purpose: the board must clamp untrusted feed values
    unit: 'minutes',
    trend: 'flat',
    severity: 'elevated',
    timestamp: 'now',
  },
];

const BRIEFING = {
  summary: 'The venue is running close to plan.',
  anomalies: ['Gate wait is trending above 10 minutes — open an extra lane at Gate C.'],
  trends: ['Attendance should reach 95% of capacity by kickoff.'],
};

beforeEach(() => {
  getOperationalIntelligenceSummaryMock.mockReset();
  getKpiSnapshotMock.mockReset();
  getKpiSnapshotMock.mockReturnValue(FIXED_KPIS);
});

describe('OperationalIntelligenceScreen — KPI board', () => {
  it('renders every KPI with its label, value, unit, trend word, and severity badge', () => {
    render(
      <LanguageProvider>
        <OperationalIntelligenceScreen />
      </LanguageProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Attendance' })).toBeInTheDocument();
    expect(screen.getByText('78,375')).toBeInTheDocument();
    expect(screen.getByText('fans · ▲ rising')).toBeInTheDocument();
    expect(screen.getByText('ok')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Avg. Gate Wait Time' })).toBeInTheDocument();
    expect(screen.getByText('watch')).toBeInTheDocument();
  });

  it('clamps negative values from the untrusted feed to zero before rendering', () => {
    render(
      <LanguageProvider>
        <OperationalIntelligenceScreen />
      </LanguageProvider>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('-4')).not.toBeInTheDocument();
  });
});

describe('OperationalIntelligenceScreen — executive briefing', () => {
  it('generates the briefing from a KPI snapshot and renders the structured sections', async () => {
    const user = userEvent.setup();
    getOperationalIntelligenceSummaryMock.mockResolvedValueOnce({
      data: BRIEFING,
      source: 'live',
    });
    render(
      <LanguageProvider>
        <OperationalIntelligenceScreen />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Generate briefing' }));

    expect(await screen.findByText(BRIEFING.summary)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Anomalies to act on' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Trends to watch' })).toBeInTheDocument();
    expect(getOperationalIntelligenceSummaryMock).toHaveBeenCalledWith(FIXED_KPIS);
  });

  it('marks mock briefings with the Demo data badge', async () => {
    const user = userEvent.setup();
    getOperationalIntelligenceSummaryMock.mockResolvedValueOnce({
      data: BRIEFING,
      source: 'mock',
    });
    render(
      <LanguageProvider>
        <OperationalIntelligenceScreen />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Generate briefing' }));

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when the briefing fails', async () => {
    const user = userEvent.setup();
    getOperationalIntelligenceSummaryMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: BRIEFING, source: 'live' });
    render(
      <LanguageProvider>
        <OperationalIntelligenceScreen />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Generate briefing' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be generated/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(BRIEFING.summary)).toBeInTheDocument();
  });

  it('re-briefs with fresh KPIs on demand', async () => {
    const user = userEvent.setup();
    getOperationalIntelligenceSummaryMock.mockResolvedValue({ data: BRIEFING, source: 'live' });
    render(
      <LanguageProvider>
        <OperationalIntelligenceScreen />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Generate briefing' }));
    await screen.findByText(BRIEFING.summary);
    await user.click(screen.getByRole('button', { name: 'Re-brief with latest KPIs' }));

    expect(getOperationalIntelligenceSummaryMock).toHaveBeenCalledTimes(2);
  });
});
