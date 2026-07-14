import { useContext } from 'react';
import { RoleContext, type RoleContextValue } from '../context/roleContext';

/**
 * The active role view and its enter/leave transitions.
 *
 * @returns The RoleContext value.
 * @throws When rendered outside a RoleProvider — misuse should fail loudly in development.
 */
export function useRole(): RoleContextValue {
  const value = useContext(RoleContext);
  if (value === null) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return value;
}
