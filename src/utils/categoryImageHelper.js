import twsImg          from '../assets/category-images/airpods.png';
import headphonesImg    from '../assets/category-images/headphones.png';
import speakerImg       from '../assets/category-images/bluetooth_speaker.png';
import wiredImg         from '../assets/category-images/wired_headphones.png';
import gamingHeadsetImg from '../assets/category-images/gaming_headphone.png';
import keyboardImg      from '../assets/category-images/gaming_keyboard.png';
import smartwatchImg    from '../assets/category-images/smartwatch.png';
import partySpeakerImg  from '../assets/category-images/party_speaker.png';
import soundbarImg      from '../assets/category-images/soundbar.png';
import wirelessMouseImg from '../assets/category-images/wirelessmouse.png';
import projectorImg     from '../assets/category-images/projector.png';
import powerBankImg     from '../assets/category-images/power_bank.png';
import { getImageUrl }  from '../config/api';

/**
 * Exact-name COVER_MAP — keyed by normalised (trimmed, lowercased) category name.
 * These entries take priority over keyword fuzzy-matching below.
 */
const COVER_MAP = {
  // Audio gear
  'tws earbuds':           twsImg,
  'tws':                   twsImg,
  'true wireless earbuds': twsImg,
  'earbuds':               twsImg,

  'wireless headphones':   headphonesImg,
  'headphones':            headphonesImg,

  'gaming headsets':       gamingHeadsetImg,
  'gaming headset':        gamingHeadsetImg,

  'wired earphones':       wiredImg,
  'wired headphones':      wiredImg,

  // Speakers
  'bluetooth speakers':    speakerImg,
  'portable speakers':     speakerImg,
  'speakers':              speakerImg,

  'party speakers':        partySpeakerImg,
  'party speaker':         partySpeakerImg,

  'soundbars':             soundbarImg,
  'soundbar':              soundbarImg,

  // Peripherals
  'keyboards':             keyboardImg,
  'gaming keyboards':      keyboardImg,
  'computer accessories':  keyboardImg,

  'wireless mouse':        wirelessMouseImg,
  'wireless mice':         wirelessMouseImg,

  // Smart / gadgets
  'smart watches':         smartwatchImg,
  'smartwatches':          smartwatchImg,
  'smart gadgets':         smartwatchImg,

  // Visual / AV
  'projectors':            projectorImg,
  'projector':             projectorImg,

  // Power
  'power banks':           powerBankImg,
  'power bank':            powerBankImg,
};

/**
 * Resolves the cover image for a category.
 *
 * Priority order:
 *  1. Database imageUrl (if the backend supplies one)
 *  2. Exact COVER_MAP lookup
 *  3. Keyword fuzzy-fallback using the new category-images assets
 *  4. Neon-SVG placeholder for anything not yet covered
 */
export const getCategoryCover = (categoryName = '', dbImageUrl = '') => {
  // 1. Backend-supplied image wins
  if (dbImageUrl) {
    return getImageUrl(dbImageUrl);
  }

  const normalized = categoryName.trim().toLowerCase();

  // 2. Exact-name lookup
  if (COVER_MAP[normalized]) {
    return COVER_MAP[normalized];
  }

  // 3. Keyword fuzzy-matching (handles slight naming variations from the DB)
  if (normalized.includes('earbud') || normalized.includes('tws') || normalized.includes('airpod')) {
    return twsImg;
  }
  if (normalized.includes('gaming') && normalized.includes('headset')) {
    return gamingHeadsetImg;
  }
  if (normalized.includes('gaming') && (normalized.includes('keyboard') || normalized.includes('key'))) {
    return keyboardImg;
  }
  if (normalized.includes('gaming')) {
    return gamingHeadsetImg;
  }
  if (normalized.includes('wired') && (normalized.includes('earphone') || normalized.includes('headphone'))) {
    return wiredImg;
  }
  if (normalized.includes('headphone') || normalized.includes('headset')) {
    return headphonesImg;
  }
  if (normalized.includes('party')) {
    return partySpeakerImg;
  }
  if (normalized.includes('soundbar') || normalized.includes('cinema')) {
    return soundbarImg;
  }
  if (normalized.includes('speaker') || normalized.includes('bluetooth speaker')) {
    return speakerImg;
  }
  if (normalized.includes('keyboard') || normalized.includes('computer')) {
    return keyboardImg;
  }
  if (normalized.includes('mouse') || normalized.includes('mice')) {
    return wirelessMouseImg;
  }
  if (normalized.includes('projector') || normalized.includes('presenter')) {
    return projectorImg;
  }
  if (normalized.includes('power bank') || normalized.includes('powerbank') || normalized.includes('battery')) {
    return powerBankImg;
  }
  if (normalized.includes('watch') || normalized.includes('gadget') || normalized.includes('smart') || normalized.includes('tracker')) {
    return smartwatchImg;
  }

  // 4. Neon SVG placeholder for any unmapped category
  const colors = [
    { primary: '#00f3ff', glow: 'rgba(0, 243, 255, 0.4)' },
    { primary: '#a820ff', glow: 'rgba(168, 32, 255, 0.4)' },
  ];
  const choice = colors[normalized.length % colors.length];

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
