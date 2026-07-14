import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageProvider';
import { RoleProvider } from '../../context/RoleProvider';
import type { Role } from '../../types/role';
import { Shell } from './Shell';

function renderShellAs(role: Role) {
  return render(
    <RoleProvider initialRole={role}>
      <LanguageProvider>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          initialEntries={['/navigation']}
        >
          <Routes>
            <Route element={<Shell />}>
              <Route element={<p>Module body</p>} path="/navigation" />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </RoleProvider>,
  );
}

describe('Shell', () => {
  it('shows fans only fan-facing modules', () => {
    renderShellAs('fan');

    expect(screen.getByRole('link', { name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Multilingual Assistance' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Crowd Management' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Operational Intelligence' }),
    ).not.toBeInTheDocument();
  });

  it('shows volunteers operational modules but not organizer-only ones', () => {
    renderShellAs('volunteer');

    expect(screen.getByRole('link', { name: 'Crowd Management' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Real-Time Decision Support' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Operational Intelligence' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sustainability' })).not.toBeInTheDocument();
  });

  it('shows organizers all eight modules', () => {
    renderShellAs('organizer');

    const nav = screen.getByRole('navigation', { name: 'Modules' });
    expect(within(nav).getAllByRole('link')).toHaveLength(8);
  });

  it('renders the routed module content, role switcher, and language picker', () => {
    renderShellAs('fan');

    expect(screen.getByText('Module body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch role' })).toBeInTheDocument();
    expect(screen.getByLabelText('AI content language')).toBeInTheDocument();
  });

  it('toggles the mobile menu with an announced expanded state', async () => {
    const user = userEvent.setup();
    renderShellAs('fan');

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('offers a skip link to the main content', () => {
    renderShellAs('fan');

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });
});
