import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageProvider';
import { RoleProvider } from '../../context/RoleProvider';
import { RoleSwitcher } from './RoleSwitcher';

function renderSwitcher() {
  return render(
    <RoleProvider initialRole="volunteer">
      <LanguageProvider>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          initialEntries={['/navigation']}
        >
          <Routes>
            <Route element={<RoleSwitcher />} path="/navigation" />
            <Route element={<p>Landing gate</p>} path="/" />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </RoleProvider>,
  );
}

describe('RoleSwitcher', () => {
  it('names the active role view', () => {
    renderSwitcher();

    expect(screen.getByText('Volunteer & Venue Staff')).toBeInTheDocument();
  });

  it('returns to the landing role gate when switching roles', async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.click(screen.getByRole('button', { name: 'Switch role' }));

    expect(screen.getByText('Landing gate')).toBeInTheDocument();
  });
});
