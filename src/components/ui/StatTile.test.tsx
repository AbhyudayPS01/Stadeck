import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { StatTile } from './StatTile';

describe('StatTile', () => {
  it('renders the label, value, and caption', () => {
    render(<StatTile caption="of matchday waste" label="Waste diverted" value="72%" />);

    expect(screen.getByRole('heading', { name: 'Waste diverted' })).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('of matchday waste')).toBeInTheDocument();
  });

  it('renders an adornment next to the value', () => {
    render(
      <StatTile
        adornment={<Badge severity="elevated">rising</Badge>}
        label="Gate wait"
        theme="ops"
        value="12 min"
      />,
    );

    expect(screen.getByText('rising')).toBeInTheDocument();
  });
});
