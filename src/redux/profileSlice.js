import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../services/profileService';
import { addressService } from '../services/addressService';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    return await profileService.getProfile();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (data, { rejectWithValue }) => {
  try {
    await profileService.updateProfile(data);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

export const changePassword = createAsyncThunk('profile/changePassword', async (data, { rejectWithValue }) => {
  try {
    return await profileService.changePassword(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to change password');
  }
});

export const fetchAddresses = createAsyncThunk('profile/fetchAddresses', async (_, { rejectWithValue }) => {
  try {
    return await addressService.getAddresses();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch addresses');
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
        }
      })
      // Fetch Addresses
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  }
});

export default profileSlice.reducer;
