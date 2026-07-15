import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { CardTheme } from './Card';

export interface StatTileProps {
  /** Metric name, rendered as a mono-tag eyebrow. */
  label: string;
  /** Pre-formatted value, e.g. "72%" or "214,000 L". */
  value: string;
  /** Small print under the value, e.g. the estimate basis. */
  caption?: string;
  /** Trailing slot next to the value, e.g. a severity Badge. */
  adornment?: ReactNode;
  /** Defaults to the light fan theme. */
  theme?: CardTheme;
}

const TILE_CLASSES: Record<CardTheme, string> = {
  fan: 'border-fan-border bg-fan-surface',
  ops: 'border-ops-border bg-ops-surface2',
};

const LABEL_CLASSES: Record<CardTheme, string> = {
  fan: 'text-fan-faint',
  ops: 'text-ops-faint',
};

const VALUE_CLASSES: Record<CardTheme, string> = {
  fan: 'text-fan-ink',
  ops: 'text-ops-ink',
};

const CAPTION_CLASSES: Record<CardTheme, string> = {
  fan: 'text-fan-muted',
  ops: 'text-ops-muted',
};

/**
 * One dashboard metric: mono-tag label over a mono-stat value — shared by the
 * Sustainability venue dashboard and the Operational Intelligence KPI board
 * so stat surfaces look identical everywhere.
 */
export function StatTile({ label, value, caption, adornment, theme = 'fan' }: StatTileProps) {
  return (
    <div className={cx('rounded-xl border p-4', TILE_CLASSES[theme])}>
      <h3 className={cx('font-mono text-mono-tag font-bold uppercase', LABEL_CLASSES[theme])}>
        {label}
      </h3>
      <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
        <span className={cx('font-mono text-mono-stat font-bold', VALUE_CLASSES[theme])}>
          {value}
        </span>
        {adornment}
      </div>
      {caption ? (
        <p className={cx('mt-1.5 text-label', CAPTION_CLASSES[theme])}>{caption}</p>
      ) : null}
    </div>
  );
}
