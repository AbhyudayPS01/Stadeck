/**
 * Non-deterministic helpers shared by the mock "live" data providers. Kept
 * out of utils/ deliberately — utils/ is pure functions only, and these
 * intentionally vary between calls to simulate a live feed.
 */

/** Random integer in [min, max], inclusive. */
export function randomInt(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

/** Picks a uniformly random element from a non-empty array. */
export function pickRandom<T>(items: readonly T[]): T {
  const item = items[randomInt(0, items.length - 1)];
  if (item === undefined) {
    throw new Error('pickRandom called with an empty array');
  }
  return item;
}
