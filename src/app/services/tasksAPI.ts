import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task, TasksResponse, TaskResponse, DeleteResponse, CreateTaskRequest } from '@/types';

export const tasksAPI = createApi({
  reducerPath: 'tasksAPI',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    
    // GET /tasks - Fetch all tasks
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      transformResponse: (response: TasksResponse) => response.tasks,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    // POST /tasks - Create a new task
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      transformResponse: (response: TaskResponse) => response.task,
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    // PUT /tasks/:id - Update a task
    updateTask: builder.mutation<Task, Task>({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
      transformResponse: (response: TaskResponse) => response.task,
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    // DELETE /tasks/:id - Delete a task
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksAPI;

