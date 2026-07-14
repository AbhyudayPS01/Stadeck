/**
 * Joins class-name fragments, skipping falsy values — the app's only
 * class-combining helper (no clsx dependency; CLAUDE.md minimal-deps rule).
 *
 * @param parts Class strings, or falsy values from conditional expressions.
 * @returns The truthy parts joined with single spaces.
 */
export function cx(...parts: ReadonlyArray<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
