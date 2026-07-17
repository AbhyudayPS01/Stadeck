import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { useUiStrings } from '../../hooks/useUiStrings';
import type { Module } from '../../types/module';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface ModuleGateProps {
  module: Module;
  children: ReactNode;
}

/**
 * Per-module route wrapper. Redirects when the module is outside the active
 * role's view (e.g. a Fan deep-linking to Operational Intelligence), and
 * isolates render crashes behind a module-scoped ErrorBoundary so one broken
 * module never blanks the rest of the app.
 */
export function ModuleGate({ module, children }: ModuleGateProps) {
  const { role } = useRole();
  const strings = useUiStrings();

  if (role === null || !module.roles.includes(role)) {
    return <Navigate replace to="/" />;
  }

  return <ErrorBoundary scope={strings[`module.${module.id}.title`]}>{children}</ErrorBoundary>;
}
