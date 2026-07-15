import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DisplayPreferencesContext,
  type DisplayPreferencesContextValue,
  type TextScale,
} from './displayPreferencesContext';

interface DisplayPreferencesProviderProps {
  children: ReactNode;
}

/**
 * Root font-size per text scale step. Every type token is defined in rem
 * (see tailwind.config), so scaling the root scales all text app-wide
 * without touching layout spacing.
 */
const ROOT_FONT_SIZES: Record<TextScale, string> = {
  default: '100%',
  large: '112.5%',
  'x-large': '125%',
};

/**
 * Provides the app-wide display preferences and applies them to the document
 * root: a `high-contrast` class (index.css strengthens muted text and borders
 * under it) and a root font-size for the text scale. Applied at the root so
 * both take effect on every screen, not just the Accessibility module.
 */
export function DisplayPreferencesProvider({ children }: DisplayPreferencesProviderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScaleState] = useState<TextScale>('default');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
    root.style.fontSize = ROOT_FONT_SIZES[textScale];
    return () => {
      root.classList.remove('high-contrast');
      root.style.removeProperty('font-size');
    };
  }, [highContrast, textScale]);

  const toggleHighContrast = useCallback(() => setHighContrast((previous) => !previous), []);
  const setTextScale = useCallback((scale: TextScale) => setTextScaleState(scale), []);

  // Stable context identity: without it every provider render would re-render
  // all consumers, and this provider wraps the entire app.
  const value = useMemo<DisplayPreferencesContextValue>(
    () => ({ highContrast, toggleHighContrast, textScale, setTextScale }),
    [highContrast, toggleHighContrast, textScale, setTextScale],
  );

  return (
    <DisplayPreferencesContext.Provider value={value}>
      {children}
    </DisplayPreferencesContext.Provider>
  );
}
