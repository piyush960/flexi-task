import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/auth/authSlice";
import tasksReducer from "./features/tasks/taskSlice";
import { authAPI } from "./services/authAPI";
import { tasksAPI } from "./services/tasksAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [tasksAPI.reducerPath]: tasksAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(tasksAPI.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;