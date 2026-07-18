import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMockStream } from './useMockStream';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useMockStream', () => {
  it('calls the generator once at mount for the initial value', () => {
    const generator = vi.fn().mockReturnValue('first');
    const { result } = renderHook(() => useMockStream(generator, 1000));

    expect(result.current).toBe('first');
    expect(generator).toHaveBeenCalledTimes(1);
  });

  it('updates the value on each interval tick', () => {
    const generator = vi.fn().mockReturnValueOnce('first').mockReturnValueOnce('second');
    const { result } = renderHook(() => useMockStream(generator, 1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe('second');
  });

  it('stops updating after unmount', () => {
    const generator = vi.fn().mockReturnValue('value');
    const { unmount } = renderHook(() => useMockStream(generator, 1000));

    unmount();
    const callsBeforeAdvance = generator.mock.calls.length;
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(generator.mock.calls.length).toBe(callsBeforeAdvance);
  });

  it('restarts the interval when intervalMs changes', () => {
    const generator = vi.fn().mockReturnValue('value');
    const { rerender } = renderHook(({ intervalMs }) => useMockStream(generator, intervalMs), {
      initialProps: { intervalMs: 1000 },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    rerender({ intervalMs: 2000 });
    act(() => {
      vi.advanceTimersByTime(500); // 1000ms since mount, but interval restarted — should not fire yet
    });
    expect(generator).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1500); // completes the new 2000ms interval
    });
    expect(generator).toHaveBeenCalledTimes(2);
  });

  it('uses the latest generator on the next tick without restarting the interval', () => {
    const firstGenerator = vi.fn().mockReturnValue('from-first');
    const secondGenerator = vi.fn().mockReturnValue('from-second');
    const { result, rerender } = renderHook(({ generator }) => useMockStream(generator, 1000), {
      initialProps: { generator: firstGenerator },
    });

    rerender({ generator: secondGenerator });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe('from-second');
    expect(firstGenerator).toHaveBeenCalledTimes(1); // only the initial mount call
  });

  it('does not regenerate on mount just because a resetKey was passed', () => {
    const generator = vi.fn().mockReturnValue('value');
    renderHook(() => useMockStream(generator, 1000, 'metlife-stadium'));

    expect(generator).toHaveBeenCalledTimes(1);
  });

  it('regenerates immediately when resetKey changes, without waiting for the interval', () => {
    const generator = vi.fn().mockReturnValueOnce('from-metlife').mockReturnValueOnce('from-bmo');
    const { result, rerender } = renderHook(
      ({ resetKey }) => useMockStream(generator, 1000, resetKey),
      { initialProps: { resetKey: 'metlife-stadium' } },
    );

    expect(result.current).toBe('from-metlife');
    rerender({ resetKey: 'bmo-field' });

    expect(result.current).toBe('from-bmo');
    expect(generator).toHaveBeenCalledTimes(2);
  });

  it('does not regenerate when resetKey is passed but unchanged', () => {
    const generator = vi.fn().mockReturnValue('value');
    const { rerender } = renderHook(({ resetKey }) => useMockStream(generator, 1000, resetKey), {
      initialProps: { resetKey: 'metlife-stadium' },
    });

    rerender({ resetKey: 'metlife-stadium' });

    expect(generator).toHaveBeenCalledTimes(1);
  });
});
