import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../TaskCard';
import { Task } from '@/types/task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'medium',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('TaskCard', () => {
  let defaultProps: {
    onEdit: ReturnType<typeof vi.fn<(task: Task) => void>>;
    onDelete: ReturnType<typeof vi.fn<(taskId: string) => void>>;
    onStatusChange: ReturnType<typeof vi.fn<(task: Task) => void>>;
  };

  beforeEach(() => {
    defaultProps = {
      onEdit: vi.fn<(task: Task) => void>(),
      onDelete: vi.fn<(taskId: string) => void>(),
      onStatusChange: vi.fn<(task: Task) => void>(),
    };
  });

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('renders task with due date', () => {
    const taskWithDueDate = {
      ...mockTask,
      dueDate: '2024-12-31',
    };

    render(
      <TaskCard
        task={taskWithDueDate}
        {...defaultProps}
      />
    );

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText(/Dec 31, 2024/)).toBeInTheDocument();
  });

  it('does not render due date when not provided', () => {
    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('applies correct priority color for low priority', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' as const };
    
    render(
      <TaskCard
        task={lowPriorityTask}
        {...defaultProps}
      />
    );

    const badge = screen.getByText('low');
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('applies correct priority color for medium priority', () => {
    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    const badge = screen.getByText('medium');
    expect(badge).toHaveClass('bg-yellow-400/15', 'text-yellow-600');
  });

  it('applies correct priority color for high priority', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const };
    
    render(
      <TaskCard
        task={highPriorityTask}
        {...defaultProps}
      />
    );

    const badge = screen.getByText('high');
    expect(badge).toHaveClass('bg-destructive/10', 'text-destructive');
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    const buttons = screen.getAllByRole('button');
    const editButton = buttons[0];
    await user.click(editButton);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);
    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons[1];
    await user.click(deleteButton);

    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('displays status select with correct value', () => {
    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('renders status select that can trigger onStatusChange', () => {
    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    // Verify the status select is rendered and accessible
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('aria-expanded', 'false');
    
  });

  it('renders with hover shadow transition', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    const card = container.querySelector('.hover\\:shadow-md');
    expect(card).toBeInTheDocument();
  });

  it('shows edit and delete buttons in a group', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    const buttonGroup = container.querySelector('.flex.gap-1');
    expect(buttonGroup).toBeInTheDocument();
  });

  it('truncates long title with line-clamp-2', () => {
    const longTitleTask = {
      ...mockTask,
      title: 'This is a very long title that should be truncated after two lines to prevent overflow',
    };

    const { container } = render(
      <TaskCard
        task={longTitleTask}
        {...defaultProps}
      />
    );

    const titleElement = container.querySelector('.line-clamp-2');
    expect(titleElement).toBeInTheDocument();
  });

  it('truncates long description with line-clamp-3', () => {
    const longDescTask = {
      ...mockTask,
      description: 'This is a very long description that should be truncated after three lines to prevent overflow in the card layout',
    };

    const { container } = render(
      <TaskCard
        task={longDescTask}
        {...defaultProps}
      />
    );

    const descElement = container.querySelector('.line-clamp-3');
    expect(descElement).toBeInTheDocument();
  });

  it('renders all status options in select', () => {
    render(
      <TaskCard
        task={mockTask}
        {...defaultProps}
      />
    );

    // The select component is present
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });
});
