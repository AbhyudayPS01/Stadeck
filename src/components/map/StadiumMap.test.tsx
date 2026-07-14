import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SECTIONS } from '../../services/data/stadiumLayout';
import { StadiumMap } from './StadiumMap';

describe('StadiumMap', () => {
  it('names the map for assistive technology', () => {
    render(<StadiumMap />);

    expect(
      screen.getByRole('group', { name: /Schematic seating map of MetLife Stadium/ }),
    ).toBeInTheDocument();
  });

  it('makes every section keyboard-focusable with an accessible name', () => {
    render(<StadiumMap />);

    const sections = screen.getAllByRole('button', { name: /^Section \d+/ });
    expect(sections).toHaveLength(SECTIONS.length);
    for (const section of sections) {
      expect(section).toHaveAttribute('tabindex', '0');
    }
  });

  it('names gates with their compass entrance', () => {
    render(<StadiumMap />);

    expect(screen.getByRole('button', { name: 'Gate A, north entrance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gate E, south entrance' })).toBeInTheDocument();
  });

  it('labels amenity markers without adding tab stops', () => {
    render(<StadiumMap />);

    expect(screen.getByRole('img', { name: 'First Aid, near section 112' })).not.toHaveAttribute(
      'tabindex',
    );
  });

  it('reports section selection from clicks and from the keyboard', async () => {
    const user = userEvent.setup();
    const onSelectSection = vi.fn();
    render(<StadiumMap onSelectSection={onSelectSection} />);

    await user.click(screen.getByRole('button', { name: 'Section 101, lower bowl' }));
    expect(onSelectSection).toHaveBeenCalledWith('sec-101');

    screen.getByRole('button', { name: 'Section 102, lower bowl' }).focus();
    await user.keyboard('{Enter}');
    expect(onSelectSection).toHaveBeenCalledWith('sec-102');
  });

  it('reports gate selection', async () => {
    const user = userEvent.setup();
    const onSelectGate = vi.fn();
    render(<StadiumMap onSelectGate={onSelectGate} />);

    await user.click(screen.getByRole('button', { name: 'Gate C, east entrance' }));

    expect(onSelectGate).toHaveBeenCalledWith('gate-c');
  });

  it('marks the selected section as pressed', () => {
    render(<StadiumMap selectedSectionId="sec-105" />);

    expect(screen.getByRole('button', { name: 'Section 105, lower bowl' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Section 106, lower bowl' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('renders overlay layers above the base map', () => {
    render(<StadiumMap overlays={<circle data-testid="overlay-dot" r="4" />} />);

    expect(screen.getByTestId('overlay-dot')).toBeInTheDocument();
  });
});
