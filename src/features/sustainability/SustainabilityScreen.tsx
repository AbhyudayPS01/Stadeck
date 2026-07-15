import { SUSTAINABILITY_REFRESH_INTERVAL_MS } from '../../config/constants';
import { useMockStream } from '../../hooks/useMockStream';
import { useRole } from '../../hooks/useRole';
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
  const { role } = useRole();
  const metrics = useMockStream(getSustainabilityMetrics, SUSTAINABILITY_REFRESH_INTERVAL_MS);

  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">Sustainability</h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        How the venue is performing right now — and what you can do to lower the matchday
        footprint.
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <SustainabilityDashboard metrics={metrics} />
        <div className="flex flex-col gap-gutter">
          <EcoActionsPanel metrics={metrics} />
          {role === 'organizer' ? <MatchReportPanel metrics={metrics} /> : null}
        </div>
      </div>
    </main>
  );
}
