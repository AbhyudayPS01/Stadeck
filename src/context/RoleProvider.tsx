import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../types/role';
import { RoleContext, type RoleContextValue } from './roleContext';

interface RoleProviderProps {
  children: ReactNode;
  /** Starting role, for tests and previews. Production always starts at the gate (null). */
  initialRole?: Role | null;
}

/** Provides the active role view to the app. See roleContext.ts for the storage rationale. */
export function RoleProvider({ children, initialRole = null }: RoleProviderProps) {
  const [role, setRole] = useState<Role | null>(initialRole);

  const enterRole = useCallback((next: Role) => setRole(next), []);
  const leaveRole = useCallback(() => setRole(null), []);

  // Stable context identity: without it every provider render would re-render
  // all consumers, and this provider wraps the entire app.
  const value = useMemo<RoleContextValue>(
    () => ({ role, enterRole, leaveRole }),
    [role, enterRole, leaveRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
