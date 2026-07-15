import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../context/LanguageProvider';
import { AnnouncementsPanel } from './AnnouncementsPanel';

vi.mock('../../services/gemini', () => ({
  getAnnouncementTranslation: vi.fn(),
}));

import { getAnnouncementTranslation } from '../../services/gemini';

const getAnnouncementTranslationMock = vi.mocked(getAnnouncementTranslation);

function renderPanel(initialLanguage: string) {
  return render(
    <LanguageProvider initialLanguage={initialLanguage}>
      <AnnouncementsPanel />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  getAnnouncementTranslationMock.mockReset();
});

describe('AnnouncementsPanel', () => {
  it('seeds the feed with announcements in English', () => {
    renderPanel('es');

    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/Kickoff is at 3:00 PM/)).toHaveAttribute('lang', 'en');
  });

  it('translates an announcement in one click and tags the language', async () => {
    const user = userEvent.setup();
    getAnnouncementTranslationMock.mockResolvedValueOnce({
      data: { translation: 'El partido comienza a las 15:00.', language: 'es' },
      source: 'live',
    });
    renderPanel('es');

    // The newest feed item is randomly generated, so target the kickoff seed's list item.
    const kickoffItem = screen.getByText(/Kickoff is at 3:00 PM/).closest('li');
    if (!kickoffItem) {
      throw new Error('expected the kickoff announcement inside a list item');
    }
    await user.click(within(kickoffItem).getByRole('button', { name: 'Translate' }));

    const translation = await screen.findByText('El partido comienza a las 15:00.');
    expect(translation).toHaveAttribute('lang', 'es');
    expect(getAnnouncementTranslationMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Kickoff') }),
      'es',
    );
  });

  it('marks mock translations with the Demo data badge and renders Arabic RTL', async () => {
    const user = userEvent.setup();
    getAnnouncementTranslationMock.mockResolvedValueOnce({
      data: { translation: 'تبدأ المباراة في الساعة 3:00 مساءً.', language: 'ar' },
      source: 'mock',
    });
    renderPanel('ar');

    const firstButton = screen.getAllByRole('button', { name: 'Translate' })[0];
    if (!firstButton) {
      throw new Error('expected at least one Translate button');
    }
    await user.click(firstButton);

    const translation = await screen.findByText('تبدأ المباراة في الساعة 3:00 مساءً.');
    expect(translation).toHaveAttribute('dir', 'rtl');
    expect(screen.getByText('Demo data')).toBeInTheDocument();
  });

  it('offers no translate buttons for English and explains why', () => {
    renderPanel('en');

    expect(screen.queryByRole('button', { name: 'Translate' })).not.toBeInTheDocument();
    expect(screen.getByText(/Pick a language in the sidebar/)).toBeInTheDocument();
  });
});
