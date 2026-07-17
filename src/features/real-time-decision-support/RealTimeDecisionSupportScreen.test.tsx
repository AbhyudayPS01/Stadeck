import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ignoringIsolates } from '../../test/textMatchers';
import { RoleProvider } from '../../context/RoleProvider';
import { LanguageProvider } from '../../context/LanguageProvider';
import { MAX_USER_INPUT_LENGTH } from '../../config/constants';
import type { Role } from '../../types/role';
import RealTimeDecisionSupportScreen from './RealTimeDecisionSupportScreen';

vi.mock('../../services/gemini', () => ({
  getRealTimeDecisionSupport: vi.fn(),
  getScenarioPlan: vi.fn(),
}));

// Deterministic feed: fixed seeds, and the stream generator emits a distinct incident.
vi.mock('../../services/data/incidents', () => ({
  getInitialIncidents: () => [
    {
      id: 'incident-seed-1',
      category: 'medical',
      severity: 'elevated',
      summary: 'Fan requiring medical assistance',
      location: 'Section 118, Row 20',
      reportedAt: '2026-07-15T14:00:00.000Z',
      status: 'monitoring',
    },
    {
      id: 'incident-seed-2',
      category: 'crowd',
      severity: 'elevated',
      summary: 'Dense queue building at entry',
      location: 'Gate C concourse',
      reportedAt: '2026-07-15T14:05:00.000Z',
      status: 'monitoring',
    },
    {
      id: 'incident-seed-3',
      category: 'security',
      severity: 'normal',
      summary: 'Unattended bag reported',
      location: 'Gate F plaza',
      reportedAt: '2026-07-15T14:10:00.000Z',
      status: 'open',
    },
  ],
  generateIncident: () => ({
    id: 'incident-stream-1',
    category: 'weather',
    severity: 'critical',
    summary: 'Lightning within 8 miles — delay protocol in effect',
    location: 'Venue-wide',
    reportedAt: '2026-07-15T14:15:00.000Z',
    status: 'open',
  }),
}));

import { getRealTimeDecisionSupport, getScenarioPlan } from '../../services/gemini';

const getRealTimeDecisionSupportMock = vi.mocked(getRealTimeDecisionSupport);
const getScenarioPlanMock = vi.mocked(getScenarioPlan);

const PLAN = {
  summary: 'Contain the queue and reassess in ten minutes.',
  immediateActions: ['Dispatch stewards to Gate C.', 'Open the overflow lane.'],
  teamsToNotify: ['Security control room'],
  escalationCriteria: ['Queue blocks an egress route.'],
  priority: 'elevated' as const,
};

function renderScreen(role: Role = 'organizer') {
  return render(
    <RoleProvider initialRole={role}>
      <LanguageProvider>
        <RealTimeDecisionSupportScreen />
      </LanguageProvider>
    </RoleProvider>,
  );
}

beforeEach(() => {
  getRealTimeDecisionSupportMock.mockReset();
  getScenarioPlanMock.mockReset();
});

describe('RealTimeDecisionSupportScreen', () => {
  it('shows the seeded incident feed with severity badges and an unselected empty state', () => {
    renderScreen();

    const feed = within(screen.getByRole('list', { name: 'Incidents' }));
    expect(feed.getByText('Dense queue building at entry')).toBeInTheDocument();
    expect(feed.getAllByRole('button').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole('heading', { name: 'No incident selected' })).toBeInTheDocument();
  });

  it('generates a structured action plan when an incident is selected', async () => {
    const user = userEvent.setup();
    getRealTimeDecisionSupportMock.mockResolvedValueOnce({ data: PLAN, source: 'live' });
    renderScreen();

    await user.click(screen.getByRole('button', { name: /Dense queue building at entry/ }));

    expect(
      await screen.findByText('Contain the queue and reassess in ten minutes.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Immediate actions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Teams to notify' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Escalation criteria' })).toBeInTheDocument();
    expect(screen.getByText(ignoringIsolates('elevated priority'))).toBeInTheDocument();
    expect(getRealTimeDecisionSupportMock).toHaveBeenCalledWith(
      expect.objectContaining({ summary: 'Dense queue building at entry' }),
    );
    expect(screen.getByRole('button', { name: /Dense queue building at entry/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks mock plans with the Demo data badge', async () => {
    const user = userEvent.setup();
    getRealTimeDecisionSupportMock.mockResolvedValueOnce({ data: PLAN, source: 'mock' });
    renderScreen();

    await user.click(screen.getByRole('button', { name: /Dense queue building at entry/ }));

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when the plan fails', async () => {
    const user = userEvent.setup();
    getRealTimeDecisionSupportMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: PLAN, source: 'live' });
    renderScreen();

    await user.click(screen.getByRole('button', { name: /Dense queue building at entry/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be generated/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(
      await screen.findByText('Contain the queue and reassess in ten minutes.'),
    ).toBeInTheDocument();
  });

  it('lets organizers plan a guarded what-if scenario', async () => {
    const user = userEvent.setup();
    getScenarioPlanMock.mockResolvedValueOnce({ data: PLAN, source: 'live' });
    renderScreen('organizer');

    const textarea = screen.getByLabelText('Describe a hypothetical situation to war-game');
    expect(textarea).toHaveAttribute('maxlength', String(MAX_USER_INPUT_LENGTH));

    await user.type(textarea, 'Rail line goes down at halftime');
    await user.click(screen.getByRole('button', { name: 'Plan scenario' }));

    expect(
      await screen.findByText('Contain the queue and reassess in ten minutes.'),
    ).toBeInTheDocument();
    expect(getScenarioPlanMock).toHaveBeenCalledWith('Rail line goes down at halftime');
  });

  it('hides the what-if scenario planner from volunteers', () => {
    renderScreen('volunteer');

    expect(screen.queryByRole('heading', { name: 'What-if scenario' })).not.toBeInTheDocument();
  });
});
