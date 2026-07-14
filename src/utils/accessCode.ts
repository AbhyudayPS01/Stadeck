import { DEMO_ACCESS_CODES } from '../config/constants';
import type { GatedRole } from '../types/role';

/**
 * Resolves a submitted demo access code to the gated role it unlocks, or null
 * when it matches none. Comparison is case-insensitive and whitespace-tolerant
 * so a code read aloud at a demo still works. Both entry paths on the landing
 * screen — the typed code field and the "Continue with demo access" button —
 * funnel through this one function: a single validation path, no bypass.
 *
 * @param input Raw text from the access-code field (or the injected demo code).
 * @returns The gated role the code unlocks, or null for unknown/empty input.
 */
export function resolveAccessCode(input: string): GatedRole | null {
  const normalized = input.trim().toUpperCase();
  if (normalized.length === 0) {
    return null;
  }

  const entries = Object.entries(DEMO_ACCESS_CODES) as ReadonlyArray<[GatedRole, string]>;
  const match = entries.find(([, code]) => code.toUpperCase() === normalized);
  return match ? match[0] : null;
}
