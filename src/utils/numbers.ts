/**
 * Clamps a value into [min, max]. Simulated "external" feeds (transit ETAs,
 * sensor metrics) are treated as untrusted per SECURITY.md — every numeric
 * feed value is bounded with this before it reaches the DOM.
 *
 * @param value The raw value.
 * @param min Inclusive lower bound.
 * @param max Inclusive upper bound.
 * @returns The bounded value; NaN becomes the lower bound.
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}
