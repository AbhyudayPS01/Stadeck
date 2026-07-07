import type { KpiSnapshot } from '../../types/operational';
import { STADIUM_CAPACITY } from '../../config/constants';
import { randomInt } from './random';

/** Organizer-facing operational snapshot, refreshed on an interval by useMockStream. */
export function getKpiSnapshot(): KpiSnapshot[] {
  const timestamp = new Date().toISOString();
  const attendancePercent = randomInt(88, 99);
  const gateWaitMinutes = randomInt(3, 14);
  const openIncidents = randomInt(0, 5);
  const transitOnTimePercent = randomInt(70, 100);
  const energyUsagePercent = randomInt(60, 95);

  return [
    {
      id: 'attendance',
      label: 'Attendance',
      value: Math.round((attendancePercent / 100) * STADIUM_CAPACITY),
      unit: 'fans',
      trend: 'up',
      severity: 'normal',
      timestamp,
    },
    {
      id: 'gate-wait-time',
      label: 'Avg. Gate Wait Time',
      value: gateWaitMinutes,
      unit: 'minutes',
      trend: gateWaitMinutes >= 10 ? 'up' : 'flat',
      severity: gateWaitMinutes >= 10 ? 'elevated' : 'normal',
      timestamp,
    },
    {
      id: 'open-incidents',
      label: 'Open Incidents',
      value: openIncidents,
      unit: 'incidents',
      trend: openIncidents > 2 ? 'up' : 'flat',
      severity: openIncidents > 2 ? 'elevated' : 'normal',
      timestamp,
    },
    {
      id: 'transit-on-time',
      label: 'Transit On-Time Rate',
      value: transitOnTimePercent,
      unit: '%',
      trend: transitOnTimePercent < 85 ? 'down' : 'flat',
      severity: transitOnTimePercent < 80 ? 'elevated' : 'normal',
      timestamp,
    },
    {
      id: 'energy-usage',
      label: 'Grid Energy Draw',
      value: energyUsagePercent,
      unit: '% of peak',
      trend: 'flat',
      severity: energyUsagePercent >= 90 ? 'elevated' : 'normal',
      timestamp,
    },
  ];
}
