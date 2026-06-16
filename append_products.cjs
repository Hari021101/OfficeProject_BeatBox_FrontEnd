const fs = require('fs');
const file = 'src/data/products.js';
let content = fs.readFileSync(file, 'utf8');

const newProducts = [
  // Camera
  { id: 'cam-1', name: 'SecureCam Pro 4K', description: 'Ultra HD 4K security camera with night vision and motion tracking.', price: 4999, originalPrice: 8999, rating: 4.8, reviews: 342, category: 'camera', isNew: true, stock: 45 },
  { id: 'cam-2', name: 'DomeGuard 360', description: '360-degree rotating dome camera with 2-way audio.', price: 2999, originalPrice: 5999, rating: 4.6, reviews: 210, category: 'camera', stock: 120 },
  { id: 'cam-3', name: 'BulletCam Outdoor', description: 'Weatherproof bullet camera with long-range IR.', price: 3499, originalPrice: 6999, rating: 4.7, reviews: 185, category: 'camera', stock: 80 },
  { id: 'cam-4', name: 'MiniSpy Hidden Cam', description: 'Discreet mini camera for indoor surveillance.', price: 1999, originalPrice: 3999, rating: 4.3, reviews: 95, category: 'camera', stock: 200 },
  { id: 'cam-5', name: 'SolarCam Wireless', description: 'Solar-powered wireless outdoor camera.', price: 5999, originalPrice: 9999, rating: 4.9, reviews: 412, category: 'camera', isNew: true, stock: 30 },

  // Video Door Phone
  { id: 'vdp-1', name: 'SmartBell Video Doorbell', description: 'WiFi video doorbell with live mobile view.', price: 3999, originalPrice: 7999, rating: 4.7, reviews: 520, category: 'video door phone', isNew: true, stock: 65 },
  { id: 'vdp-2', name: 'SecureEntry 7-inch LCD', description: 'Wired video door phone system with a 7-inch indoor display.', price: 6999, originalPrice: 12999, rating: 4.8, reviews: 310, category: 'video door phone', stock: 40 },
  { id: 'vdp-3', name: 'Wireless PeepHole Cam', description: 'Digital peephole viewer with motion detection.', price: 2499, originalPrice: 4999, rating: 4.5, reviews: 150, category: 'video door phone', stock: 85 },
  { id: 'vdp-4', name: 'Intercom Door Station', description: 'Multi-unit video intercom for apartments.', price: 12999, originalPrice: 18999, rating: 4.6, reviews: 90, category: 'video door phone', stock: 15 },
  { id: 'vdp-5', name: 'SmartBell Pro Battery', description: 'Battery-operated video doorbell with chime.', price: 4499, originalPrice: 8499, rating: 4.7, reviews: 280, category: 'video door phone', stock: 55 },

  // Video Recorder
  { id: 'vr-1', name: 'ProDVR 8-Channel', description: '8-channel digital video recorder with 1TB HDD included.', price: 8999, originalPrice: 14999, rating: 4.8, reviews: 415, category: 'video recorder', stock: 35 },
  { id: 'vr-2', name: 'NVR 16-Channel 4K', description: 'Network video recorder supporting up to 16 IP cameras.', price: 12999, originalPrice: 19999, rating: 4.9, reviews: 120, category: 'video recorder', isNew: true, stock: 20 },
  { id: 'vr-3', name: 'Compact 4-Ch DVR', description: 'Small footprint 4-channel DVR for home use.', price: 4999, originalPrice: 7999, rating: 4.5, reviews: 260, category: 'video recorder', stock: 75 },
  { id: 'vr-4', name: 'Hybrid XVR System', description: 'Supports both analog and IP cameras up to 8 channels.', price: 9999, originalPrice: 15999, rating: 4.7, reviews: 180, category: 'video recorder', stock: 45 },
  { id: 'vr-5', name: 'NVR 32-Channel Enterprise', description: 'Enterprise-grade NVR for commercial surveillance.', price: 24999, originalPrice: 35999, rating: 4.8, reviews: 45, category: 'video recorder', stock: 10 },

  // PoE Devices
  { id: 'poe-1', name: 'Gigabit PoE Switch 8-Port', description: '8-port PoE+ switch with 120W power budget.', price: 4999, originalPrice: 7999, rating: 4.8, reviews: 320, category: 'poe devices', stock: 60 },
  { id: 'poe-2', name: 'PoE Injector 30W', description: 'Single port gigabit PoE injector.', price: 999, originalPrice: 1499, rating: 4.7, reviews: 450, category: 'poe devices', stock: 150 },
  { id: 'poe-3', name: '4-Port PoE Extender', description: 'Extend PoE range up to 100 meters.', price: 2499, originalPrice: 3999, rating: 4.6, reviews: 180, category: 'poe devices', stock: 85 },
  { id: 'poe-4', name: '16-Port Rackmount PoE', description: 'Rackmountable 16-port PoE switch for NVR systems.', price: 11999, originalPrice: 18999, rating: 4.9, reviews: 110, category: 'poe devices', stock: 25 },
  { id: 'poe-5', name: 'PoE Splitter 5V/12V', description: 'Active PoE splitter to power non-PoE devices.', price: 799, originalPrice: 1299, rating: 4.5, reviews: 290, category: 'poe devices', stock: 200 },

  // Vehicle Surveillance
  { id: 'vs-1', name: 'Dual Dash Cam 4K', description: 'Front and rear 4K dash camera with GPS.', price: 8999, originalPrice: 14999, rating: 4.8, reviews: 560, category: 'vehicle surveillance', isNew: true, stock: 80 },
  { id: 'vs-2', name: 'Cabin View Taxi Cam', description: 'Infrared cabin camera for ride-share drivers.', price: 5499, originalPrice: 8999, rating: 4.7, reviews: 240, category: 'vehicle surveillance', stock: 45 },
  { id: 'vs-3', name: 'Mini Dash Cam HD', description: 'Compact 1080p dash cam with loop recording.', price: 2999, originalPrice: 4999, rating: 4.5, reviews: 890, category: 'vehicle surveillance', stock: 150 },
  { id: 'vs-4', name: '360 Truck Surveillance', description: '4-camera surround view system for large vehicles.', price: 18999, originalPrice: 25999, rating: 4.9, reviews: 75, category: 'vehicle surveillance', stock: 15 },
  { id: 'vs-5', name: 'Mirror Dash Cam Touch', description: '10-inch rearview mirror dash cam with touch screen.', price: 6999, originalPrice: 11999, rating: 4.6, reviews: 310, category: 'vehicle surveillance', stock: 65 },

  // Accessories
  { id: 'acc-1', name: 'CCTV BNC Cable 18m', description: 'Pre-made BNC video and power cable for CCTV.', price: 499, originalPrice: 899, rating: 4.6, reviews: 420, category: 'accessories', stock: 300 },
  { id: 'acc-2', name: 'Camera Mounting Bracket', description: 'Universal wall mount bracket for dome and bullet cameras.', price: 299, originalPrice: 499, rating: 4.7, reviews: 280, category: 'accessories', stock: 500 },
  { id: 'acc-3', name: '12V 2A Power Adapter', description: 'DC power adapter for security cameras.', price: 399, originalPrice: 699, rating: 4.8, reviews: 550, category: 'accessories', stock: 400 },
  { id: 'acc-4', name: 'CCTV Warning Sign', description: 'Reflective 24 Hour Video Surveillance aluminum sign.', price: 199, originalPrice: 399, rating: 4.5, reviews: 150, category: 'accessories', stock: 250 },
  { id: 'acc-5', name: 'Junction Box Waterproof', description: 'Waterproof junction box for outdoor camera wiring.', price: 599, originalPrice: 999, rating: 4.9, reviews: 310, category: 'accessories', stock: 180 },

  // Smart Wifi Plug
  { id: 'swp-1', name: 'Smart Plug Mini 10A', description: 'Compact WiFi smart plug compatible with Alexa and Google Home.', price: 799, originalPrice: 1499, rating: 4.7, reviews: 890, category: 'smart wifi plug', stock: 250 },
  { id: 'swp-2', name: 'Smart Plug 16A Heavy Duty', description: '16A smart plug for heavy appliances like AC and geyser.', price: 1199, originalPrice: 1999, rating: 4.8, reviews: 620, category: 'smart wifi plug', stock: 180 },
  { id: 'swp-3', name: 'Dual Outlet Smart Plug', description: 'Space-saving dual outlet WiFi plug with independent control.', price: 1499, originalPrice: 2499, rating: 4.6, reviews: 340, category: 'smart wifi plug', stock: 120 },
  { id: 'swp-4', name: 'Smart Power Strip', description: '4-socket WiFi power strip with 3 USB charging ports.', price: 2499, originalPrice: 3999, rating: 4.9, reviews: 450, category: 'smart wifi plug', isNew: true, stock: 85 },
  { id: 'swp-5', name: 'Outdoor Smart Plug Waterproof', description: 'IP65 waterproof smart plug for outdoor lighting and decor.', price: 1899, originalPrice: 2999, rating: 4.7, reviews: 210, category: 'smart wifi plug', stock: 60 },

  // Smart WiFi Cameras
  { id: 'swc-1', name: 'HomeView WiFi 360', description: 'Indoor 360-degree pan/tilt WiFi camera with baby crying detection.', price: 2499, originalPrice: 4999, rating: 4.8, reviews: 1200, category: 'smart wifi cameras', stock: 150 },
  { id: 'swc-2', name: 'OutdoorGuard WiFi', description: 'Weatherproof outdoor WiFi camera with color night vision.', price: 3499, originalPrice: 6999, rating: 4.7, reviews: 850, category: 'smart wifi cameras', stock: 110 },
  { id: 'swc-3', name: 'Mini WiFi Spy Cam', description: 'Magnetic mini WiFi camera for discreet monitoring.', price: 1599, originalPrice: 2999, rating: 4.4, reviews: 430, category: 'smart wifi cameras', stock: 200 },
  { id: 'swc-4', name: 'Battery Powered WiFi Cam', description: '100% wire-free WiFi camera with 6-month battery life.', price: 4999, originalPrice: 8999, rating: 4.9, reviews: 320, category: 'smart wifi cameras', isNew: true, stock: 65 },
  { id: 'swc-5', name: 'Dual-Lens WiFi Security', description: 'Advanced dual-lens WiFi camera for wide and zoom views.', price: 5999, originalPrice: 10999, rating: 4.8, reviews: 180, category: 'smart wifi cameras', stock: 45 },

  // Smart WiFi Universal Remote
  { id: 'swur-1', name: 'Smart IR Hub', description: 'Universal WiFi IR remote to control TV, AC, and setup boxes.', price: 999, originalPrice: 1999, rating: 4.6, reviews: 950, category: 'smart wifi universal remote', stock: 300 },
  { id: 'swur-2', name: 'IR+RF Smart Remote', description: 'Advanced remote supporting both IR and RF devices (like fans/curtains).', price: 1899, originalPrice: 2999, rating: 4.8, reviews: 420, category: 'smart wifi universal remote', stock: 150 },
  { id: 'swur-3', name: 'Smart Remote with Temp Sensor', description: 'IR hub with built-in temperature and humidity sensor for AC automation.', price: 1499, originalPrice: 2499, rating: 4.7, reviews: 310, category: 'smart wifi universal remote', isNew: true, stock: 120 },
  { id: 'swur-4', name: 'Compact IR Blaster', description: 'Micro-sized USB IR blaster for smart home integration.', price: 599, originalPrice: 999, rating: 4.5, reviews: 280, category: 'smart wifi universal remote', stock: 400 },
  { id: 'swur-5', name: 'Premium IR Hub Pro', description: 'High-range IR hub with LCD display and touch controls.', price: 2499, originalPrice: 3999, rating: 4.9, reviews: 150, category: 'smart wifi universal remote', stock: 80 },

  // Smart Tag
  { id: 'st-1', name: 'FindMe Smart Tag', description: 'Bluetooth tracker for keys, bags, and pets.', price: 799, originalPrice: 1499, rating: 4.7, reviews: 1500, category: 'smart tag', stock: 500 },
  { id: 'st-2', name: 'Smart Tag Pro UWB', description: 'Precision finding tracker with Ultra-Wideband technology.', price: 1499, originalPrice: 2499, rating: 4.9, reviews: 620, category: 'smart tag', isNew: true, stock: 250 },
  { id: 'st-3', name: 'Card Tracker Slim', description: 'Wallet-sized slim tracker with 2-year battery.', price: 1199, originalPrice: 1999, rating: 4.8, reviews: 480, category: 'smart tag', stock: 300 },
  { id: 'st-4', name: 'Smart Tag 4-Pack', description: 'Family pack of 4 Bluetooth trackers.', price: 2499, originalPrice: 4999, rating: 4.8, reviews: 850, category: 'smart tag', stock: 150 },
  { id: 'st-5', name: 'Pet Collar Smart Tag', description: 'Waterproof tracker specifically designed to attach to pet collars.', price: 999, originalPrice: 1799, rating: 4.6, reviews: 320, category: 'smart tag', stock: 200 },

  // Wifi Speakers
  { id: 'ws-1', name: 'Acoustic Wave WiFi', description: 'Premium multi-room WiFi speaker with lossless audio streaming.', price: 8999, originalPrice: 14999, rating: 4.9, reviews: 450, category: 'wifi speakers', isNew: true, stock: 85 },
  { id: 'ws-2', name: 'Smart Home Hub Speaker', description: 'WiFi speaker with built-in voice assistant and smart home controls.', price: 4999, originalPrice: 8999, rating: 4.7, reviews: 820, category: 'wifi speakers', stock: 120 },
  { id: 'ws-3', name: 'Portable WiFi SoundBox', description: 'Battery-powered speaker with both WiFi and Bluetooth connectivity.', price: 6999, originalPrice: 11999, rating: 4.8, reviews: 310, category: 'wifi speakers', stock: 60 },
  { id: 'ws-4', name: 'Mini WiFi Dot', description: 'Compact and affordable WiFi speaker for every room.', price: 2499, originalPrice: 4499, rating: 4.6, reviews: 1200, category: 'wifi speakers', stock: 300 },
  { id: 'ws-5', name: 'Stereo Pair WiFi Speakers', description: 'Set of two bookshelf WiFi speakers for true stereo sound.', price: 12999, originalPrice: 19999, rating: 4.9, reviews: 180, category: 'wifi speakers', stock: 40 }
];

const appendString = newProducts.map(p => {
  return '  {\n' +
    '    id: \'' + p.id + '\',\n' +
    '    name: \'' + p.name + '\',\n' +
    '    description: \'' + p.description + '\',\n' +
    '    price: ' + p.price + ',\n' +
    '    originalPrice: ' + p.originalPrice + ',\n' +
    '    rating: ' + p.rating + ',\n' +
    '    reviews: ' + p.reviews + ',\n' +
    '    category: \'' + p.category + '\',\n' +
    (p.isNew ? '    isNew: true,\n' : '') +
    '    stock: ' + p.stock + ',\n' +
    '    imageKey: \'smartTracker\',\n' +
    '    colors: [\n' +
    '      { name: \'Midnight Black\', hex: \'#000000\' }\n' +
    '    ]\n' +
    '  }';
}).join(',\n');

content = content.replace(/\];\s*$/, ',\n' + appendString + '\n];\n');
fs.writeFileSync(file, content);
