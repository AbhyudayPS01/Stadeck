import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { GATES, SECTIONS } from '../../services/data/stadiumLayout';
import { RouteOverlayLayer } from './RouteOverlayLayer';

function getFixtures() {
  const gate = GATES.find((candidate) => candidate.id === 'gate-c');
  const section = SECTIONS.find((candidate) => candidate.id === 'sec-118');
  if (!gate || !section) {
    throw new Error('missing map fixtures for route overlay test');
  }
  return { gate, section };
}

describe('RouteOverlayLayer', () => {
  it('is decorative — hidden from assistive tech', () => {
    const { gate, section } = getFixtures();
    const { container } = render(
      <svg>
        <RouteOverlayLayer gate={gate} section={section} />
      </svg>,
    );

    expect(container.querySelector('[data-testid="route-overlay"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('draws the route path with start and end markers', () => {
    const { gate, section } = getFixtures();
    const { container } = render(
      <svg>
        <RouteOverlayLayer gate={gate} section={section} />
      </svg>,
    );

    const paths = container.querySelectorAll('path');
    expect(paths).toHaveLength(2); // casing + dashed route stroke
    expect(paths[0]?.getAttribute('d')).toBe(paths[1]?.getAttribute('d'));
    expect(paths[0]?.getAttribute('d')).toMatch(/^M .+ L .+ A .+ L .+$/);
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });
});
