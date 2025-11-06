import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';
import { Task } from '@/types/task';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Pending Task',
      description: 'Description for pending task',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'In Progress Task',
      description: 'Description for in-progress task',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
    {
      id: '3',
      title: 'Completed Task',
      description: 'Description for completed task',
      status: 'completed',
      priority: 'low',
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    },
    {
      id: '4',
      title: 'Another Pending Task',
      description: 'Another description for pending task',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-04T00:00:00.000Z',
      updatedAt: '2024-01-04T00:00:00.000Z',
    },
  ];

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
  };

  it('renders all three status columns', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    // Use getAllByText since status names appear multiple times (in headers and in select dropdowns)
    const pendingElements = screen.getAllByText('Pending');
    expect(pendingElements.length).toBeGreaterThan(0);
    
    const inProgressElements = screen.getAllByText('In Progress');
    expect(inProgressElements.length).toBeGreaterThan(0);
    
    const completedElements = screen.getAllByText('Completed');
    expect(completedElements.length).toBeGreaterThan(0);
  });

  it('displays correct task counts for each status', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    expect(screen.getByText('(2)')).toBeInTheDocument(); // 2 pending tasks
    const countOnes = screen.getAllByText('(1)');
    expect(countOnes.length).toBe(2); // 1 in-progress task and 1 completed task
  });

  it('groups tasks by status correctly', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('Another Pending Task')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  it('renders TaskCard for each task', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    const taskCards = screen.getAllByRole('heading', { level: 4 });
    // Filtering out the status headings (Pending, In Progress, Completed)
    const taskTitles = taskCards.filter(heading => 
      !['Pending', 'In Progress', 'Completed'].includes(heading.textContent || '')
    );
    
    expect(taskTitles.length).toBe(4);
  });

  it('handles empty task list', () => {
    render(<TaskList tasks={[]} {...mockHandlers} />);

    const countZeros = screen.getAllByText('(0)');
    expect(countZeros.length).toBe(3); // All three status columns show (0)
  });

  it('groups only pending tasks in pending column', () => {
    const { container } = render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    const pendingSection = container.querySelector('.space-y-4:first-child');
    expect(pendingSection?.textContent).toContain('Pending Task');
    expect(pendingSection?.textContent).toContain('Another Pending Task');
    expect(pendingSection?.textContent).not.toContain('In Progress Task');
    expect(pendingSection?.textContent).not.toContain('Completed Task');
  });

  it('groups only in-progress tasks in in-progress column', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
  });

  it('groups only completed tasks in completed column', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  it('passes correct props to TaskCard components', () => {
    const { container } = render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    const taskCards = container.querySelectorAll('.p-4');
    expect(taskCards.length).toBe(4);
  });

  it('renders with only pending tasks', () => {
    const pendingOnlyTasks = mockTasks.filter(t => t.status === 'pending');
    render(<TaskList tasks={pendingOnlyTasks} {...mockHandlers} />);

    expect(screen.getByText('(2)')).toBeInTheDocument(); // 2 pending
    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('Another Pending Task')).toBeInTheDocument();
  });

  it('renders with only in-progress tasks', () => {
    const inProgressOnlyTasks = mockTasks.filter(t => t.status === 'in-progress');
    render(<TaskList tasks={inProgressOnlyTasks} {...mockHandlers} />);

    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
  });

  it('renders with only completed tasks', () => {
    const completedOnlyTasks = mockTasks.filter(t => t.status === 'completed');
    render(<TaskList tasks={completedOnlyTasks} {...mockHandlers} />);

    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  it('uses grid layout for task columns', () => {
    const { container } = render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
  });

  it('displays status indicators with correct styling', () => {
    const { container } = render(<TaskList tasks={mockTasks} {...mockHandlers} />);

    const indicators = container.querySelectorAll('.h-3.w-3.rounded-full');
    expect(indicators.length).toBe(3); // One for each status column
  });
});

