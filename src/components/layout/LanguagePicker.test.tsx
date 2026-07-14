import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../context/LanguageProvider';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { LanguagePicker } from './LanguagePicker';

function renderPicker() {
  return render(
    <LanguageProvider>
      <LanguagePicker />
    </LanguageProvider>,
  );
}

describe('LanguagePicker', () => {
  it('offers every supported AI content language', () => {
    renderPicker();

    expect(screen.getAllByRole('option')).toHaveLength(SUPPORTED_LANGUAGES.length);
  });

  it('updates the language preference through the labeled select', async () => {
    const user = userEvent.setup();
    renderPicker();

    const select = screen.getByLabelText('AI content language');
    await user.selectOptions(select, 'es');

    expect(select).toHaveValue('es');
  });
});
