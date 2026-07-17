/** Host country of a FIFA World Cup 2026 venue. */
export type VenueCountry = 'United States' | 'Canada' | 'Mexico';

/** Rail link serving a venue — grounds the transit board, facts, and announcements. */
export interface VenueRail {
  /** Operating service, e.g. "NJ Transit Rail". */
  service: string;
  /** Line or branch name shown on the transit board, e.g. "Meadowlands Line". */
  line: string;
  /**
   * Bare station proper noun (no "Station" suffix) so announcement templates
   * can compose it into any language, e.g. "Meadowlands" → "la estación
   * Meadowlands" / "メドウランズ駅".
   */
  station: string;
  /** Major interchange feeding the venue line, e.g. "Secaucus Junction". */
  hub: string;
}

/** One FIFA World Cup 2026 host venue in the registry (services/data/venues.ts). */
export interface Venue {
  id: string;
  name: string;
  city: string;
  country: VenueCountry;
  /** Tournament-configuration seats; drives layout generation and KPI scaling. */
  capacity: number;
  /** Composes into "hosting {stage} at FIFA World Cup 2026", e.g. "the Final". */
  stage: string;
  rail: VenueRail;
  /** Rideshare pickup/drop-off lot, e.g. "Lot E". */
  rideshareLot: string;
  /** Main matchday parking lot, e.g. "Lot G". */
  parkingLot: string;
}
