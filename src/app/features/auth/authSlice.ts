import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { authAPI } from '../../services/authAPI';
import type { User, AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load auth state from localStorage
const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      return {
        token,
        user: JSON.parse(userStr),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return {};
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    ...loadAuthFromStorage(),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tasks');
    },
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Handle login success from RTK Query
    builder.addMatcher(
      authAPI.endpoints.login.matchFulfilled,
      (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
    );
  },
});

export const { logout, setCredentials } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
