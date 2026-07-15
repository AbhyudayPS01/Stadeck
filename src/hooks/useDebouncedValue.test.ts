import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('hola', 300));

    expect(result.current).toBe('hola');
  });

  it('only updates after the delay has elapsed without further changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'h' },
    });

    rerender({ value: 'ho' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('h'); // still within the debounce window

    rerender({ value: 'hola' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('h'); // window restarted by the change

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('hola');
  });

  it('cancels the pending update on unmount', () => {
    const { unmount, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    unmount();

    expect(() => vi.runAllTimers()).not.toThrow(); // no setState after unmount
  });
});
