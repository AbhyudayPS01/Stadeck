import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../context/LanguageProvider';
import MultilingualAssistanceScreen from './MultilingualAssistanceScreen';

vi.mock('../../services/gemini', () => ({
  getMultilingualReply: vi.fn(),
  getAnnouncementTranslation: vi.fn(),
}));

import { getAnnouncementTranslation, getMultilingualReply } from '../../services/gemini';

const getMultilingualReplyMock = vi.mocked(getMultilingualReply);
const getAnnouncementTranslationMock = vi.mocked(getAnnouncementTranslation);

function renderScreen() {
  return render(
    <LanguageProvider>
      <MultilingualAssistanceScreen />
    </LanguageProvider>,
  );
}

/** The chat thread, scoped so queries never match the sr-only live region's mirror of the reply. */
function conversation() {
  return within(screen.getByRole('list', { name: 'Conversation' }));
}

beforeEach(() => {
  getMultilingualReplyMock.mockReset();
  getAnnouncementTranslationMock.mockReset();
});

describe('MultilingualAssistanceScreen — concierge send flow', () => {
  it('sends a message and renders the reply with its detected language', async () => {
    const user = userEvent.setup();
    getMultilingualReplyMock.mockResolvedValueOnce({
      data: { reply: 'La Puerta C está en el lado este del estadio.', language: 'es' },
      source: 'live',
    });
    renderScreen();

    await user.type(screen.getByLabelText('Ask in any language'), '¿Dónde está la Puerta C?');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(conversation().getByText('¿Dónde está la Puerta C?')).toBeInTheDocument();
    const reply = await conversation().findByText('La Puerta C está en el lado este del estadio.');
    expect(reply).toHaveAttribute('lang', 'es');
    expect(getMultilingualReplyMock).toHaveBeenCalledWith('¿Dónde está la Puerta C?');
  });

  it('renders Arabic replies right-to-left', async () => {
    const user = userEvent.setup();
    getMultilingualReplyMock.mockResolvedValueOnce({
      data: { reply: 'البوابة C في الجهة الشرقية.', language: 'ar' },
      source: 'live',
    });
    renderScreen();

    await user.type(screen.getByLabelText('Ask in any language'), 'أين البوابة C؟');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    const reply = await conversation().findByText('البوابة C في الجهة الشرقية.');
    expect(reply).toHaveAttribute('dir', 'rtl');
    expect(reply).toHaveAttribute('lang', 'ar');
  });

  it('shows the Demo data badge when the reply came from the mock fallback', async () => {
    const user = userEvent.setup();
    getMultilingualReplyMock.mockResolvedValueOnce({
      data: { reply: 'Happy to help!', language: 'en' },
      source: 'mock',
    });
    renderScreen();

    await user.type(screen.getByLabelText('Ask in any language'), 'Where is Gate C?');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    await conversation().findByText('Happy to help!');
    expect(screen.getAllByText('Demo data').length).toBeGreaterThan(0);
  });

  it('offers multilingual starter questions in the empty state and sends on click', async () => {
    const user = userEvent.setup();
    getMultilingualReplyMock.mockResolvedValueOnce({
      data: { reply: 'Gate C is on the east side.', language: 'en' },
      source: 'live',
    });
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Where is Gate C?' }));

    expect(await conversation().findByText('Gate C is on the east side.')).toBeInTheDocument();
    expect(getMultilingualReplyMock).toHaveBeenCalledWith('Where is Gate C?');
  });

  it('shows a designed error state with retry when the send fails unexpectedly', async () => {
    const user = userEvent.setup();
    getMultilingualReplyMock.mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce({
      data: { reply: 'Recovered reply.', language: 'en' },
      source: 'live',
    });
    renderScreen();

    await user.type(screen.getByLabelText('Ask in any language'), 'Where is Gate C?');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not answer/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await conversation().findByText('Recovered reply.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('disables Send while a reply is pending', async () => {
    const user = userEvent.setup();
    let resolveReply: (() => void) | undefined;
    getMultilingualReplyMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveReply = () =>
            resolve({ data: { reply: 'Done.', language: 'en' }, source: 'live' });
        }),
    );
    renderScreen();

    await user.type(screen.getByLabelText('Ask in any language'), 'Where is Gate C?');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    resolveReply?.();
    expect(await conversation().findByText('Done.')).toBeInTheDocument();
  });
});
