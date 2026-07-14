/** The three role views from the landing screen. Held in React context only, never localStorage. */
export type Role = 'fan' | 'volunteer' | 'organizer';

/** Roles behind the demo access-code gate — everyone except Fan. */
export type GatedRole = Exclude<Role, 'fan'>;

interface BaseRoleOption {
  label: string;
  description: string;
}

/**
 * Landing-screen metadata for one role view. A discriminated union so that
 * gated cards get an `id` typed as GatedRole — no casts when looking up the
 * role's demo access code.
 */
export type RoleOption =
  | (BaseRoleOption & { id: 'fan'; gated: false })
  | (BaseRoleOption & { id: GatedRole; gated: true });
