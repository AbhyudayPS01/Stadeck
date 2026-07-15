/** Cartesian point in SVG user units. */
export interface Point {
  x: number;
  y: number;
}

/** Rounds to 2 decimals — keeps generated SVG path strings compact and stable for tests. */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Converts a stadium-map polar coordinate to SVG cartesian coordinates.
 * Angles follow the stadiumLayout convention: 0° = North (up), clockwise —
 * while SVG measures from the positive x-axis, hence the -90° shift.
 *
 * @param cx Circle center x.
 * @param cy Circle center y.
 * @param radius Distance from the center.
 * @param angleDeg Degrees, 0 = North, clockwise.
 * @returns The point on the circle, rounded to 2 decimals.
 */
export function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number): Point {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: round(cx + radius * Math.cos(angleRad)),
    y: round(cy + radius * Math.sin(angleRad)),
  };
}

/**
 * Shortest angular separation between two compass bearings, always 0–180.
 * Used to find the amenity or gate nearest to a seating section on the
 * concentric-ring map, where "nearest" means smallest walk around the ring.
 *
 * @param angleA Degrees, 0 = North, clockwise.
 * @param angleB Degrees, 0 = North, clockwise.
 * @returns The separation in degrees, in [0, 180].
 */
export function angularDistanceDegrees(angleA: number, angleB: number): number {
  const difference = Math.abs(angleA - angleB) % 360;
  return difference > 180 ? 360 - difference : difference;
}

/**
 * Signed shortest rotation from one bearing to another, in (-180, 180].
 * Positive means clockwise. Drives which way a route arc bends around the
 * concourse ring on the schematic map.
 *
 * @param fromAngle Degrees, 0 = North, clockwise.
 * @param toAngle Degrees, 0 = North, clockwise.
 * @returns The signed rotation in degrees.
 */
export function signedAngularDeltaDegrees(fromAngle: number, toAngle: number): number {
  const delta = ((((toAngle - fromAngle) % 360) + 540) % 360) - 180;
  return delta === -180 ? 180 : delta;
}

/**
 * SVG path for an annular (ring) sector between two radii and two angles —
 * the shape of one seating section on the schematic stadium map. Drawn
 * clockwise along the outer arc, then back counter-clockwise along the inner.
 *
 * @param cx Ring center x.
 * @param cy Ring center y.
 * @param innerRadius Inner edge of the ring band.
 * @param outerRadius Outer edge of the ring band.
 * @param startAngle Degrees, 0 = North, clockwise.
 * @param endAngle Degrees, must be greater than startAngle.
 * @returns A closed SVG path string.
 */
export function annularSectorPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}
