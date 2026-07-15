import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { DisplayPreferencesProvider } from '../context/DisplayPreferencesProvider';
import { useDisplayPreferences } from './useDisplayPreferences';

function wrapper({ children }: { children: ReactNode }) {
  return <DisplayPreferencesProvider>{children}</DisplayPreferencesProvider>;
}

describe('useDisplayPreferences', () => {
  it('starts with defaults: no high contrast, default text scale', () => {
    const { result } = renderHook(() => useDisplayPreferences(), { wrapper });

    expect(result.current.highContrast).toBe(false);
    expect(result.current.textScale).toBe('default');
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });

  it('applies the high-contrast class to the document root when toggled', () => {
    const { result } = renderHook(() => useDisplayPreferences(), { wrapper });

    act(() => result.current.toggleHighContrast());

    expect(result.current.highContrast).toBe(true);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);

    act(() => result.current.toggleHighContrast());
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });

  it('scales the root font-size app-wide when the text scale changes', () => {
    const { result } = renderHook(() => useDisplayPreferences(), { wrapper });

    act(() => result.current.setTextScale('x-large'));

    expect(result.current.textScale).toBe('x-large');
    expect(document.documentElement.style.fontSize).toBe('125%');
  });

  it('cleans the document root back up on unmount', () => {
    const { result, unmount } = renderHook(() => useDisplayPreferences(), { wrapper });

    act(() => {
      result.current.toggleHighContrast();
      result.current.setTextScale('large');
    });
    unmount();

    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
    expect(document.documentElement.style.fontSize).toBe('');
  });

  it('throws when used outside a DisplayPreferencesProvider', () => {
    expect(() => renderHook(() => useDisplayPreferences())).toThrow(
      'useDisplayPreferences must be used within a DisplayPreferencesProvider',
    );
  });
});
