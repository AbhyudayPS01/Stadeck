/**
 * Shared shape for the per-module interface-string tables (uiStrings*.ts).
 * Each table is a Record over ALL eight languages, so the compiler fails the
 * build if any language misses a key — that guarantee is the point of the
 * static-table design. Tables are split by module (not by language) so a
 * module's strings stay together within the file-size limits.
 */

export const UI_LANGUAGES = ['en', 'es', 'fr', 'pt', 'de', 'hi', 'ar', 'ja'] as const;

export type UiLanguage = (typeof UI_LANGUAGES)[number];

/** One module's strings across every supported language. */
export type UiStringTable<K extends string> = Readonly<
  Record<UiLanguage, Readonly<Record<K, string>>>
>;
