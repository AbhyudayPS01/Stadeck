import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { getUiStrings } from './uiStrings';

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
