import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../services/wishlistService';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    return await wishlistService.getWishlist();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const toggleWishlistItem = createAsyncThunk('wishlist/toggleWishlistItem', async (productId, { rejectWithValue, dispatch }) => {
  try {
    await wishlistService.toggleWishlistItem(productId);
    dispatch(fetchWishlist()); // Refresh the list after toggling
    return productId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update wishlist');
  }
});

export const clearWishlist = createAsyncThunk('wishlist/clearWishlist', async (_, { rejectWithValue, dispatch }) => {
  try {
    await wishlistService.clearWishlist();
    dispatch(fetchWishlist());
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (state, productId) => state.wishlist.items.some(item => item.productId === productId);

export default wishlistSlice.reducer;
