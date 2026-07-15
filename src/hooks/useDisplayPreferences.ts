import { useContext } from 'react';
import {
  DisplayPreferencesContext,
  type DisplayPreferencesContextValue,
} from '../context/displayPreferencesContext';

/**
 * The app-wide display preferences (high contrast, text size) and their setters.
 *
 * @returns The DisplayPreferencesContext value.
 * @throws When rendered outside a DisplayPreferencesProvider — misuse should fail loudly in development.
 */
export function useDisplayPreferences(): DisplayPreferencesContextValue {
  const value = useContext(DisplayPreferencesContext);
  if (value === null) {
    throw new Error('useDisplayPreferences must be used within a DisplayPreferencesProvider');
  }
  return value;
}
