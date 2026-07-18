import { describe, expect, it } from 'vitest';
import { getSustainabilityMetrics } from './sustainability';
import { DEFAULT_VENUE, findVenue } from './venues';

describe('getSustainabilityMetrics', () => {
  it('keeps every metric within its plausible bound for the default venue', () => {
    const metrics = getSustainabilityMetrics();

    expect(metrics.wasteDivertedPercent).toBeGreaterThanOrEqual(55);
    expect(metrics.wasteDivertedPercent).toBeLessThanOrEqual(85);

    expect(metrics.renewableEnergyPercent).toBeGreaterThanOrEqual(40);
    expect(metrics.renewableEnergyPercent).toBeLessThanOrEqual(75);

    expect(metrics.waterUsageLiters).toBeGreaterThanOrEqual(2.2 * DEFAULT_VENUE.capacity);
    expect(metrics.waterUsageLiters).toBeLessThanOrEqual(3.2 * DEFAULT_VENUE.capacity);

    expect(metrics.carbonOffsetKg).toBeGreaterThanOrEqual(0.15 * DEFAULT_VENUE.capacity);
    expect(metrics.carbonOffsetKg).toBeLessThanOrEqual(0.27 * DEFAULT_VENUE.capacity);

    expect(metrics.transitModeSharePercent).toBeGreaterThanOrEqual(60);
    expect(metrics.transitModeSharePercent).toBeLessThanOrEqual(90);
  });

  it('scales the volume metrics down for a smaller venue', () => {
    const toronto = findVenue('bmo-field');
    expect(toronto).toBeDefined();
    if (!toronto) return;

    const metrics = getSustainabilityMetrics(toronto);
    expect(metrics.waterUsageLiters).toBeLessThanOrEqual(3.2 * toronto.capacity);
    expect(metrics.carbonOffsetKg).toBeLessThanOrEqual(0.27 * toronto.capacity);
  });

  it('reports proportionally different volume metrics for a small venue than a large one, not the same numbers relabeled', () => {
    const toronto = findVenue('bmo-field'); // 45,000-seat venue
    const azteca = findVenue('estadio-azteca'); // 87,000-seat venue
    expect(toronto).toBeDefined();
    expect(azteca).toBeDefined();
    if (!toronto || !azteca) return;

    const waterValues = (venue: NonNullable<typeof toronto>) =>
      Array.from({ length: 20 }, () => getSustainabilityMetrics(venue).waterUsageLiters);
    const carbonValues = (venue: NonNullable<typeof toronto>) =>
      Array.from({ length: 20 }, () => getSustainabilityMetrics(venue).carbonOffsetKg);

    expect(Math.max(...waterValues(toronto))).toBeLessThan(Math.min(...waterValues(azteca)));
    expect(Math.max(...carbonValues(toronto))).toBeLessThan(Math.min(...carbonValues(azteca)));
  });

  it('stamps a valid ISO timestamp', () => {
    const metrics = getSustainabilityMetrics();
    expect(() => new Date(metrics.timestamp).toISOString()).not.toThrow();
  });
});
