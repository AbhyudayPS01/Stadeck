export type IncidentCategory =
  | 'medical'
  | 'security'
  | 'crowd'
  | 'weather'
  | 'facilities'
  | 'transportation';

export type IncidentSeverity = 'normal' | 'elevated' | 'critical';

type IncidentStatus = 'open' | 'monitoring' | 'resolved';

/** A single reported operational incident, as shown in the live incident feed. */
export interface Incident {
  id: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  summary: string;
  location: string;
  reportedAt: string;
  status: IncidentStatus;
}
