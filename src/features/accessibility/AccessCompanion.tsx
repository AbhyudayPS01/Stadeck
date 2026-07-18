import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { Spinner } from '../../components/ui/Spinner';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getInitialAnnouncements } from '../../services/data/announcements';
import { getPlainLanguageRewrite, type MockReason } from '../../services/gemini';
import type { Announcement } from '../../types/announcement';
import type { Venue } from '../../types/venue';

type RewriteEntry =
  | { status: 'loading' }
  | { status: 'done'; text: string; source: 'live' | 'mock'; mockReason?: MockReason };

export interface AccessCompanionProps {
  venue: Venue;
}

/**
 * "Access Companion": one click rewrites any venue announcement into plain
 * language — short sentences, everyday words — for fans with cognitive or
 * reading-related access needs. Uses the announcement backlog rather than the
 * live stream: rewrites should stay on screen, not scroll away.
 */
export function AccessCompanion({ venue }: AccessCompanionProps) {
  const strings = useUiStrings();
  const [announcements] = useState<Announcement[]>(() => getInitialAnnouncements(venue));
  const [rewrites, setRewrites] = useState<Record<string, RewriteEntry>>({});

  const rewrite = (announcement: Announcement): void => {
    setRewrites((previous) => ({ ...previous, [announcement.id]: { status: 'loading' } }));
    getPlainLanguageRewrite(announcement, venue).then((result) => {
      setRewrites((previous) => ({
        ...previous,
        [announcement.id]: {
          status: 'done',
          text: result.data.rewrite,
          source: result.source,
          mockReason: result.mockReason,
        },
      }));
    });
  };

  return (
    <Card accent="gold">
      <h2 className="font-display text-h2 text-fan-ink">
        {strings['accessibility.accessCompanion']}
      </h2>
      <p className="mt-1.5 text-body-sm text-fan-muted">
        {strings['accessibility.accessCompanionIntro']}
      </p>
      <ul aria-label="Announcements to simplify" className="mt-4 flex flex-col gap-4">
        {announcements.map((announcement) => {
          const entry = rewrites[announcement.id];
          return (
            <li
              key={announcement.id}
              className="border-b border-fan-border pb-4 last:border-b-0 last:pb-0"
            >
              <Badge severity="info">
                {strings[`announcementCategory.${announcement.category}`]}
              </Badge>
              <p className="mt-2 text-body-sm text-fan-ink" lang="en">
                {announcement.message}
              </p>
              {entry?.status === 'done' ? (
                <div aria-live="polite" className="mt-2 rounded-md bg-pitch-tint px-3 py-2">
                  <p className="text-body-sm text-pitch-darker" lang="en">
                    {entry.text}
                  </p>
                  {entry.source === 'mock' ? (
                    <span className="mt-1.5 inline-flex">
                      <DemoDataBadge reason={entry.mockReason} />
                    </span>
                  ) : null}
                </div>
              ) : (
                <Button
                  className="mt-2"
                  disabled={entry?.status === 'loading'}
                  onClick={() => rewrite(announcement)}
                  size="sm"
                  variant="secondary"
                >
                  {entry?.status === 'loading' ? (
                    <Spinner label={strings['accessibility.rewriting']} size="sm" />
                  ) : (
                    strings['accessibility.plainLanguage']
                  )}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
