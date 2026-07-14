import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Vitest runs without injected globals, so Testing Library's automatic
 * afterEach cleanup never registers itself — without this, every render in a
 * file accumulates in one shared document and role queries find duplicates.
 */
afterEach(() => cleanup());

/**
 * jsdom does not implement matchMedia. Stadeck relies on it for
 * prefers-reduced-motion detection (useReducedMotion), so tests get a
 * deterministic stub that reports "no preference" by default.
 */
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
