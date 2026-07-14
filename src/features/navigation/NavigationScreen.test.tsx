import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavigationScreen from './NavigationScreen';

describe('NavigationScreen', () => {
  it('renders the module heading', () => {
    render(<NavigationScreen />);

    expect(screen.getByRole('heading', { level: 1, name: 'Navigation' })).toBeInTheDocument();
  });

  it('mounts the schematic stadium map', () => {
    render(<NavigationScreen />);

    expect(
      screen.getByRole('group', { name: /Schematic seating map of MetLife Stadium/ }),
    ).toBeInTheDocument();
  });
});
