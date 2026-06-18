import api from './authService';
import { IMAGE_MAP, PRODUCTS as MOCK_PRODUCTS } from '../data/products';

// ─── Derive a local image-key from the backend imageUrl string + product name ─
const mapImageKey = (url = '', name = '') => {
  const text = `${url} ${name}`.toLowerCase();
  
  // Specific overrides for unique generated images
  if (text.includes('party boom 1500')) return 'partyBoom1500';
  if (text.includes('party lite wireless')) return 'partyLiteWireless';
  if (text.includes('party blast tower')) return 'partyBlastTower';
  
  if (text.includes('soundbar mini 2.1')) return 'soundbarMini21';
  if (text.includes('soundbar elite s9')) return 'soundbarEliteS9';
  if (text.includes('cinema pro')) return 'cinemaProSoundbar';
  if (text.includes('gaming soundbar x')) return 'gamingSoundbarX';
  if (text.includes('soundbar pro 5.1')) return 'soundbarPro51';
  if (text.includes('soundbar 2.1')) return 'soundbar21';

  // General fallbacks
  if (text.includes('earbud') || text.includes('airdopes') || text.includes('tws') || text.includes('earphone')) return 'heroEarbuds';
  if (text.includes('speaker') || text.includes('stone') || text.includes('grenade') || text.includes('capsule sound')) return 'heroSpeaker';
  if (text.includes('gaming') || text.includes('immortal') || text.includes('headset')) return 'gamingHeadset';
  if (text.includes('neckband') || text.includes('collar') || text.includes('trip') || text.includes('rockerz club')) return 'wirelessNeckband';
  if (text.includes('smart') || text.includes('capsule') || text.includes('storm')) return 'smartEarbuds';
  return 'heroHeadphones';
};

// ─── Resolve the actual image src: prefer backend URL, fall back to local asset ─
const resolveImage = (imageUrl, dbProductImageUrl, imageKey) => {
  if (imageUrl && imageUrl !== 'string') {
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/uploads/')) {
      const base = api.defaults.baseURL.replace('/api', '');
      return `${base}${imageUrl}`;
    }
  }
  if (dbProductImageUrl && dbProductImageUrl.startsWith('http')) {
    return dbProductImageUrl;
  }
  return IMAGE_MAP[imageKey] || IMAGE_MAP['heroHeadphones'];
};

// ─── Transform raw API product into the shape the UI expects ──────────────────
const mapProduct = (bp) => {
  const originalPrice = bp.price ?? 0;
  const salePrice = bp.discountPrice ?? originalPrice;

  const discount =
    originalPrice > salePrice
      ? Math.round(
          ((originalPrice - salePrice) / originalPrice) * 100
        )
      : 0;

  const imageKey = mapImageKey(bp.imageUrl, bp.name);

  return {
    id: bp.id,
    slug: bp.name?.toLowerCase().replace(/ /g, '-') || 'product',

    name: bp.name,
    brand: bp.brand || 'BeatBox',

    category: (() => {
      const cat = (bp.categoryName || 'headphones').toLowerCase();
      if (cat.includes('watch') || cat.includes('wearable')) return 'smartwatches';
      if (cat.includes('tws') || cat.includes('earbud')) return 'tws';
      if (cat.includes('neckband')) return 'neckbands';
      return cat;
    })(),
    categoryName: bp.categoryName || '',

    description: bp.description || '',

    // =========================
    // FIXED PRICE MAPPING
    // =========================

    price: salePrice,
    oldPrice: originalPrice,
    discountPrice: salePrice,
    discount,

    // =========================

    stockQuantity: bp.stockQuantity ?? 0,
    inStock: (bp.stockQuantity ?? 0) > 0,

    // =========================
    // FIXED RATING
    // =========================

    rating: Number(
      (bp.averageRating ?? bp.rating ?? 4.5).toFixed(1)
    ),

    averageRating: Number(
      (bp.averageRating ?? bp.rating ?? 4.5).toFixed(1)
    ),

    reviewCount: bp.reviewCount ?? 0,

    reviews: bp.reviews ?? [],

    // =========================

    tag: bp.isFeatured ? 'Featured' : 'Popular',

    usp: bp.batteryLife
      ? `${bp.batteryLife} Battery`
      : 'Signature Sound',

    badge: 'Original',

    isFeatured: bp.isFeatured ?? false,

    soldCount: bp.soldCount ?? 0,

    deliveryDays: bp.deliveryDays ?? 5,

    imageKey,

    imageUrl: resolveImage(
      bp.imageUrl,
      bp.imageUrl,
      imageKey
    ),

    images: bp.images ?? [],

    color: bp.color || 'Black',

    batteryLife: bp.batteryLife || '',

    connectivity: (() => {
      let conn = bp.connectivity;
      if (!conn || conn === 'N/A') {
        const text = `${bp.name} ${bp.categoryName}`.toLowerCase();
        if (text.includes('wired') || text.includes('cable') || text.includes('usb')) {
          return 'Wired';
        }
        return 'Wireless / Bluetooth';
      }
      return conn;
    })(),

   // ===================================
// COLOR SUPPORT
// ===================================

colors:
  bp.images?.length > 0
    ? bp.images.map(img => ({
        name: img.colorName,
        code: img.colorCode,
        imageUrl: resolveImage(img.imageUrl, bp.imageUrl, imageKey)
      }))
    : [
        {
          name: bp.color || 'Black',
          code: '#111111',
          imageUrl: resolveImage(bp.imageUrl, bp.imageUrl, imageKey)
        }
      ],

variants:
  bp.images?.length > 0
    ? bp.images.map(img => ({
        colorName: img.colorName,
        colorCode: img.colorCode,
        imageUrl: resolveImage(img.imageUrl, bp.imageUrl, imageKey)
      }))
    : [
        {
          colorName: bp.color || 'Black',
          colorCode: '#111111',
          imageUrl: resolveImage(bp.imageUrl, bp.imageUrl, imageKey)
        }
      ],

    specs: {
      Brand: bp.brand || 'BeatBox',
      'Battery Life':
        bp.batteryLife || '40 Hours Playback',
      Connectivity:
        bp.connectivity || 'Bluetooth v5.3',
      Color: bp.color || 'Black',
      Category: bp.categoryName || '',
      'Charging Tech':
        'ASAP™ Fast Charge (10 mins = 10 Hours)',
      'Driver Size': '10mm Bass Drivers',
      'Water Resistance':
        'IPX5 Sweat & Splash Proof',
      'Low Latency':
        '40ms BEAST™ Mode',
      Microphone:
        'Dual Mic with ENx™ Technology',
      'Charging Port': 'Type-C',
      Warranty:
        '1 Year Standard Warranty',
      'In Stock':
        bp.stockQuantity ?? 0
    },

    features:
      bp.features ?? [],

    faqs:
      bp.faqs?.length > 0
        ? bp.faqs
        : [],

    highlights:
      bp.highlights ??
      [
        'Premium build quality',
        'Signature bass tuning',
        '1 year warranty'
      ]
  };
};

// ─── Service ──────────────────────────────────────────────────────────────────
export const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/product');
      const apiProducts = response.data.map(mapProduct);
      const apiProductNames = new Set(apiProducts.map(p => p.name?.toLowerCase() || ''));
      const mockExtras = MOCK_PRODUCTS.filter(p => !apiProductNames.has(p.name?.toLowerCase() || ''));
      return [...apiProducts, ...mockExtras];
    } catch (err) {
      console.warn("Failed to fetch products from API, falling back to mock data", err);
      return MOCK_PRODUCTS;
    }
  },

  getProductById: async (id) => {
    const mockProd = MOCK_PRODUCTS.find(p => p.id === Number(id));
    try {
      const response = await api.get(`/product/${id}`);
      return mapProduct(response.data);
    } catch (err) {
      if (mockProd) return mockProd;
      throw err;
    }
  },

  // Admin Methods
  createProduct: async (productData) => {
    const response = await api.post('/product', productData);
    return mapProduct(response.data);
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/product/${id}`, productData);
    if (response.data && Object.keys(response.data).length > 0) {
      return mapProduct(response.data);
    }
    // Fallback just in case
    return mapProduct({ ...productData, id });
  },

  fetchCategories: async () => {
    const response = await api.get('/category');
    return response.data;
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/Product/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  bulkDeleteProducts: async (ids) => {
    try {
      await api.post('/Product/bulk-delete', ids);
      return true;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  },

  bulkUpdateFeatured: async (ids, isFeatured) => {
    try {
      await api.post('/Product/bulk-feature', { productIds: ids, isFeatured });
      return true;
    } catch (error) {
      console.error('Error bulk updating featured status:', error);
      throw error;
    }
  },

  addReview: async (productId, reviewData) => {
    const response = await api.post(`/product/${productId}/reviews`, reviewData);
    return response.data;
  },

  checkDelivery: async (pincode, productId) => {
    // This is the expected backend endpoint for Shiprocket integration
    // Example: GET /api/shipping/serviceability?delivery_postcode=614901&product_id=37
    const response = await api.get(`/shipping/serviceability`, {
      params: {
        delivery_postcode: pincode,
        product_id: productId
      }
    });
    return response.data;
  },

  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data; // { success: true, message: "...", data: "/uploads/products/..." }
  },
};
