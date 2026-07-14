import { createContext } from 'react';
import type { Role } from '../types/role';

/** Value shape provided by RoleProvider and consumed via useRole. */
export interface RoleContextValue {
  /** Active role view, or null while the visitor is still at the landing role gate. */
  role: Role | null;
  /** Enters a role view. Gated roles must resolve through utils/accessCode first. */
  enterRole: (role: Role) => void;
  /** Returns to the landing role gate. Re-entering a gated role revalidates the access code. */
  leaveRole: () => void;
}

/**
 * Role state lives in React context only — deliberately never localStorage —
 * so a refresh always returns to the role gate (see SECURITY.md).
 */
export const RoleContext = createContext<RoleContextValue | null>(null);
