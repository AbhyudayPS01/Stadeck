import { describe, expect, it } from 'vitest';
import { getKpiSnapshot } from './kpis';
import { findVenue } from './venues';

describe('getKpiSnapshot', () => {
  it('returns 5 KPIs with unique ids', () => {
    const kpis = getKpiSnapshot();
    expect(kpis).toHaveLength(5);
    expect(new Set(kpis.map((kpi) => kpi.id)).size).toBe(5);
  });

  it('keeps attendance within plausible bounds for the 82,500-seat default venue', () => {
    const kpis = getKpiSnapshot();
    const attendance = kpis.find((kpi) => kpi.id === 'attendance');
    expect(attendance).toBeDefined();
    expect(attendance?.value).toBeGreaterThan(70_000);
    expect(attendance?.value).toBeLessThanOrEqual(82_500);
  });

  it('scales attendance to the venue capacity', () => {
    const toronto = findVenue('bmo-field');
    expect(toronto).toBeDefined();
    if (!toronto) return;
    const attendance = getKpiSnapshot(toronto).find((kpi) => kpi.id === 'attendance');
    expect(attendance?.value).toBeLessThanOrEqual(toronto.capacity);
  });

  it('flags gate wait time as elevated only once it reaches 10 minutes', () => {
    const kpis = getKpiSnapshot();
    const gateWait = kpis.find((kpi) => kpi.id === 'gate-wait-time');
    expect(gateWait).toBeDefined();
    if (gateWait && gateWait.value >= 10) {
      expect(gateWait.severity).toBe('elevated');
    } else if (gateWait) {
      expect(gateWait.severity).toBe('normal');
    }
  });
});
