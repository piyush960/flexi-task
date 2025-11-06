import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { tasksAPI } from '../../services/tasksAPI';
import type { Task } from '@/types/task';

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};

// Load tasks from localStorage
const loadTasksFromStorage = (): Task[] => {
  try {
    const tasksStr = localStorage.getItem('tasks');
    if (tasksStr) {
      return JSON.parse(tasksStr);
    }
  } catch (error) {
    console.error('Failed to load tasks from storage:', error);
  }
  return [];
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    ...initialState,
    tasks: loadTasksFromStorage(),
  },
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle getTasks query
    builder
      .addMatcher(
        tasksAPI.endpoints.getTasks.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        tasksAPI.endpoints.getTasks.matchFulfilled,
        (state, action) => {
          state.tasks = action.payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        tasksAPI.endpoints.getTasks.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to fetch tasks';
        }
      );

    // Handle createTask mutation
    builder
      .addMatcher(
        tasksAPI.endpoints.createTask.matchFulfilled,
        (state, action) => {
          state.tasks.push(action.payload);
        }
      );

    // Handle updateTask mutation
    builder
      .addMatcher(
        tasksAPI.endpoints.updateTask.matchFulfilled,
        (state, action) => {
          const index = state.tasks.findIndex(task => task.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        }
      );

    // Handle deleteTask mutation
    builder
      .addMatcher(
        tasksAPI.endpoints.deleteTask.matchFulfilled,
        (state, action) => {
          // The arg contains the task id that was deleted
          const taskId = action.meta.arg.originalArgs;
          state.tasks = state.tasks.filter(task => task.id !== taskId);
        }
      );
  },
});

export const { 
  setTasks, 
  addTask, 
  updateTask, 
  removeTask, 
  clearTasks,
  setLoading,
  setError 
} = taskSlice.actions;

// Selectors
export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectTasksError = (state: RootState) => state.tasks.error;

// Filtered selectors
export const selectTasksByStatus = (status: Task['status']) => (state: RootState) =>
  state.tasks.tasks.filter(task => task.status === status);

export const selectTasksByPriority = (priority: Task['priority']) => (state: RootState) =>
  state.tasks.tasks.filter(task => task.priority === priority);

export const selectTaskById = (taskId: string) => (state: RootState) =>
  state.tasks.tasks.find(task => task.id === taskId);

// Computed selectors
export const selectPendingTasks = (state: RootState) =>
  state.tasks.tasks.filter(task => task.status === 'pending');

export const selectInProgressTasks = (state: RootState) =>
  state.tasks.tasks.filter(task => task.status === 'in-progress');

export const selectCompletedTasks = (state: RootState) =>
  state.tasks.tasks.filter(task => task.status === 'completed');

export const selectTasksCount = (state: RootState) => state.tasks.tasks.length;

export default taskSlice.reducer;

