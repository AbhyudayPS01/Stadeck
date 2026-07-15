import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormSelect } from './FormSelect';

describe('FormSelect', () => {
  it('associates the label with the select', () => {
    render(
      <FormSelect label="Entry gate" onChange={() => undefined} value="a">
        <option value="a">Gate A</option>
      </FormSelect>,
    );

    expect(screen.getByLabelText('Entry gate')).toHaveValue('a');
  });

  it('reports the newly selected value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormSelect label="Entry gate" onChange={onChange} value="a">
        <option value="a">Gate A</option>
        <option value="b">Gate B</option>
      </FormSelect>,
    );

    await user.selectOptions(screen.getByLabelText('Entry gate'), 'b');

    expect(onChange).toHaveBeenCalledWith('b');
  });
});
