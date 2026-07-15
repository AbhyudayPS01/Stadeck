import { Badge, type BadgeSeverity } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { TRANSIT_MAX_ETA_MINUTES } from '../../config/constants';
import type { TransitMode, TransitOption, TransitStatus } from '../../types/transportation';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/numbers';

export interface TransitBoardProps {
  options: TransitOption[];
  /** Option the AI egress planner recommended — highlighted with an "AI pick" badge. */
  recommendedOptionId: string | null;
}

const MODE_TAGS: Record<TransitMode, string> = {
  rail: 'RAIL',
  bus: 'BUS',
  rideshare: 'RIDE',
  parking: 'PARK',
  walk: 'WALK',
};

const STATUS_SEVERITIES: Record<TransitStatus, BadgeSeverity> = {
  'on-time': 'normal',
  delayed: 'elevated',
  disrupted: 'critical',
};

const STATUS_WORDS: Record<TransitStatus, string> = {
  'on-time': 'on time',
  delayed: 'delayed',
  disrupted: 'disrupted',
};

const CROWDING_WORDS: Record<TransitOption['crowdingLevel'], string> = {
  normal: 'calm',
  elevated: 'busy',
  critical: 'crowded',
};

/** Live departures board for post-match egress, refreshed by the simulated transit feed. */
export function TransitBoard({ options, recommendedOptionId }: TransitBoardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-fan-ink">Live transit board</h2>
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
        />
      </div>
      <ul aria-label="Transit options" className="mt-4 flex flex-col gap-3">
        {options.map((option) => {
          const recommended = option.id === recommendedOptionId;
          return (
            <li
              key={option.id}
              className={cx(
                'rounded-xl border p-3',
                recommended ? 'border-pitch-deep bg-pitch-tint' : 'border-fan-border',
              )}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-mono-tag font-bold uppercase text-fan-faint">
                  {MODE_TAGS[option.mode]}
                </span>
                <span className="text-body-sm font-semibold text-fan-ink">{option.label}</span>
                {recommended ? <Badge severity="normal">AI pick</Badge> : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                {/* The feed is treated as untrusted — ETAs are clamped before render (SECURITY.md). */}
                <span className="font-mono text-body-sm font-bold text-fan-ink">
                  {clamp(option.etaMinutes, 1, TRANSIT_MAX_ETA_MINUTES)} min
                </span>
                <Badge severity={STATUS_SEVERITIES[option.status]}>
                  {STATUS_WORDS[option.status]}
                </Badge>
                <Badge severity={option.crowdingLevel}>
                  {CROWDING_WORDS[option.crowdingLevel]}
                </Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
