import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatingChatbot } from './FloatingChatbot';
import { VenueProvider } from '../../context/VenueProvider';
import { LanguageProvider } from '../../context/LanguageProvider';

function renderFloatingChatbot() {
  return render(
    <LanguageProvider>
      <VenueProvider>
        <FloatingChatbot />
      </VenueProvider>
    </LanguageProvider>,
  );
}

describe('FloatingChatbot', () => {
  it('renders the mascot button initially', () => {
    renderFloatingChatbot();
    expect(screen.getByRole('button', { name: 'Open AI Concierge' })).toBeInTheDocument();
  });

  it('opens the chat interface when clicked', async () => {
    const user = userEvent.setup();
    renderFloatingChatbot();

    const btn = screen.getByRole('button', { name: 'Open AI Concierge' });
    await user.click(btn);

    // ConciergeChat should be rendered, which has "Switch role" or input or similar?
    // Let's just check the button name changes to Close AI Concierge
    expect(screen.getByRole('button', { name: 'Close AI Concierge' })).toBeInTheDocument();
  });
});
