/**
 * Pure shape validators for parsing untrusted JSON (Gemini responses, mock
 * data). Composed via `hasShape` so each feature's response guard is a
 * one-line declaration instead of a hand-rolled type-check.
 */

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function isOneOf<T extends string>(values: readonly T[]) {
  return (value: unknown): value is T =>
    typeof value === 'string' && (values as readonly string[]).includes(value);
}

type FieldValidator<T> = (value: unknown) => value is T;

/** Validates that `value` is an object where every listed field passes its validator. */
export function hasShape<T extends Record<string, unknown>>(
  value: unknown,
  fields: { [K in keyof T]: FieldValidator<T[K]> },
): value is T {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return Object.keys(fields).every((key) => fields[key as keyof T](record[key]));
}
