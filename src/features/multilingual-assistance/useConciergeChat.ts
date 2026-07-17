import { useCallback, useRef, useState } from 'react';
import { getMultilingualReply, type MockReason } from '../../services/gemini';
import type { ChatMessage } from '../../types/chat';
import { detectLanguage } from '../../utils/detectLanguage';

export interface ConciergeChatState {
  messages: ChatMessage[];
  /** True between sending a message and receiving the reply — drives the typing indicator. */
  isSending: boolean;
  /** Set when a send fails unexpectedly; retry() re-sends the failed message. */
  error: string | null;
  /** Source of the newest assistant reply — "mock" drives the offline/demo badge. */
  lastSource: 'live' | 'mock' | null;
  /** Why the newest reply was mock, when it was — picks the badge copy. */
  lastMockReason: MockReason | null;
  send: (text: string) => void;
  retry: () => void;
}

/**
 * State machine for the concierge chat: appends the user message (language
 * tagged by the client-side heuristic), requests a fact-grounded reply — the
 * service auto-detects the language and falls back to a deterministic mock —
 * and appends the assistant message with its definitive language code.
 */
export function useConciergeChat(): ConciergeChatState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<'live' | 'mock' | null>(null);
  const [lastMockReason, setLastMockReason] = useState<MockReason | null>(null);
  const sequenceRef = useRef(0);
  const lastFailedTextRef = useRef<string | null>(null);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return;
    }

    sequenceRef.current += 1;
    const userMessage: ChatMessage = {
      id: `msg-${sequenceRef.current}`,
      role: 'user',
      text: trimmed,
      language: detectLanguage(trimmed),
      createdAt: new Date().toISOString(),
    };
    setMessages((previous) => [...previous, userMessage]);
    setIsSending(true);
    setError(null);

    getMultilingualReply(trimmed)
      .then((result) => {
        sequenceRef.current += 1;
        const assistantMessage: ChatMessage = {
          id: `msg-${sequenceRef.current}`,
          role: 'assistant',
          text: result.data.reply,
          language: result.data.language,
          createdAt: new Date().toISOString(),
          source: result.source,
        };
        setMessages((previous) => [...previous, assistantMessage]);
        setLastSource(result.source);
        setLastMockReason(result.mockReason ?? null);
        setIsSending(false);
        lastFailedTextRef.current = null;
      })
      .catch(() => {
        // The service already mock-falls-back internally; reaching here means
        // something unexpected threw, so surface a designed error state.
        lastFailedTextRef.current = trimmed;
        setError('The concierge could not answer just now.');
        setIsSending(false);
      });
  }, []);

  const retry = useCallback(() => {
    const failedText = lastFailedTextRef.current;
    if (failedText !== null) {
      // Drop the unanswered user bubble; send() will re-append it.
      setMessages((previous) => previous.slice(0, -1));
      send(failedText);
    }
  }, [send]);

  return { messages, isSending, error, lastSource, lastMockReason, send, retry };
}
