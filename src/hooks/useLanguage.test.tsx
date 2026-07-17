import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { DEFAULT_LANGUAGE } from '../config/constants';
import { LanguageProvider } from '../context/LanguageProvider';
import { useLanguage } from './useLanguage';

function wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe('useLanguage', () => {
  it('defaults to the app-wide default language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe(DEFAULT_LANGUAGE);
  });

  it('updates the interface language preference', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => result.current.setLanguage('es'));

    expect(result.current.language).toBe('es');
  });

  it('throws when used outside a LanguageProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useLanguage())).toThrow(/within a LanguageProvider/);
  });
});
