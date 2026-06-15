// BeatBox Mock Product Catalog
import heroHeadphones from '../assets/hero_headphones.png'
import heroEarbuds from '../assets/hero_earbuds.png'
import heroSpeaker from '../assets/hero_speaker.png'
import gamingHeadset from '../assets/gaming_headset.png'
import wirelessNeckband from '../assets/wireless_neckband.png'
import smartEarbuds from '../assets/smart_earbuds.png'
import powerBank from '../assets/power_bank.png'
import trimmer from '../assets/trimmer.png'
import soundbar from '../assets/soundbar.png'

import portableFan from '../assets/portable_fan.png'
import cables from '../assets/cables.png'
import carCharger from '../assets/car_charger.png'
import electricKettle from '../assets/electric_kettle.png'
import hairDryer from '../assets/hair_dryer.png'
import keyboardMouse from '../assets/keyboard_mouse.png'
import laptopBag from '../assets/laptop_bag.png'
import laptopStand from '../assets/laptop_stand.png'
import mobileHolder from '../assets/mobile_holder.png'
import smartTracker from '../assets/smart_tracker.png'
import tyreInflator from '../assets/tyre_inflator.png'
import usbHub from '../assets/usb_hub.png'
import vacuumCleaner from '../assets/vacuum_cleaner.png'
import wirelessCharger from '../assets/wireless_charger.png'

import partySpeaker from '../assets/party_speaker.png'
import wiredEarphones from '../assets/wired_earphones.png'
import usbSpeakers from '../assets/usb_speakers.png'
import conferenceSpeakers from '../assets/conference_speakers.png'
import wirelessMicrophones from '../assets/wireless_microphones.png'

// New unique hero images for audio subcategories
import soundbarHero from '../assets/soundbar_hero.png'
import partySpeakerHero from '../assets/party_speaker_hero.png'
import portableSpeakerHero from '../assets/portable_speaker_hero.png'
import twsHero from '../assets/tws_hero.png'
import neckbandHero from '../assets/neckband_hero.png'
import wirelessHeadphonesHero from '../assets/wireless_headphones_hero.png'
import wiredEarphonesHero from '../assets/wired_earphones_hero.png'
import usbSpeakersHero from '../assets/usb_speakers_hero.png'
import conferenceSpeakerHero from '../assets/conference_speaker_hero.png'
import wirelessMicHero from '../assets/wireless_mic_hero.png'

// Newly Generated Unique Product Images
import stoneGrenadeProImage from '../assets/stone_grenade_pro.png'
import beatboxSmartCapsuleImage from '../assets/beatbox_smart_capsule.png'
import auralPrecisionV3Image from '../assets/aural_precision_v3.png'

import partyBoom1500Image from '../assets/party_boom_1500.png'
import partyLiteWirelessImage from '../assets/party_lite_wireless.png'
import partyBlastTowerImage from '../assets/party_blast_tower.png'

import soundbarMini21Image from '../assets/soundbar_mini_21.png'
import soundbarEliteS9Image from '../assets/soundbar_elite_s9.png'
import cinemaProSoundbarImage from '../assets/cinema_pro_soundbar.png'
import soundbar21Image from '../assets/soundbar_21.png'
import gamingSoundbarXImage from '../assets/gaming_soundbar_x.png'
import soundbarPro51Image from '../assets/soundbar_pro_51.png'

import phoneWallet from '../assets/phone_wallet.png'
import cableOrganiser from '../assets/cable_organiser.png'

import wirelessKeyboard from '../assets/wireless_keyboard.png'
import wiredKeyboard from '../assets/wired_keyboard.png'
import gamingKeyboard from '../assets/gaming_keyboard.png'
import wirelessMouse from '../assets/wireless_mouse.png'
import wiredMouse from '../assets/wired_mouse.png'
import laptopTable from '../assets/laptop_table.png'
import extensionBoard from '../assets/extension_board.png'
import projector from '../assets/projector.png'
import lcdWritingPad from '../assets/lcd_writing_pad.png'
import computerCables from '../assets/computer_cables.png'
import wirelessPresenter from '../assets/wireless_presenter.png'

import smartwatchProImage from '../assets/smartwatch_pro.png'
import cctvCameraImage from '../assets/cctv_camera.png'
import ssdDriveImage from '../assets/ssd_drive.png'
import scientificCalculatorImage from '../assets/scientific_calculator.png'
import pendriveFlashImage from '../assets/pendrive_flash.png'
import microsdCardImage from '../assets/microsd_card.png'

export const IMAGE_MAP = {
  heroHeadphones,
  heroEarbuds,
  heroSpeaker,
  gamingHeadset,
  wirelessNeckband,
  smartEarbuds,
  powerBank,
  trimmer,
  soundbar,
  premiumCables: cables,
  carCharger,
  portableFan,
  electricKettle,
  hairDryer,
  keyboardMouse,
  laptopBag,
  laptopStand,
  mobileHolder,
  smartTracker,
  tyreInflator,
  usbHub,
  vacuumCleaner,
  wirelessCharger,
  partySpeaker,
  wiredEarphones,
  usbSpeakers,
  conferenceSpeakers,
  wirelessMicrophones,
  phoneWallet,
  cableOrganiser,
  wirelessKeyboard,
  wiredKeyboard,
  gamingKeyboard,
  wirelessMouse,
  wiredMouse,
  laptopTable,
  extensionBoard,
  projector,
  lcdWritingPad,
  computerCables,
  wirelessPresenter,
  // New unique audio hero images
  soundbarHero,
  partySpeakerHero,
  portableSpeakerHero,
  twsHero,
  neckbandHero,
  wirelessHeadphonesHero,
  wiredEarphonesHero,
  usbSpeakersHero,
  conferenceSpeakerHero,
  wirelessMicHero,
  
  // Newly Generated Unique Product Images
  stoneGrenadePro: stoneGrenadeProImage,
  beatboxSmartCapsule: beatboxSmartCapsuleImage,
  auralPrecisionV3: auralPrecisionV3Image,
  
  partyBoom1500: partyBoom1500Image,
  partyLiteWireless: partyLiteWirelessImage,
  partyBlastTower: partyBlastTowerImage,

  soundbarMini21: soundbarMini21Image,
  soundbarEliteS9: soundbarEliteS9Image,
  cinemaProSoundbar: cinemaProSoundbarImage,
  soundbar21: soundbar21Image,
  gamingSoundbarX: gamingSoundbarXImage,
  soundbarPro51: soundbarPro51Image,
  smartwatchProImage,
  cctvCameraImage,
  ssdDriveImage,
  scientificCalculatorImage,
  pendriveFlashImage,
  microsdCardImage
}

export const CATEGORIES = [
  { id: 'all', label: 'All Products', emoji: '🔥' },
  { id: 'headphones', label: 'Headphones', emoji: '🎧' },
  { id: 'earbuds', label: 'Earbuds', emoji: '🎵' },
  { id: 'tws', label: 'TWS Earbuds', emoji: '🎼' },
  { id: 'neckbands', label: 'Neckbands', emoji: '🏃' },
  { id: 'gaming', label: 'Gaming Headsets', emoji: '🎮' },
  { id: 'speakers', label: 'Speakers', emoji: '🔊' },
  { id: 'soundbars', label: 'Sound Bars', emoji: '📺' },
  { id: 'party speakers', label: 'Party Speakers', emoji: '🪩' },
  { id: 'portable speakers', label: 'Portable Speakers', emoji: '📻' },
  { id: 'usb speakers', label: 'USB Speakers', emoji: '🖥️' },
  { id: 'conference speakers', label: 'Conference Speakers', emoji: '🗣️' },
  { id: 'wired earphones', label: 'Wired Earphones', emoji: '🔌' },
  { id: 'wireless microphones', label: 'Microphones', emoji: '🎙️' },
  { id: 'smartwatches', label: 'Smart Watches', emoji: '⌚' },
  { id: 'power bank', label: 'Power Banks', emoji: '🔋' },
  { id: 'chargers', label: 'Chargers', emoji: '⚡' },
  { id: 'cables', label: 'Cables', emoji: '🪢' },
  { id: 'trimmer', label: 'Trimmers', emoji: '✂️' },
  { id: 'computer accessories', label: 'Computer Accs', emoji: '💻' },
  { id: 'mobile accessories', label: 'Mobile Accs', emoji: '📱' },
  { id: 'car accessories', label: 'Car Accessories', emoji: '🚗' },
  { id: 'smart gadgets', label: 'Smart Gadgets', emoji: '💡' },
  { id: 'projectors', label: 'Projectors', emoji: '🎥' },
  { id: 'wireless keyboard', label: 'Wireless Keyboards', emoji: '⌨️' },
  { id: 'wired keyboard', label: 'Wired Keyboards', emoji: '⌨️' },
  { id: 'gaming keyboard', label: 'Gaming Keyboards', emoji: '🕹️' },
  { id: 'wireless mouse', label: 'Wireless Mice', emoji: '🖱️' },
  { id: 'wired mouse', label: 'Wired Mice', emoji: '🖱️' },
  { id: 'laptop table', label: 'Laptop Tables', emoji: '🪑' },
  { id: 'extension board', label: 'Extension Boards', emoji: '🔌' },
  { id: 'lcd writing pads', label: 'Writing Pads', emoji: '📝' },
  { id: 'computer cables', label: 'Computer Cables', emoji: '🔗' },
  { id: 'wireless presenter', label: 'Presenters', emoji: '🪄' },
  { id: 'gadget cleaners', label: 'Gadget Cleaners', emoji: '🧹' },
  { id: 'phone wallet', label: 'Phone Wallets', emoji: '💳' },
  { id: 'cable organiser', label: 'Cable Organisers', emoji: '🖇️' },
  { id: 'car bluetooth', label: 'Car Bluetooth', emoji: '📻' },
  { id: 'car mobile holder', label: 'Car Mounts', emoji: '📱' },
  { id: 'bike mobile holder', label: 'Bike Mounts', emoji: '🚲' },
  { id: 'car wireless charger', label: 'Car Chargers', emoji: '⚡' },
  { id: 'pressure washer', label: 'Pressure Washers', emoji: '💦' },
  { id: 'ear cleaners', label: 'Ear Cleaners', emoji: '👂' },
  { id: 'tool kit', label: 'Tool Kits', emoji: '🛠️' },
  { id: 'humidifiers', label: 'Humidifiers', emoji: '🌫️' },
  { id: 'air blower', label: 'Air Blowers', emoji: '💨' },
  { id: 'timers', label: 'Timers', emoji: '⏱️' },
  { id: 'massagers', label: 'Massagers', emoji: '💆' },
  { id: 'smart sealers', label: 'Smart Sealers', emoji: '🥡' },
  { id: 'rechargeable battery', label: 'Batteries', emoji: '🔋' }
]

export const PRODUCTS = [
  {
    id: 1, slug: 'rockerz-pro-anc-550', name: 'Rockerz Pro ANC 550',
    brand: 'BeatBox', category: 'headphones', price: 1999, oldPrice: 7990, discount: 75,
    rating: 4.9, reviewCount: 1208, tag: 'Best Seller', usp: '60 Hours ANC Playback',
    imageKey: 'auralPrecisionV3', badge: 'Flagship Launch', inStock: true,
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
    imageKey: 'beatboxSmartCapsule', badge: 'Limited Edition', inStock: true,
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
    imageKey: 'stoneGrenadePro', badge: 'Hot Deal', inStock: true,
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
    brand: 'BeatBox', category: 'power bank', price: 999, oldPrice: 2499, discount: 60,
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
  {
    id: 15, slug: 'cinema-pro-soundbar', name: 'Cinema Pro Soundbars',
    brand: 'BeatBox', category: 'soundbars', price: 4999, oldPrice: 12999, discount: 61,
    rating: 4.8, reviewCount: 150, tag: 'Bestseller', usp: '120W Dolby Audio',
    imageKey: 'soundbar', badge: 'Home Theatre', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Output': '120W RMS', 'Channels': '2.1', 'Subwoofer': 'Wireless', 'Bluetooth': '5.3', 'Ports': 'HDMI ARC, Optical' },
    description: 'Transform your living room into a cinema with 120W of pure Dolby audio and a wireless subwoofer.',
    highlights: ['Dolby Audio', 'Wireless Subwoofer', 'HDMI ARC', 'Wall Mountable'],
    reviews: [],
  },
  {
    id: 16, slug: 'premium-cables-typec', name: 'Premium Braided Cables',
    brand: 'BeatBox', category: 'cables', price: 299, oldPrice: 999, discount: 70,
    rating: 4.6, reviewCount: 890, tag: 'Essential', usp: 'Tough Braided',
    imageKey: 'premiumCables', badge: 'Durable', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }, { name: 'Red', code: '#ff0000' }],
    specs: { 'Type': 'Type-C to Type-C', 'Length': '1.5m', 'Speed': '60W PD Fast Charging', 'Material': 'Nylon Braided' },
    description: 'Ultra-durable nylon braided cables supporting 60W Power Delivery fast charging.',
    highlights: ['10,000+ Bend Lifespan', '60W PD', 'Tangle-free'],
    reviews: [],
  },
  {
    id: 17, slug: 'magnetic-wireless-charger', name: 'Magnetic Wireless Charger',
    brand: 'BeatBox', category: 'chargers', price: 1299, oldPrice: 3499, discount: 62,
    rating: 4.7, reviewCount: 420, tag: 'New', usp: '15W MagSafe Compatible',
    imageKey: 'wirelessCharger', badge: 'Fast Charge', inStock: true,
    colors: [{ name: 'Silver', code: '#c0c0c0' }],
    specs: { 'Output': '15W Max', 'Input': 'Type-C', 'Compatibility': 'Qi-Enabled Devices', 'Material': 'Aluminum Alloy' },
    description: 'Sleek metallic wireless charging pad with strong magnetic alignment for instantaneous 15W charging.',
    highlights: ['15W Fast Charge', 'Magnetic Alignment', 'Aluminum Build'],
    reviews: [],
  },
  {
    id: 18, slug: 'auto-grip-car-charger', name: 'Auto Grip Car Charger',
    brand: 'BeatBox', category: 'car accessories', price: 899, oldPrice: 2499, discount: 64,
    rating: 4.5, reviewCount: 310, tag: 'Trending', usp: 'Dual Port 36W',
    imageKey: 'carCharger', badge: 'On-the-go', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Output': '36W Max', 'Ports': 'USB-A + Type-C', 'Material': 'Metal Body' },
    description: 'Premium dual-port car charger to fast-charge two devices simultaneously while on the move.',
    highlights: ['36W Fast Charge', 'Dual Ports', 'LED Indicator'],
    reviews: [],
  },
  {
    id: 19, slug: 'flexi-mobile-holder', name: 'Flexi Mobile Holder',
    brand: 'BeatBox', category: 'mobile accessories', price: 399, oldPrice: 999, discount: 60,
    rating: 4.4, reviewCount: 500, tag: 'Useful', usp: '360° Rotation',
    imageKey: 'mobileHolder', badge: 'Desk Essential', inStock: true,
    colors: [{ name: 'Silver', code: '#c0c0c0' }],
    specs: { 'Material': 'Aluminum', 'Compatibility': '4" to 7" devices', 'Rotation': '360 Degrees' },
    description: 'Ergonomic aluminum mobile holder for your desk. Perfect for video calls and content consumption.',
    highlights: ['360° Adjustable', 'Anti-slip pads', 'Foldable'],
    reviews: [],
  },
  {
    id: 20, slug: 'ergo-laptop-stand', name: 'Ergo Laptop Stand',
    brand: 'BeatBox', category: 'computer accessories', price: 1499, oldPrice: 3999, discount: 62,
    rating: 4.8, reviewCount: 220, tag: 'Premium', usp: 'Adjustable Angles',
    imageKey: 'laptopStand', badge: 'Ergonomic', inStock: true,
    colors: [{ name: 'Silver', code: '#c0c0c0' }],
    specs: { 'Material': 'Aviation Aluminum', 'Support': 'Up to 15.6" Laptops', 'Levels': '6 Height Settings' },
    description: 'Premium adjustable aluminum laptop stand to improve your posture and device cooling.',
    highlights: ['Aviation Aluminum', '6 Height Levels', 'Improves Cooling'],
    reviews: [],
  },
  {
    id: 21, slug: 'multi-usb-hub', name: 'Multi-Port USB Hub',
    brand: 'BeatBox', category: 'computer accessories', price: 1899, oldPrice: 4999, discount: 62,
    rating: 4.6, reviewCount: 180, tag: 'Must Have', usp: '7-in-1 Expansion',
    imageKey: 'usbHub', badge: 'Connectivity', inStock: true,
    colors: [{ name: 'Grey', code: '#808080' }],
    specs: { 'Ports': 'HDMI, 2x USB 3.0, SD/TF, Type-C PD', 'Material': 'Aluminum', 'Speed': '5Gbps' },
    description: 'Expand your laptop connectivity with this sleek 7-in-1 Type-C hub adapter.',
    highlights: ['4K HDMI', '100W PD Pass-through', 'SD/TF Card Reader'],
    reviews: [],
  },
  {
    id: 22, slug: 'pro-laptop-bags', name: 'Pro Laptop Bags',
    brand: 'BeatBox', category: 'computer accessories', price: 1999, oldPrice: 5999, discount: 66,
    rating: 4.9, reviewCount: 145, tag: 'Bestseller', usp: 'Water Resistant',
    imageKey: 'laptopBag', badge: 'Travel', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Capacity': '25L', 'Material': 'Water-resistant Oxford', 'Fit': 'Up to 16" Laptops' },
    description: 'Professional water-resistant laptop backpack with anti-theft compartments and ergonomic padding.',
    highlights: ['Water Resistant', 'Anti-theft Zippers', 'USB Charging Port'],
    reviews: [],
  },
  {
    id: 23, slug: 'smart-tyre-inflator', name: 'Smart Tyre Inflator',
    brand: 'BeatBox', category: 'car accessories', price: 2499, oldPrice: 6999, discount: 64,
    rating: 4.7, reviewCount: 88, tag: 'Safety', usp: 'Auto Shut-off',
    imageKey: 'tyreInflator', badge: 'Must Have', inStock: true,
    colors: [{ name: 'Dark Grey', code: '#404040' }],
    specs: { 'Max Pressure': '150 PSI', 'Battery': '4000mAh', 'Display': 'Digital LED', 'Charging': 'Type-C' },
    description: 'Portable digital tyre inflator with auto shut-off and built-in LED flashlight.',
    highlights: ['150 PSI Max', 'Digital Display', 'Emergency Flashlight'],
    reviews: [],
  },
  {
    id: 24, slug: 'cordless-vacuum-cleaner', name: 'Cordless Vacuum Cleaner',
    brand: 'BeatBox', category: 'car accessories', price: 2199, oldPrice: 5999, discount: 63,
    rating: 4.5, reviewCount: 112, tag: 'Cleaning', usp: 'High Suction',
    imageKey: 'vacuumCleaner', badge: 'Powerful', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Suction': '8000Pa', 'Battery': '30 Mins Runtime', 'Filter': 'Washable HEPA' },
    description: 'Sleek cordless handheld vacuum cleaner perfect for keeping your car and desk spotless.',
    highlights: ['8000Pa Suction', 'Washable HEPA filter', 'Lightweight'],
    reviews: [],
  },
  {
    id: 25, slug: 'ionic-hair-dryer', name: 'Ionic Hair Dryer',
    brand: 'BeatBox', category: 'smart gadgets', price: 1799, oldPrice: 4999, discount: 64,
    rating: 4.8, reviewCount: 300, tag: 'Beauty', usp: 'Damage Protection',
    imageKey: 'hairDryer', badge: 'Salon Tech', inStock: true,
    colors: [{ name: 'Magenta', code: '#ff00ff' }, { name: 'Dark Grey', code: '#404040' }],
    specs: { 'Power': '1800W', 'Tech': 'Negative Ion', 'Settings': '3 Heat, 2 Speed' },
    description: 'Premium ionic hair dryer that reduces frizz and dries hair quickly without heat damage.',
    highlights: ['1800W Powerful Motor', 'Ionic Technology', 'Cool Shot Button'],
    reviews: [],
  },
  {
    id: 26, slug: 'smart-electric-kettle', name: 'Smart Electric Kettle',
    brand: 'BeatBox', category: 'smart gadgets', price: 1499, oldPrice: 3999, discount: 62,
    rating: 4.6, reviewCount: 156, tag: 'Kitchen', usp: 'Temperature Control',
    imageKey: 'electricKettle', badge: 'Smart Home', inStock: true,
    colors: [{ name: 'Matte Black', code: '#202020' }],
    specs: { 'Capacity': '1.5L', 'Material': '304 Stainless Steel', 'Power': '1500W', 'Features': 'Keep Warm' },
    description: 'Sleek matte black electric kettle with real-time temperature display and keep-warm functionality.',
    highlights: ['Real-time Temp Display', '1.5L Capacity', 'Boil-dry Protection'],
    reviews: [],
  },
  {
    id: 27, slug: 'smart-location-tracker', name: 'Smart Location tracker',
    brand: 'BeatBox', category: 'smart gadgets', price: 799, oldPrice: 2499, discount: 68,
    rating: 4.7, reviewCount: 450, tag: 'Security', usp: 'Global Tracking',
    imageKey: 'smartTracker', badge: 'Never Lose', inStock: true,
    colors: [{ name: 'White', code: '#ffffff' }],
    specs: { 'Battery': '1 Year Replaceable', 'Range': 'Global (Crowdsourced)', 'Water': 'IP67' },
    description: 'Small premium smart tracker tag to keep tabs on your keys, wallet, or luggage.',
    highlights: ['Global Tracking', 'Loud Ring', 'Water Resistant'],
    reviews: [],
  },
  {
    id: 28, slug: 'breeze-portable-fans', name: 'Breeze Portable Fans',
    brand: 'BeatBox', category: 'smart gadgets', price: 599, oldPrice: 1499, discount: 60,
    rating: 4.5, reviewCount: 610, tag: 'Summer', usp: '3 Speed Settings',
    imageKey: 'portableFan', badge: 'Cooling', inStock: true,
    colors: [{ name: 'White', code: '#ffffff' }, { name: 'Pink', code: '#ffc0cb' }],
    specs: { 'Battery': '2000mAh', 'Runtime': '8 Hours', 'Charging': 'Type-C' },
    description: 'Compact and powerful portable fan to keep you cool on the go.',
    highlights: ['3 Speed Modes', '8 Hours Battery', 'Ultra-quiet'],
    reviews: [],
  },
  {
    id: 29, slug: 'wireless-keyboard-mouse', name: 'Keyboard And Mouse Set',
    brand: 'BeatBox', category: 'computer accessories', price: 1299, oldPrice: 3499, discount: 62,
    rating: 4.6, reviewCount: 380, tag: 'Workstation', usp: 'Silent Clicks',
    imageKey: 'keyboardMouse', badge: 'Combo', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Type': 'Wireless 2.4GHz', 'Range': '10m', 'Battery': '12 Months' },
    description: 'Sleek wireless keyboard and mouse combo with silent keys and ergonomic design.',
    highlights: ['Silent Clicks', 'Spill Resistant', 'Long Battery Life'],
    reviews: [],
  },
  {
    id: 30, slug: 'pro-selfie-stick', name: 'Pro Selfie Stick',
    brand: 'BeatBox', category: 'smart gadgets', price: 499, oldPrice: 1299, discount: 61,
    rating: 4.4, reviewCount: 230, tag: 'Photography', usp: 'Bluetooth Remote',
    imageKey: 'mobileHolder', badge: 'Creator Pick', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Material': 'Aluminum Alloy', 'Length': '100cm', 'Connectivity': 'Bluetooth 5.0' },
    description: 'Extendable aluminum selfie stick with a detachable Bluetooth remote for perfect group shots.',
    highlights: ['Bluetooth Remote', 'Aluminum Build', 'Tripod Mode'],
    reviews: [],
  },
  {
    id: 31, slug: 'tactical-flashlight', name: 'Tactical Flashlight',
    brand: 'BeatBox', category: 'smart gadgets', price: 699, oldPrice: 1999, discount: 65,
    rating: 4.7, reviewCount: 150, tag: 'Outdoor', usp: '1000 Lumens',
    imageKey: 'portableFan', badge: 'Bright', inStock: true,
    colors: [{ name: 'Military Black', code: '#1a1a1a' }],
    specs: { 'Brightness': '1000 Lumens', 'Battery': 'Rechargeable', 'Water': 'IPX6' },
    description: 'Ultra-bright tactical flashlight with adjustable focus and SOS mode for emergencies.',
    highlights: ['1000 Lumens', 'Adjustable Focus', 'SOS Mode'],
    reviews: [],
  },
  {
    id: 32, slug: 'precision-stylus', name: 'Precision Stylus',
    brand: 'BeatBox', category: 'smart gadgets', price: 899, oldPrice: 2499, discount: 64,
    rating: 4.6, reviewCount: 110, tag: 'Productivity', usp: 'Palm Rejection',
    imageKey: 'smartTracker', badge: 'Digital Art', inStock: true,
    colors: [{ name: 'White', code: '#ffffff' }],
    specs: { 'Compatibility': 'Universal', 'Battery': '12 Hours', 'Feature': 'Palm Rejection' },
    description: 'High-precision active stylus pen with palm rejection for smooth drawing and note-taking.',
    highlights: ['Palm Rejection', 'Zero Lag', '12 Hours Battery'],
    reviews: [],
  },
  {
    id: 33, slug: 'mega-party-speaker', name: 'Mega Party Speaker',
    brand: 'BeatBox', category: 'party speakers', price: 9999, oldPrice: 19999, discount: 50,
    rating: 4.9, reviewCount: 840, tag: 'Party Gear', usp: '250W Thunder Bass',
    imageKey: 'partySpeaker', badge: 'Loudest', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Output': '250W', 'Battery': '10 Hours', 'Lighting': 'RGB Ring Light' },
    description: 'Turn any space into a club with 250W thunder bass and dynamic RGB party lights.',
    highlights: ['250W Output', 'Karaoke Mic Included', 'RGB Sync to Music'],
    reviews: [],
  },
  {
    id: 34, slug: 'mini-portable-speaker', name: 'Mini Portable Speaker',
    brand: 'BeatBox', category: 'portable speakers', price: 1299, oldPrice: 2999, discount: 56,
    rating: 4.6, reviewCount: 410, tag: 'On the Go', usp: 'IPX7 Waterproof',
    imageKey: 'heroSpeaker', badge: 'Travel', inStock: true,
    colors: [{ name: 'Blue', code: '#0000ff' }],
    specs: { 'Output': '10W', 'Battery': '12 Hours', 'Water': 'IPX7' },
    description: 'Compact 10W portable speaker with rich bass and full IPX7 waterproofing.',
    highlights: ['IPX7 Waterproof', '12 Hours Playtime', 'Rugged Design'],
    reviews: [],
  },
  {
    id: 35, slug: 'true-wireless-tws', name: 'True Wireless TWS',
    brand: 'BeatBox', category: 'tws', price: 1499, oldPrice: 3999, discount: 62,
    rating: 4.7, reviewCount: 520, tag: 'Essential', usp: '50H Playback',
    imageKey: 'heroEarbuds', badge: 'Best Seller', inStock: true,
    colors: [{ name: 'White', code: '#ffffff' }],
    specs: { 'Driver': '10mm', 'Battery': '50 Hours Total', 'Latency': '50ms' },
    description: 'Reliable true wireless earbuds with 50 hours of total playback and low latency gaming mode.',
    highlights: ['50H Total Playback', 'Quad Mic ENC', 'Fast Charge'],
    reviews: [],
  },
  {
    id: 36, slug: 'elite-wireless-headphones', name: 'Elite Wireless Headphones',
    brand: 'BeatBox', category: 'wireless headphones', price: 2499, oldPrice: 5999, discount: 58,
    rating: 4.8, reviewCount: 315, tag: 'Studio', usp: 'Active Noise Cancellation',
    imageKey: 'heroHeadphones', badge: 'Premium', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Driver': '40mm', 'Battery': '40 Hours', 'ANC': 'Hybrid 30dB' },
    description: 'Studio-grade wireless headphones with hybrid active noise cancellation.',
    highlights: ['Hybrid ANC', 'Hi-Res Audio', 'Memory Foam Pads'],
    reviews: [],
  },
  {
    id: 37, slug: 'bass-wired-earphones', name: 'Bass Wired Earphones',
    brand: 'BeatBox', category: 'wired earphones', price: 399, oldPrice: 999, discount: 60,
    rating: 4.5, reviewCount: 1200, tag: 'Classic', usp: 'Tangle-Free Cable',
    imageKey: 'wiredEarphones', badge: 'Value', inStock: true,
    colors: [{ name: 'Red', code: '#ff0000' }],
    specs: { 'Driver': '10mm', 'Connector': '3.5mm Jack', 'Cable': 'Braided' },
    description: 'Classic wired earphones with deep bass, an in-line mic, and tangle-free braided cables.',
    highlights: ['Deep Bass', 'In-line HD Mic', 'Tangle-free Braided Cable'],
    reviews: [],
  },
  {
    id: 38, slug: 'desk-usb-speakers', name: 'Desk USB Speakers',
    brand: 'BeatBox', category: 'usb speakers', price: 799, oldPrice: 1999, discount: 60,
    rating: 4.3, reviewCount: 150, tag: 'Desktop', usp: 'Plug and Play',
    imageKey: 'usbSpeakers', badge: 'PC Setup', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Output': '6W RMS', 'Power': 'USB Powered', 'Lighting': 'Subtle RGB' },
    description: 'Compact plug-and-play USB speakers with modern angles and subtle RGB underglow for your desk.',
    highlights: ['USB Powered', 'Crisp Audio', 'Subtle RGB'],
    reviews: [],
  },
  {
    id: 39, slug: 'pro-conference-speakers', name: 'Pro Conference Speakers',
    brand: 'BeatBox', category: 'conference speakers', price: 3499, oldPrice: 8999, discount: 61,
    rating: 4.7, reviewCount: 85, tag: 'Business', usp: '360° Voice Pickup',
    imageKey: 'conferenceSpeakers', badge: 'Office', inStock: true,
    colors: [{ name: 'Silver', code: '#c0c0c0' }],
    specs: { 'Microphones': '6-Mic Array', 'Connectivity': 'Bluetooth/USB', 'Battery': '15 Hours' },
    description: 'Premium conference room speakerphone puck with 360-degree voice pickup and touch controls.',
    highlights: ['6-Mic Array', '360° Pickup', 'Echo Cancellation'],
    reviews: [],
  },
  {
    id: 40, slug: 'dual-wireless-microphones', name: 'Dual Wireless Microphones',
    brand: 'BeatBox', category: 'wireless microphones', price: 4999, oldPrice: 11999, discount: 58,
    rating: 4.8, reviewCount: 65, tag: 'Creator', usp: '100m Range',
    imageKey: 'wirelessMicrophones', badge: 'Pro Audio', inStock: true,
    colors: [{ name: 'Black', code: '#000000' }],
    specs: { 'Range': '100m', 'Latency': '5ms', 'Battery': '8 Hours/Mic' },
    description: 'Professional dual wireless microphone set with digital receiver for broadcasting and vlogging.',
    highlights: ['Dual Mics', '100m Wireless Range', 'Digital Receiver included'],
    reviews: [],
  },
  {
    id: 41, slug: 'gadget-cleaners', name: 'Gadget Cleaners Kit', brand: 'BeatBox', category: 'gadget cleaners', price: 299, oldPrice: 599, discount: 50, rating: 4.5, reviewCount: 150, tag: 'Care', usp: '7-in-1', imageKey: 'vacuumCleaner', badge: 'Essential', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Type': 'Cleaning Kit'}, description: '7-in-1 gadget cleaning kit for keyboards, earbuds, and screens.', highlights: ['Compact', 'Soft Brush'], reviews: []
  },
  {
    id: 42, slug: 'phone-wallet', name: 'Magnetic Phone Wallet', brand: 'BeatBox', category: 'phone wallet', price: 499, oldPrice: 999, discount: 50, rating: 4.6, reviewCount: 120, tag: 'Accessory', usp: 'MagSafe', imageKey: 'phoneWallet', badge: 'Premium', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Material': 'Vegan Leather'}, description: 'Premium vegan leather magnetic phone wallet that securely holds up to 3 cards.', highlights: ['MagSafe Compatible', 'Slim Design'], reviews: []
  },
  {
    id: 43, slug: 'cable-organiser', name: 'Magnetic Cable Organiser', brand: 'BeatBox', category: 'cable organiser', price: 199, oldPrice: 499, discount: 60, rating: 4.7, reviewCount: 300, tag: 'Desk', usp: 'Clutter Free', imageKey: 'cableOrganiser', badge: 'Neat', inStock: true, colors: [{name: 'Grey', code: '#888'}], specs: {'Material': 'Silicone'}, description: 'Keep your workspace tidy with these magnetic silicone cable organizers.', highlights: ['Strong Magnets', 'Reusable'], reviews: []
  },
  {
    id: 44, slug: 'wireless-keyboard', name: 'Pro Wireless Keyboard', brand: 'BeatBox', category: 'wireless keyboard', price: 1499, oldPrice: 3999, discount: 62, rating: 4.8, reviewCount: 410, tag: 'Work', usp: 'Multi-Device', imageKey: 'wirelessKeyboard', badge: 'Top Pick', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Type': 'Membrane'}, description: 'Slim multi-device wireless keyboard for seamless switching between PC and tablet.', highlights: ['Multi-Device', 'Quiet Keys'], reviews: []
  },
  {
    id: 45, slug: 'wired-keyboard', name: 'Classic Wired Keyboard', brand: 'BeatBox', category: 'wired keyboard', price: 499, oldPrice: 999, discount: 50, rating: 4.4, reviewCount: 200, tag: 'Office', usp: 'Durable', imageKey: 'wiredKeyboard', badge: 'Value', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Interface': 'USB'}, description: 'Durable and spill-resistant wired keyboard for everyday office use.', highlights: ['Spill Resistant', 'Plug & Play'], reviews: []
  },
  {
    id: 46, slug: 'gaming-keyboard', name: 'RGB Gaming Keyboard', brand: 'BeatBox', category: 'gaming keyboard', price: 2499, oldPrice: 5999, discount: 58, rating: 4.9, reviewCount: 850, tag: 'Esports', usp: 'Mechanical', imageKey: 'gamingKeyboard', badge: 'Gamer', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Switches': 'Blue Mechanical'}, description: 'Tactile mechanical gaming keyboard with per-key RGB lighting.', highlights: ['Blue Switches', 'Anti-Ghosting'], reviews: []
  },
  {
    id: 47, slug: 'wireless-mouse', name: 'Ergo Wireless Mouse', brand: 'BeatBox', category: 'wireless mouse', price: 799, oldPrice: 1999, discount: 60, rating: 4.7, reviewCount: 620, tag: 'Comfort', usp: 'Silent', imageKey: 'wirelessMouse', badge: 'Popular', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'DPI': '1600'}, description: 'Ergonomic wireless mouse with silent clicks and 12-month battery life.', highlights: ['Silent Clicks', 'Ergonomic'], reviews: []
  },
  {
    id: 48, slug: 'wired-mouse', name: 'Precision Wired Mouse', brand: 'BeatBox', category: 'wired mouse', price: 299, oldPrice: 699, discount: 57, rating: 4.5, reviewCount: 340, tag: 'Basic', usp: 'Optical', imageKey: 'wiredMouse', badge: 'Budget', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'DPI': '1000'}, description: 'Reliable optical wired mouse for smooth and precise tracking.', highlights: ['Optical Sensor', 'Ambidextrous'], reviews: []
  },
  {
    id: 49, slug: 'laptop-table', name: 'Foldable Laptop Table', brand: 'BeatBox', category: 'laptop table', price: 899, oldPrice: 1999, discount: 55, rating: 4.6, reviewCount: 500, tag: 'Home', usp: 'Portable', imageKey: 'laptopTable', badge: 'WFH', inStock: true, colors: [{name: 'Wood', code: '#deb887'}], specs: {'Material': 'MDF & Steel'}, description: 'Sturdy foldable laptop table perfect for working from bed or the couch.', highlights: ['Cup Holder', 'Tablet Slot'], reviews: []
  },
  {
    id: 50, slug: 'extension-board', name: 'Smart Extension Board', brand: 'BeatBox', category: 'extension board', price: 699, oldPrice: 1499, discount: 53, rating: 4.5, reviewCount: 210, tag: 'Power', usp: 'Surge Protection', imageKey: 'extensionBoard', badge: 'Safe', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Sockets': '4 AC, 2 USB'}, description: 'Surge-protected extension board with 4 AC sockets and 2 fast-charging USB ports.', highlights: ['Surge Protection', 'Fire Retardant'], reviews: []
  },
  {
    id: 51, slug: 'projectors', name: 'Mini HD Projectors', brand: 'BeatBox', category: 'projectors', price: 4999, oldPrice: 12999, discount: 61, rating: 4.6, reviewCount: 180, tag: 'Cinema', usp: '1080p Support', imageKey: 'projector', badge: 'Movie Night', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Resolution': '1080p Supported'}, description: 'Compact mini projector to bring the cinema experience to your bedroom.', highlights: ['120" Screen Size', 'Built-in Speaker'], reviews: []
  },
  {
    id: 52, slug: 'lcd-writing-pads', name: 'Digital LCD Writing Pads', brand: 'BeatBox', category: 'lcd writing pads', price: 399, oldPrice: 999, discount: 60, rating: 4.4, reviewCount: 420, tag: 'Kids', usp: 'Paperless', imageKey: 'lcdWritingPad', badge: 'Eco', inStock: true, colors: [{name: 'Blue', code: '#00f'}], specs: {'Screen': '8.5 Inch'}, description: 'Eco-friendly LCD writing pad for notes, doodles, and lists without wasting paper.', highlights: ['One-touch Erase', 'Eye Protection'], reviews: []
  },
  {
    id: 53, slug: 'computer-cables', name: 'High-Speed Computer Cables', brand: 'BeatBox', category: 'computer cables', price: 499, oldPrice: 1299, discount: 61, rating: 4.8, reviewCount: 310, tag: 'Network', usp: 'CAT8 LAN', imageKey: 'computerCables', badge: 'Fast', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Type': 'Ethernet CAT8'}, description: 'Ultra-fast CAT8 ethernet computer cables for zero-lag gaming and streaming.', highlights: ['40Gbps Speed', 'Gold Plated'], reviews: []
  },
  {
    id: 54, slug: 'wireless-presenter', name: 'Laser Wireless Presenter', brand: 'BeatBox', category: 'wireless presenter', price: 599, oldPrice: 1499, discount: 60, rating: 4.7, reviewCount: 190, tag: 'Office', usp: 'Red Laser', imageKey: 'wirelessPresenter', badge: 'Pro', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Range': '15m'}, description: 'Sleek wireless presenter remote with a bright red laser pointer for impactful meetings.', highlights: ['Plug & Play', '15m Range'], reviews: []
  },
  {
    id: 55, slug: 'car-bluetooth', name: 'Car Bluetooth Receiver', brand: 'BeatBox', category: 'car bluetooth', price: 399, oldPrice: 999, discount: 60, rating: 4.5, reviewCount: 330, tag: 'Audio', usp: 'AUX to Bluetooth', imageKey: 'smartTracker', badge: 'Upgrade', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Bluetooth': '5.0'}, description: 'Upgrade your old car stereo to wireless with this compact Bluetooth AUX receiver.', highlights: ['Hands-free Calling', '10hr Battery'], reviews: []
  },
  {
    id: 56, slug: 'car-mobile-holder', name: 'Dash Car Mobile Holder', brand: 'BeatBox', category: 'car mobile holder', price: 499, oldPrice: 1299, discount: 61, rating: 4.6, reviewCount: 450, tag: 'Nav', usp: 'Suction Cup', imageKey: 'mobileHolder', badge: 'Secure', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Mount': 'Dashboard/Windshield'}, description: 'Secure suction cup car mobile holder with a telescopic arm for optimal navigation viewing.', highlights: ['Strong Suction', 'Telescopic Arm'], reviews: []
  },
  {
    id: 57, slug: 'bike-mobile-holder', name: 'Alloy Bike Mobile Holder', brand: 'BeatBox', category: 'bike mobile holder', price: 599, oldPrice: 1499, discount: 60, rating: 4.8, reviewCount: 280, tag: 'Ride', usp: 'Anti-Shake', imageKey: 'mobileHolder', badge: 'Rugged', inStock: true, colors: [{name: 'Silver', code: '#c0c0c0'}], specs: {'Material': 'Aluminum Alloy'}, description: 'Rugged aluminum bike mobile holder that keeps your phone secure on the bumpiest trails.', highlights: ['Aluminum Build', '360° Rotation'], reviews: []
  },
  {
    id: 58, slug: 'car-wireless-charger', name: 'MagGrip Car Wireless Charger', brand: 'BeatBox', category: 'car wireless charger', price: 1499, oldPrice: 3999, discount: 62, rating: 4.7, reviewCount: 150, tag: 'Tech', usp: '15W Auto-Clamping', imageKey: 'wirelessCharger', badge: 'Futuristic', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Output': '15W Max'}, description: 'Futuristic auto-clamping car wireless charger that detects your phone and securely grips it.', highlights: ['Auto-Clamping', '15W Fast Charge'], reviews: []
  },
  {
    id: 59, slug: 'pressure-washer', name: 'High Pressure Washer', brand: 'BeatBox', category: 'pressure washer', price: 4999, oldPrice: 12999, discount: 61, rating: 4.8, reviewCount: 90, tag: 'Cleaning', usp: '1500W Motor', imageKey: 'vacuumCleaner', badge: 'Power', inStock: true, colors: [{name: 'Yellow', code: '#ff0'}], specs: {'Pressure': '120 Bar'}, description: 'Heavy-duty high pressure washer perfect for cleaning cars, bikes, and driveways effortlessly.', highlights: ['120 Bar Pressure', 'Foam Cannon Included'], reviews: []
  },
  {
    id: 60, slug: 'ear-cleaners', name: 'Smart Visual Ear Cleaners', brand: 'BeatBox', category: 'ear cleaners', price: 999, oldPrice: 2499, discount: 60, rating: 4.5, reviewCount: 220, tag: 'Hygiene', usp: '1080p Camera', imageKey: 'trimmer', badge: 'Tech', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Camera': '1080p HD'}, description: 'High-tech visual ear cleaner with an integrated 1080p camera that syncs directly to your phone.', highlights: ['1080p Camera', 'Soft Silicone Tips'], reviews: []
  },
  {
    id: 61, slug: 'tool-kit', name: '46-Piece Tool Kit', brand: 'BeatBox', category: 'tool kit', price: 899, oldPrice: 2499, discount: 64, rating: 4.7, reviewCount: 310, tag: 'DIY', usp: 'Chrome Vanadium', imageKey: 'laptopBag', badge: 'Handy', inStock: true, colors: [{name: 'Red', code: '#f00'}], specs: {'Pieces': '46'}, description: 'Comprehensive 46-piece socket and wrench tool kit forged from premium chrome vanadium steel.', highlights: ['Rust Resistant', 'Compact Case'], reviews: []
  },
  {
    id: 62, slug: 'humidifiers', name: 'Aroma Diffuser Humidifiers', brand: 'BeatBox', category: 'humidifiers', price: 799, oldPrice: 1999, discount: 60, rating: 4.8, reviewCount: 420, tag: 'Home', usp: 'RGB Lights', imageKey: 'electricKettle', badge: 'Relax', inStock: true, colors: [{name: 'Wood', code: '#deb887'}], specs: {'Capacity': '300ml'}, description: 'Ultrasonic aroma diffuser humidifier with soothing RGB lighting for a relaxing room ambiance.', highlights: ['Auto Shut-off', 'Ultra Quiet'], reviews: []
  },
  {
    id: 63, slug: 'air-blower', name: 'Heavy Duty Air Blower', brand: 'BeatBox', category: 'air blower', price: 999, oldPrice: 2499, discount: 60, rating: 4.6, reviewCount: 150, tag: 'Tools', usp: '500W Power', imageKey: 'portableFan', badge: 'Strong', inStock: true, colors: [{name: 'Blue', code: '#00f'}], specs: {'Power': '500W'}, description: 'High-velocity 500W air blower for cleaning PC internals and clearing dust from tight spaces.', highlights: ['Unbreakable Body', 'Dust Bag Included'], reviews: []
  },
  {
    id: 64, slug: 'timers', name: 'Digital Pomodoro Timers', brand: 'BeatBox', category: 'timers', price: 399, oldPrice: 999, discount: 60, rating: 4.7, reviewCount: 290, tag: 'Focus', usp: 'Magnetic Back', imageKey: 'smartTracker', badge: 'Study', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Display': 'LED'}, description: 'Sleek digital rotating timer with a magnetic back, perfect for the Pomodoro technique and cooking.', highlights: ['Twist to Set', 'Loud Alarm'], reviews: []
  },
  {
    id: 65, slug: 'massagers', name: 'Deep Tissue Massagers', brand: 'BeatBox', category: 'massagers', price: 1999, oldPrice: 4999, discount: 60, rating: 4.9, reviewCount: 880, tag: 'Health', usp: 'Fascia Gun', imageKey: 'trimmer', badge: 'Recovery', inStock: true, colors: [{name: 'Grey', code: '#888'}], specs: {'Speeds': '6 Levels'}, description: 'Professional grade percussion massage gun to relieve muscle tension and accelerate recovery.', highlights: ['4 Massage Heads', 'Quiet Motor'], reviews: []
  },
  {
    id: 66, slug: 'smart-sealers', name: 'Mini smart Sealers', brand: 'BeatBox', category: 'smart sealers', price: 299, oldPrice: 799, discount: 62, rating: 4.4, reviewCount: 120, tag: 'Kitchen', usp: 'Heat Sealing', imageKey: 'smartTracker', badge: 'Fresh', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Battery': 'AA Operated'}, description: 'Compact mini heat sealer to easily reseal snack bags and keep food fresh for longer.', highlights: ['Instant Heat', 'Magnetic Base'], reviews: []
  },
  {
    id: 67, slug: 'rechargeable-battery', name: 'AA Rechargeable Battery Set', brand: 'BeatBox', category: 'rechargeable battery', price: 699, oldPrice: 1499, discount: 53, rating: 4.8, reviewCount: 500, tag: 'Power', usp: '2800mAh', imageKey: 'powerBank', badge: 'Eco', inStock: true, colors: [{name: 'Green', code: '#0f0'}], specs: {'Capacity': '2800mAh'}, description: 'Pack of 4 high-capacity Ni-MH rechargeable batteries. Stop buying disposable batteries!', highlights: ['Pre-charged', '1000+ Cycles'], reviews: []
  },
  // Soundbars (4 more)
  { id: 68, slug: 'soundbar-pro', name: 'BeatBox Soundbar Pro 5.1', brand: 'BeatBox', category: 'soundbars', price: 6999, oldPrice: 14999, discount: 53, rating: 4.8, reviewCount: 320, tag: 'Premium', usp: '5.1 Surround', imageKey: 'soundbarPro51', badge: 'Hot', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Channels': '5.1', 'Power': '200W'}, description: 'Immersive 5.1 surround soundbar for the ultimate home cinema experience.', highlights: ['5.1 Surround', 'Bluetooth 5.0'], reviews: [] },
  { id: 69, slug: 'soundbar-elite', name: 'BeatBox Soundbar Elite S9', brand: 'BeatBox', category: 'soundbars', price: 8999, oldPrice: 19999, discount: 55, rating: 4.9, reviewCount: 210, tag: 'Flagship', usp: 'Dolby Atmos', imageKey: 'soundbarEliteS9', badge: 'Top', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Audio': 'Dolby Atmos', 'Power': '320W'}, description: 'Flagship soundbar with Dolby Atmos and wireless subwoofer for audiophiles.', highlights: ['Dolby Atmos', 'Wireless Sub'], reviews: [] },
  { id: 70, slug: 'soundbar-mini', name: 'BeatBox Soundbar Mini 2.1', brand: 'BeatBox', category: 'soundbars', price: 3499, oldPrice: 7999, discount: 56, rating: 4.6, reviewCount: 450, tag: 'Compact', usp: '2.1 Channel', imageKey: 'soundbarMini21', badge: 'Value', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Channels': '2.1', 'Power': '80W'}, description: 'Compact 2.1 soundbar perfect for small rooms and gaming setups.', highlights: ['Compact Design', 'Deep Bass'], reviews: [] },
  { id: 71, slug: 'soundbar-gaming', name: 'BeatBox Gaming Soundbar X', brand: 'BeatBox', category: 'soundbars', price: 4999, oldPrice: 10999, discount: 54, rating: 4.7, reviewCount: 380, tag: 'Gaming', usp: 'Virtual 7.1', imageKey: 'gamingSoundbarX', badge: 'Gamer', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Audio': 'Virtual 7.1', 'Power': '120W'}, description: 'Gaming-optimized soundbar with virtual 7.1 surround and RGB accents.', highlights: ['Virtual 7.1', 'Low Latency'], reviews: [] },
  // Party Speakers (4 more)
  { id: 72, slug: 'party-boom', name: 'Party Boom 1500', brand: 'BeatBox', category: 'party speakers', price: 12999, oldPrice: 24999, discount: 48, rating: 4.8, reviewCount: 290, tag: 'Loud', usp: '1500W Peak', imageKey: 'partySpeakerHero', badge: 'Beast', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Power': '1500W Peak', 'Battery': '8 Hours'}, description: 'Massive party speaker with 1500W peak power and built-in disco lights.', highlights: ['Disco Lights', 'Mic Input'], reviews: [] },
  { id: 73, slug: 'party-blast', name: 'Party Blast Tower', brand: 'BeatBox', category: 'party speakers', price: 14999, oldPrice: 29999, discount: 50, rating: 4.9, reviewCount: 180, tag: 'Tower', usp: 'Tower Speaker', imageKey: 'partySpeakerHero', badge: 'Epic', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Height': '1.2m', 'Power': '800W'}, description: 'Tall tower party speaker with a karaoke mic and FM radio.', highlights: ['Karaoke Ready', 'FM Radio'], reviews: [] },
  { id: 74, slug: 'party-max', name: 'Party Max 2000', brand: 'BeatBox', category: 'party speakers', price: 18999, oldPrice: 39999, discount: 52, rating: 4.9, reviewCount: 120, tag: 'Pro', usp: '2000W RMS', imageKey: 'partySpeakerHero', badge: 'King', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Power': '2000W RMS'}, description: 'Professional-grade party speaker for outdoor events and large gatherings.', highlights: ['Outdoor Ready', 'Dual Woofer'], reviews: [] },
  { id: 75, slug: 'party-lite', name: 'Party Lite Wireless', brand: 'BeatBox', category: 'party speakers', price: 7999, oldPrice: 16999, discount: 52, rating: 4.6, reviewCount: 410, tag: 'Portable', usp: 'Wireless', imageKey: 'partySpeakerHero', badge: 'Portable', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Battery': '12 Hours', 'Power': '60W'}, description: 'Portable party speaker with 12-hour battery and splash resistance.', highlights: ['IPX5 Splash Proof', 'Carry Handle'], reviews: [] },
  // Portable Speakers (4 more)
  { id: 76, slug: 'portable-rugged', name: 'Portable Rugged X3', brand: 'BeatBox', category: 'portable speakers', price: 2499, oldPrice: 5999, discount: 58, rating: 4.8, reviewCount: 520, tag: 'Rugged', usp: 'IP67 Waterproof', imageKey: 'portableSpeakerHero', badge: 'Adventure', inStock: true, colors: [{name: 'Green', code: '#228b22'}], specs: {'Rating': 'IP67', 'Battery': '24 Hours'}, description: 'Fully waterproof rugged bluetooth speaker for outdoor adventures.', highlights: ['IP67 Waterproof', '24Hr Battery'], reviews: [] },
  { id: 77, slug: 'portable-bass', name: 'Portable Bass Booster', brand: 'BeatBox', category: 'portable speakers', price: 1999, oldPrice: 4499, discount: 55, rating: 4.7, reviewCount: 640, tag: 'Bass', usp: '360° Bass', imageKey: 'portableSpeakerHero', badge: 'Boom', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Bass': '360° Radiator', 'Battery': '16 Hours'}, description: 'Portable speaker with a 360° passive bass radiator for room-filling sound.', highlights: ['360° Sound', 'TWS Pairable'], reviews: [] },
  { id: 78, slug: 'portable-mini', name: 'Pocket Mini Speaker', brand: 'BeatBox', category: 'portable speakers', price: 999, oldPrice: 2499, discount: 60, rating: 4.5, reviewCount: 880, tag: 'Mini', usp: 'Pocket Size', imageKey: 'portableSpeakerHero', badge: 'Tiny', inStock: true, colors: [{name: 'Blue', code: '#00f'}], specs: {'Size': 'Pocket', 'Battery': '8 Hours'}, description: 'Ultra-compact pocket speaker that punches well above its size.', highlights: ['Clip & Go', 'USB-C Charging'], reviews: [] },
  { id: 79, slug: 'portable-fabric', name: 'Fabric Portable Speaker', brand: 'BeatBox', category: 'portable speakers', price: 1499, oldPrice: 3499, discount: 57, rating: 4.6, reviewCount: 390, tag: 'Style', usp: 'Premium Fabric', imageKey: 'portableSpeakerHero', badge: 'Chic', inStock: true, colors: [{name: 'Grey', code: '#888'}], specs: {'Cover': 'Premium Fabric', 'Battery': '20 Hours'}, description: 'Stylish fabric-wrapped portable speaker with rich, warm audio.', highlights: ['Premium Fabric', 'Multi-Color'], reviews: [] },
  // TWS (4 more)
  { id: 80, slug: 'tws-sport', name: 'TWS Sport Pro', brand: 'BeatBox', category: 'tws', price: 1999, oldPrice: 4999, discount: 60, rating: 4.7, reviewCount: 720, tag: 'Sport', usp: 'IPX5 Sweat Proof', imageKey: 'twsHero', badge: 'Active', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Rating': 'IPX5', 'Playback': '36 Hours'}, description: 'Sport-tuned TWS earbuds with secure ear hooks and sweat resistance.', highlights: ['IPX5 Rated', 'Ear Hook Design'], reviews: [] },
  { id: 81, slug: 'tws-anc', name: 'TWS ANC Elite', brand: 'BeatBox', category: 'tws', price: 3499, oldPrice: 7999, discount: 56, rating: 4.9, reviewCount: 480, tag: 'ANC', usp: 'Hybrid ANC', imageKey: 'twsHero', badge: 'Quiet', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'ANC': 'Hybrid', 'Playback': '40 Hours'}, description: 'Premium hybrid ANC TWS earbuds for crystal-clear calls and music.', highlights: ['Hybrid ANC', '40Hr Total'], reviews: [] },
  { id: 82, slug: 'tws-lite', name: 'TWS Lite Everyday', brand: 'BeatBox', category: 'tws', price: 799, oldPrice: 1999, discount: 60, rating: 4.5, reviewCount: 1100, tag: 'Budget', usp: 'Best Value', imageKey: 'twsHero', badge: 'Value', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Playback': '24 Hours', 'Connect': 'BT 5.0'}, description: 'Everyday TWS earbuds offering great sound at an unbeatable price.', highlights: ['24Hr Battery', 'Touch Controls'], reviews: [] },
  { id: 83, slug: 'tws-gaming', name: 'TWS Gaming Buds', brand: 'BeatBox', category: 'tws', price: 2499, oldPrice: 5999, discount: 58, rating: 4.8, reviewCount: 350, tag: 'Gaming', usp: '50ms Low Latency', imageKey: 'twsHero', badge: 'Pro', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Latency': '50ms', 'Playback': '30 Hours'}, description: 'Low latency gaming TWS earbuds with a dedicated gaming mode.', highlights: ['50ms Latency', 'RGB Case'], reviews: [] },
  // Neckbands (2 more)
  { id: 84, slug: 'neckband-pro', name: 'Neckband Pro ANC', brand: 'BeatBox', category: 'neckbands', price: 1499, oldPrice: 3499, discount: 57, rating: 4.8, reviewCount: 560, tag: 'ANC', usp: 'Active Noise Cancel', imageKey: 'neckbandHero', badge: 'Smart', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'ANC': 'Active', 'Playback': '30 Hours'}, description: 'Neckband with active noise cancellation for undisturbed listening.', highlights: ['ANC Mode', 'Fast Charge'], reviews: [] },
  { id: 85, slug: 'neckband-sport', name: 'Neckband Sport Flex', brand: 'BeatBox', category: 'neckbands', price: 1299, oldPrice: 2999, discount: 56, rating: 4.7, reviewCount: 430, tag: 'Sport', usp: 'Flexible Band', imageKey: 'neckbandHero', badge: 'Flex', inStock: true, colors: [{name: 'Blue', code: '#00f'}], specs: {'Band': 'Memory Flex', 'Playback': '28 Hours'}, description: 'Flexible memory-band neckband that fits every neck comfortably.', highlights: ['Memory Flex Band', 'IPX4 Rated'], reviews: [] },
  // Wireless Headphones (4 more)
  { id: 86, slug: 'wireless-headphones-anc', name: 'ANC Headphones Pro', brand: 'BeatBox', category: 'wireless headphones', price: 4999, oldPrice: 10999, discount: 54, rating: 4.9, reviewCount: 290, tag: 'ANC', usp: '45dB Noise Cancel', imageKey: 'wirelessHeadphonesHero', badge: 'Silent', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'ANC': '45dB', 'Playback': '50 Hours'}, description: 'Industry-leading 45dB ANC headphones with premium leather cushions.', highlights: ['45dB ANC', '50Hr Playback'], reviews: [] },
  { id: 87, slug: 'wireless-headphones-lite', name: 'Wireless Headphones Lite', brand: 'BeatBox', category: 'wireless headphones', price: 1999, oldPrice: 4999, discount: 60, rating: 4.6, reviewCount: 780, tag: 'Value', usp: 'Best Value', imageKey: 'wirelessHeadphonesHero', badge: 'Popular', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Playback': '40 Hours', 'Driver': '40mm'}, description: 'Lightweight wireless headphones with great sound for everyday use.', highlights: ['Foldable Design', '40Hr Playback'], reviews: [] },
  { id: 88, slug: 'wireless-headphones-studio', name: 'Studio Headphones X', brand: 'BeatBox', category: 'wireless headphones', price: 6999, oldPrice: 14999, discount: 53, rating: 4.9, reviewCount: 150, tag: 'Studio', usp: 'Studio Grade', imageKey: 'wirelessHeadphonesHero', badge: 'Creator', inStock: true, colors: [{name: 'Silver', code: '#c0c0c0'}], specs: {'Driver': '50mm', 'Freq': '5Hz-40kHz'}, description: 'Studio-grade wireless headphones for professional music production.', highlights: ['Studio Grade', 'Flat EQ'], reviews: [] },
  { id: 89, slug: 'wireless-headphones-kids', name: 'Kids Wireless Headphones', brand: 'BeatBox', category: 'wireless headphones', price: 999, oldPrice: 2499, discount: 60, rating: 4.7, reviewCount: 920, tag: 'Kids', usp: '85dB Safe Volume', imageKey: 'wirelessHeadphonesHero', badge: 'Safe', inStock: true, colors: [{name: 'Pink', code: '#ffc0cb'}], specs: {'Volume Limit': '85dB', 'Playback': '25 Hours'}, description: 'Safe volume-limited wireless headphones designed for children.', highlights: ['85dB Limit', 'Flexible Headband'], reviews: [] },
  // Wired Earphones (4 more)
  { id: 90, slug: 'wired-bass', name: 'Wired Bass Boost', brand: 'BeatBox', category: 'wired earphones', price: 499, oldPrice: 1199, discount: 58, rating: 4.6, reviewCount: 1200, tag: 'Bass', usp: 'Deep Bass', imageKey: 'wiredEarphonesHero', badge: 'Boom', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Driver': '12mm Bass', 'Jack': '3.5mm'}, description: 'Bass-boosted wired earphones with a powerful 12mm driver.', highlights: ['Deep Bass', 'In-line Mic'], reviews: [] },
  { id: 91, slug: 'wired-pro', name: 'Wired Pro IEM', brand: 'BeatBox', category: 'wired earphones', price: 799, oldPrice: 1999, discount: 60, rating: 4.8, reviewCount: 480, tag: 'IEM', usp: 'Audiophile Grade', imageKey: 'wiredEarphonesHero', badge: 'HiFi', inStock: true, colors: [{name: 'Silver', code: '#c0c0c0'}], specs: {'Driver': 'Balanced Armature', 'Impedance': '32 Ohm'}, description: 'Audiophile-grade IEM earphones for detailed, accurate sound reproduction.', highlights: ['Balanced Armature', 'Braided Cable'], reviews: [] },
  { id: 92, slug: 'wired-sport', name: 'Wired Sport Earphones', brand: 'BeatBox', category: 'wired earphones', price: 599, oldPrice: 1499, discount: 60, rating: 4.5, reviewCount: 670, tag: 'Sport', usp: 'Ear Hook Design', imageKey: 'wiredEarphonesHero', badge: 'Active', inStock: true, colors: [{name: 'Red', code: '#f00'}], specs: {'Rating': 'IPX4', 'Jack': '3.5mm'}, description: 'Sport wired earphones with secure ear hooks and sweat resistance.', highlights: ['IPX4 Rated', 'Tangle-Free Cable'], reviews: [] },
  { id: 93, slug: 'wired-typec', name: 'Type-C Wired Earphones', brand: 'BeatBox', category: 'wired earphones', price: 899, oldPrice: 1999, discount: 55, rating: 4.7, reviewCount: 390, tag: 'Type-C', usp: 'USB-C + DAC', imageKey: 'wiredEarphonesHero', badge: 'Modern', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Connector': 'USB-C', 'DAC': 'Built-in'}, description: 'Modern USB-C earphones with a built-in DAC for improved audio quality.', highlights: ['Built-in DAC', 'Hi-Res Audio'], reviews: [] },
  // USB Speakers (4 more)
  { id: 94, slug: 'usb-speakers-rgb', name: 'USB RGB Gaming Speakers', brand: 'BeatBox', category: 'usb speakers', price: 1299, oldPrice: 2999, discount: 56, rating: 4.7, reviewCount: 430, tag: 'RGB', usp: 'RGB Lighting', imageKey: 'usbSpeakersHero', badge: 'Gamer', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Power': '10W RMS', 'Lighting': 'RGB'}, description: 'USB gaming speakers with vibrant RGB lighting and punchy bass.', highlights: ['RGB Lighting', 'Headphone Jack'], reviews: [] },
  { id: 95, slug: 'usb-speakers-pro', name: 'USB Studio Monitors', brand: 'BeatBox', category: 'usb speakers', price: 1999, oldPrice: 4499, discount: 55, rating: 4.8, reviewCount: 220, tag: 'Studio', usp: 'Flat Response', imageKey: 'usbSpeakersHero', badge: 'Creator', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Power': '20W RMS', 'Response': 'Flat'}, description: 'USB studio monitor speakers for accurate audio mixing and content creation.', highlights: ['Flat Frequency', 'XLR Input'], reviews: [] },
  { id: 96, slug: 'usb-speakers-mini', name: 'USB Mini Desktop Speakers', brand: 'BeatBox', category: 'usb speakers', price: 699, oldPrice: 1699, discount: 58, rating: 4.5, reviewCount: 760, tag: 'Mini', usp: 'Bus Powered', imageKey: 'usbSpeakersHero', badge: 'Compact', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Power': '5W RMS', 'Powered': 'USB Bus'}, description: 'No power adapter needed. Just plug into your PC and enjoy clear desktop audio.', highlights: ['Bus Powered', 'Volume Knob'], reviews: [] },
  { id: 97, slug: 'usb-speakers-soundbar', name: 'USB Desktop Soundbar', brand: 'BeatBox', category: 'usb speakers', price: 1499, oldPrice: 3499, discount: 57, rating: 4.6, reviewCount: 310, tag: 'Soundbar', usp: 'Under Monitor', imageKey: 'usbSpeakersHero', badge: 'Space Saver', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Power': '15W RMS', 'Form': 'Under-Monitor'}, description: 'Slim USB soundbar designed to sit neatly under your monitor.', highlights: ['Space-Saving Design', 'Optical Input'], reviews: [] },
  // Conference Speakers (4 more)
  { id: 98, slug: 'conf-360', name: 'Conference Speaker 360', brand: 'BeatBox', category: 'conference speakers', price: 4999, oldPrice: 11999, discount: 58, rating: 4.8, reviewCount: 140, tag: '360°', usp: '360° Pickup', imageKey: 'conferenceSpeakerHero', badge: 'Pro', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Mics': '6 Array', 'Range': '5m'}, description: 'Omnidirectional conference speaker with 6-mic array for crystal-clear meetings.', highlights: ['360° Pickup', 'Echo Cancel'], reviews: [] },
  { id: 99, slug: 'conf-mini', name: 'Portable Conference Speaker', brand: 'BeatBox', category: 'conference speakers', price: 2999, oldPrice: 6999, discount: 57, rating: 4.6, reviewCount: 230, tag: 'Portable', usp: 'Travel Ready', imageKey: 'conferenceSpeakerHero', badge: 'Compact', inStock: true, colors: [{name: 'Grey', code: '#888'}], specs: {'Battery': '10 Hours', 'Weight': '300g'}, description: 'Portable conference speakerphone for remote workers and business travelers.', highlights: ['10Hr Battery', 'USB-C & BT'], reviews: [] },
  { id: 100, slug: 'conf-elite', name: 'Conference Elite Hub', brand: 'BeatBox', category: 'conference speakers', price: 7999, oldPrice: 17999, discount: 55, rating: 4.9, reviewCount: 80, tag: 'Elite', usp: 'AI Noise Cancel', imageKey: 'conferenceSpeakerHero', badge: 'AI', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'AI': 'Noise Cancel', 'Mics': '8 Array'}, description: 'AI-powered conference speaker that removes background noise automatically.', highlights: ['AI Noise Cancel', '8-Mic Array'], reviews: [] },
  { id: 101, slug: 'conf-duo', name: 'Dual Conference Speakerphone', brand: 'BeatBox', category: 'conference speakers', price: 5999, oldPrice: 13999, discount: 57, rating: 4.7, reviewCount: 110, tag: 'Dual', usp: 'Dual Unit Link', imageKey: 'conferenceSpeakerHero', badge: 'Large Room', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Units': '2 Daisy-chainable', 'Range': '10m'}, description: 'Two daisy-chainable conference speakers for large boardrooms.', highlights: ['Daisy-Chain', '10m Coverage'], reviews: [] },
  // Wireless Microphones (4 more)
  { id: 102, slug: 'mic-handheld', name: 'Wireless Handheld Mic', brand: 'BeatBox', category: 'wireless microphones', price: 5999, oldPrice: 12999, discount: 53, rating: 4.8, reviewCount: 180, tag: 'Stage', usp: 'Stage Ready', imageKey: 'wirelessMicHero', badge: 'Live', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Range': '80m', 'Battery': '10 Hours'}, description: 'Professional wireless handheld mic for live performances and events.', highlights: ['80m Range', 'Anti-Drop Design'], reviews: [] },
  { id: 103, slug: 'mic-lavalier', name: 'Wireless Lavalier Clip Mic', brand: 'BeatBox', category: 'wireless microphones', price: 3499, oldPrice: 7999, discount: 56, rating: 4.7, reviewCount: 390, tag: 'Vlog', usp: 'Clip-On Design', imageKey: 'wirelessMicHero', badge: 'Creator', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Latency': '20ms', 'Battery': '8 Hours'}, description: 'Wireless clip-on lavalier mic for vloggers and content creators.', highlights: ['Clip-On Design', 'Noise Shield'], reviews: [] },
  { id: 104, slug: 'mic-duo', name: 'Wireless Dual Mic System', brand: 'BeatBox', category: 'wireless microphones', price: 8999, oldPrice: 19999, discount: 55, rating: 4.9, reviewCount: 95, tag: 'Dual', usp: '2-Person Recording', imageKey: 'wirelessMicHero', badge: 'Interview', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Channels': 'Dual', 'Range': '100m'}, description: 'Dual wireless mic system ideal for interviews and two-person podcasts.', highlights: ['Dual Channel', 'Mixer Output'], reviews: [] },
  { id: 105, slug: 'mic-studio', name: 'Studio Wireless Condenser', brand: 'BeatBox', category: 'wireless microphones', price: 12999, oldPrice: 27999, discount: 53, rating: 4.9, reviewCount: 60, tag: 'Studio', usp: 'Condenser Grade', imageKey: 'wirelessMicHero', badge: 'Pro Audio', inStock: true, colors: [{name: 'Silver', code: '#c0c0c0'}], specs: {'Type': 'Condenser', 'Freq': '20Hz-20kHz'}, description: 'Premium wireless condenser microphone for studio-quality recordings.', highlights: ['Condenser Capsule', 'Low Self-Noise'], reviews: [] },
  // Storage & Calculators
  { id: 106, slug: 'ssd-pro-1tb', name: 'BeatBox SSD Pro 1TB', brand: 'BeatBox', category: 'ssd cards', price: 5999, oldPrice: 10999, discount: 45, rating: 4.8, reviewCount: 310, tag: 'Storage', usp: 'NVMe Gen4', imageKey: 'ssdDriveImage', badge: 'Fast', inStock: true, colors: [{name: 'Black', code: '#000'}], capacities: ['500GB', '1TB', '2TB'], specs: {'Capacity': '1TB', 'Type': 'NVMe'}, description: 'Lightning fast 1TB NVMe Gen4 SSD for ultimate gaming and productivity.', highlights: ['7000MB/s Read', 'Heatsink Included'], reviews: [] },
  { id: 107, slug: 'pendrive-128gb', name: 'BeatBox Flash Pendrive', brand: 'BeatBox', category: 'pendrives', price: 999, oldPrice: 1999, discount: 50, rating: 4.6, reviewCount: 520, tag: 'Storage', usp: 'USB 3.2', imageKey: 'pendriveFlashImage', badge: 'Compact', inStock: true, colors: [{name: 'Silver', code: '#c0c0c0'}], capacities: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'], specs: {'Interface': 'USB 3.2'}, description: 'Compact and durable metal body pendrive.', highlights: ['Metal Body', 'Waterproof'], reviews: [] },
  { id: 117, slug: 'memory-card-256gb', name: 'BeatBox Ultra MicroSD', brand: 'BeatBox', category: 'memory cards', price: 1499, oldPrice: 2999, discount: 50, rating: 4.8, reviewCount: 410, tag: 'Storage', usp: 'Class 10 U3', imageKey: 'microsdCardImage', badge: 'Fast', inStock: true, colors: [{name: 'Black', code: '#000'}], capacities: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'], specs: {'Type': 'MicroSDXC'}, description: 'High-speed MicroSD card perfect for 4K video recording and smartphones.', highlights: ['130MB/s Read', 'Adapter Included'], reviews: [] },
  { id: 108, slug: 'calc-scientific', name: 'Scientific Calculator X1', brand: 'BeatBox', category: 'calculators', price: 799, oldPrice: 1499, discount: 46, rating: 4.7, reviewCount: 140, tag: 'Office', usp: '417 Functions', imageKey: 'scientificCalculatorImage', badge: 'Student', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Functions': '417', 'Display': '2-Line'}, description: 'Advanced scientific calculator perfect for engineering and science students.', highlights: ['Solar Powered', 'Matrix Calculations'], reviews: [] },
  // Smart Watches
  { id: 109, slug: 'smartwatch-active', name: 'BeatBox Watch Active', brand: 'BeatBox', category: 'smart watches', price: 2999, oldPrice: 6999, discount: 57, rating: 4.8, reviewCount: 890, tag: 'Wearable', usp: 'Amoled Display', imageKey: 'smartwatchProImage', badge: 'Hot', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Display': '1.4" Amoled', 'Battery': '7 Days'}, description: 'Feature-packed smartwatch with heart rate monitoring and fitness tracking.', highlights: ['SpO2 Monitor', 'IP68 Waterproof'], reviews: [] },
  { id: 110, slug: 'smartwatch-pro', name: 'BeatBox Watch Pro', brand: 'BeatBox', category: 'smart watches', price: 4999, oldPrice: 9999, discount: 50, rating: 4.9, reviewCount: 450, tag: 'Wearable', usp: 'Bluetooth Calling', imageKey: 'smartwatchProImage', badge: 'Premium', inStock: true, colors: [{name: 'Silver', code: '#c0c0c0'}], specs: {'Display': '1.78" Amoled', 'Battery': '10 Days'}, description: 'Premium smartwatch with built-in speaker for Bluetooth calling.', highlights: ['Bluetooth Calling', 'Metal Body'], reviews: [] },
  // CCTV
  { id: 111, slug: 'cctv-outdoor', name: 'Smart Outdoor Camera', brand: 'BeatBox', category: 'camera', price: 3499, oldPrice: 7999, discount: 56, rating: 4.7, reviewCount: 320, tag: 'Security', usp: '1080p PTZ', imageKey: 'cctvCameraImage', badge: 'Secure', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Resolution': '1080p', 'Night Vision': 'Color'}, description: 'Outdoor PTZ camera with color night vision and motion tracking.', highlights: ['360° Pan', '2-Way Audio'], reviews: [] },
  { id: 112, slug: 'cctv-indoor', name: 'Mini Indoor WiFi Cam', brand: 'BeatBox', category: 'camera', price: 1999, oldPrice: 3999, discount: 50, rating: 4.6, reviewCount: 280, tag: 'Security', usp: 'Compact Size', imageKey: 'cctvCameraImage', badge: 'Baby Monitor', inStock: true, colors: [{name: 'White', code: '#fff'}], specs: {'Resolution': '1080p', 'Storage': 'MicroSD'}, description: 'Discreet indoor WiFi camera perfect for baby monitoring or pet watching.', highlights: ['Motion Alerts', 'Cloud Storage'], reviews: [] },
  // New Products Menu Items
  { id: 113, slug: 'latest-drops-audio', name: 'BeatBox Latest Drops Edition', brand: 'BeatBox', category: 'latest drops', price: 12999, oldPrice: 24999, discount: 48, rating: 5.0, reviewCount: 15, tag: 'Exclusive', usp: 'Limited Run', imageKey: 'beatboxSmartCapsuleImage', badge: 'New', inStock: true, colors: [{name: 'Neon', code: '#00f3ff'}], specs: {'Type': 'Exclusive', 'Status': 'Just Dropped'}, description: 'Be the first to experience our latest drops. This exclusive edition is strictly limited in quantity.', highlights: ['Latest Drops', 'Collector Edition'], reviews: [] },
  { id: 114, slug: 'trending-gear-speaker', name: 'Trending Gear Pro Speaker', brand: 'BeatBox', category: 'trending gear', price: 8999, oldPrice: 15999, discount: 43, rating: 4.9, reviewCount: 450, tag: 'Trending', usp: 'Viral Hit', imageKey: 'partyBoom1500Image', badge: 'Trending', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Type': 'Speaker', 'Popularity': 'Viral'}, description: 'The trending gear everyone is talking about on social media. Grab yours before it sells out.', highlights: ['Trending Gear', 'High Demand'], reviews: [] },
  { id: 115, slug: 'upcoming-releases-preview', name: 'BeatBox Upcoming Releases VIP', brand: 'BeatBox', category: 'upcoming releases', price: 499, oldPrice: 999, discount: 50, rating: 4.8, reviewCount: 20, tag: 'Pre-Order', usp: 'Early Access', imageKey: 'stoneGrenadeProImage', badge: 'Upcoming', inStock: true, colors: [{name: 'Silver', code: '#c0c0c0'}], specs: {'Type': 'Preview Pass', 'Release': 'Next Month'}, description: 'A VIP pass giving you early access to upcoming releases and exclusive discounts.', highlights: ['Upcoming Releases', 'VIP Access'], reviews: [] },
  { id: 116, slug: 'limited-editions-gold', name: 'BeatBox Limited Editions Gold', brand: 'BeatBox', category: 'limited editions', price: 29999, oldPrice: 49999, discount: 40, rating: 5.0, reviewCount: 5, tag: 'Luxury', usp: '24K Gold Plated', imageKey: 'soundbarEliteS9Image', badge: 'Limited', inStock: true, colors: [{name: 'Gold', code: '#ffd700'}], specs: {'Finish': '24K Gold', 'Units': '100 Worldwide'}, description: 'Part of our exclusive limited editions line. Only 100 units made globally.', highlights: ['Limited Editions', 'Certificate Included'], reviews: [] }
]

export const getProductById = (id) => PRODUCTS.find((p) => p.id === Number(id))
export const getProductsByCategory = (cat) => cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)
export const getRelatedProducts = (product, count = 4) =>
  PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count)



