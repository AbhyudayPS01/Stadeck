import type { Gate, StadiumSection } from '../../types/stadium';
import { gatePoint, routePath, sectionLabelPoint } from './mapGeometry';

export interface RouteOverlayLayerProps {
  /** Where the route starts (the fan's chosen entry gate). */
  gate: Gate;
  /** Where the route ends (the fan's seating section). */
  section: StadiumSection;
}

/**
 * Highlighted walking route rendered through StadiumMap's overlay slot, shared
 * by the Navigation directions and the Accessibility step-free planner.
 * Decorative by design (aria-hidden): the turn-by-turn text next to the map
 * carries the same information, so the overlay never has to be readable.
 */
export function RouteOverlayLayer({ gate, section }: RouteOverlayLayerProps) {
  const start = gatePoint(gate);
  const end = sectionLabelPoint(section);
  const path = routePath(gate, section);

  return (
    <g aria-hidden="true" data-testid="route-overlay">
      {/* White casing under the dashed stroke keeps the route legible over any section fill. */}
      <path d={path} fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="7" />
      <path
        d={path}
        fill="none"
        stroke="#106634"
        strokeDasharray="8 6"
        strokeLinecap="round"
        strokeWidth="3.5"
      />
      <circle cx={start.x} cy={start.y} fill="#106634" r="6" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx={end.x} cy={end.y} fill="#E8A93B" r="7" stroke="#FFFFFF" strokeWidth="2" />
    </g>
  );
}
