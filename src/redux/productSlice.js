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
        const mapImageKey = (url = '', name = '') => {
          const text = `${url} ${name}`.toLowerCase();
          if (text.includes('earbud') || text.includes('airdopes') || text.includes('tws') || text.includes('earphone')) return 'heroEarbuds';
          if (text.includes('speaker') || text.includes('stone') || text.includes('grenade') || text.includes('capsule sound')) return 'heroSpeaker';
          if (text.includes('gaming') || text.includes('immortal') || text.includes('headset')) return 'gamingHeadset';
          if (text.includes('neckband') || text.includes('collar') || text.includes('trip') || text.includes('rockerz club')) return 'wirelessNeckband';
          if (text.includes('smart') || text.includes('capsule') || text.includes('storm')) return 'smartEarbuds';
          return 'heroHeadphones';
        };

        // Map backend DTO to match the UI's expected structure
        state.items = action.payload.map(bp => {
          // Bypass mapping if it's already a fully-formed mock product
          if (bp.colors && Array.isArray(bp.colors)) {
            return bp;
          }

          return {
            id: bp.id,
            slug: bp.name?.toLowerCase().replace(/ /g, '-') || 'product',
            name: bp.name,
            brand: bp.brand || 'BeatBox',
            category: bp.categoryName?.toLowerCase() || bp.category || 'headphones',
            // bp.price = original/MRP; bp.discountPrice = sale price
            price: bp.discountPrice ?? bp.price,          // sale price shown on card
            oldPrice: bp.price ?? bp.oldPrice,                            // strikethrough price
            discount: bp.discountPrice
              ? Math.round(((bp.price - bp.discountPrice) / bp.price) * 100)
              : 0,
            rating: bp.averageRating ?? bp.rating ?? 4.5,
            reviewCount: bp.reviewCount ?? 0,
            tag: bp.isFeatured ? 'Featured' : 'Popular',
            usp: bp.batteryLife ? `${bp.batteryLife} Battery` : 'Signature Sound',
            imageKey: bp.imageKey || mapImageKey(bp.imageUrl, bp.name),
            imageUrl: bp.imageUrl,
            badge: bp.badge || 'Original',
            inStock: bp.inStock !== undefined ? bp.inStock : ((bp.stockQuantity || 0) > 0),
            stockQuantity: bp.stockQuantity || 0,
            colors: bp.colors || [{ name: bp.color || 'Black', code: '#0a0a0a' }],
            specs: {

            'Battery Life': bp.batteryLife || '40 Hours Playback',
            'Connectivity': bp.connectivity || 'Bluetooth v5.3',
            'Charging Tech': 'ASAP™ Fast Charge (10 mins = 10 Hours)',
            'Driver Size': '10mm Bass Drivers',
            'Water Resistance': 'IPX5 Sweat & Splash Proof',
            'Low Latency': '40ms BEAST™ Mode',
            'Microphone': 'Dual Mic with ENx™ Technology',
            'Charging Port': 'Type-C',
            'Warranty': '1 Year Standard Warranty'
          },
          description: bp.description || 'Elevate your music experience with an impressive 40 hours of uninterrupted playback, and never miss a beat with our lightning-fast ASAP™ Charge feature. Seamlessly switch between devices with our advanced Dual Pairing feature, and enjoy crystal-clear calls with ENx™ Technology.',
          highlights: ['Premium build quality', 'Signature bass tuning', '1 year warranty'],
          features: [
            {
              id: 'battery',
              title: '40 HRS of Musical Escape',
              description: 'Your playlists can now go on and on. With our ASAP™ charge, you can get 10 hours of playback in just 10 minutes.',
              gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              iconName: 'Battery'
            },
            {
              id: 'pairing',
              title: 'Seamless Device Transition',
              description: 'Experience uninterrupted connectivity with advanced Dual Pairing feature with Bluetooth v5.3 which allows you to effortlessly switch between your smartphone and tablet.',
              gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
              iconName: 'Smartphone'
            },
            {
              id: 'calls',
              title: 'Crystal-Clear Conversations',
              description: 'Engage in confident and distraction-free conversations with ENx™ Technology. Whether it\'s professional calls or catching up with friends, your voice is heard perfectly.',
              gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              iconName: 'Mic'
            },
            {
              id: 'gaming',
              title: 'Gaming Thrill Unleashed',
              description: 'Step into the gaming arena with BEAST™ Mode, engineered to minimize latency to an impressive 40ms. Enjoy smooth responsiveness for an enhanced gaming experience.',
              gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
              iconName: 'Gamepad2'
            }
          ],
          faqs: [
            { question: 'How long does it last on a single charge?', answer: 'It offers up to 40 hours of continuous playback on a single charge at 60% volume.' },
            { question: 'Does it support Fast Charging?', answer: 'Yes! With ASAP™ Charge technology, just 10 minutes of charging gives you 10 hours of playtime.' },
            { question: 'Is it water/sweat resistant?', answer: 'Yes, it comes with an IPX5 rating, making it completely sweat and splash resistant—perfect for intense workouts.' },
            { question: 'Can I connect it to two devices simultaneously?', answer: 'Absolutely. The Dual Pairing feature allows you to connect it to your laptop and phone at the same time and switch seamlessly.' },
            { question: 'What is the warranty period?', answer: 'It comes with a 1-year standard warranty against manufacturing defects.' }
          ],
          reviews: [],
        };
        });
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
