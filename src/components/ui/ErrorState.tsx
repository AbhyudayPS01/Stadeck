import { useUiStrings } from '../../hooks/useUiStrings';
import { Button } from './Button';
import { Card, type CardTheme } from './Card';

export interface ErrorStateProps {
  /** Defaults to the translated "Something went wrong". */
  title?: string;
  /** What failed and what the user can do about it. */
  message: string;
  /** When provided, renders a "Try again" button. */
  onRetry?: () => void;
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
 * Designed error surface — every feature failure state renders this instead
 * of dead-ending. The warning glyph pairs with the text so the state is never
 * conveyed by color alone.
 */
export function ErrorState({ title, message, onRetry, theme = 'fan' }: ErrorStateProps) {
  const strings = useUiStrings();
  return (
    <Card className="flex flex-col items-center gap-3 text-center" theme={theme}>
      <div className="flex flex-col items-center gap-3" role="alert">
        <span aria-hidden="true" className="text-h1 leading-none text-warn">
          ⚠
        </span>
        <h2 className={`font-display text-h3 ${TITLE_CLASSES[theme]}`}>
          {title ?? strings['common.somethingWentWrong']}
        </h2>
        <p className={`max-w-prose text-body-sm ${MESSAGE_CLASSES[theme]}`}>{message}</p>
      </div>
      {onRetry ? (
        <Button className="mt-1" onClick={onRetry} size="sm" variant="secondary">
          {strings['common.tryAgain']}
        </Button>
      ) : null}
    </Card>
  );
}
