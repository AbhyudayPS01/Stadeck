import type { ReactNode } from 'react';
import { Mascot } from '../mascot/Mascot';
import { Card, type CardTheme } from './Card';

export interface EmptyStateProps {
  title: string;
  /** What would fill this space and how to get there. */
  message: string;
  /** Optional call to action, e.g. a Button. */
  action?: ReactNode;
  /** Bolo pointing at the action (decorative). Defaults to true. */
  showMascot?: boolean;
  /** Defaults to the light fan theme. */
  theme?: CardTheme;
}

const TITLE_CLASSES: Record<CardTheme, string> = {
  fan: 'text-fan-ink',
  ops: 'text-ops-ink',
};

const MESSAGE_CLASSES: Record<CardTheme, string> = {
  fan: 'text-fan-muted',
  ops: 'text-ops-muted',
};

/**
 * Designed empty surface — "nothing here yet" is a first-class state, never
 * a blank area. Bolo is decorative (aria-hidden inside Mascot) and stays out
 * of the reading order.
 */
export function EmptyState({
  title,
  message,
  action,
  showMascot = true,
  theme = 'fan',
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 text-center" theme={theme}>
      {showMascot ? <Mascot pose="pointing" size={72} /> : null}
      <h2 className={`font-display text-h3 ${TITLE_CLASSES[theme]}`}>{title}</h2>
      <p className={`max-w-prose text-body-sm ${MESSAGE_CLASSES[theme]}`}>{message}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </Card>
  );
}
