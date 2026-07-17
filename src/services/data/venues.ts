import { DEFAULT_VENUE_ID } from '../../config/constants';
import type { Venue } from '../../types/venue';

/**
 * Registry of the sixteen FIFA World Cup 2026 host venues. Capacities are
 * approximate tournament configurations; rail links and lot names are demo
 * fiction anchored to each city's real transit network, not venue guidance.
 * Every layout, fact sheet, and mock feed is generated from these entries, so
 * adding a venue here is all it takes to bring it into the app.
 */
export const VENUES: readonly Venue[] = [
  {
    id: 'metlife-stadium',
    name: 'MetLife Stadium',
    city: 'East Rutherford',
    country: 'United States',
    capacity: 82_500,
    stage: 'the Final',
    rail: {
      service: 'NJ Transit Rail',
      line: 'Meadowlands Line',
      station: 'Meadowlands',
      hub: 'Secaucus Junction',
    },
    rideshareLot: 'Lot E',
    parkingLot: 'Lot G',
  },
  {
    id: 'att-stadium',
    name: 'AT&T Stadium',
    city: 'Arlington',
    country: 'United States',
    capacity: 80_000,
    stage: 'a Semi-final',
    rail: {
      service: 'Trinity Railway Express',
      line: 'Stadium Shuttle Link',
      station: 'CentrePort',
      hub: 'Dallas Union Station',
    },
    rideshareLot: 'Lot 10',
    parkingLot: 'Lot 4',
  },
  {
    id: 'estadio-azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: 87_000,
    stage: 'the Opening match',
    rail: {
      service: 'Tren Ligero',
      line: 'Xochimilco Line',
      station: 'Estadio Azteca',
      hub: 'Tasqueña',
    },
    rideshareLot: 'Lot C',
    parkingLot: 'Lot A',
  },
  {
    id: 'sofi-stadium',
    name: 'SoFi Stadium',
    city: 'Inglewood',
    country: 'United States',
    capacity: 70_000,
    stage: 'a Quarter-final',
    rail: {
      service: 'LA Metro Rail',
      line: 'K Line',
      station: 'Downtown Inglewood',
      hub: 'LAX Transit Center',
    },
    rideshareLot: 'Lot L',
    parkingLot: 'Lot P1',
  },
  {
    id: 'arrowhead-stadium',
    name: 'Arrowhead Stadium',
    city: 'Kansas City',
    country: 'United States',
    capacity: 76_000,
    stage: 'a Quarter-final',
    rail: {
      service: 'KC Streetcar',
      line: 'Stadium Shuttle Link',
      station: 'Sports Complex',
      hub: 'Union Station',
    },
    rideshareLot: 'Lot M',
    parkingLot: 'Lot B',
  },
  {
    id: 'nrg-stadium',
    name: 'NRG Stadium',
    city: 'Houston',
    country: 'United States',
    capacity: 72_000,
    stage: 'Round of 16 matches',
    rail: {
      service: 'METRORail',
      line: 'Red Line',
      station: 'Stadium Park',
      hub: 'Downtown Transit Center',
    },
    rideshareLot: 'Yellow Lot',
    parkingLot: 'Blue Lot',
  },
  {
    id: 'mercedes-benz-stadium',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    country: 'United States',
    capacity: 71_000,
    stage: 'a Semi-final',
    rail: {
      service: 'MARTA Rail',
      line: 'Blue Line',
      station: 'Vine City',
      hub: 'Five Points',
    },
    rideshareLot: 'Home Depot Backyard Lot',
    parkingLot: 'Silver Deck',
  },
  {
    id: 'lincoln-financial-field',
    name: 'Lincoln Financial Field',
    city: 'Philadelphia',
    country: 'United States',
    capacity: 69_000,
    stage: 'Round of 16 matches',
    rail: {
      service: 'SEPTA Metro',
      line: 'Broad Street Line',
      station: 'NRG',
      hub: 'City Hall',
    },
    rideshareLot: 'Lot K',
    parkingLot: 'Lot J',
  },
  {
    id: 'lumen-field',
    name: 'Lumen Field',
    city: 'Seattle',
    country: 'United States',
    capacity: 69_000,
    stage: 'Round of 32 matches',
    rail: {
      service: 'Link Light Rail',
      line: '1 Line',
      station: 'Stadium',
      hub: 'Westlake',
    },
    rideshareLot: 'Lot 5',
    parkingLot: 'North Lot',
  },
  {
    id: 'levis-stadium',
    name: "Levi's Stadium",
    city: 'Santa Clara',
    country: 'United States',
    capacity: 71_000,
    stage: 'Group stage matches',
    rail: {
      service: 'VTA Light Rail',
      line: 'Orange Line',
      station: 'Great America',
      hub: 'Diridon Station',
    },
    rideshareLot: 'Green Lot 1',
    parkingLot: 'Red Lot 1',
  },
  {
    id: 'gillette-stadium',
    name: 'Gillette Stadium',
    city: 'Foxborough',
    country: 'United States',
    capacity: 65_000,
    stage: 'a Quarter-final',
    rail: {
      service: 'MBTA Commuter Rail',
      line: 'Foxboro Event Line',
      station: 'Foxboro',
      hub: 'South Station',
    },
    rideshareLot: 'Lot 15',
    parkingLot: 'Lot 4',
  },
  {
    id: 'hard-rock-stadium',
    name: 'Hard Rock Stadium',
    city: 'Miami Gardens',
    country: 'United States',
    capacity: 65_000,
    stage: 'the Third-place match',
    rail: {
      service: 'Tri-Rail',
      line: 'Stadium Shuttle Link',
      station: 'Golden Glades',
      hub: 'MiamiCentral',
    },
    rideshareLot: 'Lot 18',
    parkingLot: 'Lot 2',
  },
  {
    id: 'bmo-field',
    name: 'BMO Field',
    city: 'Toronto',
    country: 'Canada',
    capacity: 45_000,
    stage: 'Group stage matches',
    rail: {
      service: 'GO Transit',
      line: 'Lakeshore West Line',
      station: 'Exhibition',
      hub: 'Union Station',
    },
    rideshareLot: 'Lot 2',
    parkingLot: 'Lot 1',
  },
  {
    id: 'bc-place',
    name: 'BC Place',
    city: 'Vancouver',
    country: 'Canada',
    capacity: 54_000,
    stage: 'Round of 16 matches',
    rail: {
      service: 'SkyTrain',
      line: 'Expo Line',
      station: 'Stadium-Chinatown',
      hub: 'Waterfront',
    },
    rideshareLot: 'Terry Fox Plaza Lot',
    parkingLot: 'Lot A',
  },
  {
    id: 'estadio-bbva',
    name: 'Estadio BBVA',
    city: 'Monterrey',
    country: 'Mexico',
    capacity: 53_500,
    stage: 'Group stage matches',
    rail: {
      service: 'Metrorrey',
      line: 'Line 2',
      station: 'Exposición',
      hub: 'Cuauhtémoc',
    },
    rideshareLot: 'Lot Oriente',
    parkingLot: 'Lot Norte',
  },
  {
    id: 'estadio-akron',
    name: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'Mexico',
    capacity: 48_000,
    stage: 'Group stage matches',
    rail: {
      service: 'Mi Tren',
      line: 'Line 3',
      station: 'Periférico Belenes',
      hub: 'Guadalajara Centro',
    },
    rideshareLot: 'Lot Poniente',
    parkingLot: 'Lot Sur',
  },
];

/**
 * Finds a venue by registry id.
 *
 * @param venueId The venue's registry id, e.g. "metlife-stadium".
 * @returns The venue entry, or undefined when the id is unknown.
 */
export function findVenue(venueId: string): Venue | undefined {
  return VENUES.find((venue) => venue.id === venueId);
}

function requireDefaultVenue(): Venue {
  const venue = findVenue(DEFAULT_VENUE_ID);
  if (!venue) {
    throw new Error(`Default venue "${DEFAULT_VENUE_ID}" is missing from the venue registry`);
  }
  return venue;
}

/** The venue every screen renders until a venue switcher lands (see constants.ts). */
export const DEFAULT_VENUE: Venue = requireDefaultVenue();
