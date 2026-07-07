import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GeminiResult } from '../services/gemini';
import { useGemini } from './useGemini';

function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('useGemini', () => {
  it('starts in a loading state', () => {
    const fetcher = vi.fn().mockReturnValue(new Promise<never>(() => {}));
    const { result } = renderHook(() => useGemini(fetcher));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('resolves to the fetched data and source', async () => {
    const fetchResult: GeminiResult<string> = { data: 'hello', source: 'live' };
    const fetcher = vi.fn().mockResolvedValue(fetchResult);
    const { result } = renderHook(() => useGemini(fetcher));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe('hello');
    expect(result.current.source).toBe('live');
    expect(result.current.error).toBeNull();
  });

  it('surfaces an Error message on failure', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useGemini(fetcher));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('boom');
    expect(result.current.data).toBeNull();
  });

  it('falls back to a generic message when a non-Error is thrown', async () => {
    const fetcher = vi.fn().mockRejectedValue('nope');
    const { result } = renderHook(() => useGemini(fetcher));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Unknown error');
  });

  it('refetch() re-runs the fetcher and updates state again', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ data: 'first', source: 'mock' })
      .mockResolvedValueOnce({ data: 'second', source: 'live' });
    const { result } = renderHook(() => useGemini(fetcher));

    await waitFor(() => expect(result.current.data).toBe('first'));

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toBe('second'));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('discards a stale response if a newer request has already resolved', async () => {
    const first = deferred<GeminiResult<string>>();
    const second = deferred<GeminiResult<string>>();
    const fetcher = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

    const { result } = renderHook(() => useGemini(fetcher));

    act(() => {
      result.current.refetch(); // fires the second request while the first is still pending
    });

    await act(async () => {
      second.resolve({ data: 'second', source: 'live' });
      await second.promise;
    });
    expect(result.current.data).toBe('second');

    await act(async () => {
      first.resolve({ data: 'first', source: 'mock' }); // resolves late; must be ignored
      await first.promise;
    });
    expect(result.current.data).toBe('second');
  });
});
