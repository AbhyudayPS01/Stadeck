import { describe, expect, it } from 'vitest';
import { getSustainabilityMetrics } from './sustainability';

describe('getSustainabilityMetrics', () => {
  it('keeps every metric within its plausible bound', () => {
    const metrics = getSustainabilityMetrics();

    expect(metrics.wasteDivertedPercent).toBeGreaterThanOrEqual(55);
    expect(metrics.wasteDivertedPercent).toBeLessThanOrEqual(85);

    expect(metrics.renewableEnergyPercent).toBeGreaterThanOrEqual(40);
    expect(metrics.renewableEnergyPercent).toBeLessThanOrEqual(75);

    expect(metrics.waterUsageLiters).toBeGreaterThanOrEqual(180_000);
    expect(metrics.waterUsageLiters).toBeLessThanOrEqual(260_000);

    expect(metrics.carbonOffsetKg).toBeGreaterThanOrEqual(12_000);
    expect(metrics.carbonOffsetKg).toBeLessThanOrEqual(22_000);

    expect(metrics.transitModeSharePercent).toBeGreaterThanOrEqual(60);
    expect(metrics.transitModeSharePercent).toBeLessThanOrEqual(90);
  });

  it('stamps a valid ISO timestamp', () => {
    const metrics = getSustainabilityMetrics();
    expect(() => new Date(metrics.timestamp).toISOString()).not.toThrow();
  });
});
