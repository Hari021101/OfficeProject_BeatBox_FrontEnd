import api from './authService';
import { IMAGE_MAP, PRODUCTS as MOCK_PRODUCTS } from '../data/products';

// ─── Derive a local image-key from the backend imageUrl string + product name ─
const mapImageKey = (url = '', name = '') => {
  const text = `${url} ${name}`.toLowerCase();
  if (text.includes('earbud') || text.includes('airdopes') || text.includes('tws') || text.includes('earphone')) return 'heroEarbuds';
  if (text.includes('speaker') || text.includes('stone') || text.includes('grenade') || text.includes('capsule sound')) return 'heroSpeaker';
  if (text.includes('gaming') || text.includes('immortal') || text.includes('headset')) return 'gamingHeadset';
  if (text.includes('neckband') || text.includes('collar') || text.includes('trip') || text.includes('rockerz club')) return 'wirelessNeckband';
  if (text.includes('smart') || text.includes('capsule') || text.includes('storm')) return 'smartEarbuds';
  return 'heroHeadphones';
};

// ─── Resolve the actual image src: prefer backend URL, fall back to local asset ─
const resolveImage = (imageUrl, imageKey) => {
  if (imageUrl && imageUrl !== 'string' && (imageUrl.startsWith('http') || imageUrl.startsWith('data:'))) return imageUrl;
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

    category: bp.categoryName?.toLowerCase() || 'headphones',
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
      imageKey
    ),

    images: bp.images ?? [],

    color: bp.color || 'Black',

    batteryLife: bp.batteryLife || '',

    connectivity: bp.connectivity || '',

   // ===================================
// COLOR SUPPORT
// ===================================

colors:
  bp.images?.length > 0
    ? bp.images.map(img => ({
        name: img.colorName,
        code: img.colorCode,
        imageUrl: img.imageUrl
      }))
    : [
        {
          name: bp.color || 'Black',
          code: '#111111',
          imageUrl: bp.imageUrl
        }
      ],

variants:
  bp.images?.length > 0
    ? bp.images.map(img => ({
        colorName: img.colorName,
        colorCode: img.colorCode,
        imageUrl: img.imageUrl
      }))
    : [
        {
          colorName: bp.color || 'Black',
          colorCode: '#111111',
          imageUrl: bp.imageUrl
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
      const mockExtras = MOCK_PRODUCTS.filter(p => p.category === 'powerbank' || p.category === 'trimmer');
      return [...apiProducts, ...mockExtras];
    } catch (err) {
      console.warn("Failed to fetch products from API, falling back to mock data", err);
      return MOCK_PRODUCTS;
    }
  },

  getProductById: async (id) => {
    const mockProd = MOCK_PRODUCTS.find(p => p.id === Number(id));
    if (mockProd && (mockProd.category === 'powerbank' || mockProd.category === 'trimmer')) {
      return mockProd;
    }
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
    await api.put(`/product/${id}`, productData);
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

  addReview: async (productId, reviewData) => {
    const response = await api.post(`/product/${productId}/reviews`, reviewData);
    return response.data;
  },
};
