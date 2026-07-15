export type ChatRole = 'user' | 'assistant';

/** One message in the multilingual assistance chat thread. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  /** BCP-47 language tag, e.g. "es" or "pt-BR" — drives the `lang` attribute on render. */
  language: string;
  createdAt: string;
  /** Set on assistant messages; "mock" drives the "Demo data" badge in the chat header. */
  source?: 'live' | 'mock';
}
