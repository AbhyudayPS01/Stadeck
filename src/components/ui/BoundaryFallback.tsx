import { useUiStrings } from '../../hooks/useUiStrings';
import { formatUiString } from '../../utils/uiText';
import { ErrorState } from './ErrorState';

interface BoundaryFallbackProps {
  /** Human name for the crashed area; defaults to the translated app-wide fallback. */
  scope?: string;
  onRetry: () => void;
}

/**
 * The translated recovery card ErrorBoundary swaps in on a render crash.
 * Lives outside the class boundary because class components cannot use the
 * useUiStrings hook.
 */
export function BoundaryFallback({ scope, onRetry }: BoundaryFallbackProps) {
  const strings = useUiStrings();
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center px-gutter py-section">
      <div className="w-full max-w-md">
        <ErrorState
          message={formatUiString(strings['common.crashMessage'], {
            scope: scope ?? strings['common.crashScopeFallback'],
          })}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
