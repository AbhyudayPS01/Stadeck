import { Suspense, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MODULES } from '../../config/constants';
import { useLanguage } from '../../hooks/useLanguage';
import { useRole } from '../../hooks/useRole';
import { useUiStrings } from '../../hooks/useUiStrings';
import { Spinner } from '../ui/Spinner';
import { cx } from '../../utils/cx';
import { isRtlLanguage } from '../../utils/detectLanguage';
import { LanguagePicker } from './LanguagePicker';
import { RoleSwitcher } from './RoleSwitcher';
import { VenuePicker } from './VenuePicker';

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
  const { language } = useLanguage();
  const strings = useUiStrings();
  const [navOpen, setNavOpen] = useState(false);

  const visibleModules = MODULES.filter((module) => role !== null && module.roles.includes(role));

  return (
    <div className="flex min-h-screen flex-col bg-fan-bg md:flex-row">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-pitch-deep focus:px-4 focus:py-2 focus:text-body-sm focus:text-white"
        href="#main-content"
      >
        {strings['shell.skipToContent']}
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
          {navOpen ? strings['shell.closeMenu'] : strings['shell.menu']}
        </button>
      </header>

      {/* The aside stretches the full column height (its background must cover tall pages);
          the inner block is what stays sticky and viewport-sized on desktop. */}
      <aside
        className={cx(
          'w-full bg-ops-bg md:block md:w-64 md:shrink-0',
          navOpen ? 'block' : 'hidden',
        )}
        id="shell-sidebar"
      >
        <div className="flex flex-col gap-6 px-gutter py-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
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
                    lang={language}
                    onClick={() => setNavOpen(false)}
                    to={module.path}
                  >
                    {strings[`module.${module.id}.title`]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-4 border-t border-ops-border pt-4">
            <RoleSwitcher />
            <VenuePicker />
            <LanguagePicker />
          </div>
        </div>
      </aside>

      {/* The interface language applies to the content region: translated
          chrome gets its lang, and Arabic flips the region to RTL. AI content
          keeps setting lang/dir on its own containers as before. */}
      <div
        className="min-w-0 flex-1 outline-none"
        dir={isRtlLanguage(language) ? 'rtl' : undefined}
        id="main-content"
        lang={language}
        tabIndex={-1}
      >
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center text-pitch-deep">
              <Spinner label={strings['shell.loadingModule']} size="lg" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
