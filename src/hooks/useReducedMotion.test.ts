import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

interface FakeMediaQueryList {
  matches: boolean;
  removeEventListener: ReturnType<typeof vi.fn>;
}

function installMatchMedia(initialMatches: boolean): {
  list: FakeMediaQueryList;
  triggerChange: (matches: boolean) => void;
} {
  let changeHandler: ((event: MediaQueryListEvent) => void) | undefined;

  const list: FakeMediaQueryList = {
    matches: initialMatches,
    removeEventListener: vi.fn(),
  };

  const addEventListener = vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
    if (event === 'change') {
      changeHandler = handler;
    }
  });

  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ ...list, addEventListener }));

  return {
    list,
    triggerChange: (matches: boolean) => {
      changeHandler?.({ matches } as MediaQueryListEvent);
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useReducedMotion', () => {
  it('returns false when the OS has no reduced-motion preference', () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when the OS prefers reduced motion', () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when the media query change event fires', () => {
    const { triggerChange } = installMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes its change listener on unmount', () => {
    const { list } = installMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());

    unmount();

    expect(list.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
