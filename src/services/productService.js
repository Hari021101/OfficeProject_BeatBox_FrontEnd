import api from './authService';
import { IMAGE_MAP } from '../data/products';

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
  if (imageUrl && imageUrl !== 'string' && imageUrl.startsWith('http')) return imageUrl;
  return IMAGE_MAP[imageKey] || IMAGE_MAP['heroHeadphones'];
};

// ─── Transform raw API product into the shape the UI expects ──────────────────
const mapProduct = (bp) => {
  const originalPrice = bp.price ?? 0;
  const salePrice = bp.discountPrice ?? originalPrice;
  const discount = originalPrice > 0 && salePrice < originalPrice
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return {
    // Core identity
    id: bp.id,
    slug: bp.name?.toLowerCase().replace(/ /g, '-') || 'product',
    name: bp.name,
    brand: bp.brand || 'BeatBox',
    description: bp.description || '',

    // Category
    category: bp.categoryName?.toLowerCase() || 'headphones',
    categoryName: bp.categoryName || '',

    // Pricing — price = original/MRP, discountPrice = sale price
    price: originalPrice,
    discountPrice: salePrice,
    oldPrice: originalPrice,       // alias used by some components
    discount,

    // Stock
    stockQuantity: bp.stockQuantity ?? 0,
    inStock: (bp.stockQuantity ?? 0) > 0,

    // Ratings & Reviews
    rating: bp.averageRating ?? bp.rating ?? 4.5,
    averageRating: bp.averageRating ?? bp.rating ?? 4.5,
    reviewCount: bp.reviewCount ?? 0,
    reviews: bp.reviews ?? [],

    // Misc display
    tag: bp.isFeatured ? 'Featured' : 'Popular',
    usp: bp.batteryLife ? `${bp.batteryLife} Battery` : 'Signature Sound',
    badge: 'Original',
    isFeatured: bp.isFeatured ?? false,
    soldCount: bp.soldCount ?? 0,
    deliveryDays: bp.deliveryDays ?? 5,

    // Image
    imageKey: mapImageKey(bp.imageUrl, bp.name),
    imageUrl: resolveImage(bp.imageUrl, mapImageKey(bp.imageUrl, bp.name)),
    images: bp.images ?? [],

    // Product attributes
    color: bp.color || 'Black',
    batteryLife: bp.batteryLife || '',
    connectivity: bp.connectivity || '',

    // Variants — derived from single color until backend supports variants
    variants: bp.variants ?? [
      {
        colorName: bp.color || 'Black',
        colorCode: '#0a0a0a',
        imageUrl: bp.imageUrl || '',
      },
    ],

    // Specs — merge real API fields with sensible defaults
    specs: bp.specs ?? {
      'Brand': bp.brand || 'BeatBox',
      'Battery Life': bp.batteryLife || '40 Hours Playback',
      'Connectivity': bp.connectivity || 'Bluetooth v5.3',
      'Color': bp.color || 'Black',
      'Category': bp.categoryName || '',
      'Charging Tech': 'ASAP™ Fast Charge (10 mins = 10 Hours)',
      'Driver Size': '10mm Bass Drivers',
      'Water Resistance': 'IPX5 Sweat & Splash Proof',
      'Low Latency': '40ms BEAST™ Mode',
      'Microphone': 'Dual Mic with ENx™ Technology',
      'Charging Port': 'Type-C',
      'Warranty': '1 Year Standard Warranty',
      'In Stock': bp.stockQuantity ?? 0,
    },

    // Marketing feature cards
    features: bp.features ?? [
      {
        id: 'battery',
        title: '40 HRS of Musical Escape',
        description: 'Your playlists can now go on and on. With our ASAP™ charge, you can get 10 hours of playback in just 10 minutes.',
        gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        iconName: 'Battery',
      },
      {
        id: 'pairing',
        title: 'Seamless Device Transition',
        description: 'Experience uninterrupted connectivity with Dual Pairing via Bluetooth v5.3, seamlessly switching between your smartphone and tablet.',
        gradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
        iconName: 'Smartphone',
      },
      {
        id: 'calls',
        title: 'Crystal-Clear Conversations',
        description: 'Engage in confident and distraction-free conversations with ENx™ Technology. Your voice is heard perfectly.',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        iconName: 'Mic',
      },
      {
        id: 'gaming',
        title: 'Gaming Thrill Unleashed',
        description: 'Step into the gaming arena with BEAST™ Mode, engineered to minimize latency to an impressive 40ms.',
        gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
        iconName: 'Gamepad2',
      },
    ],

    // FAQs — backend returns { question, answer }; use as-is
    faqs: (bp.faqs ?? []).length > 0
      ? bp.faqs
      : [
          { question: 'How long does it last on a single charge?', answer: 'It offers up to 40 hours of continuous playback at 60% volume.' },
          { question: 'Does it support Fast Charging?', answer: 'Yes! With ASAP™ Charge, just 10 minutes of charging gives you 10 hours of playtime.' },
          { question: 'Is it water/sweat resistant?', answer: 'Yes, IPX5 rating — completely sweat and splash resistant.' },
          { question: 'Can I connect to two devices simultaneously?', answer: 'Yes. Dual Pairing lets you connect to your phone and laptop at the same time.' },
          { question: 'What is the warranty period?', answer: '1 year standard warranty against manufacturing defects.' },
        ],

    // Highlights
    highlights: bp.highlights ?? ['Premium build quality', 'Signature bass tuning', '1 year warranty'],
  };
};

// ─── Service ──────────────────────────────────────────────────────────────────
export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/product');
    return response.data.map(mapProduct);
  },

  getProductById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return mapProduct(response.data);
  },

  addReview: async (productId, reviewData) => {
    const response = await api.post(`/product/${productId}/reviews`, reviewData);
    return response.data;
  },
};
