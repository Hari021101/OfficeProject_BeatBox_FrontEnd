/**
 * cleanupProducts.cjs
 * Removes duplicate product entries from products.js by slug.
 * Keeps only the FIRST occurrence of each slug.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'products.js');
const content = fs.readFileSync(filePath, 'utf8');

// Extract the header (imports) and footer (exports) separately
const headerMatch = content.match(/^([\s\S]*?export const PRODUCTS = \[)/);
const footerMatch = content.match(/\]\s*\nexport const getProductById[\s\S]*$/);

if (!headerMatch || !footerMatch) {
  console.error('Could not find PRODUCTS array boundaries!');
  process.exit(1);
}

const header = headerMatch[1];
const footer = content.slice(content.lastIndexOf('\n]') + 2); // from `]` to end

// Extract the array body
const arrayBody = content.slice(header.length, content.lastIndexOf('\n]'));

// Split into individual product objects
// Each product starts with `\n  {\n` or `  {` and ends with `  },`
// We'll use a state machine approach: count braces
const products = [];
let depth = 0;
let current = '';
let inProduct = false;

for (let i = 0; i < arrayBody.length; i++) {
  const ch = arrayBody[i];
  
  if (ch === '{') {
    depth++;
    inProduct = true;
  }
  
  if (inProduct) {
    current += ch;
  }
  
  if (ch === '}') {
    depth--;
    if (depth === 0 && inProduct) {
      products.push(current.trim());
      current = '';
      inProduct = false;
    }
  }
}

console.log(`Total raw product objects extracted: ${products.length}`);

// Deduplicate by slug
const seenSlugs = new Set();
const seenIds = new Set();
const unique = [];

for (const prod of products) {
  const slugMatch = prod.match(/slug:\s*'([^']+)'/);
  const idMatch = prod.match(/id:\s*(\d+)/);
  
  const slug = slugMatch ? slugMatch[1] : null;
  const id = idMatch ? idMatch[1] : null;
  
  if (!slug || seenSlugs.has(slug)) {
    // Skip duplicate
    continue;
  }
  
  seenSlugs.add(slug);
  if (id) seenIds.add(id);
  unique.push(prod);
}

console.log(`Unique products after deduplication: ${unique.length}`);
console.log(`Removed duplicates: ${products.length - unique.length}`);

// Reassign sequential IDs to avoid any gaps
const reassigned = unique.map((prod, i) => {
  return prod.replace(/id:\s*\d+/, `id: ${i + 1}`);
});

// Rebuild the file
const newContent = header + '\n  ' + reassigned.join(',\n  ') + '\n' + footer;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('products.js cleaned and saved successfully!');
