/** Broad announcement categories used for the badge on each feed item. */
export type AnnouncementCategory = 'safety' | 'transit' | 'match' | 'services';

/** One venue PA/board announcement on the simulated live feed. */
export interface Announcement {
  id: string;
  category: AnnouncementCategory;
  /** English source text as issued by venue operations. */
  message: string;
  /**
   * Canned translations keyed by BCP-47 code — the deterministic offline path
   * for one-click translation. The live path asks Gemini instead; these keep
   * the demo fully multilingual with zero API key (SPEC.md mock fallback).
   */
  translations: Readonly<Record<string, string>>;
  /** ISO timestamp. */
  issuedAt: string;
}
