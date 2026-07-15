import { useId } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { TextScale } from '../../context/displayPreferencesContext';
import { useDisplayPreferences } from '../../hooks/useDisplayPreferences';
import { cx } from '../../utils/cx';

const TEXT_SCALE_OPTIONS: ReadonlyArray<{ value: TextScale; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: 'x-large', label: 'Extra large' },
];

/**
 * In-app display controls, applied app-wide through DisplayPreferencesProvider:
 * a high-contrast toggle and a text-size control — every screen reflects them,
 * not just this module.
 */
export function DisplayControls() {
  const { highContrast, toggleHighContrast, textScale, setTextScale } = useDisplayPreferences();
  const contrastLabelId = useId();

  return (
    <Card accent="steel">
      <h2 className="font-display text-h2 text-fan-ink">Display</h2>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-body-sm text-fan-ink" id={contrastLabelId}>
          High contrast
        </span>
        <Button
          aria-labelledby={contrastLabelId}
          aria-pressed={highContrast}
          onClick={toggleHighContrast}
          size="sm"
          variant={highContrast ? 'primary' : 'secondary'}
        >
          {highContrast ? 'On' : 'Off'}
        </Button>
      </div>
      <fieldset className="mt-4">
        <legend className="text-body-sm text-fan-ink">Text size</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TEXT_SCALE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cx(
                'cursor-pointer rounded-lg border-[1.5px] px-3 py-2 text-body-sm font-semibold',
                'has-[:focus-visible]:shadow-inputfocus',
                option.value === textScale
                  ? 'border-pitch-deep bg-pitch-tint text-pitch-darker'
                  : 'border-fan-border bg-fan-surface text-fan-muted',
              )}
            >
              <input
                checked={option.value === textScale}
                className="sr-only"
                name="text-scale"
                onChange={() => setTextScale(option.value)}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </Card>
  );
}
