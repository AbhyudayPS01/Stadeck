import { describe, expect, it } from 'vitest';
import { detectLanguage, isRtlLanguage } from './detectLanguage';

describe('detectLanguage', () => {
  it('detects Arabic by script', () => {
    expect(detectLanguage('أين البوابة C؟')).toBe('ar');
  });

  it('detects Hindi by Devanagari script', () => {
    expect(detectLanguage('गेट C कहाँ है?')).toBe('hi');
  });

  it('detects Japanese by kana', () => {
    expect(detectLanguage('ゲートCはどこですか？')).toBe('ja');
  });

  it('detects Spanish by marker words', () => {
    expect(detectLanguage('Hola, ¿dónde está la entrada C?')).toBe('es');
  });

  it('detects French by marker words', () => {
    expect(detectLanguage('Bonjour, où sont les toilettes ?')).toBe('fr');
  });

  it('detects Portuguese by marker words', () => {
    expect(detectLanguage('Olá, onde fica o banheiro?')).toBe('pt');
  });

  it('detects German by marker words', () => {
    expect(detectLanguage('Wo ist bitte der Eingang?')).toBe('de');
  });

  it('defaults to English for unmatched text', () => {
    expect(detectLanguage('Where is Gate C?')).toBe('en');
    expect(detectLanguage('')).toBe('en');
  });
});

describe('isRtlLanguage', () => {
  it('marks Arabic (including region variants) as right-to-left', () => {
    expect(isRtlLanguage('ar')).toBe(true);
    expect(isRtlLanguage('ar-EG')).toBe(true);
  });

  it('marks left-to-right languages as such', () => {
    expect(isRtlLanguage('en')).toBe(false);
    expect(isRtlLanguage('ja')).toBe(false);
    expect(isRtlLanguage('')).toBe(false);
  });
});
