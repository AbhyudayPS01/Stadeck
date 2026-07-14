import { cx } from '../../utils/cx';
import { MASCOT_POSE_ART, type MascotPose } from './poses';

export interface MascotProps {
  /** Defaults to welcoming. */
  pose?: MascotPose;
  /** Rendered width/height in px; artwork scales cleanly from 30 (avatar) to 140+ (hero). */
  size?: number;
  /** Gentle transform-only bob (DESIGN.md floatBall). Frozen under prefers-reduced-motion. */
  float?: boolean;
  className?: string;
}

/**
 * Bolo — Stadeck's original mascot, an anthropomorphic football (no FIFA IP).
 * Always decorative: hard-coded aria-hidden, never carries information, and
 * never placed in the content path.
 */
export function Mascot({ pose = 'welcoming', size = 120, float = false, className }: MascotProps) {
  return (
    <svg
      aria-hidden="true"
      className={
        cx(float && 'animate-float-ball motion-reduce:animate-none', className) || undefined
      }
      focusable="false"
      height={size}
      viewBox="0 0 220 220"
      width={size}
    >
      {MASCOT_POSE_ART[pose]}
    </svg>
  );
}
