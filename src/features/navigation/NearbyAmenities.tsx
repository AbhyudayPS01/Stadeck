import { Card } from '../../components/ui/Card';
import { nearestAmenity, nearestGate, sectionNumber } from '../../services/data/stadiumLayout';
import type { StadiumSection } from '../../types/stadium';

export interface NearbyAmenitiesProps {
  section: StadiumSection;
}

/**
 * Closest restroom, food, and exit for the selected section — computed from
 * the stadium layout config, no AI round-trip needed for fixed geography.
 */
export function NearbyAmenities({ section }: NearbyAmenitiesProps) {
  const restroom = nearestAmenity(section, 'restroom');
  const food = nearestAmenity(section, 'food');
  const exit = nearestGate(section);

  const entries = [
    { label: 'Nearest restroom', detail: `Near Section ${sectionNumber(restroom.sectionId)}` },
    { label: 'Nearest food', detail: `Near Section ${sectionNumber(food.sectionId)}` },
    { label: 'Closest exit', detail: exit.label },
  ];

  return (
    <Card accent="pitch">
      <h2 className="font-display text-h3 text-fan-ink">Closest to Section {section.label}</h2>
      <dl className="mt-3 flex flex-col gap-2">
        {entries.map((entry) => (
          <div key={entry.label} className="flex items-baseline justify-between gap-3">
            <dt className="text-body-sm text-fan-muted">{entry.label}</dt>
            <dd className="text-body-sm font-semibold text-fan-ink">{entry.detail}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
