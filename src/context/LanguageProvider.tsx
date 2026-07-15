import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE } from '../config/constants';
import { LanguageContext, type LanguageContextValue } from './languageContext';

interface LanguageProviderProps {
  children: ReactNode;
  /** Starting language, for tests and previews. Production always starts at the default. */
  initialLanguage?: string;
}

/** Provides the AI content language preference. See languageContext.ts for scope. */
export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState(initialLanguage);

  const setLanguage = useCallback((code: string) => setLanguageState(code), []);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
