import { MapLegend } from '../../components/map/MapLegend';
import { StadiumMap } from '../../components/map/StadiumMap';
import { Card } from '../../components/ui/Card';
import { DENSITY_REFRESH_INTERVAL_MS } from '../../config/constants';
import { useMockStream } from '../../hooks/useMockStream';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import { generateDensityReadings } from '../../services/data/density';
import { getVenueLayout } from '../../services/data/stadiumLayout';
import { CrowdAnalysisPanel } from './CrowdAnalysisPanel';
import { DensityHeatmapLayer, HeatmapLegend } from './DensityHeatmapLayer';
import { ZoneWatchlist } from './ZoneWatchlist';

/** Crowd Management — implements the challenge clause "crowd management". */
export default function CrowdManagementScreen() {
  const strings = useUiStrings();
  const { venue } = useVenue();
  const layout = getVenueLayout(venue.id);
  const readings = useMockStream(
    () => generateDensityReadings(layout),
    DENSITY_REFRESH_INTERVAL_MS,
    venue,
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-ops-bg to-ops-bg2 px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-ops-ink">
        {strings['module.crowd-management.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-ops-muted">
        {strings['module.crowd-management.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <Card theme="ops">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-h2 text-ops-ink">{strings['crowd.densityMap']}</h2>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
            />
          </div>
          <StadiumMap
            className="mt-4"
            overlays={<DensityHeatmapLayer layout={layout} readings={readings} />}
            venue={venue}
          />
          <HeatmapLegend />
          <MapLegend theme="ops" />
        </Card>
        <div className="flex flex-col gap-gutter">
          <ZoneWatchlist layout={layout} readings={readings} />
          <CrowdAnalysisPanel key={venue.id} readings={readings} venue={venue} />
        </div>
      </div>
    </main>
  );
}
