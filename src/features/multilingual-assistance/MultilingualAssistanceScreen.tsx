import { AnnouncementsPanel } from './AnnouncementsPanel';
import { ConciergeChat } from './ConciergeChat';

/**
 * Multilingual Assistance — implements the challenge clause "multilingual
 * assistance". Fans chat with a fact-grounded AI concierge that auto-detects
 * their language and replies in it, and translate live venue announcements
 * into their chosen language with one click.
 */
export default function MultilingualAssistanceScreen() {
  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">Multilingual Assistance</h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        Ask the concierge anything in your own language, and translate venue announcements
        instantly. AI answers are grounded in verified stadium facts.
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <ConciergeChat />
        <AnnouncementsPanel />
      </div>
    </main>
  );
}
