/** Host country of a FIFA World Cup 2026 venue. */
export type VenueCountry = 'United States' | 'Canada' | 'Mexico';

/**
 * Roof configuration — feeds AI weather/crowd reasoning (an open-air bowl and
 * a domed venue plan differently around rain and heat) and the venue picker's
 * secondary detail line.
 */
export type VenueRoof = 'open' | 'retractable' | 'fixed';

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
  roof: VenueRoof;
  /** Elevation above sea level — grounds the altitude advisory fact for high-altitude venues. */
  altitudeMeters: number;
  /**
   * Approximate public coordinates (degrees), used only for the on-device
   * nearest-venue distance calculation in utils/geolocation.ts — never sent
   * anywhere, never compared against a fan's precise location.
   */
  latitude: number;
  longitude: number;
  /** IANA time zone identifier, e.g. "America/New_York" — grounds local-time facts and prompts. */
  timezone: string;
  /**
   * Seating tiers the generated map renders: 3 for a lower/club/upper bowl,
   * 2 for smaller soccer-specific grounds with no club level (see
   * services/data/stadiumLayout.ts's tier plans).
   */
  tierCount: 2 | 3;
  /** Entry gates the generated map renders, one per compass point (see stadiumLayout.ts's GATES). */
  gateCount: number;
  /** A short factual note distinguishing this venue, shown in venue-facing copy. */
  note: string;
}
