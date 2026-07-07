import { useCallback, useEffect, useRef, useState } from 'react';
import type { GeminiResult } from '../services/gemini';

export interface UseGeminiState<T> {
  data: T | null;
  source: 'live' | 'mock' | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Runs a Gemini service call and tracks loading/data/source/error state.
 * `fetcher` should be memoized by the caller (useCallback) with whatever
 * inputs it depends on — this hook re-runs whenever the fetcher reference
 * changes and re-fires on refetch(). A request id guards against a stale
 * response from an earlier call overwriting a newer one.
 */
export function useGemini<T>(
  fetcher: () => Promise<GeminiResult<T>>,
): UseGeminiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseGeminiState<T>>({
    data: null,
    source: null,
    isLoading: true,
    error: null,
  });
  const requestIdRef = useRef(0);

  const runFetch = useCallback(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setState((previous) => ({ ...previous, isLoading: true, error: null }));

    fetcher()
      .then((result) => {
        if (requestIdRef.current !== requestId) {
          return; // a newer request already resolved; discard this stale response
        }
        setState({ data: result.data, source: result.source, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== requestId) {
          return;
        }
        setState({
          data: null,
          source: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
  }, [fetcher]);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  return { ...state, refetch: runFetch };
}
