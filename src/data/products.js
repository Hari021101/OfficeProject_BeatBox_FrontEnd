// BeatBox Mock Product Catalog
import heroHeadphones from '../assets/hero_headphones.png'
import heroEarbuds from '../assets/hero_earbuds.png'
import heroSpeaker from '../assets/hero_speaker.png'
import gamingHeadset from '../assets/gaming_headset.png'
import wirelessNeckband from '../assets/wireless_neckband.png'
import smartEarbuds from '../assets/smart_earbuds.png'
import powerBank from '../assets/power_bank.png'
import trimmer from '../assets/trimmer.png'

export const IMAGE_MAP = {
  heroHeadphones,
  heroEarbuds,
  heroSpeaker,
  gamingHeadset,
  wirelessNeckband,
  smartEarbuds,
  powerBank,
  trimmer,
}

export const CATEGORIES = [
  { id: 'all', label: 'All Products', emoji: '🔥' },
  { id: 'airpods', label: 'AirPods', emoji: '🎵' },
  { id: 'tws', label: 'TWS Earbuds', emoji: '🎧' },
  { id: 'gaming_headsets', label: 'Gaming Headsets', emoji: '🎮' },
  { id: 'bluetooth_speakers', label: 'Bluetooth Speakers', emoji: '🔊' },
  { id: 'soundbars', label: 'Sound Bars', emoji: '📺' },
  { id: 'smartwatches', label: 'Smart Watches', emoji: '⌚' },
  { id: 'powerbank', label: 'Power Banks', emoji: '🔋' },
  { id: 'gaming_accessories', label: 'Gaming Accessories', emoji: '🕹️' },
  { id: 'dashcams', label: 'Dash Cameras', emoji: '🚗' },
  { id: 'projectors', label: 'Projectors', emoji: '🎥' }
]

export const PRODUCTS = [
  {
    id: 1, slug: 'rockerz-pro-anc-550', name: 'Rockerz Pro ANC 550',
    brand: 'BeatBox', category: 'headphones', price: 1999, oldPrice: 7990, discount: 75,
    rating: 4.9, reviewCount: 1208, tag: 'Best Seller', usp: '60 Hours ANC Playback',
    imageKey: 'heroHeadphones', badge: 'Flagship Launch', inStock: true,
    colors: [{ name: 'Purple', code: '#a820ff' }, { name: 'Cyan', code: '#00f3ff' }, { name: 'Black', code: '#0a0d14' }],
    specs: { 'Driver': '40mm Dynamic', 'Battery': '60 Hours', 'ANC': 'Hybrid -35dB', 'Mic': 'Dual ENC', 'Bluetooth': '5.3', 'Charging': 'Type-C' },
    description: 'Experience true audio purity with 40mm dynamic drivers, hybrid ANC, and up to 60 hours of massive playback.',
    highlights: ['Hybrid ANC -35dB', '60hr battery (35hr ANC on)', 'Dual EQ modes', 'Foldable with carry case', '10min charge = 3hrs'],
    reviews: [
      { user: 'Arjun M.', rating: 5, comment: 'Insane ANC for this price. Best budget ANC headphones!' },
      { user: 'Priya S.', rating: 5, comment: 'Crystal clear audio, bass is punchy and controlled.' },
      { user: 'Ravi K.', rating: 4, comment: 'ANC is excellent. Wished the mic was slightly better.' },
    ],
  },
  {
    id: 2, slug: 'rockerz-wireless-450', name: 'Rockerz Wireless 450',
    brand: 'BeatBox', category: 'headphones', price: 1499, oldPrice: 4990, discount: 70,
    rating: 4.7, reviewCount: 864, tag: 'Popular', usp: '50 Hours Playtime',
    imageKey: 'heroHeadphones', badge: 'Top Rated', inStock: true,
    colors: [{ name: 'Black', code: '#1a1a2e' }, { name: 'White', code: '#e8e8f0' }, { name: 'Blue', code: '#0d6efd' }],
    specs: { 'Driver': '40mm Dynamic', 'Battery': '50 Hours', 'Bluetooth': '5.2', 'Charging': 'Type-C', 'Weight': '230g', 'Mic': 'Single + Voice Assistant' },
    description: 'Premium wireless headphones with 50-hour battery, signature bass tuning, and ultra-comfortable over-ear cushions.',
    highlights: ['50hr playtime single charge', 'Premium faux leather cushions', 'Foldable portable design', 'Multi-point pairing 2 devices'],
    reviews: [
      { user: 'Sneha T.', rating: 5, comment: 'Incredible battery life! Daily driver for 6 months.' },
      { user: 'Kiran J.', rating: 4, comment: 'Great bass and comfortable for long sessions.' },
    ],
  },
  {
    id: 3, slug: 'airdopes-cyber-141', name: 'Airdopes Cyber 141',
    brand: 'BeatBox', category: 'earbuds', price: 1299, oldPrice: 4490, discount: 71,
    rating: 4.8, reviewCount: 956, tag: 'Trending', usp: '40ms Low Latency Gaming',
    imageKey: 'heroEarbuds', badge: 'Bestseller', inStock: true,
    colors: [{ name: 'Cyan', code: '#00f3ff' }, { name: 'Purple', code: '#a820ff' }, { name: 'Grey', code: '#8496ae' }],
    specs: { 'Driver': '13mm Dynamic', 'Battery': '42 Hours Total', 'Latency': '40ms BEAST™', 'Mic': 'Quad ENx™', 'Bluetooth': '5.3', 'Charging': 'Type-C' },
    description: 'BEAST™ mode for 40ms gaming latency, quad ENx™ mics for crystal-clear calls, and a glowing neon charging case.',
    highlights: ['BEAST™ 40ms ultra-low latency', 'Quad ENx™ mics', '42hr total battery', 'Neon RGB glow case', 'Touch controls'],
    reviews: [
      { user: 'Amit P.', rating: 5, comment: 'Zero lag in BGMI! The BEAST mode is a game-changer.' },
      { user: 'Divya R.', rating: 5, comment: 'Call quality is exceptional with the quad mics.' },
      { user: 'Vijay L.', rating: 4, comment: 'Fit is snug and bass is punchy. Great TWS for the price.' },
    ],
  },
  {
    id: 4, slug: 'beatbox-smart-capsule', name: 'BeatBox Smart Capsule',
    brand: 'BeatBox', category: 'earbuds', price: 2999, oldPrice: 9990, discount: 70,
    rating: 4.9, reviewCount: 412, tag: 'New Launch', usp: 'OLED Touchscreen Case',
    imageKey: 'smartEarbuds', badge: 'Limited Edition', inStock: true,
    colors: [{ name: 'Black', code: '#0a0a0a' }, { name: 'Rose Gold', code: '#b76e79' }, { name: 'Purple', code: '#8b5cf6' }],
    specs: { 'Driver': '12mm + Balanced Armature', 'Battery': '38 Hours', 'ANC': 'Hybrid -42dB', 'Charging': 'Type-C + Wireless Qi', 'Bluetooth': '5.3', 'Water': 'IPX5' },
    description: 'World\'s first OLED touchscreen charging case. Adjust EQ, monitor battery, toggle ANC with a swipe on the case.',
    highlights: ['OLED touchscreen charging case', 'Hybrid ANC -42dB', 'Wireless Qi charging', '6-mic AI noise reduction', '10-band app EQ'],
    reviews: [
      { user: 'Nisha K.', rating: 5, comment: 'The OLED case is mind-blowing!' },
      { user: 'Rohit B.', rating: 5, comment: 'ANC is the best I\'ve experienced at this price.' },
    ],
  },
  {
    id: 5, slug: 'stone-beat-beast-1200', name: 'Stone Beat Beast 1200',
    brand: 'BeatBox', category: 'speakers', price: 2499, oldPrice: 6990, discount: 64,
    rating: 4.7, reviewCount: 542, tag: 'Rugged', usp: '14W Signature Sound',
    imageKey: 'heroSpeaker', badge: 'Summer Special', inStock: true,
    colors: [{ name: 'Carbon', code: '#1a2238' }, { name: 'Blue', code: '#0d6efd' }, { name: 'Red', code: '#dc3545' }],
    specs: { 'Output': '14W RMS', 'Battery': '14 Hours', 'Charging': 'Type-C', 'Water': 'IPX7', 'Bluetooth': '5.3 + AUX', 'Range': '15m' },
    description: 'IPX7 waterproof speaker with dual passive radiators, 14W signature bass, custom RGB ring, and waterproof protection.',
    highlights: ['IPX7 fully waterproof', 'Dual passive radiators', 'RGB ring syncs music', '14hr outdoor battery', 'TWS stereo pair'],
    reviews: [
      { user: 'Suresh P.', rating: 5, comment: 'Took it to the beach. Survived waves and sand!' },
      { user: 'Meera S.', rating: 4, comment: 'RGB lights are a showstopper at parties.' },
    ],
  },
  {
    id: 6, slug: 'stone-grenade-pro', name: 'Stone Grenade Pro',
    brand: 'BeatBox', category: 'speakers', price: 1799, oldPrice: 4990, discount: 64,
    rating: 4.6, reviewCount: 378, tag: 'Value Pick', usp: '10W 360° Sound',
    imageKey: 'heroSpeaker', badge: 'Hot Deal', inStock: true,
    colors: [{ name: 'Green', code: '#556b2f' }, { name: 'Black', code: '#1a1a1a' }, { name: 'Blue', code: '#007bff' }],
    specs: { 'Output': '10W RMS', 'Battery': '10 Hours', 'Water': 'IPX5', 'Bluetooth': '5.2', 'Range': '10m', 'Special': '360° Sound' },
    description: 'Compact cylindrical speaker with 360° omnidirectional sound. Perfect for travel, indoor parties, and outdoor picnics.',
    highlights: ['360° omnidirectional sound', 'Ultra-portable design', 'IPX5 splash-proof', '10hr battery', 'Built-in power bank'],
    reviews: [
      { user: 'Anil M.', rating: 5, comment: 'Tiny speaker, HUGE sound! Perfect for college rooms.' },
      { user: 'Pooja K.', rating: 4, comment: 'The 360 sound is impressive outdoors.' },
    ],
  },
  {
    id: 7, slug: 'trip-athletic-neon', name: 'Trip Athletic Neon',
    brand: 'BeatBox', category: 'neckbands', price: 999, oldPrice: 2990, discount: 66,
    rating: 4.6, reviewCount: 723, tag: 'Active Wear', usp: '30 Hours Athletic Playback',
    imageKey: 'wirelessNeckband', badge: 'Sporty Pick', inStock: true,
    colors: [{ name: 'Neon Green', code: '#39ff14' }, { name: 'Cyan', code: '#00f3ff' }, { name: 'Yellow', code: '#ffd700' }],
    specs: { 'Driver': '10mm Dynamic', 'Battery': '30 Hours', 'Water': 'IPX5', 'Bluetooth': '5.2', 'Charging': 'Type-C', 'Weight': '25g' },
    description: 'Featherlight neckband with magnetic earbud tips, dual EQ modes, and 30 hours of athletic playback for gym warriors.',
    highlights: ['Magnetic auto-pause earbuds', '30hr sports playback', 'IPX5 sweat proof', 'Only 25 grams', 'Dual EQ modes'],
    reviews: [
      { user: 'Gaurav T.', rating: 5, comment: 'Best gym companion! Stays put during intense workouts.' },
      { user: 'Rekha S.', rating: 4, comment: '30 hours is real. Charged once, used all week.' },
    ],
  },
  {
    id: 8, slug: 'collar-flex-pro', name: 'Collar Flex Pro',
    brand: 'BeatBox', category: 'neckbands', price: 799, oldPrice: 1999, discount: 60,
    rating: 4.5, reviewCount: 534, tag: 'Budget King', usp: 'ASAP Charge 10min=10hrs',
    imageKey: 'wirelessNeckband', badge: 'Best Value', inStock: true,
    colors: [{ name: 'Black', code: '#0a0a0a' }, { name: 'Blue', code: '#0d6efd' }, { name: 'Red', code: '#dc3545' }],
    specs: { 'Driver': '10mm', 'Battery': '24 Hours', 'Charging': 'ASAP Charge', 'Bluetooth': '5.1', 'Water': 'IPX4', 'Mic': 'AI Noise Cancellation' },
    description: 'Budget neckband with legendary ASAP Charge — 10 min charging = 10 hours playback. Perfect daily commute companion.',
    highlights: ['ASAP Charge 10min=10hrs', 'AI noise cancellation mic', '24hr total playback', 'Flexible collar design', 'Voice assistant'],
    reviews: [
      { user: 'Deepak J.', rating: 5, comment: 'ASAP charge is a lifesaver!' },
      { user: 'Anjali P.', rating: 4, comment: 'Value for money. Call quality is great.' },
    ],
  },
  {
    id: 9, slug: 'immortal-cyber-pro', name: 'Immortal Cyber Pro',
    brand: 'BeatBox', category: 'gaming', price: 1599, oldPrice: 4999, discount: 68,
    rating: 4.9, reviewCount: 822, tag: 'New Launch', usp: 'Virtual 7.1 Surround',
    imageKey: 'gamingHeadset', badge: 'Cyber Launch', inStock: true,
    colors: [{ name: 'Neon Green', code: '#39ff14' }, { name: 'Purple', code: '#a820ff' }, { name: 'Cyan', code: '#00f3ff' }],
    specs: { 'Driver': '50mm Neodymium', 'Surround': 'Virtual 7.1', 'Connect': 'USB + 3.5mm', 'Mic': 'Boom Flip-Mute', 'RGB': 'Per-Zone', 'Compat': 'PC/PS5/Xbox/Switch' },
    description: 'Dedicated per-zone RGB, 50mm drivers, professional boom mic with flip-to-mute, and virtual 7.1 surround for esports pros.',
    highlights: ['Virtual 7.1 surround sound', 'Flip-to-mute boom mic', 'Per-zone RGB 16.8M colors', '50mm neodymium drivers', 'Cross-platform compatible'],
    reviews: [
      { user: 'Aakash G.', rating: 5, comment: '7.1 surround is insane for FPS. Hear footsteps everywhere!' },
      { user: 'Tanuj M.', rating: 5, comment: 'Best gaming headset under ₹2000. RGB looks sick.' },
      { user: 'Isha R.', rating: 4, comment: 'Mic quality is excellent. Comfortable for long gaming sessions.' },
    ],
  },
  {
    id: 10, slug: 'immortal-rave-700', name: 'Immortal Rave 700',
    brand: 'BeatBox', category: 'gaming', price: 1299, oldPrice: 3999, discount: 68,
    rating: 4.7, reviewCount: 641, tag: 'Gamer Pick', usp: 'Wireless + Wired Dual Mode',
    imageKey: 'gamingHeadset', badge: 'Dual Mode', inStock: false,
    colors: [{ name: 'Black', code: '#0d0d0d' }, { name: 'White', code: '#f0f0f5' }],
    specs: { 'Driver': '40mm Dynamic', 'Connect': '2.4GHz + 3.5mm', 'Battery': '40 Hours', 'Latency': '5ms Wireless', 'Mic': 'Detachable Boom', 'RGB': 'Side Panel' },
    description: 'Seamlessly switch between wireless 2.4GHz (5ms) and wired 3.5mm modes. 40-hour battery. Detachable boom mic.',
    highlights: ['Dual mode: 2.4GHz + Wired', 'Ultra-low 5ms wireless latency', '40hr wireless battery', 'Detachable boom mic', 'Memory foam cushions'],
    reviews: [
      { user: 'Dev C.', rating: 5, comment: 'The 2.4GHz mode is lag-free. Console + PC compatible.' },
      { user: 'Siya K.', rating: 4, comment: 'Battery lasts forever. Great for weekend gaming marathons.' },
    ],
  },
  {
    id: 11, slug: 'rockerz-club-330', name: 'Rockerz Club 330',
    brand: 'BeatBox', category: 'neckbands', price: 699, oldPrice: 1799, discount: 61,
    rating: 4.4, reviewCount: 1104, tag: 'Top Seller', usp: 'IPX5 + 24Hr Battery',
    imageKey: 'wirelessNeckband', badge: 'Fan Favourite', inStock: true,
    colors: [{ name: 'Black', code: '#1a1a1a' }, { name: 'Blue', code: '#87ceeb' }, { name: 'Red', code: '#722f37' }],
    specs: { 'Driver': '10mm', 'Battery': '24 Hours', 'Water': 'IPX5', 'Bluetooth': '5.0', 'Charging': 'Micro USB', 'Weight': '22g' },
    description: 'The fan favourite entry-level neckband with 24-hour battery and IPX5 protection. Perfect for first-time buyers.',
    highlights: ['24hr playback', 'IPX5 water resistant', 'Magnetic auto-pause', 'Lightweight 22g'],
    reviews: [{ user: 'Mohit A.', rating: 4, comment: 'My first BeatBox product. Hooked for life. Great value!' }],
  },
  {
    id: 12, slug: 'beatbox-storm-111', name: 'BeatBox Storm 111',
    brand: 'BeatBox', category: 'earbuds', price: 1099, oldPrice: 2999, discount: 63,
    rating: 4.6, reviewCount: 687, tag: 'Trending', usp: 'ANC + 35Hr Battery',
    imageKey: 'heroEarbuds', badge: 'New Drop', inStock: true,
    colors: [{ name: 'Grey', code: '#6b7280' }, { name: 'Black', code: '#111827' }, { name: 'White', code: '#f9fafb' }],
    specs: { 'Driver': '12mm Dynamic', 'Battery': '35 Hours', 'ANC': 'Active', 'Bluetooth': '5.3', 'Water': 'IPX4', 'Mic': 'Dual CVC 8.0' },
    description: 'Premium ANC earbuds with 35-hour battery and CVC 8.0 dual-mic for crystal-clear calls in any environment.',
    highlights: ['ANC for deep focus', '35hr total battery', 'CVC 8.0 dual-mic', 'IPX4 sweat resistant', 'One-tap voice assistant'],
    reviews: [
      { user: 'Kavya N.', rating: 5, comment: 'Compact and great ANC. Perfect for office and commutes.' },
      { user: 'Siddharth R.', rating: 4, comment: 'Solid TWS with ANC at this budget. Very impressed!' },
    ],
  },
  {
    id: 13, slug: 'energy-core-10000', name: 'Energy Core 10k',
    brand: 'BeatBox', category: 'powerbank', price: 999, oldPrice: 2499, discount: 60,
    rating: 4.8, reviewCount: 520, tag: 'New', usp: '22.5W Fast Charge',
    imageKey: 'powerBank', badge: 'Power Up', inStock: true,
    colors: [{ name: 'Black', code: '#1a1a1a' }, { name: 'White', code: '#f9fafb' }],
    specs: { 'Capacity': '10000mAh', 'Output': '22.5W Max', 'Ports': '2 USB-A, 1 Type-C', 'Material': 'Aluminum', 'Charging': 'Two-way Fast Charge', 'Weight': '210g' },
    description: 'Ultra-slim 10000mAh power bank with 22.5W fast charging, LED display, and premium aluminum casing. Never run out of juice.',
    highlights: ['22.5W fast charging', 'Charge 3 devices at once', 'Smart IC protection', 'Digital LED display'],
    reviews: [
      { user: 'Vikram S.', rating: 5, comment: 'Charges my phone super fast. Highly recommend!' },
      { user: 'Neha P.', rating: 4, comment: 'Very sleek and portable. A bit heavy but worth it.' },
    ],
  },
  {
    id: 14, slug: 'blade-pro-trimmer', name: 'Blade Pro Trimmer',
    brand: 'BeatBox', category: 'trimmer', price: 1499, oldPrice: 3499, discount: 57,
    rating: 4.7, reviewCount: 315, tag: 'Grooming', usp: 'Titanium Blades',
    imageKey: 'trimmer', badge: 'Pro Series', inStock: true,
    colors: [{ name: 'Silver', code: '#c0c0c0' }, { name: 'Black', code: '#000000' }],
    specs: { 'Blade': 'Titanium Coated', 'Battery': '90 Mins', 'Lengths': '20 Settings', 'Charging': 'Type-C', 'Water': 'IPX7 Washable', 'Motor': '7000 RPM' },
    description: 'Precision beard trimmer with self-sharpening titanium blades, 90 mins runtime, and 20 length settings. Elevate your grooming.',
    highlights: ['Titanium coated blades', '90 mins cordless use', '20 precision length settings', 'IPX7 fully washable body'],
    reviews: [
      { user: 'Rahul D.', rating: 5, comment: 'Very smooth trim, no pulling at all.' },
      { user: 'Karan V.', rating: 4, comment: 'Battery life is excellent. Good quality.' },
    ],
  },
]

export const getProductById = (id) => PRODUCTS.find((p) => p.id === Number(id))
export const getProductsByCategory = (cat) => cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)
export const getRelatedProducts = (product, count = 4) =>
  PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count)
