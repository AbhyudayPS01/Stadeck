import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Mascot } from '../../components/mascot/Mascot';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { CHAT_INPUT_DEBOUNCE_MS, SUPPORTED_LANGUAGES } from '../../config/constants';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { cx } from '../../utils/cx';
import { detectLanguage } from '../../utils/detectLanguage';
import { ChatMessageBubble } from './ChatMessageBubble';
import { useConciergeChat } from './useConciergeChat';

/** Starter questions in different languages — the empty state doubles as a demo of auto-detection. */
const SUGGESTIONS: ReadonlyArray<{ text: string; language: string }> = [
  { text: 'Where is Gate C?', language: 'en' },
  { text: '¿Dónde están los baños?', language: 'es' },
  { text: 'Où sont les premiers secours ?', language: 'fr' },
  { text: 'アクセシブル席はどこですか？', language: 'ja' },
];

/** Bouncing dots while the concierge composes a reply; announced via the chat's live region. */
function TypingIndicator() {
  return (
    <li aria-hidden="true" className="flex items-center gap-1.5 self-start px-4 py-2.5">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-2 w-2 animate-typing-bounce rounded-pill bg-fan-faint motion-reduce:animate-none"
          style={{ animationDelay: `${dot * 150}ms` }}
        />
      ))}
    </li>
  );
}

/**
 * The AI concierge chat: fans ask in any language, the reply comes back in
 * that language, grounded in local stadium facts. The newest reply streams
 * in visually; a screen-reader-only live region announces it once complete,
 * so assistive tech hears one clean announcement instead of every partial.
 */
export function ConciergeChat() {
  const { messages, isSending, error, lastSource, send, retry } = useConciergeChat();
  const [draft, setDraft] = useState('');
  const inputId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedDraft = useDebouncedValue(draft, CHAT_INPUT_DEBOUNCE_MS);
  // Memoized so detection runs once per debounced draft, not on the frequent
  // unrelated re-renders (keystrokes, streaming ticks) — the debounce would
  // otherwise be defeated.
  const detectedLanguage = useMemo(() => {
    const trimmed = debouncedDraft.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const code = detectLanguage(trimmed);
    return SUPPORTED_LANGUAGES.find((option) => option.code === code) ?? null;
  }, [debouncedDraft]);

  const lastAssistantText =
    [...messages].reverse().find((message) => message.role === 'assistant')?.text ?? '';
  const lastMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  return (
    <Card accent="pitch" className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-h2 text-fan-ink">AI concierge</h2>
        {lastSource === 'mock' ? <DemoDataBadge /> : null}
      </div>

      <ul
        ref={listRef}
        aria-label="Conversation"
        className="mt-4 flex max-h-[420px] min-h-[260px] flex-col gap-3 overflow-y-auto pr-1"
      >
        {messages.length === 0 && !error ? (
          <li className="flex flex-col items-center gap-3 py-6 text-center">
            <Mascot pose="pointing" size={72} />
            <p className="text-body-sm text-fan-muted">
              Ask anything about the stadium — in any language. Try one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.language}
                  className="rounded-pill border border-fan-border bg-fan-bg px-3 py-1.5 text-body-sm text-fan-ink transition-colors hover:border-pitch hover:bg-pitch-tint focus-visible:outline-none focus-visible:shadow-inputfocus"
                  lang={suggestion.language}
                  onClick={() => send(suggestion.text)}
                  type="button"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </li>
        ) : (
          messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              stream={message.id === lastMessageId}
            />
          ))
        )}
        {isSending ? <TypingIndicator /> : null}
        {error ? (
          <li>
            <ErrorState message={error} onRetry={retry} title="Reply failed" />
          </li>
        ) : null}
      </ul>

      {/* Mirrors the finished reply for assistive tech — the visible bubble streams word by word. */}
      <p aria-live="polite" className="sr-only">
        {isSending ? 'The concierge is typing.' : lastAssistantText}
      </p>

      <form
        className="mt-4 flex flex-col gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
          setDraft('');
        }}
      >
        <label className="text-label font-semibold text-fan-faint" htmlFor={inputId}>
          Ask in any language
        </label>
        <div className="flex gap-2">
          <input
            autoComplete="off"
            className="min-w-0 flex-1 rounded-md border border-fan-border bg-fan-bg px-3 py-2.5 text-body-sm text-fan-ink placeholder:text-fan-faint focus:border-pitch focus:outline-none focus:shadow-inputfocus"
            id={inputId}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="e.g. ¿Dónde está la Puerta C?"
            value={draft}
          />
          <Button disabled={isSending || draft.trim().length === 0} size="sm" type="submit">
            Send
          </Button>
        </div>
        <p className={cx('text-label text-fan-faint', !detectedLanguage && 'invisible')}>
          Detected: {detectedLanguage?.label ?? '—'}
          {detectedLanguage && detectedLanguage.code !== 'en'
            ? ` · ${detectedLanguage.nativeLabel}`
            : ''}
        </p>
      </form>
    </Card>
  );
}
