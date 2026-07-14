import { Navigate, Outlet } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';

/**
 * Route guard for everything behind the role gate: with no role selected
 * (fresh load, deep link, or after "Switch role") the visitor is sent back to
 * the landing screen to pick a view.
 */
export function RequireRole() {
  const { role } = useRole();

  if (role === null) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
