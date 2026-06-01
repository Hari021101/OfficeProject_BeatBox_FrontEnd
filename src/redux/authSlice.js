import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Thunk for User Registration — returns { userId, email, message } (no JWT yet)
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password, phoneNumber }, thunkAPI) => {
    try {
      return await authService.register(fullName, email, password, phoneNumber);
    } catch (error) {
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
  // OTP verification flow
  pendingUserId: null,      // set after register, used to call OTP endpoints
  pendingEmail: null,
  pendingPhone: null,
  otpStep: null,            // null | 'email' | 'phone' | 'done'
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
    setOtpStep: (state, action) => {
      state.otpStep = action.payload;
    },
    clearOtpState: (state) => {
      state.pendingUserId = null;
      state.pendingEmail = null;
      state.pendingPhone = null;
      state.otpStep = null;
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.pendingUserId = null;
      state.pendingEmail = null;
      state.pendingPhone = null;
      state.otpStep = null;
    },
    // Called from Register.jsx after phone OTP verified and JWT received
    setAuthFromOtp: (state, action) => {
      const { fullName, email, token } = action.payload;
      authService.login.__skipApi = true; // flag (unused, JWT stored manually below)
      localStorage.setItem('bb_token', token);
      localStorage.setItem('bb_user', JSON.stringify({ fullName, email }));
      state.user = { fullName, email };
      state.token = token;
      state.isAuthenticated = true;
      state.otpStep = 'done';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Actions — succeeds when user is created (OTP step begins)
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pendingUserId = action.payload.userId;
        state.pendingEmail = action.payload.email;
        state.otpStep = 'email'; // move to email OTP step
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

export const { resetState, logout, setOtpStep, clearOtpState, setAuthFromOtp } = authSlice.actions;
export default authSlice.reducer;
