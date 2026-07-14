import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { MODULES } from './config/constants';

function renderAppAt(path: string) {
  return render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      initialEntries={[path]}
    >
      <App />
    </MemoryRouter>,
  );
}

/** Enters the Organizer view (sees all eight modules) via the demo access button. */
async function enterAsOrganizer(user: ReturnType<typeof userEvent.setup>) {
  const form = within(screen.getByRole('form', { name: 'Organizer demo access' }));
  await user.click(form.getByRole('button', { name: 'Continue with demo access' }));
}

describe('App', () => {
  it('renders the landing role gate at the root', () => {
    renderAppAt('/');

    expect(screen.getByRole('heading', { level: 1, name: 'Stadeck' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Choose your view' })).toBeInTheDocument();
  });

  it('redirects module deep links back to the role gate when no role is selected', () => {
    renderAppAt('/crowd-management');

    expect(screen.getByRole('heading', { name: 'Choose your view' })).toBeInTheDocument();
  });

  it('redirects unknown paths to the landing screen', () => {
    renderAppAt('/does-not-exist');

    expect(screen.getByRole('heading', { name: 'Choose your view' })).toBeInTheDocument();
  });

  it.each(MODULES)('renders the $label screen for an organizer at $path', async (module) => {
    const user = userEvent.setup();
    renderAppAt('/');

    await enterAsOrganizer(user);
    await user.click(await screen.findByRole('link', { name: module.label }));

    expect(
      await screen.findByRole('heading', { level: 1, name: module.label }),
    ).toBeInTheDocument();
  });
});
