import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ModuleGate } from './components/layout/ModuleGate';
import { RequireRole } from './components/layout/RequireRole';
import { Shell } from './components/layout/Shell';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { DisplayPreferencesProvider } from './context/DisplayPreferencesProvider';
import { LanguageProvider } from './context/LanguageProvider';
import { RoleProvider } from './context/RoleProvider';
import { VenueProvider } from './context/VenueProvider';
import { MODULES } from './config/constants';
import LandingScreen from './features/landing/LandingScreen';
import type { ModuleId } from './types/module';

/**
 * Route-level code splitting for all eight modules (SPEC.md efficiency
 * rules); the landing screen loads eagerly because it is always the first
 * paint. The Suspense boundary lives in Shell, next to the Outlet, so the
 * sidebar stays interactive while a module chunk loads.
 */
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

/**
 * Providers (role + AI language + venue), the global error boundary, and the
 * router: landing role gate at "/", the eight module routes behind
 * RequireRole inside the Shell layout, each additionally wrapped by
 * ModuleGate for role checks and a per-route error boundary.
 */
export default function App() {
  return (
    <RoleProvider>
      <LanguageProvider>
        <VenueProvider>
          <DisplayPreferencesProvider>
            <ErrorBoundary>
              <Routes>
                <Route element={<LandingScreen />} path="/" />
                <Route element={<RequireRole />}>
                  <Route element={<Shell />}>
                    {MODULES.map((module) => {
                      const Screen = screens[module.id];
                      return (
                        <Route
                          key={module.id}
                          element={
                            <ModuleGate module={module}>
                              <Screen />
                            </ModuleGate>
                          }
                          path={module.path}
                        />
                      );
                    })}
                  </Route>
                </Route>
                <Route element={<Navigate replace to="/" />} path="*" />
              </Routes>
            </ErrorBoundary>
          </DisplayPreferencesProvider>
        </VenueProvider>
      </LanguageProvider>
    </RoleProvider>
  );
}
