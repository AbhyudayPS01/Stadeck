import { useProgressiveText } from '../../hooks/useProgressiveText';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { ChatMessage } from '../../types/chat';
import { cx } from '../../utils/cx';
import { isRtlLanguage } from '../../utils/detectLanguage';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  /** Stream the text word by word — set only for the newest assistant reply. */
  stream?: boolean;
}

/**
 * One chat bubble. Sets `lang` (and `dir` for RTL scripts like Arabic) on the
 * text itself so screen readers switch pronunciation and the browser shapes
 * the text correctly — UI chrome around it stays English per CLAUDE.md.
 */
export function ChatMessageBubble({ message, stream = false }: ChatMessageBubbleProps) {
  const prefersReducedMotion = useReducedMotion();
  const isAssistant = message.role === 'assistant';
  const text = useProgressiveText(message.text, stream && isAssistant && !prefersReducedMotion);

  return (
    <li
      className={cx(
        'max-w-[85%] animate-msg-in rounded-xl px-4 py-2.5 motion-reduce:animate-none',
        isAssistant ? 'self-start border border-fan-border bg-fan-bg' : 'self-end bg-pitch-deep',
      )}
    >
      <p
        className={cx('text-body-sm', isAssistant ? 'text-fan-ink' : 'text-white')}
        dir={isRtlLanguage(message.language) ? 'rtl' : undefined}
        lang={message.language}
      >
        {text}
      </p>
    </li>
  );
}
