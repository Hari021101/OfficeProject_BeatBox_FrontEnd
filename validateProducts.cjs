const fs = require('fs');
let src = fs.readFileSync('src/data/products.js', 'utf8');
// Remove ES module imports and exports
src = src.replace(/^import .+ from .+;?$/gm, '');
src = src.replace(/^export const /gm, 'const ');
// Replace all image variable references in object values with a placeholder string
// This handles: image: varName, or imageKey: 'varName', or heroHeadphones, etc.
const importedNames = [];
const importMatches = src.match(/const (\w+) = ['"][^'"]+['"]/g) || [];
// Replace any remaining bare variable references used as values (e.g. image: heroHeadphones)
// We can't easily do this without executing. Better to stub all variables.
// Stub all image-like identifiers
src = src.replace(/\b(hero\w+|gaming\w+|wireless\w+|smart\w+|power\w+|trimmer|soundbar\w*|portable\w+|cables|car\w+|electric\w+|hair\w+|keyboard\w+|laptop\w+|mobile\w+|smart\w+|tyre\w+|usb\w+|vacuum\w+|wireless\w+|party\w+|wired\w+|conf\w+|wireless\w+|stone\w*|neckband\w*|soundbarHero|partySpeaker\w*|portableSpeakerHero|twsHero|neckbandHero|wirelessHeadphonesHero|wiredEarphonesHero|usbSpeakersHero|conferenceSpeakerHero|wirelessMicHero|stoneGrenadeProImage|beatboxSmartCapsuleImage|auralPrecisionV3Image|partyBoom1500Image|usbGamingSpeakersImage|soundbarEliteS9Image|heroSpeaker|heroEarbuds|wirelessMicImage|mobileHolder|phoneWallet|premiumCables|carCharger|wirelessCharger|partySpeakerImage|cctvCameraImage|smartTrackerImage|smartwatchProImage|smartTracker|soundbarEliteS9Image)\b/g, "'placeholder'");
src += '\nmodule.exports = { PRODUCTS };';

try {
  const m = { exports: {} };
  const fn = new Function('module', 'exports', src);
  fn(m, m.exports);
  const { PRODUCTS } = m.exports;
  console.log('SUCCESS - Total products:', PRODUCTS.length);
  
  const bad = PRODUCTS.filter(p => !p || !p.name || typeof p.name !== 'string');
  console.log('Products without valid name:', bad.length);
  if (bad.length > 0) {
    console.log('Bad products:', JSON.stringify(bad.slice(0,3), null, 2));
  }
  
  // Show unique categories
  const cats = [...new Set(PRODUCTS.map(p => p.category))].sort();
  console.log('Categories:', cats.join(', '));
  
} catch(e) {
  console.error('Error:', e.message);
  const lines = e.stack.split('\n');
  lines.slice(0,5).forEach(l => console.log(l));
}
