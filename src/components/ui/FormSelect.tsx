import type { ReactNode } from 'react';

export interface FormSelectProps {
  /** Visible label text; wraps the select so it needs no id plumbing. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** The <option>/<optgroup> elements. */
  children: ReactNode;
}

/**
 * Labeled select for fan-theme planner forms — one styling for every picker
 * (Navigation and Accessibility route planners) so form controls never drift.
 */
export function FormSelect({ label, value, onChange, children }: FormSelectProps) {
  return (
    <label className="block text-label font-semibold text-fan-muted">
      {label}
      <select
        className="mt-1.5 w-full rounded-lg border border-fan-border bg-fan-surface px-3 py-2.5 text-body-sm text-fan-ink focus-visible:outline-none focus-visible:shadow-inputfocus"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}
