import { Badge, type BadgeSeverity } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { TRANSIT_MAX_ETA_MINUTES } from '../../config/constants';
import { useUiStrings } from '../../hooks/useUiStrings';
import type { TransitMode, TransitOption, TransitStatus } from '../../types/transportation';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/numbers';
import { formatUiString } from '../../utils/uiText';

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

const STATUS_KEYS = {
  'on-time': 'transportation.onTime',
  delayed: 'transportation.delayed',
  disrupted: 'transportation.disrupted',
} as const satisfies Record<TransitStatus, string>;

const CROWDING_KEYS = {
  normal: 'transportation.calm',
  elevated: 'transportation.busy',
  critical: 'transportation.crowded',
} as const satisfies Record<TransitOption['crowdingLevel'], string>;

/** Live departures board for post-match egress, refreshed by the simulated transit feed. */
export function TransitBoard({ options, recommendedOptionId }: TransitBoardProps) {
  const strings = useUiStrings();
  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-fan-ink">{strings['transportation.liveBoard']}</h2>
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
                {recommended ? (
                  <Badge severity="normal">{strings['transportation.aiPick']}</Badge>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                {/* The feed is treated as untrusted — ETAs are clamped before render (SECURITY.md). */}
                <span className="font-mono text-body-sm font-bold text-fan-ink">
                  {formatUiString(strings['transportation.minutes'], {
                    minutes: clamp(option.etaMinutes, 1, TRANSIT_MAX_ETA_MINUTES),
                  })}
                </span>
                <Badge severity={STATUS_SEVERITIES[option.status]}>
                  {strings[STATUS_KEYS[option.status]]}
                </Badge>
                <Badge severity={option.crowdingLevel}>
                  {strings[CROWDING_KEYS[option.crowdingLevel]]}
                </Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
