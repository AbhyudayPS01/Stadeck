import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

/** Visual weight per DESIGN.md §4. State is never color-only — every button carries a text label. */
export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'destructive';

export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Defaults to primary (pitch green, white text). */
  variant?: ButtonVariant;
  /** Defaults to md. */
  size?: ButtonSize;
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors ' +
  'focus-visible:outline-none focus-visible:shadow-inputfocus ' +
  'disabled:cursor-not-allowed disabled:border-none disabled:bg-fan-border disabled:text-[#9AA2AF]';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-pitch-deep text-white enabled:hover:bg-pitch-darker',
  accent: 'bg-gold text-fan-ink enabled:hover:bg-gold-hover',
  secondary:
    'border-[1.5px] border-pitch-deep bg-fan-surface text-pitch-darker enabled:hover:bg-pitch-tint',
  destructive: 'bg-danger text-fan-ink enabled:hover:bg-danger-hover',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'px-[22px] py-3 text-body leading-none',
  sm: 'px-[18px] py-2.5 text-body-sm leading-none',
};

/**
 * Stadeck's only button. `type` defaults to "button" so forms opt in to
 * submission explicitly; all other native button props pass straight through.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      type={type}
      {...rest}
    />
  );
}
