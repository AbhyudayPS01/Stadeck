import { StadiumMap } from '../../components/map/StadiumMap';
import { Card } from '../../components/ui/Card';

/** Navigation — implements the challenge clause "improve navigation". */
export default function NavigationScreen() {
  return (
    <main className="min-h-screen bg-fan-bg px-page py-section">
      <h1 className="font-display text-h1 text-fan-ink">Navigation</h1>
      <p className="mt-2 text-body text-fan-muted">
        Turn-by-turn wayfinding to seats, gates, and amenities across MetLife Stadium.
      </p>
      <section aria-labelledby="stadium-map-heading" className="mt-section max-w-xl">
        <h2 className="font-display text-h2 text-fan-ink" id="stadium-map-heading">
          Stadium map
        </h2>
        <Card className="mt-gutter">
          <StadiumMap />
        </Card>
      </section>
    </main>
  );
}
