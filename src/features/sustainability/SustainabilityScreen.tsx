import { SUSTAINABILITY_REFRESH_INTERVAL_MS } from '../../config/constants';
import { useMockStream } from '../../hooks/useMockStream';
import { useRole } from '../../hooks/useRole';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import { getSustainabilityMetrics } from '../../services/data/sustainability';
import { EcoActionsPanel } from './EcoActionsPanel';
import { MatchReportPanel } from './MatchReportPanel';
import { SustainabilityDashboard } from './SustainabilityDashboard';

/**
 * Sustainability — implements the challenge clause "sustainability". A live
 * (simulated) venue dashboard — waste diversion, energy, water, and a crowd
 * carbon estimate — with AI per-fan eco-actions, plus an organizer-only AI
 * match report.
 */
export default function SustainabilityScreen() {
  const strings = useUiStrings();
  const { role } = useRole();
  const { venue } = useVenue();
  const metrics = useMockStream(
    () => getSustainabilityMetrics(venue),
    SUSTAINABILITY_REFRESH_INTERVAL_MS,
    venue,
  );

  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">
        {strings['module.sustainability.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        {strings['module.sustainability.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <SustainabilityDashboard metrics={metrics} venue={venue} />
        <div className="flex flex-col gap-gutter">
          <EcoActionsPanel key={`eco-${venue.id}`} metrics={metrics} venue={venue} />
          {role === 'organizer' ? (
            <MatchReportPanel key={`report-${venue.id}`} metrics={metrics} venue={venue} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
