import { useRole } from '../../hooks/useRole';
import { useUiStrings } from '../../hooks/useUiStrings';
import { AnnouncementsPanel } from './AnnouncementsPanel';
import { ConciergeChat } from './ConciergeChat';
import { VolunteerAssist } from './VolunteerAssist';

/**
 * Multilingual Assistance — implements the challenge clause "multilingual
 * assistance". Fans chat with a fact-grounded AI concierge that auto-detects
 * their language and replies in it, and translate live venue announcements
 * into their chosen language with one click. Volunteers get a different
 * presentation of the same capability: one-tap common questions answered in
 * English and the fan's language side by side.
 */
export default function MultilingualAssistanceScreen() {
  const strings = useUiStrings();
  const { role } = useRole();
  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">
        {strings['module.multilingual-assistance.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        {strings['module.multilingual-assistance.description']}
      </p>
      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        {role === 'volunteer' ? <VolunteerAssist /> : <ConciergeChat />}
        <AnnouncementsPanel />
      </div>
    </main>
  );
}
