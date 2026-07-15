import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useProgressiveText } from './useProgressiveText';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useProgressiveText', () => {
  it('reveals the text word by word until complete', () => {
    const { result } = renderHook(() => useProgressiveText('Gates open three hours early', true));

    expect(result.current).toBe('Gates');

    act(() => vi.advanceTimersByTime(45));
    expect(result.current).toBe('Gates open');

    act(() => vi.advanceTimersByTime(45 * 3));
    expect(result.current).toBe('Gates open three hours early');
  });

  it('stops advancing once the full text is shown', () => {
    const { result } = renderHook(() => useProgressiveText('Two words', true));

    act(() => vi.advanceTimersByTime(45 * 10));

    expect(result.current).toBe('Two words');
  });

  it('returns the full text immediately when disabled (reduced motion, history)', () => {
    const { result } = renderHook(() => useProgressiveText('No animation for this text', false));

    expect(result.current).toBe('No animation for this text');
  });

  it('restarts the reveal when the text changes', () => {
    const { result, rerender } = renderHook(({ text }) => useProgressiveText(text, true), {
      initialProps: { text: 'First reply here' },
    });

    act(() => vi.advanceTimersByTime(45 * 5));
    expect(result.current).toBe('First reply here');

    rerender({ text: 'Second answer streams again' });
    expect(result.current).toBe('Second');
  });
});
