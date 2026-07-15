import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisplayPreferencesProvider } from '../../context/DisplayPreferencesProvider';
import AccessibilityScreen from './AccessibilityScreen';

vi.mock('../../services/gemini', () => ({
  getStepFreeRoute: vi.fn(),
  getPlainLanguageRewrite: vi.fn(),
}));

import { getPlainLanguageRewrite, getStepFreeRoute } from '../../services/gemini';

const getStepFreeRouteMock = vi.mocked(getStepFreeRoute);
const getPlainLanguageRewriteMock = vi.mocked(getPlainLanguageRewrite);

const GUIDANCE = {
  summary: 'A fully step-free route runs from Gate G to Section 120.',
  recommendedRoute: 'Enter through Gate G and take the accessible ramp to the level concourse.',
  accommodations: ['Wheelchair-accessible seating', 'Companion seating'],
};

function renderScreen() {
  return render(
    <DisplayPreferencesProvider>
      <AccessibilityScreen />
    </DisplayPreferencesProvider>,
  );
}

async function submitRoute(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText('Entry gate'), 'gate-g');
  await user.selectOptions(screen.getByLabelText('Accessible seating area'), 'sec-120');
  await user.click(screen.getByRole('button', { name: 'Plan step-free route' }));
}

beforeEach(() => {
  getStepFreeRouteMock.mockReset();
  getPlainLanguageRewriteMock.mockReset();
});

describe('AccessibilityScreen — step-free route planner', () => {
  it('renders the module heading and the schematic stadium map', () => {
    renderScreen();

    expect(screen.getByRole('heading', { level: 1, name: 'Accessibility' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /Schematic seating map of MetLife Stadium/ }),
    ).toBeInTheDocument();
  });

  it('plans a step-free route and renders the guidance with accommodations', async () => {
    const user = userEvent.setup();
    getStepFreeRouteMock.mockResolvedValueOnce({ data: GUIDANCE, source: 'live' });
    renderScreen();

    await submitRoute(user);

    expect(await screen.findByText(GUIDANCE.summary)).toBeInTheDocument();
    expect(screen.getByText(GUIDANCE.recommendedRoute)).toBeInTheDocument();
    expect(screen.getByText('Wheelchair-accessible seating')).toBeInTheDocument();
    const [gate, section] = getStepFreeRouteMock.mock.calls[0] ?? [];
    expect(gate?.id).toBe('gate-g');
    expect(section?.id).toBe('sec-120');
  });

  it('highlights the step-free route on the map after planning', async () => {
    const user = userEvent.setup();
    getStepFreeRouteMock.mockResolvedValueOnce({ data: GUIDANCE, source: 'live' });
    const { container } = renderScreen();

    expect(container.querySelector('[data-testid="route-overlay"]')).toBeNull();
    await submitRoute(user);

    expect(container.querySelector('[data-testid="route-overlay"]')).toBeInTheDocument();
  });

  it('marks mock guidance with the Demo data badge', async () => {
    const user = userEvent.setup();
    getStepFreeRouteMock.mockResolvedValueOnce({ data: GUIDANCE, source: 'mock' });
    renderScreen();

    await submitRoute(user);

    expect(await screen.findByText('Demo data')).toBeInTheDocument();
  });

  it('shows a designed error state with retry when planning fails', async () => {
    const user = userEvent.setup();
    getStepFreeRouteMock
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: GUIDANCE, source: 'live' });
    renderScreen();

    await submitRoute(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be planned/i);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(GUIDANCE.summary)).toBeInTheDocument();
  });
});

describe('AccessibilityScreen — Access Companion', () => {
  it('rewrites an announcement into plain language on demand', async () => {
    const user = userEvent.setup();
    getPlainLanguageRewriteMock.mockResolvedValueOnce({
      data: { rewrite: 'The game starts at 3:00 PM. Come early.' },
      source: 'mock',
    });
    renderScreen();

    const [firstRewriteButton] = screen.getAllByRole('button', { name: 'Plain language' });
    if (!firstRewriteButton) {
      throw new Error('expected at least one announcement to simplify');
    }
    await user.click(firstRewriteButton);

    expect(await screen.findByText('The game starts at 3:00 PM. Come early.')).toBeInTheDocument();
    expect(screen.getByText('Demo data')).toBeInTheDocument();
    expect(getPlainLanguageRewriteMock).toHaveBeenCalledTimes(1);
  });
});

describe('AccessibilityScreen — display controls', () => {
  it('toggles app-wide high contrast from the Display card', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'High contrast' }));

    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    expect(screen.getByRole('button', { name: 'High contrast' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('scales the root font-size from the text-size control', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('radio', { name: 'Extra large' }));

    expect(document.documentElement.style.fontSize).toBe('125%');
  });
});
