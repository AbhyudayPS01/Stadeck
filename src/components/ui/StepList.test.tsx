import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepList } from './StepList';

describe('StepList', () => {
  it('renders a bulleted list by default', () => {
    render(<StepList items={['First tip', 'Second tip']} />);

    const list = screen.getByRole('list');
    expect(list.tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('First tip')).toBeInTheDocument();
  });

  it('renders numbered markers when sequence matters', () => {
    render(<StepList items={['Enter the gate', 'Follow the concourse']} ordered />);

    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveTextContent('1.');
    expect(list).toHaveTextContent('2.');
  });
});
