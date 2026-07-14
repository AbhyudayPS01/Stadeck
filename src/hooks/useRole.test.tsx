import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RoleProvider } from '../context/RoleProvider';
import { useRole } from './useRole';

function wrapper({ children }: { children: ReactNode }) {
  return <RoleProvider>{children}</RoleProvider>;
}

describe('useRole', () => {
  it('starts at the role gate with no role selected', () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBeNull();
  });

  it('enters and leaves a role view', () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    act(() => result.current.enterRole('organizer'));
    expect(result.current.role).toBe('organizer');

    act(() => result.current.leaveRole());
    expect(result.current.role).toBeNull();
  });

  it('honours an initialRole for tests and previews', () => {
    const { result } = renderHook(() => useRole(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <RoleProvider initialRole="fan">{children}</RoleProvider>
      ),
    });

    expect(result.current.role).toBe('fan');
  });

  it('throws when used outside a RoleProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useRole())).toThrow(/within a RoleProvider/);
  });
});
