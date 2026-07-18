import { useUiStrings } from '../../hooks/useUiStrings';
import type { MockReason } from '../../services/gemini';
import { cx } from '../../utils/cx';
import type { CardTheme } from './Card';

export interface DemoDataBadgeProps {
  /** Defaults to the light fan theme. */
  theme?: CardTheme;
  /**
   * Why the mock was served. Network-shaped failures read as "Offline mode" —
   * deliberate capability for fans on roaming, not a degraded state — while
   * everything else (no key, rate limits) stays "Demo data".
   */
  reason?: MockReason;
}

const THEME_CLASSES: Record<CardTheme, string> = {
  fan: 'border-gold-tintbdr bg-gold-tint text-gold-darker',
  ops: 'border-[rgba(232,169,59,0.35)] bg-[rgba(232,169,59,0.10)] text-warn',
};

/**
 * Marks AI content that came from the deterministic mock rather than a live
 * Gemini call — the app quietly keeps working, but never passes demo data
 * off as live (SPEC.md Gemini rules). Gold mono-tag styling per DESIGN.md §4.
 */
export function DemoDataBadge({ theme = 'fan', reason = 'unavailable' }: DemoDataBadgeProps) {
  const strings = useUiStrings();
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-sm border px-2 py-1 font-mono text-mono-tag font-bold uppercase',
        THEME_CLASSES[theme],
      )}
    >
      {reason === 'offline' ? strings['common.offlineMode'] : strings['common.demoData']}
    </span>
  );
}
