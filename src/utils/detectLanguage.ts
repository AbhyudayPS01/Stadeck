/**
 * Lightweight client-side language detection for the concierge chat. It has
 * two jobs only: (1) pick the reply language for the deterministic offline
 * mock, and (2) power the "Detected: Español" hint under the input. The live
 * path never relies on it — Gemini detects the language itself and reports
 * the definitive BCP-47 code in its response.
 */

/** Unicode-script checks run first: unambiguous and cheap. */
const SCRIPT_PATTERNS: ReadonlyArray<[RegExp, string]> = [
  [/[؀-ۿ]/u, 'ar'], // Arabic
  [/[ऀ-ॿ]/u, 'hi'], // Devanagari (Hindi)
  [/[぀-ヿ一-鿿]/u, 'ja'], // Kana or CJK — Japanese is the supported CJK language
];

/**
 * Distinctive high-frequency words per Latin-script language. Deliberately
 * biased toward accented/unique tokens to limit es/pt/fr overlap; ties and
 * misses fall back to English, which is always a safe reply language here.
 */
const LATIN_MARKERS: ReadonlyArray<[string, readonly string[]]> = [
  ['es', ['dónde', 'está', 'cómo', 'qué', 'gracias', 'hola', 'baño', 'entrada', 'ayuda', 'puerta']],
  ['fr', ['où', 'merci', 'bonjour', 'toilettes', 'comment', 'est-ce', 'vous', 'porte', 'entrée']],
  ['pt', ['onde', 'obrigado', 'obrigada', 'banheiro', 'você', 'olá', 'fica', 'portão', 'ajuda']],
  ['de', ['wo', 'ist', 'danke', 'bitte', 'der', 'die', 'das', 'ich', 'toilette', 'eingang', 'wie']],
];

/**
 * Detects the language of a chat message, returning a SUPPORTED_LANGUAGES
 * code; defaults to "en" when nothing matches.
 *
 * @param text Raw message text.
 * @returns A BCP-47 code: ar/hi/ja by script, es/fr/pt/de by marker words, else "en".
 */
export function detectLanguage(text: string): string {
  for (const [pattern, language] of SCRIPT_PATTERNS) {
    if (pattern.test(text)) {
      return language;
    }
  }

  const tokens = text.toLowerCase().split(/[^\p{L}'-]+/u);
  let best: { language: string; score: number } = { language: 'en', score: 0 };
  for (const [language, markers] of LATIN_MARKERS) {
    const score = tokens.filter((token) => markers.includes(token)).length;
    if (score > best.score) {
      best = { language, score };
    }
  }
  return best.language;
}

const RTL_LANGUAGES: readonly string[] = ['ar', 'fa', 'he', 'ur'];

/**
 * Whether text in this language renders right-to-left, so chat bubbles and
 * translated announcements can set `dir="rtl"`.
 *
 * @param language BCP-47 tag; only the primary subtag is considered.
 */
export function isRtlLanguage(language: string): boolean {
  const primarySubtag = language.toLowerCase().split('-')[0] ?? '';
  return RTL_LANGUAGES.includes(primarySubtag);
}
