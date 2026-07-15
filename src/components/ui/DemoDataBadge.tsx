import type { CardTheme } from './Card';
import { cx } from '../../utils/cx';

export interface DemoDataBadgeProps {
  /** Defaults to the light fan theme. */
  theme?: CardTheme;
}

const THEME_CLASSES: Record<CardTheme, string> = {
  fan: 'border-gold-tintbdr bg-gold-tint text-gold-darker',
  ops: 'border-[rgba(232,169,59,0.35)] bg-[rgba(232,169,59,0.10)] text-warn',
};

/**
 * Marks AI content that came from the deterministic mock rather than a live
 * Gemini call (proxy unreachable, rate-limited, or no key) — the app quietly
 * keeps working, but never passes demo data off as live (CLAUDE.md Gemini
 * rules). Gold mono-tag styling per DESIGN.md §4.
 */
export function DemoDataBadge({ theme = 'fan' }: DemoDataBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-sm border px-2 py-1 font-mono text-mono-tag font-bold uppercase',
        THEME_CLASSES[theme],
      )}
    >
      Demo data
    </span>
  );
}
