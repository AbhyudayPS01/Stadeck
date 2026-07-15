import { describe, expect, it } from 'vitest';
import { estimateCrowdCarbonTonnes } from './carbon';

describe('estimateCrowdCarbonTonnes', () => {
  it('estimates an all-car crowd at the car factor', () => {
    // 10,000 fans × 9 kg = 90 tonnes
    expect(estimateCrowdCarbonTonnes(10_000, 0)).toBe(90);
  });

  it('estimates an all-transit crowd at the transit factor', () => {
    // 10,000 fans × 2 kg = 20 tonnes
    expect(estimateCrowdCarbonTonnes(10_000, 100)).toBe(20);
  });

  it('falls as transit share rises', () => {
    expect(estimateCrowdCarbonTonnes(82_500, 90)).toBeLessThan(
      estimateCrowdCarbonTonnes(82_500, 60),
    );
  });

  it('clamps out-of-range shares and negative attendance from the untrusted feed', () => {
    expect(estimateCrowdCarbonTonnes(10_000, 250)).toBe(20);
    expect(estimateCrowdCarbonTonnes(-5, 50)).toBe(0);
  });
});
