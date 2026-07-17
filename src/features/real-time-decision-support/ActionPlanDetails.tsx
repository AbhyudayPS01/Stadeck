import { Badge } from '../../components/ui/Badge';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { InsightCard } from '../../components/ui/InsightCard';
import type { MockReason } from '../../services/gemini';
import type { RealTimeDecisionSupportResponse } from '../../services/gemini/responses';

interface ActionPlanDetailsProps {
  plan: RealTimeDecisionSupportResponse;
  source: 'live' | 'mock';
  mockReason?: MockReason;
}

/**
 * Renders one structured action plan — shared by incident analysis and the
 * what-if scenario planner so both AI outputs read identically.
 */
export function ActionPlanDetails({ plan, source, mockReason }: ActionPlanDetailsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge severity={plan.priority} theme="ops">
          {plan.priority} priority
        </Badge>
        {source === 'mock' ? <DemoDataBadge reason={mockReason} theme="ops" /> : null}
      </div>
      {/* AI response region per CLAUDE.md accessibility rules */}
      <p aria-live="polite" className="text-body-sm text-ops-body">
        {plan.summary}
      </p>
      <InsightCard items={plan.immediateActions} ordered title="Immediate actions" />
      <InsightCard items={plan.teamsToNotify} title="Teams to notify" />
      <InsightCard items={plan.escalationCriteria} title="Escalation criteria" />
    </div>
  );
}
