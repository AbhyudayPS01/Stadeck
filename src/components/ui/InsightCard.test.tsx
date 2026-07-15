import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InsightCard } from './InsightCard';

describe('InsightCard', () => {
  it('renders the title and unordered items', () => {
    render(<InsightCard items={['Open Gate A', 'Open Gate B']} title="Gates to open" />);

    expect(screen.getByRole('heading', { name: 'Gates to open' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an ordered list with step numbers when sequence matters', () => {
    render(<InsightCard ordered items={['First', 'Second']} title="Immediate actions" />);

    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();
  });

  it('renders prose sections', () => {
    render(<InsightCard text="Pressure eases in 15 minutes." title="Congestion forecast" />);

    expect(screen.getByText('Pressure eases in 15 minutes.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
