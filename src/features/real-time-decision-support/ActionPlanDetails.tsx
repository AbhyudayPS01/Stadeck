import { Badge } from '../../components/ui/Badge';
import { useUiStrings } from '../../hooks/useUiStrings';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { InsightCard } from '../../components/ui/InsightCard';
import type { MockReason } from '../../services/gemini';
import type { RealTimeDecisionSupportResponse } from '../../services/gemini/responses';
import { formatUiString } from '../../utils/uiText';

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
  const strings = useUiStrings();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge severity={plan.priority} theme="ops">
          {formatUiString(strings['rtds.priority'], {
            level: strings[`severity.${plan.priority}`],
          })}
        </Badge>
        {source === 'mock' ? <DemoDataBadge reason={mockReason} theme="ops" /> : null}
      </div>
      {/* AI response region per SPEC.md accessibility rules */}
      <p aria-live="polite" className="text-body-sm text-ops-body">
        {plan.summary}
      </p>
      <InsightCard items={plan.immediateActions} ordered title={strings['rtds.immediateActions']} />
      <InsightCard items={plan.teamsToNotify} title={strings['rtds.teamsToNotify']} />
      <InsightCard items={plan.escalationCriteria} title={strings['rtds.escalationCriteria']} />
    </div>
  );
}
