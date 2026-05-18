import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Thunk for User Registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password }, thunkAPI) => {
    try {
      return await authService.register(fullName, email, password);
    } catch (error) {
      // Handles ASP.NET validation error payloads or plain string messages
      const message = 
        (error.response && error.response.data) || 
        error.message || 
        'Registration failed.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for User Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      return await authService.login(email, password);
    } catch (error) {
      const message = 
        (error.response && error.response.data) || 
        error.message || 
        'Invalid email or password.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const user = authService.getCurrentUser();
const token = authService.getToken();

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Register Actions
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Login Actions
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = {
          fullName: action.payload.fullName,
          email: action.payload.email,
        };
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.message = action.payload;
      });
  }
});

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;
