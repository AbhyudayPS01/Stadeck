import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { CardTheme } from './Card';

/** Severity levels shared by both themes (DESIGN.md §1). */
export type BadgeSeverity = 'critical' | 'elevated' | 'normal' | 'info';

export interface BadgeProps {
  severity: BadgeSeverity;
  /** Defaults to the light fan theme. */
  theme?: CardTheme;
  /** The badge word, e.g. "CRITICAL" or "ON TIME". */
  children: ReactNode;
}

/**
 * Severity glyphs per DESIGN.md §4 — meaning is always icon + word, never
 * fill color alone, so severities survive color-blindness and grayscale.
 */
const GLYPHS: Record<BadgeSeverity, string> = {
  critical: '▲',
  elevated: '●',
  normal: '✓',
  info: '○',
};

const SEVERITY_CLASSES: Record<CardTheme, Record<BadgeSeverity, string>> = {
  fan: {
    critical: 'border-[#F5B8B1] bg-[#FDE8E5] text-danger-fan',
    elevated: 'border-gold-tintbdr bg-gold-tint text-gold-darker',
    normal: 'border-pitch-tintbdr bg-pitch-tint text-pitch-darker',
    info: 'border-[#C6D6F0] bg-[#EAF0FB] text-[#234B9E]',
  },
  ops: {
    critical: 'border-[rgba(255,107,94,0.35)] bg-[rgba(255,107,94,0.10)] text-danger',
    elevated: 'border-[rgba(232,169,59,0.35)] bg-[rgba(232,169,59,0.10)] text-warn',
    normal: 'border-[rgba(78,208,138,0.35)] bg-[rgba(78,208,138,0.10)] text-ok',
    info: 'border-[rgba(120,150,190,0.35)] bg-[rgba(120,150,190,0.10)] text-ops-muted',
  },
};

/** Status/severity tag in mono-tag type. */
export function Badge({ severity, theme = 'fan', children }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-mono-tag font-bold uppercase',
        SEVERITY_CLASSES[theme][severity],
      )}
    >
      <span aria-hidden="true">{GLYPHS[severity]}</span>
      {children}
    </span>
  );
}
