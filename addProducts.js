const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'data', 'products.js');
let content = fs.readFileSync(targetFile, 'utf8');

const newProducts = [
  // Soundbars (needs 3)
  { slug: 'soundbar-pro', name: 'BeatBox Soundbar Pro', category: 'soundbars', imageKey: 'soundbar_2', price: 6999 },
  { slug: 'soundbar-elite', name: 'BeatBox Soundbar Elite', category: 'soundbars', imageKey: 'soundbar_3', price: 8999 },
  { slug: 'soundbar-mini', name: 'BeatBox Soundbar Mini', category: 'soundbars', imageKey: 'soundbar_4', price: 3499 },
  
  // Party Speakers (needs 4)
  { slug: 'party-boom', name: 'Party Boom', category: 'party speakers', imageKey: 'party_speaker_2', price: 12999 },
  { slug: 'party-blast', name: 'Party Blast', category: 'party speakers', imageKey: 'party_speaker_3', price: 14999 },
  { slug: 'party-max', name: 'Party Max', category: 'party speakers', imageKey: 'party_speaker_4', price: 18999 },
  { slug: 'party-lite', name: 'Party Lite', category: 'party speakers', imageKey: 'party_speaker_5', price: 7999 },

  // Portable Speakers (needs 4)
  { slug: 'portable-go', name: 'Portable Go', category: 'portable speakers', imageKey: 'portable_speaker_2', price: 1499 },
  { slug: 'portable-rugged', name: 'Portable Rugged', category: 'portable speakers', imageKey: 'portable_speaker_3', price: 2499 },
  { slug: 'portable-bass', name: 'Portable Bass', category: 'portable speakers', imageKey: 'portable_speaker_4', price: 2999 },
  { slug: 'portable-mini', name: 'Portable Mini', category: 'portable speakers', imageKey: 'portable_speaker_5', price: 999 },

  // TWS (needs 1) - Reclassifying earbuds to tws already handles 3
  { slug: 'tws-sport', name: 'TWS Sport', category: 'tws', imageKey: 'tws_2', price: 1999 },
  { slug: 'tws-anc', name: 'TWS ANC Elite', category: 'tws', imageKey: 'tws_3', price: 3499 },
  { slug: 'tws-budget', name: 'TWS Lite', category: 'tws', imageKey: 'tws_4', price: 999 },

  // Neckbands (needs 2)
  { slug: 'neckband-pro', name: 'Neckband Pro', category: 'neckbands', imageKey: 'neckband_4', price: 1499 },
  { slug: 'neckband-sport', name: 'Neckband Sport', category: 'neckbands', imageKey: 'neckband_5', price: 1299 },

  // Wireless Headphones (needs 2)
  { slug: 'wireless-headphone-anc', name: 'Headphones ANC', category: 'wireless headphones', imageKey: 'wireless_headphone_4', price: 4999 },
  { slug: 'wireless-headphone-lite', name: 'Headphones Lite', category: 'wireless headphones', imageKey: 'wireless_headphone_5', price: 1999 },

  // Wired Earphones (needs 4)
  { slug: 'wired-bass', name: 'Wired Bass', category: 'wired earphones', imageKey: 'wired_earphones_2', price: 499 },
  { slug: 'wired-pro', name: 'Wired Pro', category: 'wired earphones', imageKey: 'wired_earphones_3', price: 799 },
  { slug: 'wired-sport', name: 'Wired Sport', category: 'wired earphones', imageKey: 'wired_earphones_4', price: 599 },
  { slug: 'wired-typec', name: 'Wired Type-C', category: 'wired earphones', imageKey: 'wired_earphones_5', price: 899 },

  // USB Speakers (needs 4)
  { slug: 'usb-speaker-rgb', name: 'USB RGB Speakers', category: 'usb speakers', imageKey: 'usb_speakers_2', price: 1299 },
  { slug: 'usb-speaker-pro', name: 'USB Speakers Pro', category: 'usb speakers', imageKey: 'usb_speakers_3', price: 1499 },
  { slug: 'usb-speaker-mini', name: 'USB Speakers Mini', category: 'usb speakers', imageKey: 'usb_speakers_4', price: 699 },
  { slug: 'usb-speaker-soundbar', name: 'USB Soundbar', category: 'usb speakers', imageKey: 'usb_speakers_5', price: 1999 },

  // Conference Speakers (needs 4)
  { slug: 'conf-speaker-pro', name: 'Conference Pro', category: 'conference speakers', imageKey: 'conference_speakers_2', price: 4999 },
  { slug: 'conf-speaker-360', name: 'Conference 360', category: 'conference speakers', imageKey: 'conference_speakers_3', price: 5999 },
  { slug: 'conf-speaker-mini', name: 'Conference Mini', category: 'conference speakers', imageKey: 'conference_speakers_4', price: 2999 },
  { slug: 'conf-speaker-elite', name: 'Conference Elite', category: 'conference speakers', imageKey: 'conference_speakers_5', price: 7999 },

  // Wireless Microphones (needs 4)
  { slug: 'mic-pro', name: 'Wireless Mic Pro', category: 'wireless microphones', imageKey: 'wireless_microphones_2', price: 5999 },
  { slug: 'mic-duo', name: 'Wireless Mic Duo', category: 'wireless microphones', imageKey: 'wireless_microphones_3', price: 8999 },
  { slug: 'mic-vlog', name: 'Vlogger Mic', category: 'wireless microphones', imageKey: 'wireless_microphones_4', price: 3499 },
  { slug: 'mic-studio', name: 'Studio Mic', category: 'wireless microphones', imageKey: 'wireless_microphones_5', price: 12999 }
];

let idCounter = 100; // Start IDs from 100
const productsToAdd = newProducts.map(p => {
  idCounter++;
  return `  { id: ${idCounter}, slug: '${p.slug}', name: '${p.name}', brand: 'BeatBox', category: '${p.category}', price: ${p.price}, oldPrice: ${Math.round(p.price * 1.5)}, discount: 33, rating: 4.5, reviewCount: 150, tag: 'New', usp: 'Premium', imageKey: '${p.imageKey}', badge: 'Hot', inStock: true, colors: [{name: 'Black', code: '#000'}], specs: {'Quality': 'Premium'}, description: 'High quality ${p.name} with premium features.', highlights: ['Durable', 'Premium'], reviews: [] }`;
});

// Reclassify existing 'headphones' and 'earbuds' as 'wireless headphones' and 'tws' to ensure 5+ items total
content = content.replace(/category: 'headphones'/g, "category: 'wireless headphones'");
content = content.replace(/category: 'earbuds'/g, "category: 'tws'");

// Insert into PRODUCTS array
const productsEndIndex = content.lastIndexOf(']');
const updatedContent = content.slice(0, productsEndIndex - 1) + ',\n' + productsToAdd.join(',\n') + '\n' + content.slice(productsEndIndex);

// Add missing IMAGE_MAP keys
const importsToAdd = newProducts.map(p => `import ${p.imageKey} from '../assets/${p.imageKey}.png';`).join('\n');
const mapEntriesToAdd = newProducts.map(p => `  ${p.imageKey}: ${p.imageKey},`).join('\n');

content = updatedContent.replace(/(import .* from '\.\.\/assets\/.*';\n)(export const CATEGORIES)/, `$1${importsToAdd}\n\n$2`);
content = content.replace(/(export const IMAGE_MAP = {[\s\S]*?)(};)/, `$1${mapEntriesToAdd}\n$2`);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated products.js with 35 new items and image mappings.');
