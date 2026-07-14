import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MODULES } from '../../config/constants';
import { RoleProvider } from '../../context/RoleProvider';
import type { Module } from '../../types/module';
import type { Role } from '../../types/role';
import { ModuleGate } from './ModuleGate';

function getModule(id: Module['id']): Module {
  const module = MODULES.find((candidate) => candidate.id === id);
  if (!module) {
    throw new Error(`Unknown module in test setup: ${id}`);
  }
  return module;
}

function renderGate(role: Role, module: Module, children: ReactNode = <p>Module content</p>) {
  return render(
    <RoleProvider initialRole={role}>
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        initialEntries={[module.path]}
      >
        <Routes>
          <Route element={<ModuleGate module={module}>{children}</ModuleGate>} path={module.path} />
          <Route element={<p>Landing gate</p>} path="/" />
        </Routes>
      </MemoryRouter>
    </RoleProvider>,
  );
}

describe('ModuleGate', () => {
  it('renders the module for a role that includes it', () => {
    renderGate('fan', getModule('navigation'));

    expect(screen.getByText('Module content')).toBeInTheDocument();
  });

  it('redirects a fan deep-linking to an organizer-only module', () => {
    renderGate('fan', getModule('operational-intelligence'));

    expect(screen.getByText('Landing gate')).toBeInTheDocument();
    expect(screen.queryByText('Module content')).not.toBeInTheDocument();
  });

  it('contains a module crash behind a recovery card naming the module', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function Boom(): never {
      throw new Error('boom');
    }

    renderGate('organizer', getModule('crowd-management'), <Boom />);

    expect(screen.getByRole('alert')).toHaveTextContent(/Crowd Management ran into/);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
