import { useEffect, useRef, useState } from 'react';

/**
 * Simulates a live feed by re-running `generator` on an interval. The
 * generator is held in a ref (not the effect's dependency array) so an
 * inline arrow function passed by the caller doesn't restart the interval
 * every render — only a genuine `intervalMs` change does that.
 */
export function useMockStream<T>(generator: () => T, intervalMs: number): T {
  const [value, setValue] = useState<T>(generator);
  const generatorRef = useRef(generator);

  useEffect(() => {
    generatorRef.current = generator;
  }, [generator]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue(generatorRef.current());
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return value;
}
