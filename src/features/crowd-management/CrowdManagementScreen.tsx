import { MapLegend } from '../../components/map/MapLegend';
import { StadiumMap } from '../../components/map/StadiumMap';
import { Card } from '../../components/ui/Card';
import { DENSITY_REFRESH_INTERVAL_MS } from '../../config/constants';
import { useMockStream } from '../../hooks/useMockStream';
import { generateDensityReadings } from '../../services/data/density';
import { CrowdAnalysisPanel } from './CrowdAnalysisPanel';
import { DensityHeatmapLayer, HeatmapLegend } from './DensityHeatmapLayer';
import { ZoneWatchlist } from './ZoneWatchlist';

/** Crowd Management — implements the challenge clause "crowd management". */
export default function CrowdManagementScreen() {
  const readings = useMockStream(generateDensityReadings, DENSITY_REFRESH_INTERVAL_MS);

  return (
    <main className="min-h-screen bg-gradient-to-b from-ops-bg to-ops-bg2 px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-ops-ink">Crowd Management</h1>
      <p className="mt-2 max-w-2xl text-body text-ops-muted">
        Live occupancy from simulated sensors across all 96 sections and 8 gates, with AI staff
        recommendations for keeping the crowd moving.
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <Card theme="ops">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-h2 text-ops-ink">Density map</h2>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
            />
          </div>
          <StadiumMap className="mt-4" overlays={<DensityHeatmapLayer readings={readings} />} />
          <HeatmapLegend />
          <MapLegend theme="ops" />
        </Card>
        <div className="flex flex-col gap-gutter">
          <ZoneWatchlist readings={readings} />
          <CrowdAnalysisPanel readings={readings} />
        </div>
      </div>
    </main>
  );
}
