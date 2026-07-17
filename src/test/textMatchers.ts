/**
 * Text matcher for @testing-library queries that ignores the U+2068/U+2069
 * bidi isolate marks formatUiString wraps around wayfinding identifiers —
 * tests assert the words the user reads, not the invisible direction marks.
 */
export function ignoringIsolates(expected: string) {
  return (content: string): boolean => content.replace(/[⁨⁩]/g, '') === expected;
}
