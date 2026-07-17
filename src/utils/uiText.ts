/**
 * Substitutes values into a translated template string, e.g.
 * `formatUiString('Closest to {id}', { id: 'Section 102' })`.
 *
 * Wayfinding identifiers ("Section 102", "Gate A", "Row 14") are passed in as
 * values and are NEVER translated or transliterated: the physical signage
 * inside the venue reads "SECTION 102" and "GATE A", and a fan navigating in
 * Hindi or Arabic has to match what the app says to what is printed on the
 * sign above their head. Translating the identifier would break wayfinding
 * for the exact user the translation is meant to serve — so templates carry
 * the translated words and identifiers are injected verbatim.
 *
 * Each substituted value is wrapped in Unicode first-strong-isolate marks
 * (U+2068 FSI … U+2069 PDI) so a Latin-script identifier keeps its own
 * left-to-right direction inside an RTL (Arabic) sentence instead of
 * visually scrambling.
 *
 * @param template Translated template with `{name}` placeholders.
 * @param values Placeholder values, injected verbatim with bidi isolation.
 * @returns The composed string; unknown placeholders are left untouched.
 */
export function formatUiString(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = values[name];
    return value === undefined ? match : `⁨${String(value)}⁩`;
  });
}
