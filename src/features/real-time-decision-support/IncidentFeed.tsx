import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUiStrings } from '../../hooks/useUiStrings';
import type { Incident } from '../../types/incident';
import { cx } from '../../utils/cx';

interface IncidentFeedProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (incidentId: string) => void;
}

const TIME_FORMAT = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

/**
 * The live incident feed with severity triage. Each row is a real button
 * (aria-pressed marks the selected incident) and the list is aria-live so new
 * incidents are announced (CLAUDE.md accessibility rules).
 */
export function IncidentFeed({ incidents, selectedId, onSelect }: IncidentFeedProps) {
  const strings = useUiStrings();
  return (
    <Card theme="ops">
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-ops-ink">{strings['rtds.incidentFeed']}</h2>
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
        />
      </div>
      <p className="mt-1.5 text-body-sm text-ops-muted">{strings['rtds.selectHint']}</p>
      {incidents.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            message={strings['empty.incidents']}
            showMascot={false}
            theme="ops"
            title={strings['rtds.noIncidentsTitle']}
          />
        </div>
      ) : (
        <ul aria-label="Incidents" aria-live="polite" className="mt-4 flex flex-col gap-2.5">
          {incidents.map((incident) => {
            const selected = incident.id === selectedId;
            return (
              <li key={incident.id}>
                <button
                  aria-pressed={selected}
                  className={cx(
                    'w-full rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:shadow-inputfocus',
                    selected
                      ? 'border-glow bg-ops-surface2'
                      : 'border-ops-border bg-ops-surface hover:bg-ops-surface2',
                  )}
                  onClick={() => onSelect(incident.id)}
                  type="button"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge severity={incident.severity} theme="ops">
                      {strings[`severity.${incident.severity}`]}
                    </Badge>
                    <span className="font-mono text-mono-tag font-bold uppercase text-ops-faint">
                      {strings[`incidentCategory.${incident.category}`]}
                    </span>
                    <time
                      className="ml-auto text-label text-ops-faint"
                      dateTime={incident.reportedAt}
                    >
                      {TIME_FORMAT.format(new Date(incident.reportedAt))}
                    </time>
                  </div>
                  <p className="mt-2 text-body-sm font-medium text-ops-body">{incident.summary}</p>
                  <p className="mt-1 text-label text-ops-muted">{incident.location}</p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
