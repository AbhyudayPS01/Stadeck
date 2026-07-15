type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** Announced to screen readers; defaults to "Loading". */
  label?: string;
  /** Defaults to md. */
  size?: SpinnerSize;
}

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 36,
};

/**
 * Loading indicator. Inherits `currentColor` so callers set the color with a
 * text utility. The rotation is transform-only and stops under
 * prefers-reduced-motion — the static arc plus the accessible label still
 * communicate the loading state.
 */
export function Spinner({ label = 'Loading', size = 'md' }: SpinnerProps) {
  const px = SIZE_PX[size];
  return (
    <span className="inline-flex" role="status">
      <svg
        aria-hidden="true"
        className="animate-spin motion-reduce:animate-none"
        fill="none"
        height={px}
        viewBox="0 0 24 24"
        width={px}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path
          d="M12 2 a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
