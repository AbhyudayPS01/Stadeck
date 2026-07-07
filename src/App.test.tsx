import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('App', () => {
  it('renders the module index with a link per module', () => {
    renderAppAt('/');

    for (const module of MODULES) {
      expect(screen.getByRole('link', { name: module.label })).toBeInTheDocument();
    }
  });

  it.each(MODULES)('renders the $label screen at $path', async (module) => {
    renderAppAt(module.path);

    expect(
      await screen.findByRole('heading', { level: 1, name: module.label }),
    ).toBeInTheDocument();
  });
});
