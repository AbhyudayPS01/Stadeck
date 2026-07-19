import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageProvider';
import { RoleProvider } from '../../context/RoleProvider';
import { VenueProvider } from '../../context/VenueProvider';
import type { Role } from '../../types/role';
import { Shell } from './Shell';

function renderShellAs(role: Role, initialLanguage = 'en') {
  return render(
    <RoleProvider initialRole={role}>
      <LanguageProvider initialLanguage={initialLanguage}>
        <VenueProvider>
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
        </VenueProvider>
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

  it('shows organizers all ten modules', () => {
    renderShellAs('organizer');

    const nav = screen.getByRole('navigation', { name: 'Modules' });
    expect(within(nav).getAllByRole('link')).toHaveLength(10);
  });

  it('renders the routed module content, role switcher, and language picker', () => {
    renderShellAs('fan');

    expect(screen.getByText('Module body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch role' })).toBeInTheDocument();
    expect(screen.getByLabelText('Interface language')).toBeInTheDocument();
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

  it('translates the module navigation for the selected interface language', () => {
    renderShellAs('fan', 'es');

    expect(screen.getByRole('link', { name: 'Navegación' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Asistencia Multilingüe' })).toBeInTheDocument();
  });

  it('flips the content region to RTL with its language tag for Arabic', () => {
    const { container } = renderShellAs('fan', 'ar');

    const main = container.querySelector('#main-content');
    expect(main).toHaveAttribute('dir', 'rtl');
    expect(main).toHaveAttribute('lang', 'ar');
  });

  it('keeps the content region LTR with no dir attribute for English', () => {
    const { container } = renderShellAs('fan');

    expect(container.querySelector('#main-content')).not.toHaveAttribute('dir');
  });
});
