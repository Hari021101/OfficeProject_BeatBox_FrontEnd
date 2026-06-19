import twsImg from '../assets/category-covers/tws.png';
import headphonesImg from '../assets/category-covers/wireless_headphones.png';
import speakersImg from '../assets/category-covers/portable_speakers.png';
import soundbarsImg from '../assets/category-covers/soundbars.png';
import mobileAccImg from '../assets/category-covers/mobile_accessories.png';
import computerAccImg from '../assets/category-covers/computer_accessories.png';
import carAccImg from '../assets/category-covers/car_accessories.png';
import smartGadgetsImg from '../assets/category-covers/smart_gadgets.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5089';

// Map normalized category names to pre-generated cover assets
const COVER_MAP = {
  'tws': twsImg,
  'wireless headphones': headphonesImg,
  'portable speakers': speakersImg,
  'soundbars': soundbarsImg,
  'mobile accessories': mobileAccImg,
  'computer accessories': computerAccImg,
  'car accessories': carAccImg,
  'smart gadgets': smartGadgetsImg
};

/**
 * Resolves the cover image for a category.
 * Prioritizes DB image URL, falls back to pre-generated cover image,
 * and falls back to a dynamically generated neon SVG if both are missing.
 */
export const getCategoryCover = (categoryName = '', dbImageUrl = '') => {
  // 1. Return database image if available
  if (dbImageUrl) {
    if (
      dbImageUrl.startsWith('http://') ||
      dbImageUrl.startsWith('https://') ||
      dbImageUrl.startsWith('data:')
    ) {
      return dbImageUrl;
    }
    return `${API_BASE}${dbImageUrl}`;
  }

  // 2. Return pre-generated assets from COVER_MAP
  const normalized = categoryName.trim().toLowerCase();
  if (COVER_MAP[normalized]) {
    return COVER_MAP[normalized];
  }

  // Exact-match partial fallbacks (in case of subtle naming variants)
  if (normalized.includes('earbud') || normalized.includes('tws') || normalized.includes('airpod')) {
    return twsImg;
  }
  if (normalized.includes('headphone') || normalized.includes('headset') || normalized.includes('neckband')) {
    return headphonesImg;
  }
  if (normalized.includes('speaker') || normalized.includes('party')) {
    return speakersImg;
  }
  if (normalized.includes('soundbar') || normalized.includes('cinema')) {
    return soundbarsImg;
  }
  if (normalized.includes('mobile') || normalized.includes('phone') || normalized.includes('cable')) {
    return mobileAccImg;
  }
  if (normalized.includes('computer') || normalized.includes('keyboard') || normalized.includes('mouse') || normalized.includes('laptop')) {
    return computerAccImg;
  }
  if (normalized.includes('car') || normalized.includes('bike') || normalized.includes('charger')) {
    return carAccImg;
  }
  if (normalized.includes('gadget') || normalized.includes('smart') || normalized.includes('tracker')) {
    return smartGadgetsImg;
  }

  // 3. Dynamic custom SVG generator fallback for other/new categories (visual fallback)
  const colors = [
    { primary: '#00f3ff', glow: 'rgba(0, 243, 255, 0.4)' }, // Cyan
    { primary: '#a820ff', glow: 'rgba(168, 32, 255, 0.4)' } // Purple
  ];
  const choice = colors[normalized.length % colors.length];

  // Return a beautiful dynamic dark SVG containing a premium glowing neon wave design
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="100%" height="100%" fill="%23060b19" />
    <circle cx="200" cy="150" r="100" fill="none" stroke="${encodeURIComponent(choice.primary)}" stroke-width="2" opacity="0.3" />
    <circle cx="200" cy="150" r="130" fill="none" stroke="${encodeURIComponent(choice.primary)}" stroke-width="1" opacity="0.15" />
    <path d="M 0,150 Q 100,100 200,150 T 400,150" fill="none" stroke="${encodeURIComponent(choice.primary)}" stroke-width="3" />
    <path d="M 0,150 Q 100,200 200,150 T 400,150" fill="none" stroke="%23a820ff" stroke-width="1.5" opacity="0.5" />
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${encodeURIComponent(choice.primary)}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="%23010308" stop-opacity="0" />
    </radialGradient>
    <rect width="100%" height="100%" fill="url(%23glow)" />
  </svg>`;
};
