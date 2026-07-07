export type TransitMode = 'rail' | 'bus' | 'rideshare' | 'parking' | 'walk';

export type TransitStatus = 'on-time' | 'delayed' | 'disrupted';

/** One arrival/departure option shown on the live transit board. */
export interface TransitOption {
  id: string;
  mode: TransitMode;
  label: string;
  etaMinutes: number;
  status: TransitStatus;
  crowdingLevel: 'normal' | 'elevated' | 'critical';
}
