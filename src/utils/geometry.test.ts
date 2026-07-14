import { describe, expect, it } from 'vitest';
import { annularSectorPath, polarToCartesian } from './geometry';

describe('polarToCartesian', () => {
  it('maps 0° to straight up (North)', () => {
    expect(polarToCartesian(300, 300, 100, 0)).toEqual({ x: 300, y: 200 });
  });

  it('maps 90° to the right (East)', () => {
    expect(polarToCartesian(300, 300, 100, 90)).toEqual({ x: 400, y: 300 });
  });

  it('maps 180° to straight down (South)', () => {
    expect(polarToCartesian(300, 300, 100, 180)).toEqual({ x: 300, y: 400 });
  });

  it('maps 270° to the left (West)', () => {
    expect(polarToCartesian(300, 300, 100, 270)).toEqual({ x: 200, y: 300 });
  });

  it('rounds coordinates to 2 decimals', () => {
    const point = polarToCartesian(0, 0, 100, 45);
    expect(point).toEqual({ x: 70.71, y: -70.71 });
  });
});

describe('annularSectorPath', () => {
  it('builds a closed path from the outer start point', () => {
    const path = annularSectorPath(300, 300, 100, 150, 0, 90);

    expect(path.startsWith('M 300 150')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
  });

  it('uses a clockwise sweep on the outer arc and counter-clockwise on the inner', () => {
    const path = annularSectorPath(300, 300, 100, 150, 0, 90);

    expect(path).toContain('A 150 150 0 0 1 450 300');
    expect(path).toContain('A 100 100 0 0 0 300 200');
  });

  it('sets the large-arc flag for sectors wider than 180°', () => {
    const path = annularSectorPath(300, 300, 100, 150, 0, 270);

    expect(path).toContain('A 150 150 0 1 1');
  });
});
