import { useEffect, useState } from 'react';

/**
 * Returns `value` only after it has stopped changing for `delayMs`
 * (SPEC.md: chat/translation inputs are debounced at 300ms). Keeps
 * per-keystroke work — like the live language-detection hint — off the hot
 * typing path. The pending timeout is cleared on every change and on unmount.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}
