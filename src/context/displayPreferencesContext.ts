import { createContext } from 'react';

/** Text scale steps offered by the Accessibility module's display controls. */
export type TextScale = 'default' | 'large' | 'x-large';

/** Value shape provided by DisplayPreferencesProvider and consumed via useDisplayPreferences. */
export interface DisplayPreferencesContextValue {
  /** Whether the app-wide high-contrast treatment is on. */
  highContrast: boolean;
  toggleHighContrast: () => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
}

/**
 * App-wide display preferences (high contrast, text size), part of the
 * Accessibility module's story. Session-only by design — like the role gate,
 * nothing is persisted, so every demo run starts from the same state.
 */
export const DisplayPreferencesContext = createContext<DisplayPreferencesContextValue | null>(null);
