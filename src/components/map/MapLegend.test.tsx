import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../context/LanguageProvider';
import { MapLegend } from './MapLegend';

describe('MapLegend', () => {
  it('lists every amenity marker type with its glyph and label paired', () => {
    render(
      <LanguageProvider>
        <MapLegend />
      </LanguageProvider>,
    );

    // textContent concatenates the swatch glyph with the label, so each
    // entry asserts the glyph–label pairing in one string.
    const entries = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(entries).toEqual([
      'RRestroom',
      'CConcessions',
      'WWater Refill Station',
      'MMerchandise',
      'iGuest Services',
      'PPrayer & Quiet Room',
      'AAccessible Seating',
      '+First Aid',
      'FFamily Reunification',
      'XEmergency Exit',
    ]);
  });

  it('pairs each swatch glyph with its text label, never color alone', () => {
    const { container } = render(
      <LanguageProvider>
        <MapLegend />
      </LanguageProvider>,
    );

    const glyphs = [...container.querySelectorAll('text')].map((glyph) => glyph.textContent);
    expect(glyphs).toContain('W');
    expect(glyphs).toContain('X');
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(glyphs.length);
  });
});
