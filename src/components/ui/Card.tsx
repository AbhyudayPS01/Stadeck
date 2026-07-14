import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

/** Surface family per DESIGN.md — never mix the two themes on one screen. */
export type CardTheme = 'fan' | 'ops';

/** Top accent-bar color, following the role palette (DESIGN.md §4). */
export type CardAccent = 'pitch' | 'gold' | 'steel';

export interface CardProps {
  /** Defaults to the light fan theme. */
  theme?: CardTheme;
  /** Renders a 4px top accent bar when set. */
  accent?: CardAccent;
  /** Decorative penalty-box corner bracket in the top-right (DESIGN.md §4). */
  bracket?: boolean;
  className?: string;
  children: ReactNode;
}

const THEME_CLASSES: Record<CardTheme, string> = {
  fan: 'rounded-3xl border border-fan-border bg-fan-surface shadow-card',
  ops: 'rounded-2xl border border-ops-border bg-ops-surface',
};

const ACCENT_CLASSES: Record<CardAccent, string> = {
  pitch: 'bg-pitch',
  gold: 'bg-gold',
  steel: 'bg-steel',
};

const BRACKET_STROKES: Record<CardAccent, string> = {
  pitch: '#1B8A4A',
  gold: '#E8A93B',
  steel: '#4A5A80',
};

/** Stadeck's base surface. Accent bar and bracket are decorative and hidden from assistive tech. */
export function Card({ theme = 'fan', accent, bracket = false, className, children }: CardProps) {
  return (
    <div className={cx('relative overflow-hidden p-card', THEME_CLASSES[theme], className)}>
      {accent ? (
        <span
          aria-hidden="true"
          className={cx('absolute inset-x-0 top-0 h-1', ACCENT_CLASSES[accent])}
        />
      ) : null}
      {bracket ? (
        <svg
          aria-hidden="true"
          className="absolute right-3 top-3"
          fill="none"
          height="22"
          viewBox="0 0 22 22"
          width="22"
        >
          <path d="M1 1 H21 V21" stroke={BRACKET_STROKES[accent ?? 'pitch']} strokeWidth="2.5" />
        </svg>
      ) : null}
      {children}
    </div>
  );
}
