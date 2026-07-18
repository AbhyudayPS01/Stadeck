import { useEffect, useState } from 'react';
import { TRANSIT_REFRESH_INTERVAL_MS } from '../../config/constants';
import { useMockStream } from '../../hooks/useMockStream';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import { getTransitOptions } from '../../services/data/transit';
import { EgressPlanner } from './EgressPlanner';
import { TransitBoard } from './TransitBoard';

/**
 * Transportation — implements the challenge clause "transportation". A live
 * (simulated) transit board for post-match egress, plus an AI departure
 * strategy personalized to where the fan is headed, with concrete times and
 * expected crowd loads. The AI's pick is highlighted on the board.
 */
export default function TransportationScreen() {
  const strings = useUiStrings();
  const { venue } = useVenue();
  const options = useMockStream(
    () => getTransitOptions(venue),
    TRANSIT_REFRESH_INTERVAL_MS,
    venue,
  );
  const [recommendedOptionId, setRecommendedOptionId] = useState<string | null>(null);

  // The AI's previous pick was grounded in the old venue's board — clear it
  // rather than leave a stale "AI pick" badge pointing at the wrong context.
  useEffect(() => {
    setRecommendedOptionId(null);
  }, [venue]);

  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">
        {strings['module.transportation.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        {strings['module.transportation.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <TransitBoard options={options} recommendedOptionId={recommendedOptionId} />
        <EgressPlanner
          key={venue.id}
          onRecommendation={setRecommendedOptionId}
          options={options}
          venue={venue}
        />
      </div>
    </main>
  );
}
