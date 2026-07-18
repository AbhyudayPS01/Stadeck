import { useEffect, useRef, useState } from 'react';

/**
 * Simulates a live feed by re-running `generator` on an interval. The
 * generator is held in a ref (not the effect's dependency array) so an
 * inline arrow function passed by the caller doesn't restart the interval
 * every render — only a genuine `intervalMs` change does that.
 *
 * @param resetKey When this changes identity, the value is regenerated
 *   immediately instead of waiting for the next tick — for callers whose
 *   generator input changed in a way that makes the current value wrong
 *   right now (e.g. the active venue switched), not just stale. Components
 *   that fully remount on that change (via a `key` prop) don't need this;
 *   it exists for state that outlives the change, like a screen-level feed.
 */
export function useMockStream<T>(generator: () => T, intervalMs: number, resetKey?: unknown): T {
  const [value, setValue] = useState<T>(generator);
  const generatorRef = useRef(generator);
  const isFirstResetRef = useRef(true);

  useEffect(() => {
    generatorRef.current = generator;
  }, [generator]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue(generatorRef.current());
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  useEffect(() => {
    if (isFirstResetRef.current) {
      isFirstResetRef.current = false;
      return;
    }
    setValue(generatorRef.current());
  }, [resetKey]);

  return value;
}
