export type KpiTrend = 'up' | 'down' | 'flat';

export type KpiSeverity = 'normal' | 'elevated' | 'critical' | 'info';

/** One organizer-facing operational metric shown on the KPI board. */
export interface KpiSnapshot {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: KpiTrend;
  severity: KpiSeverity;
  timestamp: string;
}
