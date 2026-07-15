import { useEffect, useMemo, useState } from 'react';

/** Interval between revealed words — fast enough to feel live, slow enough to read. */
const WORD_REVEAL_INTERVAL_MS = 45;

/**
 * Reveals `text` word by word for a streaming feel on AI replies. Purely
 * visual: pass `enabled: false` (e.g. under prefers-reduced-motion, or for
 * historical messages) to get the full text immediately. The interval is
 * cleared on completion, on text change, and on unmount.
 */
export function useProgressiveText(text: string, enabled: boolean): string {
  const words = useMemo(() => text.split(' '), [text]);
  const [visibleCount, setVisibleCount] = useState(enabled ? 1 : words.length);

  useEffect(() => {
    if (!enabled) {
      setVisibleCount(words.length);
      return;
    }

    setVisibleCount(1);
    const intervalId = setInterval(() => {
      setVisibleCount((count) => {
        if (count >= words.length) {
          clearInterval(intervalId);
          return count;
        }
        return count + 1;
      });
    }, WORD_REVEAL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [words, enabled]);

  return words.slice(0, visibleCount).join(' ');
}
