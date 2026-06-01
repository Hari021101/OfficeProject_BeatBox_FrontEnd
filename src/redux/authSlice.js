import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Helper to extract a clean string error message from ASP.NET Core responses
const extractErrorMessage = (error, defaultMsg) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.errors) {
      const messages = Object.values(data.errors).flat();
      if (messages.length > 0) return messages[0];
    }
    if (data.message) return data.message;
    if (data.title) return data.title;
  }
  return error.message || defaultMsg;
};

// Thunk for User Registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ fullName, identifier, password }, thunkAPI) => {
    try {
      return await authService.register(fullName, identifier, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error, 'Registration failed.'));
    }
  }
);

// Thunk for User Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ identifier, password }, thunkAPI) => {
    try {
      return await authService.login(identifier, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error, 'Invalid credentials.'));
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
        // set pendingEmail or pendingPhone based on what they registered with
        if (action.payload.identifierType === 'email') {
           state.pendingEmail = action.payload.identifier;
           state.otpStep = 'email';
        } else {
           state.pendingPhone = action.payload.identifier;
           state.otpStep = 'phone';
        }
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
