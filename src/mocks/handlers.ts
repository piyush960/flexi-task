import { http, HttpResponse } from 'msw';
import type { Task, TaskStatus, TaskPriority } from '@/types';
import { withAuth } from './middleware';

// Mock user data
const MOCK_USER = {
  username: 'test',
  password: 'test123',
};

// Mock tasks storage (using Task type from shared types)
type MockTask = Task;

// LocalStorage key for persisting tasks
const TASKS_STORAGE_KEY = 'msw_mock_tasks';

// Load tasks from localStorage
const loadTasks = (): MockTask[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
};

// Save tasks to localStorage
const saveTasks = (tasks: MockTask[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

// Initialize tasks from localStorage
let mockTasks: MockTask[] = loadTasks();

export const handlers = [
  // POST /login - Simulate user login
  http.post('/api/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string };

    if (body.username === MOCK_USER.username && body.password === MOCK_USER.password) {
      const token = 'mock-jwt-token-' + Date.now();
      return HttpResponse.json({
        success: true,
        token,
        user: {
          id: '1',
          username: body.username,
          name: 'Test User',
        },
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // GET /tasks - Fetch all tasks
  http.get('/api/tasks', withAuth(() => {
    return HttpResponse.json({
      success: true,
      tasks: mockTasks,
    });
  })),

  // POST /tasks - Create a new task
  http.post('/api/tasks', withAuth(async ({ request }) => {
   
    const body = await request.json() as {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate?: string;
    };
    
    const newTask: MockTask = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockTasks.push(newTask);
    saveTasks(mockTasks);
    
    return HttpResponse.json({
      success: true,
      task: newTask,
    });
  })),

  // PUT /tasks/:id - Update a task
  http.put('/api/tasks/:id', withAuth(async ({ request, params }) => {
    const { id } = params;
    const body = await request.json() as {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate?: string;
    };
    
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }
    
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    saveTasks(mockTasks);
    
    return HttpResponse.json({
      success: true,
      task: mockTasks[taskIndex],
    });
  })),

  // DELETE /tasks/:id - Delete a task
  http.delete('/api/tasks/:id', withAuth(({ request, params }) => {
    const { id } = params;
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }
    
    mockTasks.splice(taskIndex, 1);
    saveTasks(mockTasks);
    
    return HttpResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  })),
];

// Optional: Export a function to reset tasks to default (useful for development/testing)
export const resetTasksToDefault = () => {
  mockTasks = [];
  saveTasks(mockTasks);
};

// Optional: Export a function to clear all tasks
export const clearAllTasks = () => {
  mockTasks = [];
  saveTasks(mockTasks);
};

