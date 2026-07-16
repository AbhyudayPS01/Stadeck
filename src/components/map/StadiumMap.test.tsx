import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AMENITIES, SECTIONS } from '../../services/data/stadiumLayout';
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

  it('makes every amenity marker a keyboard-focusable popup toggle', () => {
    render(<StadiumMap />);

    const marker = screen.getByRole('button', { name: 'First Aid, near section 112' });
    expect(marker).toHaveAttribute('tabindex', '0');
    expect(marker).toHaveAttribute('aria-expanded', 'false');
    expect(marker).toHaveAttribute('aria-haspopup', 'dialog');
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

  it('shows name, description, and nearby sections when an amenity is clicked', async () => {
    const user = userEvent.setup();
    render(<StadiumMap />);

    await user.click(screen.getByRole('button', { name: 'First Aid, near section 112' }));

    const popup = screen.getByRole('dialog', { name: 'First Aid details' });
    expect(popup).toHaveAttribute('aria-hidden', 'false');
    expect(popup).toHaveTextContent('Staffed medical station with trained personnel.');
    expect(popup).toHaveTextContent('Near sections 111 · 112 · 113');
  });

  it('opens the amenity popup with Enter and closes it with Escape', async () => {
    const user = userEvent.setup();
    render(<StadiumMap />);

    const marker = screen.getByRole('button', { name: 'Restroom, near section 105' });
    marker.focus();
    await user.keyboard('{Enter}');
    expect(marker).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Restroom details' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(marker).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles the popup closed when its marker is clicked again', async () => {
    const user = userEvent.setup();
    render(<StadiumMap />);

    const marker = screen.getByRole('button', { name: 'Concessions, near section 108' });
    await user.click(marker);
    expect(screen.getByRole('dialog', { name: 'Concessions details' })).toBeInTheDocument();

    await user.click(marker);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dismisses the amenity popup on a click outside it', async () => {
    const user = userEvent.setup();
    render(<StadiumMap />);

    await user.click(screen.getByRole('button', { name: 'Merchandise, near section 110' }));
    expect(screen.getByRole('dialog', { name: 'Merchandise details' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Section 101, lower bowl' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('gives every amenity an enlarged touch circle that opens its popup', async () => {
    const user = userEvent.setup();
    const { container } = render(<StadiumMap />);

    const hitCircles = container.querySelectorAll('.map-amenity-hit');
    expect(hitCircles).toHaveLength(AMENITIES.length);
    await user.click(hitCircles[0] as Element);
    expect(screen.getByRole('dialog', { name: 'Restroom details' })).toBeInTheDocument();
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
