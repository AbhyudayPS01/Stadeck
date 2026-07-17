import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { DEMO_ACCESS_CODES } from '../../config/constants';

function renderApp() {
  return render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      initialEntries={['/']}
    >
      <App />
    </MemoryRouter>,
  );
}

function gatedForm(roleLabel: string) {
  return within(screen.getByRole('form', { name: `${roleLabel} demo access` }));
}

describe('Landing role gate', () => {
  it('enters the Fan view in one click', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Enter as Fan' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Navigation' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Operational Intelligence' }),
    ).not.toBeInTheDocument();
  });

  it('unlocks Volunteer & Staff with a typed access code', async () => {
    const user = userEvent.setup();
    renderApp();

    const form = gatedForm('Volunteer & Staff');
    await user.type(form.getByLabelText('Demo access code'), DEMO_ACCESS_CODES.volunteer);
    await user.click(form.getByRole('button', { name: 'Enter with code' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Navigation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crowd Management' })).toBeInTheDocument();
  });

  it('unlocks Organizer through the one-click demo access button', async () => {
    const user = userEvent.setup();
    renderApp();

    const form = gatedForm('Organizer');
    await user.click(form.getByRole('button', { name: 'Continue with demo access' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Navigation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Operational Intelligence' })).toBeInTheDocument();
  });

  it('rejects an unknown access code with an inline error', async () => {
    const user = userEvent.setup();
    renderApp();

    const form = gatedForm('Volunteer & Staff');
    await user.type(form.getByLabelText('Demo access code'), 'NOT-A-REAL-CODE');
    await user.click(form.getByRole('button', { name: 'Enter with code' }));

    // The role name is bidi-isolated by formatUiString; '.' absorbs the marks.
    expect(form.getByRole('alert')).toHaveTextContent(
      /does not unlock the .Volunteer & Staff. view/,
    );
    expect(screen.getByRole('heading', { name: 'Choose your view' })).toBeInTheDocument();
  });

  it("rejects another role's code — codes are scoped to their card", async () => {
    const user = userEvent.setup();
    renderApp();

    const form = gatedForm('Volunteer & Staff');
    await user.type(form.getByLabelText('Demo access code'), DEMO_ACCESS_CODES.organizer);
    await user.click(form.getByRole('button', { name: 'Enter with code' }));

    // The role name is bidi-isolated by formatUiString; '.' absorbs the marks.
    expect(form.getByRole('alert')).toHaveTextContent(
      /does not unlock the .Volunteer & Staff. view/,
    );
  });
});
