const fs = require('fs');
const path = require('path');

const watchesRaw = fs.readFileSync(path.join(__dirname, 'watches.txt'), 'utf8');
const watches = watchesRaw.split('\n').map(l => l.trim()).filter(l => l);

const existingContent = fs.readFileSync(path.join(__dirname, 'src', 'data', 'products.js'), 'utf8');

// Find the last ID used in products.js to auto-increment
let maxId = 0;
const idMatches = existingContent.match(/id:\s*(\d+)/g);
if (idMatches) {
  idMatches.forEach(match => {
    const id = parseInt(match.replace(/[^\d]/g, ''), 10);
    if (id > maxId) maxId = id;
  });
}

let newProductsString = "";

watches.forEach((watchName, index) => {
  maxId++;
  const slug = watchName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  // Fake some prices and stats
  const price = Math.floor(Math.random() * 4000) + 1499;
  const oldPrice = price + Math.floor(Math.random() * 5000) + 2000;
  const discount = Math.floor(((oldPrice - price) / oldPrice) * 100);
  const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 500) + 10;
  
  const isRing = watchName.toLowerCase().includes('ring');
  const cat = isRing ? 'smart-ring' : 'smart-watch';
  
  // Choose an imageKey placeholder
  const imageKey = 'smartTracker';
  
  newProductsString += `
  {
    id: ${maxId},
    slug: '${slug}',
    name: '${watchName.replace(/'/g, "\\'")}',
    brand: 'boAt',
    category: '${cat}',
    price: ${price},
    oldPrice: ${oldPrice},
    discount: ${discount},
    rating: parseFloat(${rating}),
    reviewCount: ${reviewCount},
    tag: ${index % 5 === 0 ? "'New Launch'" : index % 7 === 0 ? "'Best Seller'" : "''"},
    usp: 'Bluetooth Calling & Health Tracking',
    imageKey: '${imageKey}',
    badge: '',
    inStock: true,
    colors: [
      { name: 'Active Black', code: '#000000' },
      { name: 'Cherry Blossom', code: '#ffb7c5' }
    ],
    specs: {
      'Display': '1.83" HD Display',
      'Battery': 'Up to 7 Days',
      'Calling': 'Advanced BT Calling',
      'Health': 'HR & SpO2',
      'Sports': '100+ Sports Modes',
      'Waterproof': 'IP68'
    },
    description: 'Elevate your lifestyle with the ${watchName.replace(/'/g, "\\'")}. Features include a bright HD display, advanced bluetooth calling, comprehensive health monitoring, and a premium design built to keep you connected.',
    highlights: [
      'Crisp HD Display for clear visuals',
      'Seamless Bluetooth Calling',
      'Comprehensive Health & Sleep Tracking',
      '100+ Active Sports Modes',
      'IP68 Dust and Water Resistance'
    ],
    reviews: [
      { user: 'Karan V.', rating: 5, comment: 'Amazing watch for the price! The calling feature is very clear.' },
      { user: 'Neha R.', rating: 4, comment: 'Good display and battery life. Highly recommended.' }
    ]
  },`;
});

// Insert into products.js right before the `];` at the end of the `export const PRODUCTS = [` block.
// Wait, the products array might not end exactly at the end of the file.
// Let's replace `];\n` at the end of the file or just do string replacement.

const newContent = existingContent.replace(/\]\s*export const getProductById/, ',' + newProductsString + '\n]\n\nexport const getProductById');

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'products.js'), newContent);
console.log('Successfully injected ' + watches.length + ' watches.');
