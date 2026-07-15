import { cx } from '../../utils/cx';
import type { CardTheme } from './Card';
import { Spinner } from './Spinner';

export interface LoadingRowProps {
  /** Announced by the spinner and mirrored as the visible text (with an ellipsis). */
  label: string;
  /** Defaults to the light fan theme. */
  theme?: CardTheme;
}

const ROW_CLASSES: Record<CardTheme, string> = {
  fan: 'text-pitch-deep',
  ops: 'text-glow',
};

const TEXT_CLASSES: Record<CardTheme, string> = {
  fan: 'text-fan-muted',
  ops: 'text-ops-muted',
};

/**
 * The in-panel loading state for AI requests: spinner plus visible status
 * text. The text is aria-hidden because the Spinner already announces the
 * same label — one announcement, not two.
 */
export function LoadingRow({ label, theme = 'fan' }: LoadingRowProps) {
  return (
    <div className={cx('flex items-center gap-3 py-4', ROW_CLASSES[theme])}>
      <Spinner label={label} size="md" />
      <span aria-hidden="true" className={cx('text-body-sm', TEXT_CLASSES[theme])}>
        {label}…
      </span>
    </div>
  );
}
