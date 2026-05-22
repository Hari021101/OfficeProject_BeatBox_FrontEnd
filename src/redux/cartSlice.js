import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { cartService } from '../services/cartService';
import { toast } from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return await cartService.getCart();
});

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, { dispatch }) => {
  // payload: { id, quantity, name, price, imageKey, selectedColor, category }
  // Backend only expects productId and quantity
  await cartService.addToCart(payload.id, payload.quantity || 1);
  dispatch(fetchCart());
  return payload;
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async (payload, { dispatch }) => {
  // payload: { cartItemId, quantity }
  await cartService.updateQuantity(payload.cartItemId, payload.quantity);
  dispatch(fetchCart());
  return payload;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (cartItemId, { dispatch }) => {
  await cartService.removeFromCart(cartItemId);
  dispatch(fetchCart());
  return cartItemId;
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { dispatch }) => {
  await cartService.clearCart();
  dispatch(fetchCart());
});

const initialState = {
  items: [],
  cartId: null,
  totalAmount: 0,
  status: 'idle',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload?.items || [];
        state.cartId = action.payload?.cartId;
        state.totalAmount = action.payload?.totalAmount || 0;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // UI feedback already handled by components, or we could toast here
      });
  },
});

// Selectors
export const selectCartItems = createSelector(
  [(state) => state.cart.items, (state) => state.products.items],
  (cartItems, productsItems) => {
    return cartItems.map(cartItem => {
      const product = productsItems?.find(p => p.id === cartItem.productId);
      return {
        cartKey: cartItem.cartItemId,
        id: cartItem.productId,
        name: cartItem.productName || (product ? product.name : 'Unknown Product'),
        price: cartItem.unitPrice,
        quantity: cartItem.quantity,
        imageKey: product ? product.imageKey : 'heroHeadphones',
        selectedColor: null, // Backend doesn't support colors yet
        selectedColorCode: null
      };
    });
  }
);

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export const selectCartStatus = (state) => state.cart.status;

export default cartSlice.reducer;
