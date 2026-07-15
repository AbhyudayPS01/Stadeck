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

  it('scales through the viewBox with no fixed pixel dimensions', () => {
    render(<StadiumMap />);

    const svg = screen.getByRole('group', { name: /Schematic seating map/ });
    expect(svg).toHaveAttribute('viewBox', '0 0 600 600');
    expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    expect(svg).not.toHaveAttribute('width');
    expect(svg).not.toHaveAttribute('height');
  });

  it('gives every section an expanded touch target that selects it', async () => {
    const user = userEvent.setup();
    const onSelectSection = vi.fn();
    const { container } = render(<StadiumMap onSelectSection={onSelectSection} />);

    const hitPaths = container.querySelectorAll('.map-section-hit');
    expect(hitPaths).toHaveLength(SECTIONS.length);
    await user.click(hitPaths[0] as Element);
    expect(onSelectSection).toHaveBeenCalledWith('sec-101');
  });

  it('gives every gate an enlarged touch circle that selects it', async () => {
    const user = userEvent.setup();
    const onSelectGate = vi.fn();
    const { container } = render(<StadiumMap onSelectGate={onSelectGate} />);

    const hitCircles = container.querySelectorAll('.map-gate-hit');
    expect(hitCircles).toHaveLength(8);
    await user.click(hitCircles[0] as Element);
    expect(onSelectGate).toHaveBeenCalledWith('gate-a');
  });

  it('lets taps pass through amenity markers to the section beneath', () => {
    render(<StadiumMap />);

    expect(screen.getByRole('img', { name: 'First Aid, near section 112' })).toHaveClass(
      'pointer-events-none',
    );
  });

  it('reduces label density instead of shrinking text: minors classed or dropped', () => {
    const { container } = render(<StadiumMap />);

    const labels = [...container.querySelectorAll('.map-section-label')];
    const labelText = labels.map((label) => label.textContent);
    expect(labelText).toContain('105'); // every 5th: always labeled
    expect(labelText).toContain('203'); // club tier: always labeled
    expect(labelText).not.toContain('102'); // lower-bowl minor: never rendered
    const upperMinor = labels.find((label) => label.textContent === '302');
    expect(upperMinor).toHaveClass('map-label-wide'); // upper minor: wide maps only
  });
});
