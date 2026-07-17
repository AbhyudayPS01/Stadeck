import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { getUiStrings, UI_LANGUAGES, UI_STRING_TABLES } from './uiStrings';

const ENGLISH = getUiStrings('en');
const ENGLISH_KEYS = Object.keys(ENGLISH).sort();

describe('getUiStrings', () => {
  it('covers every supported language with the full key set', () => {
    for (const option of SUPPORTED_LANGUAGES) {
      const strings = getUiStrings(option.code);
      expect(Object.keys(strings).sort(), option.code).toEqual(ENGLISH_KEYS);
      for (const value of Object.values(strings)) {
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });

  it('actually translates: non-English tables differ from English', () => {
    for (const option of SUPPORTED_LANGUAGES) {
      if (option.code === 'en') {
        continue;
      }
      const strings = getUiStrings(option.code);
      expect(strings['module.navigation.description'], option.code).not.toBe(
        ENGLISH['module.navigation.description'],
      );
    }
  });

  it('falls back to English for an unsupported language code', () => {
    expect(getUiStrings('xx')).toEqual(ENGLISH);
  });

  it('keeps the module titles aligned with the challenge clauses in English', () => {
    expect(ENGLISH['module.navigation.title']).toBe('Navigation');
    expect(ENGLISH['module.multilingual-assistance.title']).toBe('Multilingual Assistance');
    expect(ENGLISH['module.real-time-decision-support.title']).toBe('Real-Time Decision Support');
  });
});

describe('UI_STRING_TABLES', () => {
  it('every per-module table covers every language with identical key sets', () => {
    // The Record types enforce this at compile time; this guards the split
    // files at runtime too, as a safety net against type-level workarounds.
    for (const [name, table] of Object.entries(UI_STRING_TABLES)) {
      const englishKeys = Object.keys(table.en).sort();
      expect(englishKeys.length, name).toBeGreaterThan(0);
      for (const language of UI_LANGUAGES) {
        expect(Object.keys(table[language]).sort(), `${name}/${language}`).toEqual(englishKeys);
      }
    }
  });

  it('keeps every {placeholder} from the English source in every translation', () => {
    // A translation that drops {id}/{gate}/{section} would silently lose the
    // wayfinding identifier the fan needs to match against venue signage.
    const placeholdersOf = (value: string): string[] =>
      [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? '').sort();
    for (const language of UI_LANGUAGES) {
      const strings = getUiStrings(language);
      for (const [key, englishValue] of Object.entries(ENGLISH)) {
        const expected = placeholdersOf(englishValue);
        if (expected.length > 0) {
          expect(
            placeholdersOf(strings[key as keyof typeof strings]),
            `${language}/${key}`,
          ).toEqual(expected);
        }
      }
    }
  });
});
