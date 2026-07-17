import { useId } from 'react';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * The interface language preference. Switches the static string table
 * (module titles/descriptions, primary buttons, placeholders, empty states —
 * see services/data/uiStrings) instantly with no API call, and AI-generated
 * content follows the same setting when a key is present. Styled for the
 * dark sidebar.
 */
export function LanguagePicker() {
  const { language, setLanguage } = useLanguage();
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label font-semibold text-ops-faint" htmlFor={id}>
        Interface language
      </label>
      <select
        className="rounded-md border border-ops-border bg-ops-surface px-3 py-2 text-body-sm text-ops-body focus-visible:outline-none focus-visible:shadow-inputfocus"
        id={id}
        onChange={(event) => setLanguage(event.target.value)}
        value={language}
      >
        {SUPPORTED_LANGUAGES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label} · {option.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
