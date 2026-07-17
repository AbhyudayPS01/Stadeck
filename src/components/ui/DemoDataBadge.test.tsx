import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../context/LanguageProvider';
import { DemoDataBadge } from './DemoDataBadge';

describe('DemoDataBadge', () => {
  it('labels demo content in both themes', () => {
    const { rerender } = render(
      <LanguageProvider>
        <DemoDataBadge />
      </LanguageProvider>,
    );
    expect(screen.getByText('Demo data')).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <DemoDataBadge theme="ops" />
      </LanguageProvider>,
    );
    expect(screen.getByText('Demo data')).toBeInTheDocument();
  });

  it('reads as offline capability when the mock was served for a network failure', () => {
    render(
      <LanguageProvider>
        <DemoDataBadge reason="offline" />
      </LanguageProvider>,
    );
    expect(screen.getByText('Offline mode')).toBeInTheDocument();
  });

  it('keeps the demo label when no API key is configured', () => {
    render(
      <LanguageProvider>
        <DemoDataBadge reason="no-key" />
      </LanguageProvider>,
    );
    expect(screen.getByText('Demo data')).toBeInTheDocument();
  });
});
