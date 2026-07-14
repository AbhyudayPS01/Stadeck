import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>Card body</p>
      </Card>,
    );

    expect(screen.getByText('Card body')).toBeInTheDocument();
  });

  it('hides the accent bar and corner bracket from assistive technology', () => {
    const { container } = render(
      <Card accent="gold" bracket>
        <p>Decorated</p>
      </Card>,
    );

    const decorations = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorations).toHaveLength(2);
  });

  it('renders no decorations by default', () => {
    const { container } = render(
      <Card>
        <p>Plain</p>
      </Card>,
    );

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });
});
