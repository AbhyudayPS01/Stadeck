import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Mascot } from './Mascot';
import type { MascotPose } from './poses';

const POSES: readonly MascotPose[] = ['welcoming', 'celebrating', 'pointing'];

describe('Mascot', () => {
  it.each(POSES)('is always decorative (aria-hidden) in the %s pose', (pose) => {
    const { container } = render(<Mascot pose={pose} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('renders distinct artwork per pose', () => {
    const markup = POSES.map((pose) => render(<Mascot pose={pose} />).container.innerHTML);

    expect(new Set(markup).size).toBe(POSES.length);
  });

  it('scales via the size prop', () => {
    const { container } = render(<Mascot size={30} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '30');
    expect(svg).toHaveAttribute('height', '30');
  });

  it('only animates when float is requested, with a reduced-motion escape hatch', () => {
    const { container, rerender } = render(<Mascot />);
    expect(container.querySelector('svg')).not.toHaveClass('animate-float-ball');

    rerender(<Mascot float />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('animate-float-ball');
    expect(svg).toHaveClass('motion-reduce:animate-none');
  });
});
