import '@testing-library/jest-dom/vitest';

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
