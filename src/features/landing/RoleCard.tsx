import { useId, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, type CardAccent } from '../../components/ui/Card';
import { DEMO_ACCESS_CODES } from '../../config/constants';
import type { Role, RoleOption } from '../../types/role';
import { resolveAccessCode } from '../../utils/accessCode';
import { cx } from '../../utils/cx';

/** Role accent colors per DESIGN.md §4: pitch / gold / steel. */
const ROLE_ACCENTS: Record<Role, CardAccent> = {
  fan: 'pitch',
  volunteer: 'gold',
  organizer: 'steel',
};

interface RoleCardProps {
  option: RoleOption;
  onEnter: (role: Role) => void;
}

function RoleCardHeading({ option }: { option: RoleOption }) {
  return (
    <div>
      <h3 className="font-display text-h3 text-fan-ink">{option.label}</h3>
      <p className="mt-1.5 text-body-sm text-fan-muted">{option.description}</p>
    </div>
  );
}

/**
 * One role entry card. Fan enters in one click; gated roles validate a demo
 * access code. The "Continue with demo access" button submits the role's demo
 * code through the exact same resolveAccessCode path as the text field —
 * one validation path, no bypass logic (CLAUDE.md product shape).
 */
export function RoleCard({ option, onEnter }: RoleCardProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  if (!option.gated) {
    return (
      <Card accent={ROLE_ACCENTS[option.id]} bracket className="flex flex-col gap-4">
        <RoleCardHeading option={option} />
        <Button className="mt-auto" onClick={() => onEnter(option.id)}>
          Enter as Fan
        </Button>
      </Card>
    );
  }

  const submitCode = (candidate: string): void => {
    const resolved = resolveAccessCode(candidate);
    if (resolved === option.id) {
      setError(null);
      onEnter(resolved);
    } else {
      setError(`That code does not unlock the ${option.label} view.`);
    }
  };

  return (
    <Card accent={ROLE_ACCENTS[option.id]} bracket className="flex flex-col gap-4">
      <RoleCardHeading option={option} />
      <form
        aria-label={`${option.label} demo access`}
        className="mt-auto flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submitCode(code);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-label font-semibold text-fan-faint" htmlFor={inputId}>
            Demo access code
          </label>
          <input
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error !== null}
            autoComplete="off"
            className={cx(
              'rounded-md bg-fan-bg px-3 py-2.5 text-body-sm text-fan-ink placeholder:text-fan-faint focus:outline-none focus:shadow-inputfocus',
              error
                ? 'border-[1.5px] border-danger-hover'
                : 'border border-fan-border focus:border-pitch',
            )}
            id={inputId}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Enter access code"
            value={code}
          />
          {error ? (
            <p className="text-label font-medium text-danger-fan" id={errorId} role="alert">
              <span aria-hidden="true">⚠ </span>
              {error}
            </p>
          ) : null}
        </div>
        <Button size="sm" type="submit" variant="secondary">
          Enter with code
        </Button>
        <Button onClick={() => submitCode(DEMO_ACCESS_CODES[option.id])} size="sm" variant="accent">
          Continue with demo access
        </Button>
      </form>
    </Card>
  );
}
