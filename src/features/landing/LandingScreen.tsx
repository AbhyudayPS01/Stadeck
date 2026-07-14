import { useNavigate } from 'react-router-dom';
import { Mascot } from '../../components/mascot/Mascot';
import { MODULES, ROLES, STADIUM_NAME } from '../../config/constants';
import { useRole } from '../../hooks/useRole';
import type { Role } from '../../types/role';
import { RoleCard } from './RoleCard';

/**
 * Landing role gate — the entry to Stadeck's three role views (Fan,
 * Volunteer & Staff, Organizer) from the CLAUDE.md product shape. Not one of
 * the eight challenge modules; those live under src/features/<module>.
 */
export default function LandingScreen() {
  const { enterRole } = useRole();
  const navigate = useNavigate();

  const handleEnter = (role: Role): void => {
    const firstModule = MODULES.find((module) => module.roles.includes(role));
    enterRole(role);
    navigate(firstModule?.path ?? '/');
  };

  return (
    <main className="min-h-screen bg-fan-bg">
      <header className="bg-gradient-to-b from-ops-bg to-ops-bg2">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-gutter py-12 text-center md:flex-row md:gap-10 md:px-page md:py-16 md:text-left">
          <Mascot float pose="welcoming" size={140} />
          <div>
            <p className="font-mono text-mono-tag font-bold uppercase text-gold">
              FIFA World Cup 2026 · {STADIUM_NAME}
            </p>
            <h1 className="mt-3 font-display text-h1 font-extrabold text-ops-ink md:text-display">
              Stadeck
            </h1>
            <p className="mt-4 max-w-xl text-body text-ops-muted">
              GenAI-powered stadium operations and fan experience — navigation, crowd management,
              multilingual assistance, and real-time decision support for the 2026 Final.
            </p>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="role-select-heading"
        className="mx-auto max-w-5xl px-gutter py-section md:px-page"
      >
        <h2 className="font-display text-h2 text-fan-ink" id="role-select-heading">
          Choose your view
        </h2>
        <div className="mt-gutter grid grid-cols-1 gap-gutter md:grid-cols-3">
          {ROLES.map((option) => (
            <RoleCard key={option.id} onEnter={handleEnter} option={option} />
          ))}
        </div>
      </section>
    </main>
  );
}
