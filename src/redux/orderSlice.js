import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { orderService } from '../services/orderService';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getMyOrders();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      await orderService.cancelOrder(id);
      return id; // Return the cancelled order ID
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  orders: [],
  currentOrder: null,
  status: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
  detailStatus: 'idle',  // separate status for single order fetch
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.detailStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload || [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.detailStatus = 'loading';
        state.currentOrder = null;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })
      // cancelOrderThunk
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const cancelledId = action.payload;
        // Update current order if it's the one being cancelled
        if (state.currentOrder && state.currentOrder.orderId === cancelledId) {
          state.currentOrder.status = 'Cancelled';
        }
        // Update in the orders list
        const orderIndex = state.orders.findIndex(o => o.orderId === cancelledId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = 'Cancelled';
        }
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllOrders = (state) => state.orders.orders;
export const selectOrderStatus = (state) => state.orders.status;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderDetailStatus = (state) => state.orders.detailStatus;
export const selectOrderError = (state) => state.orders.error;

// Memoized: orders filtered by status tab
export const selectFilteredOrders = createSelector(
  [selectAllOrders, (_, filter) => filter],
  (orders, filter) => {
    if (!filter || filter === 'All') return orders;
    return orders.filter((o) => o.status === filter);
  }
);

export default orderSlice.reducer;
