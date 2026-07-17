import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { generateAnnouncement, getInitialAnnouncements } from './announcements';
import { findVenue, VENUES } from './venues';

describe('getInitialAnnouncements', () => {
  it('seeds the feed newest first with unique ids', () => {
    const announcements = getInitialAnnouncements();

    expect(announcements.length).toBeGreaterThanOrEqual(3);
    expect(new Set(announcements.map((a) => a.id)).size).toBe(announcements.length);
    for (let index = 1; index < announcements.length; index += 1) {
      const current = announcements[index];
      const previous = announcements[index - 1];
      expect(current && previous && current.issuedAt <= previous.issuedAt).toBe(true);
    }
  });

  it('carries a canned translation for every supported non-English language', () => {
    const nonEnglish = SUPPORTED_LANGUAGES.filter((option) => option.code !== 'en');

    for (const announcement of getInitialAnnouncements()) {
      for (const option of nonEnglish) {
        expect(
          announcement.translations[option.code],
          `${announcement.id} → ${option.code}`,
        ).toBeTruthy();
      }
    }
  });
});

describe('generateAnnouncement', () => {
  it('produces unique ids and a valid category', () => {
    const first = generateAnnouncement();
    const second = generateAnnouncement();

    expect(first.id).not.toBe(second.id);
    expect(['safety', 'transit', 'match', 'services']).toContain(first.category);
    expect(first.message.length).toBeGreaterThan(0);
  });

  it('substitutes venue details into every language, leaving no template tokens', () => {
    for (const venue of VENUES) {
      for (const announcement of getInitialAnnouncements(venue)) {
        expect(announcement.message, `${venue.id} ${announcement.id}`).not.toContain('{{');
        for (const [language, text] of Object.entries(announcement.translations)) {
          expect(text, `${venue.id} ${announcement.id} → ${language}`).not.toContain('{{');
        }
      }
    }
  });

  it('names the venue’s own rail station in the transit announcement', () => {
    const toronto = findVenue('bmo-field');
    expect(toronto).toBeDefined();
    if (!toronto) return;
    const transit = getInitialAnnouncements(toronto).find(
      (announcement) => announcement.category === 'transit',
    );
    expect(transit?.message).toContain('Exhibition Station');
    expect(transit?.translations['es']).toContain('la estación Exhibition');
  });
});
