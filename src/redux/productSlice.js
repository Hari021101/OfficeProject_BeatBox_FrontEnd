import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../services/productService';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  return await productService.getAllProducts();
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const mapImageKey = (url) => {
          if (!url || url === 'string') return 'heroHeadphones';
          const lower = url.toLowerCase();
          if (lower.includes('earbud')) return 'heroEarbuds';
          if (lower.includes('speaker')) return 'heroSpeaker';
          if (lower.includes('gaming')) return 'gamingHeadset';
          if (lower.includes('neckband')) return 'wirelessNeckband';
          return 'heroHeadphones';
        };

        // Map backend DTO to match the UI's expected structure
        state.items = action.payload.map(bp => ({
          id: bp.id,
          slug: bp.name?.toLowerCase().replace(/ /g, '-') || 'product',
          name: bp.name,
          brand: bp.brand || 'BeatBox',
          category: bp.categoryName?.toLowerCase() || 'headphones',
          price: bp.price,
          oldPrice: bp.discountPrice ? bp.price : bp.price * 1.4, // Fallback mock
          discount: bp.discountPrice ? Math.round(((bp.price - bp.discountPrice) / bp.price) * 100) : 30,
          rating: bp.rating || 4.5,
          reviewCount: Math.floor(Math.random() * 500) + 50,
          tag: bp.isFeatured ? 'Featured' : 'Popular',
          usp: bp.batteryLife ? `${bp.batteryLife} Battery` : 'Signature Sound',
          imageKey: mapImageKey(bp.imageUrl),
          badge: 'Original',
          inStock: bp.stockQuantity > 0,
          colors: [{ name: bp.color || 'Black', code: '#0a0a0a' }],
          specs: {
            'Battery': bp.batteryLife || 'N/A',
            'Connectivity': bp.connectivity || 'N/A',
          },
          description: bp.description || 'Premium BeatBox audio gear.',
          highlights: ['Premium build quality', 'Signature bass tuning', '1 year warranty'],
          reviews: [],
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllProducts = (state) => state.products.items;
export const selectProductStatus = (state) => state.products.status;
export const selectProductById = (state, productId) => 
  state.products.items.find(product => product.id === productId);

export default productSlice.reducer;
