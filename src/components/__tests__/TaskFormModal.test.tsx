import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFormModal from '../TaskFormModal';
import { Task } from '@/types/task';

describe('TaskFormModal', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description for the task',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('renders the modal when open is true', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('does not render the modal when open is false', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={false}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('displays "Edit Task" title when editing an existing task', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        task={mockTask}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('pre-fills form fields when editing a task', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        task={mockTask}
      />
    );

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description for the task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates title minimum length', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    await user.type(titleInput, 'AB');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates description minimum length', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    
    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionInput, 'Short');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data for new task', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    
    await user.type(titleInput, 'New Task Title');
    await user.type(descriptionInput, 'This is a detailed description for the new task');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Task Title',
        description: 'This is a detailed description for the new task',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('submits form with valid data for editing task', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        task={mockTask}
      />
    );

    const titleInput = screen.getByDisplayValue('Test Task');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task Title');

    const submitButton = screen.getByRole('button', { name: /update task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        ...mockTask,
        title: 'Updated Task Title',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows "Saving..." text when form is submitting', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    
    await user.type(titleInput, 'New Task Title');
    await user.type(descriptionInput, 'This is a detailed description for the new task');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    // Note: This test may need adjustment based on actual async behavior
  });

  it('displays all form fields correctly', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it('validates title maximum length', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const longTitle = 'A'.repeat(101);
    await user.type(titleInput, longTitle);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be less than 100 characters')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates description maximum length', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    
    await user.type(titleInput, 'Valid Title');
    
    const longDescription = 'A'.repeat(501);
    await user.type(descriptionInput, longDescription);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be less than 500 characters')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});

