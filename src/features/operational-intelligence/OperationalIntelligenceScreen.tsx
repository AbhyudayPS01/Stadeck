import { KPI_REFRESH_INTERVAL_MS } from '../../config/constants';
import { useMockStream } from '../../hooks/useMockStream';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import { getKpiSnapshot } from '../../services/data/kpis';
import { ExecutiveBriefingPanel } from './ExecutiveBriefingPanel';
import { KpiBoard } from './KpiBoard';

/**
 * Operational Intelligence — implements the challenge clause "operational
 * intelligence". A live (simulated) organizer KPI board with an on-demand AI
 * executive briefing: state of venue, anomalies to act on, trends to watch.
 */
export default function OperationalIntelligenceScreen() {
  const strings = useUiStrings();
  const { venue } = useVenue();
  const kpis = useMockStream(() => getKpiSnapshot(venue), KPI_REFRESH_INTERVAL_MS, venue);

  return (
    <main className="min-h-screen bg-gradient-to-b from-ops-bg to-ops-bg2 px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-ops-ink">
        {strings['module.operational-intelligence.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-ops-muted">
        {strings['module.operational-intelligence.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <KpiBoard kpis={kpis} />
        <ExecutiveBriefingPanel key={venue.id} kpis={kpis} venue={venue} />
      </div>
    </main>
  );
}
