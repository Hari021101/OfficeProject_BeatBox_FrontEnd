import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import profileReducer from './profileSlice';
import wishlistReducer from './wishlistSlice';
import recentlyViewedReducer from './recentlyViewedSlice';
import compareReducer from './compareSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    profile: profileReducer,
    wishlist: wishlistReducer,
    recentlyViewed: recentlyViewedReducer,
    compare: compareReducer,
  },
});
