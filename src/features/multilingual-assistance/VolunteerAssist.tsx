import { useId, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { MAX_USER_INPUT_LENGTH, SUPPORTED_LANGUAGES } from '../../config/constants';
import { useLanguage } from '../../hooks/useLanguage';
import { useUiStrings } from '../../hooks/useUiStrings';
import { isRtlLanguage } from '../../utils/detectLanguage';
import { COMMON_QUESTIONS } from './commonQuestions';
import { useVolunteerAssist, type VolunteerAnswer } from './useVolunteerAssist';

/**
 * The dual-language answer panels: English for the volunteer to read, the
 * fan's language to hold out to the fan. Answer text uses the h3 size —
 * large enough to read from an outstretched phone in a crowded stand.
 */
function AnswerPanels({ answer }: { answer: VolunteerAnswer }) {
  const fanLanguage = SUPPORTED_LANGUAGES.find(
    (option) => option.code === answer.translated?.language,
  );
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <section className="rounded-xl border border-fan-border bg-fan-bg p-3.5">
        <h3 className="font-mono text-mono-tag font-bold uppercase text-fan-faint">
          English — for you
        </h3>
        <p className="mt-2 text-h3 text-fan-ink">{answer.english}</p>
      </section>
      {answer.translated ? (
        <section className="rounded-xl bg-pitch-tint p-3.5">
          <h3 className="font-mono text-mono-tag font-bold uppercase text-pitch-darker">
            {fanLanguage ? `${fanLanguage.nativeLabel} — show the fan` : 'Show the fan'}
          </h3>
          <p
            className="mt-2 text-h3 text-pitch-darker"
            dir={isRtlLanguage(answer.translated.language) ? 'rtl' : undefined}
            lang={answer.translated.language}
          >
            {answer.translated.text}
          </p>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Volunteer view of Multilingual Assistance: a fan is standing in front of
 * the volunteer needing an answer in seconds, so the layout leads with
 * one-tap chips for the questions volunteers are actually asked. Every
 * answer arrives in English and the selected fan language side by side —
 * the same grounded concierge pathway as the fan chat, presented for
 * one-handed use.
 */
export function VolunteerAssist() {
  const { language } = useLanguage();
  const { answer, isLoading, error, ask, retry } = useVolunteerAssist(language);
  const strings = useUiStrings();
  const [draft, setDraft] = useState('');
  const inputId = useId();
  const languageOption = SUPPORTED_LANGUAGES.find((option) => option.code === language);

  return (
    <Card accent="pitch" className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-h2 text-fan-ink">Common questions</h2>
        {answer?.source === 'mock' ? (
          <DemoDataBadge reason={answer.mockReason ?? undefined} />
        ) : null}
      </div>
      <p className="mt-1.5 text-body-sm text-fan-muted">
        {language === 'en'
          ? 'Tap a question for the grounded answer. Pick a language in the sidebar to also get a show-the-fan translation.'
          : `Tap a question — you read English, the fan reads ${languageOption?.label ?? language}.`}
      </p>

      <ul aria-label="Common questions" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {COMMON_QUESTIONS.map((item) => (
          <li key={item.id}>
            <button
              className="min-h-[44px] w-full rounded-xl border border-fan-border bg-fan-bg px-3 py-2 text-body-sm font-medium text-fan-ink transition-colors hover:border-pitch hover:bg-pitch-tint focus-visible:outline-none focus-visible:shadow-inputfocus"
              disabled={isLoading}
              onClick={() => ask(item.question)}
              type="button"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* AI response region per CLAUDE.md accessibility rules */}
      <div aria-live="polite" className="mt-4 flex flex-col gap-3">
        {isLoading ? <LoadingRow label="Fetching the grounded answer" /> : null}
        {error !== null ? (
          <ErrorState message={error} onRetry={retry} title="Answer failed" />
        ) : null}
        {answer !== null && !isLoading && error === null ? <AnswerPanels answer={answer} /> : null}
      </div>

      <form
        className="mt-4 flex flex-col gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
          setDraft('');
        }}
      >
        <label className="text-label font-semibold text-fan-faint" htmlFor={inputId}>
          Anything not on the grid
        </label>
        <div className="flex gap-2">
          <input
            autoComplete="off"
            className="min-w-0 flex-1 rounded-md border border-fan-border bg-fan-bg px-3 py-2.5 text-body-sm text-fan-ink placeholder:text-fan-faint focus:border-pitch focus:outline-none focus:shadow-inputfocus"
            id={inputId}
            maxLength={MAX_USER_INPUT_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="e.g. Where is the merchandise stand?"
            value={draft}
          />
          <Button disabled={isLoading || draft.trim().length === 0} size="sm" type="submit">
            {strings['action.send']}
          </Button>
        </div>
      </form>
    </Card>
  );
}
