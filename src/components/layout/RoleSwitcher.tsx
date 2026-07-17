import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/constants';
import { useRole } from '../../hooks/useRole';
import { useUiStrings } from '../../hooks/useUiStrings';

/**
 * Shows the active role view and exits back to the landing role gate.
 * Deliberately no in-place role switching: re-entering a gated role goes back
 * through the same access-code validation path — no shortcut around the gate.
 * Styled for the dark sidebar.
 */
export function RoleSwitcher() {
  const { role, leaveRole } = useRole();
  const strings = useUiStrings();
  const navigate = useNavigate();

  const option = ROLES.find((candidate) => candidate.id === role);
  if (!option) {
    return null;
  }

  const handleSwitch = (): void => {
    leaveRole();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-body-sm text-ops-muted">
        {strings['shell.viewingAs']}{' '}
        <span className="font-semibold text-ops-body">{strings[`role.${option.id}.label`]}</span>
      </p>
      <button
        className="shrink-0 rounded-md border border-ops-border px-3 py-1.5 text-label font-semibold text-ops-body transition-colors hover:bg-ops-surface2 focus-visible:outline-none focus-visible:shadow-inputfocus"
        onClick={handleSwitch}
        type="button"
      >
        {strings['shell.switchRole']}
      </button>
    </div>
  );
}
