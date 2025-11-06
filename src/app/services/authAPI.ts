import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, LoginRequest, LoginResponse } from '@/types';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      // Handle response and store token/user in localStorage
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authAPI;

