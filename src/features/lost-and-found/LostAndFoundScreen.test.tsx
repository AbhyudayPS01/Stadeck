import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LostAndFoundScreen from './LostAndFoundScreen';
import { LanguageProvider } from '../../context/LanguageProvider';

function renderLostAndFound() {
  return render(
    <LanguageProvider>
      <LostAndFoundScreen />
    </LanguageProvider>,
  );
}

describe('LostAndFoundScreen', () => {
  it('renders the lost and found heading', () => {
    renderLostAndFound();
    expect(screen.getByRole('heading', { name: /Lost/i })).toBeInTheDocument();
  });

  it('toggles to report mode and submits a report', async () => {
    const user = userEvent.setup();
    renderLostAndFound();

    // The primary button starts as "Report Lost Item" (or fallback key)
    const reportBtn = screen.getByRole('button', { name: /Report/i });
    await user.click(reportBtn);

    const textboxes = screen.getAllByRole('textbox');
    await user.type(textboxes[0], 'My Wallet'); // Name
    await user.type(textboxes[1], 'Black leather'); // Description
    await user.type(textboxes[2], 'Gate B'); // Location

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await user.click(submitBtn);

    expect(screen.getByText('Submitted!')).toBeInTheDocument();
  });
});
