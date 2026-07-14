import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders an accessible button and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enter as Fan</Button>);

    await user.click(screen.getByRole('button', { name: 'Enter as Fan' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to type="button" so it never submits forms accidentally', () => {
    render(<Button>Do a thing</Button>);

    expect(screen.getByRole('button', { name: 'Do a thing' })).toHaveAttribute('type', 'button');
  });

  it('supports type="submit" for forms', () => {
    render(<Button type="submit">Enter with code</Button>);

    expect(screen.getByRole('button', { name: 'Enter with code' })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('does not fire onClick while disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Unavailable
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Unavailable' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  });

  it.each(['primary', 'accent', 'secondary', 'destructive'] as const)(
    'renders the %s variant with its label visible',
    (variant) => {
      render(<Button variant={variant}>Label</Button>);

      expect(screen.getByRole('button', { name: 'Label' })).toBeVisible();
    },
  );
});
