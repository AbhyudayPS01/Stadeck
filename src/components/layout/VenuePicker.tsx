import { useEffect, useId } from 'react';
import { NEARBY_VENUE_THRESHOLD_KM } from '../../config/constants';
import { useGeolocatedVenue } from '../../hooks/useGeolocatedVenue';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';
import type { UiStrings } from '../../services/data/uiStrings';
import { VENUES } from '../../services/data/venues';
import type { Venue, VenueCountry } from '../../types/venue';
import { formatCount } from '../../utils/format';
import { formatUiString } from '../../utils/uiText';

const COUNTRY_ORDER: readonly VenueCountry[] = ['United States', 'Canada', 'Mexico'];

function countryLabel(strings: UiStrings, country: VenueCountry): string {
  if (country === 'United States') return strings['venue.groupUnitedStates'];
  if (country === 'Canada') return strings['venue.groupCanada'];
  return strings['venue.groupMexico'];
}

function venuesByCountry(country: VenueCountry): Venue[] {
  return VENUES.filter((venue) => venue.country === country);
}

/** Distance formatted with the app's grouped-digit convention; "km" is kept in Latin form across languages, like other unit abbreviations in the app. */
function distanceLabel(distanceKm: number): string {
  return `${formatCount(Math.round(distanceKm))} km`;
}

/**
 * Venue picker for the sidebar: a native select grouped by host country
 * (United States / Canada / Mexico), showing each venue's name, city,
 * capacity, and roof — one-handed and keyboard-accessible on a phone with no
 * custom popover. Venue names and cities are proper nouns and are injected
 * verbatim (never translated), the same rule as wayfinding identifiers.
 *
 * "Find nearest venue" never runs on load — only this button triggers the
 * browser's location prompt. Within NEARBY_VENUE_THRESHOLD_KM it switches
 * the venue directly (the fan asked to be found); beyond it, it surfaces the
 * nearest match as information instead of jumping the view to an irrelevant
 * venue, since that fan is almost certainly planning ahead from home.
 * Permission denial, unavailability, or a timeout all fall back to the
 * picker with no error state — see useGeolocatedVenue.
 */
export function VenuePicker() {
  const { venue, setVenueId } = useVenue();
  const strings = useUiStrings();
  const { state, locate } = useGeolocatedVenue();
  const id = useId();

  useEffect(() => {
    if (state.status === 'found' && state.result.distanceKm <= NEARBY_VENUE_THRESHOLD_KM) {
      setVenueId(state.result.venue.id);
    }
  }, [state, setVenueId]);

  const optionLabel = (candidate: Venue): string =>
    formatUiString(strings['venue.optionLabel'], {
      name: candidate.name,
      city: candidate.city,
      capacity: formatCount(candidate.capacity),
      roof: strings[`venue.roof.${candidate.roof}`],
    });

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label font-semibold text-ops-faint" htmlFor={id}>
        {strings['venue.label']}
      </label>
      <select
        className="rounded-md border border-ops-border bg-ops-surface px-3 py-2 text-body-sm text-ops-body focus-visible:outline-none focus-visible:shadow-inputfocus"
        id={id}
        onChange={(event) => setVenueId(event.target.value)}
        value={venue.id}
      >
        {COUNTRY_ORDER.map((country) => (
          <optgroup key={country} label={countryLabel(strings, country)}>
            {venuesByCountry(country).map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {optionLabel(candidate)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <button
        className="rounded-md border border-ops-border px-3 py-1.5 text-label font-semibold text-ops-body transition-colors hover:bg-ops-surface2 focus-visible:outline-none focus-visible:shadow-inputfocus disabled:cursor-not-allowed disabled:opacity-60"
        disabled={state.status === 'locating'}
        onClick={locate}
        type="button"
      >
        {state.status === 'locating' ? strings['venue.locating'] : strings['venue.findNearest']}
      </button>
      {state.status === 'found' ? (
        <p aria-live="polite" className="text-label text-ops-muted">
          {formatUiString(
            state.result.distanceKm <= NEARBY_VENUE_THRESHOLD_KM
              ? strings['venue.nearestNearby']
              : strings['venue.nearestFar'],
            {
              name: state.result.venue.name,
              city: state.result.venue.city,
              distance: distanceLabel(state.result.distanceKm),
            },
          )}
        </p>
      ) : null}
    </div>
  );
}
