import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { MODULES } from './config/constants';
import type { ModuleId } from './types/module';

const screens: Record<ModuleId, ReturnType<typeof lazy>> = {
  navigation: lazy(() => import('./features/navigation/NavigationScreen')),
  'crowd-management': lazy(() => import('./features/crowd-management/CrowdManagementScreen')),
  accessibility: lazy(() => import('./features/accessibility/AccessibilityScreen')),
  transportation: lazy(() => import('./features/transportation/TransportationScreen')),
  sustainability: lazy(() => import('./features/sustainability/SustainabilityScreen')),
  'multilingual-assistance': lazy(
    () => import('./features/multilingual-assistance/MultilingualAssistanceScreen'),
  ),
  'operational-intelligence': lazy(
    () => import('./features/operational-intelligence/OperationalIntelligenceScreen'),
  ),
  'real-time-decision-support': lazy(
    () => import('./features/real-time-decision-support/RealTimeDecisionSupportScreen'),
  ),
};

/** Temporary module index. Superseded by the role-select landing screen in a later phase. */
function HomeIndex() {
  return (
    <main className="min-h-screen bg-fan-bg px-page py-section">
      <h1 className="font-display text-h1 text-fan-ink">Stadeck</h1>
      <nav aria-label="Modules" className="mt-6">
        <ul className="flex flex-col gap-2">
          {MODULES.map((module) => (
            <li key={module.id}>
              <Link className="text-body text-pitch-deep underline" to={module.path}>
                {module.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

/** Router, route-level code splitting for all eight modules, and the global error boundary. */
export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <Routes>
          <Route element={<HomeIndex />} path="/" />
          {MODULES.map((module) => {
            const Screen = screens[module.id];
            return <Route key={module.id} element={<Screen />} path={module.path} />;
          })}
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
