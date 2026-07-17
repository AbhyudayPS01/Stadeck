import { useCallback, useRef, useState } from 'react';
import { getVolunteerAnswer, type MockReason } from '../../services/gemini';

export interface VolunteerAnswer {
  question: string;
  /** The answer the volunteer reads. */
  english: string;
  /** The answer shown to the fan; null when the interface language is English. */
  translated: { text: string; language: string } | null;
  /** "mock" when either half came from the deterministic fallback. */
  source: 'live' | 'mock';
  mockReason: MockReason | null;
}

export interface VolunteerAssistState {
  answer: VolunteerAnswer | null;
  isLoading: boolean;
  /** Set when a request fails unexpectedly; retry() re-asks the failed question. */
  error: string | null;
  ask: (question: string) => void;
  retry: () => void;
}

/**
 * State for the volunteer quick-answer view: one question in, the grounded
 * concierge answer out in both English and the selected fan language
 * (requested in parallel through the same service pathway as the fan chat).
 * A request id guards against a stale answer overwriting a newer one.
 */
export function useVolunteerAssist(language: string): VolunteerAssistState {
  const [answer, setAnswer] = useState<VolunteerAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const lastFailedQuestionRef = useRef<string | null>(null);

  const ask = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (trimmed.length === 0) {
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);
      setError(null);

      const englishRequest = getVolunteerAnswer(trimmed, 'en');
      const translatedRequest = language === 'en' ? null : getVolunteerAnswer(trimmed, language);

      Promise.all([englishRequest, translatedRequest])
        .then(([englishResult, translatedResult]) => {
          if (requestIdRef.current !== requestId) {
            return; // a newer question already resolved; discard this stale answer
          }
          setAnswer({
            question: trimmed,
            english: englishResult.data.reply,
            translated: translatedResult
              ? { text: translatedResult.data.reply, language: translatedResult.data.language }
              : null,
            source:
              englishResult.source === 'mock' || translatedResult?.source === 'mock'
                ? 'mock'
                : 'live',
            mockReason: englishResult.mockReason ?? translatedResult?.mockReason ?? null,
          });
          setIsLoading(false);
          lastFailedQuestionRef.current = null;
        })
        .catch(() => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          // The service already mock-falls-back internally; reaching here means
          // something unexpected threw, so surface a designed error state.
          lastFailedQuestionRef.current = trimmed;
          setError('The answer could not be generated just now.');
          setIsLoading(false);
        });
    },
    [language],
  );

  const retry = useCallback(() => {
    const failedQuestion = lastFailedQuestionRef.current;
    if (failedQuestion !== null) {
      ask(failedQuestion);
    }
  }, [ask]);

  return { answer, isLoading, error, ask, retry };
}
