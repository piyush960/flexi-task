import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    const onCreateTask = vi.fn();
    
    const { getByText } = render(<EmptyState onCreateTask={onCreateTask} />);

    expect(getByText('No tasks yet')).toBeTruthy();
    expect(getByText(/Get started by creating your first task/)).toBeTruthy();
  });

  it('calls onCreateTask when button is clicked', async () => {
    const user = userEvent.setup();
    const onCreateTask = vi.fn();
    
    const { getByText } = render(<EmptyState onCreateTask={onCreateTask} />);

    const button = getByText('Create Your First Task');
    await user.click(button);

    expect(onCreateTask).toHaveBeenCalledTimes(1);
  });
});
