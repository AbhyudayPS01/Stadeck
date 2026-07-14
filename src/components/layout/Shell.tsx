import { Suspense, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MODULES } from '../../config/constants';
import { useRole } from '../../hooks/useRole';
import { Spinner } from '../ui/Spinner';
import { cx } from '../../utils/cx';
import { LanguagePicker } from './LanguagePicker';
import { RoleSwitcher } from './RoleSwitcher';

/** Dark-navy brand block shared by the mobile top bar and the desktop sidebar. */
function BrandMark() {
  return (
    <p className="flex flex-col">
      <span className="font-mono text-mono-tag font-bold uppercase text-gold">
        FIFA World Cup 2026
      </span>
      <span className="font-display text-h2 font-extrabold text-ops-ink">Stadeck</span>
    </p>
  );
}

/**
 * Signed-in layout: dark sidebar with the module navigation (filtered to the
 * active role), role switcher, and AI language preference; content renders in
 * the Outlet. Below the md breakpoint the sidebar collapses behind a top-bar
 * menu button so everything stays usable at 375px.
 */
export function Shell() {
  const { role } = useRole();
  const [navOpen, setNavOpen] = useState(false);

  const visibleModules = MODULES.filter((module) => role !== null && module.roles.includes(role));

  return (
    <div className="flex min-h-screen flex-col bg-fan-bg md:flex-row">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-pitch-deep focus:px-4 focus:py-2 focus:text-body-sm focus:text-white"
        href="#main-content"
      >
        Skip to content
      </a>

      <header className="flex items-center justify-between bg-ops-bg px-gutter py-3 md:hidden">
        <BrandMark />
        <button
          aria-controls="shell-sidebar"
          aria-expanded={navOpen}
          className="rounded-md border border-ops-border px-3 py-2 text-label font-semibold text-ops-body focus-visible:outline-none focus-visible:shadow-inputfocus"
          onClick={() => setNavOpen((open) => !open)}
          type="button"
        >
          {navOpen ? 'Close menu' : 'Menu'}
        </button>
      </header>

      <aside
        className={cx(
          'w-full flex-col gap-6 bg-ops-bg px-gutter py-6',
          'md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto',
          navOpen ? 'flex' : 'hidden',
        )}
        id="shell-sidebar"
      >
        <div className="hidden md:block">
          <BrandMark />
        </div>
        <nav aria-label="Modules" className="flex-1">
          <ul className="flex flex-col gap-1">
            {visibleModules.map((module) => (
              <li key={module.id}>
                <NavLink
                  className={({ isActive }) =>
                    cx(
                      'block rounded-md px-3 py-2 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:shadow-inputfocus',
                      isActive
                        ? 'bg-pitch-deep text-white'
                        : 'text-ops-muted hover:bg-ops-surface hover:text-ops-ink',
                    )
                  }
                  onClick={() => setNavOpen(false)}
                  to={module.path}
                >
                  {module.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-4 border-t border-ops-border pt-4">
          <RoleSwitcher />
          <LanguagePicker />
        </div>
      </aside>

      <div className="min-w-0 flex-1 outline-none" id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center text-pitch-deep">
              <Spinner label="Loading module" size="lg" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
