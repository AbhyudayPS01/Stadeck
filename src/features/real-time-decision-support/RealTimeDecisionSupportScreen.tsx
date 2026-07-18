import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { INCIDENT_FEED_INTERVAL_MS, INCIDENT_FEED_LIMIT } from '../../config/constants';
import { useMockStream } from '../../hooks/useMockStream';
import { useRole } from '../../hooks/useRole';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import { generateIncident, getInitialIncidents } from '../../services/data/incidents';
import type { Incident } from '../../types/incident';
import { ActionPlanPanel } from './ActionPlanPanel';
import { IncidentFeed } from './IncidentFeed';
import { ScenarioPlanner } from './ScenarioPlanner';

/** Real-Time Decision Support — implements the challenge clause "real-time decision support". */
export default function RealTimeDecisionSupportScreen() {
  const strings = useUiStrings();
  const { role } = useRole();
  const { venue } = useVenue();
  const [incidents, setIncidents] = useState<Incident[]>(() => getInitialIncidents(venue));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Incident locations are venue-specific — re-seed the feed and clear the
  // selection rather than leave incidents (and a selected plan) that cite a
  // section only the previous venue has.
  useEffect(() => {
    setIncidents(getInitialIncidents(venue));
    setSelectedId(null);
  }, [venue]);

  const incoming = useMockStream(
    () => generateIncident(venue),
    INCIDENT_FEED_INTERVAL_MS,
    venue,
  );
  useEffect(() => {
    setIncidents((previous) =>
      previous.some((incident) => incident.id === incoming.id)
        ? previous
        : [incoming, ...previous].slice(0, INCIDENT_FEED_LIMIT),
    );
  }, [incoming]);

  const selected = incidents.find((incident) => incident.id === selectedId) ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-ops-bg to-ops-bg2 px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-ops-ink">
        {strings['module.real-time-decision-support.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-ops-muted">
        {strings['module.real-time-decision-support.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-2">
        <IncidentFeed incidents={incidents} onSelect={setSelectedId} selectedId={selectedId} />
        <div className="flex flex-col gap-gutter">
          {selected ? (
            // Keyed so switching incidents remounts the panel and fetches a fresh plan.
            <ActionPlanPanel key={selected.id} incident={selected} venue={venue} />
          ) : (
            <EmptyState
              message={strings['empty.incidentNotSelected']}
              showMascot={false}
              theme="ops"
              title={strings['rtds.noIncidentSelectedTitle']}
            />
          )}
          {role === 'organizer' ? <ScenarioPlanner key={venue.id} venue={venue} /> : null}
        </div>
      </div>
    </main>
  );
}
