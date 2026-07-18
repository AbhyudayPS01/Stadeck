import { useEffect, useState } from 'react';
import { Badge, type BadgeSeverity } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import {
  ANNOUNCEMENT_FEED_INTERVAL_MS,
  ANNOUNCEMENT_FEED_LIMIT,
  SUPPORTED_LANGUAGES,
} from '../../config/constants';
import { useLanguage } from '../../hooks/useLanguage';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useMockStream } from '../../hooks/useMockStream';
import { generateAnnouncement, getInitialAnnouncements } from '../../services/data/announcements';
import { getAnnouncementTranslation, type MockReason } from '../../services/gemini';
import type { Announcement, AnnouncementCategory } from '../../types/announcement';
import type { Venue } from '../../types/venue';
import { isRtlLanguage } from '../../utils/detectLanguage';
import { formatUiString } from '../../utils/uiText';

export interface AnnouncementsPanelProps {
  venue: Venue;
}

const CATEGORY_SEVERITIES: Record<AnnouncementCategory, BadgeSeverity> = {
  safety: 'elevated',
  transit: 'info',
  match: 'normal',
  services: 'info',
};

const TIME_FORMAT = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

type TranslationEntry =
  | { status: 'loading' }
  | {
      status: 'done';
      text: string;
      language: string;
      source: 'live' | 'mock';
      mockReason?: MockReason;
    };

/**
 * The simulated venue announcement feed with one-click translation into the
 * fan's chosen interface language (the sidebar LanguagePicker). Feed items
 * are English; each translation sets its own `lang`/`dir`.
 */
export function AnnouncementsPanel({ venue }: AnnouncementsPanelProps) {
  const { language } = useLanguage();
  const strings = useUiStrings();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    getInitialAnnouncements(venue),
  );
  const [translations, setTranslations] = useState<Record<string, TranslationEntry>>({});

  const incoming = useMockStream(
    () => generateAnnouncement(venue),
    ANNOUNCEMENT_FEED_INTERVAL_MS,
  );
  useEffect(() => {
    setAnnouncements((previous) =>
      previous.some((announcement) => announcement.id === incoming.id)
        ? previous
        : [incoming, ...previous].slice(0, ANNOUNCEMENT_FEED_LIMIT),
    );
  }, [incoming]);

  const languageLabel = SUPPORTED_LANGUAGES.find((option) => option.code === language);

  const translate = (announcement: Announcement): void => {
    setTranslations((previous) => ({ ...previous, [announcement.id]: { status: 'loading' } }));
    getAnnouncementTranslation(announcement, language, venue).then((result) => {
      setTranslations((previous) => ({
        ...previous,
        [announcement.id]: {
          status: 'done',
          text: result.data.translation,
          language: result.data.language,
          source: result.source,
          mockReason: result.mockReason,
        },
      }));
    });
  };

  return (
    <Card accent="gold" className="flex flex-col">
      <div className="flex items-center gap-2.5">
        <h2 className="font-display text-h2 text-fan-ink">{strings['ml.liveAnnouncements']}</h2>
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
        />
      </div>
      <p className="mt-1.5 text-body-sm text-fan-muted">
        {language === 'en'
          ? strings['ml.pickLanguageHint']
          : formatUiString(strings['ml.oneClickTranslates'], {
              language: languageLabel?.nativeLabel ?? language,
            })}
      </p>

      {announcements.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            message={strings['empty.announcements']}
            title={strings['ml.noAnnouncementsTitle']}
          />
        </div>
      ) : (
        <ul aria-label="Announcements" aria-live="polite" className="mt-4 flex flex-col gap-4">
          {announcements.map((announcement) => {
            const entry = translations[announcement.id];
            const translated =
              entry?.status === 'done' && entry.language === language ? entry : null;
            return (
              <li
                key={announcement.id}
                className="border-b border-fan-border pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  <Badge severity={CATEGORY_SEVERITIES[announcement.category]}>
                    {strings[`announcementCategory.${announcement.category}`]}
                  </Badge>
                  <time className="text-label text-fan-faint" dateTime={announcement.issuedAt}>
                    {TIME_FORMAT.format(new Date(announcement.issuedAt))}
                  </time>
                </div>
                <p className="mt-2 text-body-sm text-fan-ink" lang="en">
                  {announcement.message}
                </p>
                {translated ? (
                  <div className="mt-2 rounded-md bg-pitch-tint px-3 py-2">
                    <p
                      className="text-body-sm text-pitch-darker"
                      dir={isRtlLanguage(translated.language) ? 'rtl' : undefined}
                      lang={translated.language}
                    >
                      {translated.text}
                    </p>
                    {translated.source === 'mock' ? (
                      <span className="mt-1.5 inline-flex">
                        <DemoDataBadge reason={translated.mockReason} />
                      </span>
                    ) : null}
                  </div>
                ) : language !== 'en' ? (
                  <Button
                    className="mt-2"
                    disabled={entry?.status === 'loading'}
                    onClick={() => translate(announcement)}
                    size="sm"
                    variant="secondary"
                  >
                    {entry?.status === 'loading' ? (
                      <Spinner label={strings['ml.translating']} size="sm" />
                    ) : (
                      strings['action.translate']
                    )}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
