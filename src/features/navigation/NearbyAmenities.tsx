import { Card } from '../../components/ui/Card';
import { useUiStrings } from '../../hooks/useUiStrings';
import { nearestAmenity, nearestGate, sectionNumber } from '../../services/data/stadiumLayout';
import type { StadiumSection } from '../../types/stadium';
import { formatUiString } from '../../utils/uiText';

export interface NearbyAmenitiesProps {
  section: StadiumSection;
}

/**
 * Closest restroom, food, and exit for the selected section — computed from
 * the stadium layout config, no AI round-trip needed for fixed geography.
 */
export function NearbyAmenities({ section }: NearbyAmenitiesProps) {
  const strings = useUiStrings();
  const restroom = nearestAmenity(section, 'restroom');
  const food = nearestAmenity(section, 'food');
  const exit = nearestGate(section);

  // Labels translate; "Section 105" / "Gate A" are wayfinding identifiers and
  // are injected verbatim through formatUiString (see utils/uiText.ts).
  const near = (sectionId: string): string =>
    formatUiString(strings['navigation.nearIdentifier'], {
      id: `Section ${sectionNumber(sectionId)}`,
    });
  const entries = [
    { label: strings['navigation.nearestRestroom'], detail: near(restroom.sectionId) },
    { label: strings['navigation.nearestFood'], detail: near(food.sectionId) },
    { label: strings['navigation.closestExit'], detail: exit.label },
  ];

  return (
    <Card accent="pitch">
      <h2 className="font-display text-h3 text-fan-ink">
        {formatUiString(strings['navigation.closestTo'], { id: `Section ${section.label}` })}
      </h2>
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
