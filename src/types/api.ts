import type { Task } from './task';

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

export interface TaskResponse {
  success: boolean;
  task: Task;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export type CreateTaskRequest = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

