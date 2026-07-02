// ============================================================
//  BeatBox AI Assistant — Knowledge Base
//  Rule-based intent matching engine
// ============================================================

export const BOT_NAME = 'BeatBot'

export const QUICK_REPLIES = [
  { label: '🎧 Browse Products', intent: 'browse_products' },
  { label: '🚚 Shipping Info',   intent: 'shipping' },
  { label: '↩️ Returns Policy',  intent: 'returns' },
  { label: '💰 Best Deals',      intent: 'deals' },
  { label: '📞 Contact Support', intent: 'contact' },
]

// Each intent: keywords to match + response text/JSX-safe string
export const INTENTS = [
  // ── Greetings ──────────────────────────────────────────────
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'howdy', 'good morning', 'good evening', 'good afternoon', 'sup', 'yo'],
    response: `Hey there! 👋 Welcome to **BeatBox**! I'm **BeatBot**, your personal audio shopping assistant.\n\nI can help you with:\n• 🎧 Product recommendations\n• 🚚 Shipping & delivery info\n• ↩️ Returns & warranty\n• 💰 Deals & discounts\n• 📞 Support & contact\n\nWhat can I help you with today?`,
  },

  // ── Browse / Products ──────────────────────────────────────
  {
    id: 'browse_products',
    keywords: ['browse', 'products', 'shop', 'catalog', 'show me', 'categories', 'all products', 'what do you sell', 'items'],
    response: `We have an awesome lineup! 🎵\n\n**Product Categories:**\n• 🎧 **TWS Earbuds** — True Wireless, up to 50hr battery\n• 🎙️ **Neckbands** — Sporty & lightweight\n• 🎵 **Speakers** — Portable & home audio\n• ⌚ **Smartwatches** — Fitness + audio control\n• 🎚️ **Studio Headphones** — Pro-grade sound\n\nVisit our [Products](/products) page to explore everything!`,
    link: { label: '🛍️ Browse All Products', path: '#/products' },
  },

  // ── TWS / Earbuds ──────────────────────────────────────────
  {
    id: 'tws',
    keywords: ['tws', 'earbuds', 'wireless earbuds', 'true wireless', 'airpods', 'in-ear'],
    response: `Our TWS earbuds are top-tier! 🎧\n\n**Popular Picks:**\n• **BeatBox Air Pro** — 50hr total, ANC, IPX5\n• **BeatBox Atom** — 30hr, crystal clear calls\n• **BeatBox Pods Ultra** — Hi-Res audio, Multipoint\n\n💡 *Tip: Filter by "TWS" on the Products page for the full range.*`,
    link: { label: '🎧 View TWS Earbuds', path: '#/products?category=tws' },
  },

  // ── Headphones ─────────────────────────────────────────────
  {
    id: 'headphones',
    keywords: ['headphone', 'headphones', 'over-ear', 'on-ear', 'studio', 'dj', 'wired headphone'],
    response: `Studio-grade headphones await! 🎚️\n\n**Our Best:**\n• **BeatBox Studio X** — 40mm drivers, foldable\n• **BeatBox Monitor Pro** — Flat response, for mixing\n• **BeatBox Retro** — Vintage look, modern sound\n\nPerfect for music lovers, gamers & professionals!`,
    link: { label: '🎚️ View Headphones', path: '#/products?category=headphones' },
  },

  // ── Speakers ───────────────────────────────────────────────
  {
    id: 'speakers',
    keywords: ['speaker', 'speakers', 'bluetooth speaker', 'party speaker', 'portable speaker', 'home audio'],
    response: `Fill the room with sound! 🔊\n\n**Top Speakers:**\n• **BeatBox Boom 360** — 360° surround, IPX7\n• **BeatBox PartyPod** — RGB lights + 20hr battery\n• **BeatBox MiniRave** — Pocket-sized, huge sound\n\nAll feature Bluetooth 5.3 with 10m range.`,
    link: { label: '🔊 View Speakers', path: '#/products?category=speakers' },
  },

  // ── Neckbands ──────────────────────────────────────────────
  {
    id: 'neckbands',
    keywords: ['neckband', 'neckbands', 'around neck', 'neck earphone', 'sport earphone'],
    response: `Perfect for workouts & commutes! 💪\n\n**Top Neckbands:**\n• **BeatBox Flex Pro** — 20hr, magnetic earbuds\n• **BeatBox Rush Sport** — IPX5, fast charge 10min → 2hr\n• **BeatBox Swift** — Ultra-light 22g design\n\nAll feature ENC (Environmental Noise Cancellation).`,
    link: { label: '🎵 View Neckbands', path: '#/products?category=neckbands' },
  },

  // ── Smartwatches ───────────────────────────────────────────
  {
    id: 'smartwatch',
    keywords: ['watch', 'smartwatch', 'smart watch', 'fitness tracker', 'wearable', 'band'],
    response: `Stay connected on the go! ⌚\n\n**Top Smartwatches:**\n• **BeatBox Watch Ultra** — AMOLED, 7-day battery\n• **BeatBox FitPro** — Health tracking + Bluetooth calling\n• **BeatBox Aura** — Premium design, SpO2 + HR\n\nAll support iOS & Android.`,
    link: { label: '⌚ View Smartwatches', path: '#/products?category=smartwatches' },
  },

  // ── Price / Budget ─────────────────────────────────────────
  {
    id: 'price',
    keywords: ['price', 'cost', 'cheap', 'budget', 'affordable', 'under', 'expensive', 'how much', 'rate'],
    response: `We have something for every budget! 💰\n\n**Price Ranges:**\n• 🟢 **Under ₹1,000** — Entry-level picks\n• 🔵 **₹1,000 – ₹3,000** — Mid-range, great value\n• 🟣 **₹3,000 – ₹6,000** — Premium performance\n• ⭐ **₹6,000+** — Flagship & pro-grade\n\nUse the price filter on the Products page to find your range!`,
    link: { label: '💰 Shop by Price', path: '#/products' },
  },

  // ── Deals / Offers ─────────────────────────────────────────
  {
    id: 'deals',
    keywords: ['deal', 'deals', 'offer', 'discount', 'sale', 'coupon', 'promo', 'daily deals', 'today', 'best price'],
    response: `Hot deals just for you! 🔥\n\n**Current Offers:**\n• 🎉 **Daily Deals** — Up to 50% off every day\n• 🎁 **Gifting Bundles** — Special combo packs\n• 👥 **Refer & Earn** — Get ₹200 per friend referral\n• 🏢 **Corporate Orders** — Bulk discounts available\n\nCheck our Daily Deals page for today's offers!`,
    link: { label: '🔥 View Daily Deals', path: '#/daily-deals' },
  },

  // ── Shipping ───────────────────────────────────────────────
  {
    id: 'shipping',
    keywords: ['shipping', 'delivery', 'ship', 'how long', 'when will', 'deliver', 'track', 'tracking', 'courier', 'arrive'],
    response: `Here's everything about delivery! 🚚\n\n**Shipping Details:**\n• 📦 **Standard Delivery** — 5–7 working days (Free above ₹499)\n• ⚡ **Express Delivery** — 1–3 working days (₹99)\n• 🏙️ **Same-Day Delivery** — Available in select cities\n\n**Order Tracking:**\nGo to **My Orders** → click your order → view live tracking.\n\nAll orders dispatched within 24 hours of payment!`,
  },

  // ── Returns ────────────────────────────────────────────────
  {
    id: 'returns',
    keywords: ['return', 'returns', 'refund', 'replace', 'replacement', 'broken', 'damaged', 'exchange', 'cancel', 'cancellation'],
    response: `No worries, returns are easy! ↩️\n\n**Return Policy:**\n• ✅ **7-Day Easy Returns** — No questions asked\n• 🔄 **Replacement** — For damaged/defective items\n• 💳 **Refund** — Processed in 5–7 business days to original payment method\n\n**How to Return:**\n1. Go to **My Orders**\n2. Select the item → click **Request Return**\n3. Schedule a pickup — we'll collect it from your door!\n\nItems must be unused, in original packaging.`,
    link: { label: '📦 View My Orders', path: '#/orders' },
  },

  // ── Warranty ───────────────────────────────────────────────
  {
    id: 'warranty',
    keywords: ['warranty', 'guarantee', 'repair', 'service center', 'after sales'],
    response: `All BeatBox products come with warranty! 🛡️\n\n**Warranty Coverage:**\n• 🎧 **Earbuds & Headphones** — 1 Year\n• ⌚ **Smartwatches** — 1 Year\n• 🔊 **Speakers** — 1 Year\n• 🔋 **Batteries** — 6 Months\n\n**Claim Warranty:**\nContact our support team with your order ID and we'll arrange pickup or a service center visit.`,
  },

  // ── Cart ───────────────────────────────────────────────────
  {
    id: 'cart',
    keywords: ['cart', 'add to cart', 'basket', 'bag', 'checkout', 'buy now', 'purchase', 'order now'],
    response: `Ready to shop? 🛒\n\nHere's how:\n1. Browse products and click **Add to Cart**\n2. Go to your **Cart** to review items\n3. Proceed to **Checkout** and choose payment\n4. Done! You'll get an order confirmation email.\n\n💡 *Tip: Create an account to save your cart and track orders easily!*`,
    link: { label: '🛒 View My Cart', path: '#/cart' },
  },

  // ── Payment ────────────────────────────────────────────────
  {
    id: 'payment',
    keywords: ['payment', 'pay', 'upi', 'card', 'credit card', 'debit card', 'net banking', 'cod', 'emi', 'wallet'],
    response: `We accept all major payment methods! 💳\n\n**Payment Options:**\n• 💳 Credit & Debit Cards (Visa, Mastercard, RuPay)\n• 📱 UPI (GPay, PhonePe, Paytm, BHIM)\n• 🏦 Net Banking (All major banks)\n• 💵 Cash on Delivery (COD)\n• 🔄 EMI — Available on orders above ₹3,000\n\nAll payments are **100% secure** & encrypted with SSL.`,
  },

  // ── Account / Login ────────────────────────────────────────
  {
    id: 'account',
    keywords: ['account', 'login', 'sign in', 'register', 'sign up', 'profile', 'password', 'forgot password', 'email'],
    response: `Managing your account is easy! 👤\n\n**Account Features:**\n• 📦 Track all your orders\n• ❤️ Save items to Wishlist\n• 🔔 Get personalized deals\n• 📍 Manage delivery addresses\n\n**Having trouble logging in?**\nUse "Forgot Password" on the login page to reset via OTP on your registered email or phone.`,
    link: { label: '👤 Go to Login', path: '#/login' },
  },

  // ── Wishlist ───────────────────────────────────────────────
  {
    id: 'wishlist',
    keywords: ['wishlist', 'wish list', 'favourite', 'favorite', 'save', 'saved items', 'liked'],
    response: `Love something? Save it! ❤️\n\nClick the **heart icon** on any product to add it to your Wishlist. You can view all saved items anytime from **My Wishlist**.\n\n💡 *Pro Tip: Wishlisted items get price drop notifications!*`,
    link: { label: '❤️ View Wishlist', path: '#/wishlist' },
  },

  // ── Contact / Support ──────────────────────────────────────
  {
    id: 'contact',
    keywords: ['contact', 'support', 'help', 'customer care', 'phone', 'email support', 'chat', 'human', 'agent', 'talk to someone'],
    response: `Our support team is here for you! 📞\n\n**Contact Us:**\n• 📧 **Email:** support@beatbox.in\n• 📱 **Phone:** 1800-XXX-XXXX (Mon–Sat, 9AM–6PM)\n• 💬 **Live Chat:** Available on Support page\n\nAverage response time: **< 2 hours**`,
    link: { label: '📞 Go to Support', path: '#/support' },
  },

  // ── Gifting ────────────────────────────────────────────────
  {
    id: 'gifting',
    keywords: ['gift', 'gifting', 'present', 'birthday', 'anniversary', 'festival', 'diwali', 'christmas', 'someone else'],
    response: `Perfect gifts for any occasion! 🎁\n\n**Our Gifting Options:**\n• 🎀 Custom gift packaging\n• 📦 Curated gift sets & bundles\n• 💌 Personalized gift messages\n• 🏢 Corporate gifting (bulk orders)\n\nVisit our **Gifting** section for exclusive combo deals!`,
    link: { label: '🎁 Explore Gifting', path: '#/gifting' },
  },

  // ── Corporate ──────────────────────────────────────────────
  {
    id: 'corporate',
    keywords: ['corporate', 'bulk', 'office', 'company', 'business', 'enterprise', 'b2b', 'wholesale'],
    response: `Great choice for businesses! 🏢\n\n**Corporate Benefits:**\n• 📦 Bulk order discounts (10+ units)\n• 🎁 Custom branding available\n• 🚚 Priority shipping\n• 📄 GST invoicing\n• 🤝 Dedicated account manager\n\nFill out the Corporate Order form and our team will reach out within 24 hours!`,
    link: { label: '🏢 Corporate Orders', path: '#/corporate' },
  },

  // ── ANC / Noise Cancellation ───────────────────────────────
  {
    id: 'anc',
    keywords: ['noise cancellation', 'anc', 'active noise', 'noise cancel', 'quiet', 'block noise', 'enc'],
    response: `Silence the world, hear your music! 🔇\n\n**ANC Products at BeatBox:**\n• 🎧 Multiple TWS earbuds with Active ANC\n• 🎵 Studio headphones with Hybrid ANC\n• 🎙️ ENC (Environmental Noise Cancellation) on all neckbands\n\n💡 *ANC is great for commuting, offices & studying!*`,
    link: { label: '🔇 Shop ANC Products', path: '#/products' },
  },

  // ── Battery ────────────────────────────────────────────────
  {
    id: 'battery',
    keywords: ['battery', 'battery life', 'playtime', 'charging', 'fast charge', 'how long charge', 'hours'],
    response: `Our products are built to last! 🔋\n\n**Battery Life Ranges:**\n• 🎧 **TWS Earbuds** — 6–10hr (earbuds) + 40hr (case)\n• 🎵 **Neckbands** — 15–25hr continuous\n• 🔊 **Speakers** — 10–24hr playback\n• ⌚ **Smartwatches** — 5–10 days\n\n⚡ **Fast Charge:** 10 min charge = 2hr playback on select models!`,
  },

  // ── Bluetooth ──────────────────────────────────────────────
  {
    id: 'bluetooth',
    keywords: ['bluetooth', 'pairing', 'connect', 'connection', 'compatible', 'pair', 'ios', 'android'],
    response: `Connecting is super simple! 📱\n\n**How to Pair:**\n1. Open your device's Bluetooth settings\n2. Power on your BeatBox device (it auto enters pairing mode)\n3. Select **"BeatBox [model name]"** from the list\n4. Done! ✅\n\n**Compatibility:** Works with all iOS, Android, Windows & Mac devices.\n\n**Bluetooth version:** 5.0 – 5.3 across all models.`,
  },

  // ── Refer & Earn ───────────────────────────────────────────
  {
    id: 'refer',
    keywords: ['refer', 'referral', 'earn', 'invite', 'friend', 'reward', 'cashback', 'bonus'],
    response: `Earn money by sharing BeatBox! 🤑\n\n**Refer & Earn Program:**\n• Share your unique referral link with friends\n• They get **₹100 off** on their first order\n• You earn **₹200 cashback** credited to your wallet\n• No limit — refer unlimited friends!\n\nStart referring from your account dashboard.`,
    link: { label: '🤑 Refer & Earn', path: '#/refer' },
  },

  // ── Personalisation ────────────────────────────────────────
  {
    id: 'personalisation',
    keywords: ['personalise', 'personalize', 'custom', 'engrave', 'personalized', 'customise', 'name on'],
    response: `Make it uniquely yours! ✨\n\n**Personalisation Options:**\n• 🖊️ Name or initials engraving\n• 🎨 Custom color variants (on select models)\n• 🎁 Custom gift message cards\n\nAvailable on selected products — look for the **"Personalise"** tag!`,
    link: { label: '✨ Personalisation', path: '#/personalisation' },
  },

  // ── SoundMatch ─────────────────────────────────────────────
  {
    id: 'soundmatch',
    keywords: ['soundmatch', 'sound match', 'recommend', 'which one', 'suggest', 'best for me', 'which headphone', 'which earbuds'],
    response: `Let me help you find the perfect match! 🎯\n\nOur **SoundMatch** tool asks you a few questions about:\n• Your usage (gym, travel, work, gaming)\n• Your budget\n• Sound preference (bass-heavy, balanced, vocal-focused)\n\n...and recommends the best product for YOU!`,
    link: { label: '🎯 Try SoundMatch', path: '#/soundmatch' },
  },

  // ── Gaming ─────────────────────────────────────────────────
  {
    id: 'gaming',
    keywords: ['gaming', 'game', 'gamer', 'ps5', 'xbox', 'pc gaming', 'surround sound', 'fps', 'esports'],
    response: `Level up your audio! 🎮\n\n**Best BeatBox Gaming Picks:**\n• 🎧 **BeatBox Xtreme Pro** — 7.1 virtual surround, RGB, ultra-low latency\n• 🎧 **BeatBox Raid** — Detachable mic, 50mm drivers, USB-C\n• 🎧 **BeatBox Sentinel** — Cross-platform (PC/PS5/Xbox/Switch)\n\n**Key Gaming Features:**\n• Low-latency wireless (< 40ms)\n• Crystal-clear mic with noise gate\n• Powerful bass for immersive gameplay`,
    link: { label: '🎮 Shop Gaming Headsets', path: '#/products?category=gaming' },
  },

  // ── Best for gym / workout ──────────────────────────────────
  {
    id: 'gym',
    keywords: ['gym', 'workout', 'running', 'sports', 'exercise', 'sweat', 'waterproof', 'ipx', 'outdoor', 'jogging', 'fitness'],
    response: `Power your workouts! 💪\n\n**Best for Sports & Gym:**\n• 🏃 **BeatBox Rush Sport Neckband** — IPX5, 20hr battery, ear-hook secure fit\n• 🎧 **BeatBox Atom TWS** — IPX4, stable fit, punchy bass\n• ⌚ **BeatBox FitPro Watch** — SpO2, heart rate, music control\n\n💡 Look for **IPX4 or higher** rating for sweat/rain resistance!`,
    link: { label: '💪 Shop Sports Audio', path: '#/products' },
  },

  // ── Best under budget ───────────────────────────────────────
  {
    id: 'budget_500',
    keywords: ['under 500', 'below 500', 'cheapest', 'most affordable', '₹500', 'under five hundred'],
    response: `Great audio doesn't have to be expensive! 🤑\n\n**Under ₹500 picks:**\n• 🎧 **BeatBox Evo** — Wired earbuds, premium sound, tangle-free cable\n• 🎵 **BeatBox Swift Neckband** — 15hr battery, magnetic tips\n• 🔊 **BeatBox Mini** — Portable speaker, 6hr battery\n\nAll come with **1-year warranty** included!`,
    link: { label: '🔍 Browse Budget Picks', path: '#/products' },
  },

  // ── Under 1000 ──────────────────────────────────────────────
  {
    id: 'budget_1000',
    keywords: ['under 1000', 'below 1000', '₹1000', 'under one thousand', '1k budget'],
    response: `Solid picks under ₹1,000! 💰\n\n**Best Value:**\n• 🎧 **BeatBox Air Lite TWS** — 28hr total, ENC calls, IPX4\n• 🎵 **BeatBox Flex Pro Neckband** — 20hr, fast charge, LDAC\n• 🔊 **BeatBox BoomBox Mini** — 10hr speaker, RGB\n\nGreat sound, zero compromise on essentials!`,
    link: { label: '💸 Shop Under ₹1000', path: '#/products' },
  },

  // ── Under 3000 ──────────────────────────────────────────────
  {
    id: 'budget_3000',
    keywords: ['under 3000', 'below 3000', '₹3000', 'mid range', 'mid-range', '2000', '2500'],
    response: `Premium mid-range options! ⭐\n\n**Best Under ₹3,000:**\n• 🎧 **BeatBox Air Pro TWS** — ANC, 50hr, Hi-Res certified\n• 🎵 **BeatBox Studio X Headphone** — 40mm, foldable, 30hr\n• 🔊 **BeatBox Boom 360** — 360° surround, IPX7, 20hr\n\nPerfect balance of features and price!`,
    link: { label: '⭐ Shop Mid-Range', path: '#/products' },
  },

  // ── ANC vs ENC ─────────────────────────────────────────────
  {
    id: 'anc_vs_enc',
    keywords: ['difference between anc and enc', 'anc vs enc', 'what is enc', 'what is anc', 'noise cancellation difference'],
    response: `Great question! Here's the difference 🎓\n\n**ANC (Active Noise Cancellation):**\n• Cancels ambient sounds YOU hear (traffic, AC, crowd)\n• Uses microphones + anti-noise technology\n• Best for: commuting, studying, focus\n\n**ENC (Environmental Noise Cancellation):**\n• Filters noise from your MIC during calls\n• Makes YOUR voice clearer for the other person\n• Best for: calls, meetings, voice recording\n\n💡 *Premium models have BOTH ANC + ENC!*`,
  },

  // ── Driver size / sound quality ─────────────────────────────
  {
    id: 'driver_sound',
    keywords: ['driver', 'driver size', 'sound quality', 'bass', 'treble', 'frequency', 'hz', 'hi-res', 'lossless', 'ldac', 'aptx'],
    response: `Let's talk audio tech! 🎵\n\n**Driver Size Guide:**\n• 6–10mm → Earbuds (tight, punchy)\n• 40mm → Over-ear (rich, balanced)\n• 50mm → Studio-grade (wide, immersive)\n\n**Codecs:**\n• **SBC** — Standard quality (all Bluetooth)\n• **AAC** — Better quality (iPhone optimized)\n• **LDAC** — Hi-Res wireless (best quality)\n• **aptX** — Low-latency, great for Android\n\nBeatBox flagship models support **LDAC + aptX HD**!`,
  },

  // ── Multipoint / dual connection ───────────────────────────
  {
    id: 'multipoint',
    keywords: ['multipoint', 'two devices', 'dual connection', 'connect two phones', 'multiple devices', 'switch between'],
    response: `Multipoint is super handy! 📱💻\n\n**Multipoint Connection** lets you connect to **2 devices simultaneously** — e.g. your phone + laptop.\n\n• Music from laptop pauses automatically when a call comes on phone\n• Switch between devices instantly, no re-pairing\n\n**BeatBox models with Multipoint:**\n• BeatBox Air Pro TWS ✅\n• BeatBox Studio X Headphone ✅\n• BeatBox Boom 360 Speaker ✅`,
  },

  // ── Mic quality ─────────────────────────────────────────────
  {
    id: 'microphone',
    keywords: ['mic', 'microphone', 'call quality', 'voice clarity', 'recording', 'podcast', 'voice note'],
    response: `BeatBox mics are top-notch! 🎙️\n\n**Mic Features across products:**\n• 📞 **ENC** — Filters background noise on calls\n• 🎙️ **Quad-mic array** — On flagship TWS for 360° pickup\n• 🎚️ **Boom mic** — On gaming headsets (detachable)\n• 🤫 **AI noise suppression** — On premium models\n\n**Best for calls:**\n• BeatBox Air Pro TWS (6 mics + ENC)\n• BeatBox Raid Gaming (detachable boom mic)\n• BeatBox Studio X (dual mic, great for video calls)`,
  },

  // ── Battery charging tips ───────────────────────────────────
  {
    id: 'battery_tips',
    keywords: ['battery tips', 'charge properly', 'battery health', 'overcharge', 'how to charge', 'charging time', 'charging case'],
    response: `Keep your battery healthy! 🔋\n\n**Charging Tips:**\n• ✅ Use the included cable for best results\n• ✅ Charge to 80–90% regularly (avoids stress)\n• ✅ Don't leave at 0% for long periods\n• ❌ Avoid overnight charging repeatedly\n• ❌ Don't use in extreme heat while charging\n\n**TWS Case Charging:**\n• Place earbuds in case — they charge automatically\n• Case charges via USB-C (most models)\n• Fast charge: 15 min → 3hr playback ⚡`,
  },

  // ── Wired vs Wireless ───────────────────────────────────────
  {
    id: 'wired_vs_wireless',
    keywords: ['wired vs wireless', 'should i get wired', 'wired or wireless', 'better wired or bluetooth', '3.5mm', 'aux'],
    response: `Here's how to choose! 🎯\n\n**Wired (3.5mm/USB-C):**\n• ✅ Zero latency — great for gaming/studio\n• ✅ No charging needed\n• ✅ Works with any device\n• ❌ Cable restriction, tangle risk\n\n**Wireless (Bluetooth):**\n• ✅ Total freedom of movement\n• ✅ Modern features (ANC, touch controls)\n• ✅ Better for commute/gym\n• ❌ Needs charging\n\n💡 *For casual listening & mobility → Wireless. For studio/gaming → Wired.*`,
  },

  // ── Kids / children ─────────────────────────────────────────
  {
    id: 'kids',
    keywords: ['kids', 'children', 'child', 'for my kid', 'son', 'daughter', 'school', 'safe volume', 'volume limit'],
    response: `Safe listening for little ones! 👶\n\n**BeatBox Kids-Friendly Picks:**\n• 🎧 **BeatBox Junior** — Volume limited to 85dB, soft cushions\n• 🌈 **BeatBox Color TWS** — Bright colors, IPX4, child-safe\n• 🎒 **BeatBox StudyPod** — Wired, foldable, lightweight\n\n**Features to look for:**\n• 85dB volume limit (WHO recommended)\n• Durable, drop-resistant build\n• Comfortable fit for smaller ears\n• Parental controls via BeatBox App`,
  },

  // ── Elderly / seniors ───────────────────────────────────────
  {
    id: 'elderly',
    keywords: ['elderly', 'senior', 'old age', 'parent', 'easy to use', 'simple', 'grandparent'],
    response: `Easy-to-use picks for seniors! 👴👵\n\n**Best Simple Options:**\n• 🎧 **BeatBox Classic Neckband** — Simple on/off, big buttons\n• 🔊 **BeatBox HomePod** — Home speaker, voice assistant built-in\n• ⌚ **BeatBox Aura Watch** — Large display, health monitoring\n\n**Why these work:**\n• Large, tactile buttons\n• Loud, clear speaker output\n• Simple pairing (one-button connect)\n• Health alerts (heart rate, SpO2)`,
  },

  // ── Comparison questions ────────────────────────────────────
  {
    id: 'compare',
    keywords: ['compare', 'vs', 'versus', 'difference between', 'which is better', 'which one to buy', 'should i get'],
    response: `Let me help you compare! ⚖️\n\nFor the best comparison, use our **Compare Tool** — add up to 3 products side by side and see:\n• Battery life\n• Driver size & sound signature\n• Features (ANC, ENC, multipoint)\n• Price & warranty\n• User ratings\n\nOr tell me which **two specific products** you're deciding between and I'll help you pick the right one!`,
    link: { label: '⚖️ Open Compare Tool', path: '#/compare' },
  },

  // ── App / companion app ─────────────────────────────────────
  {
    id: 'app',
    keywords: ['app', 'beatbox app', 'companion app', 'equalizer', 'eq', 'settings', 'touch control', 'customize sound'],
    response: `The BeatBox App supercharges your device! 📱\n\n**App Features:**\n• 🎚️ **10-band EQ** — Custom sound profiles\n• 🎛️ **Touch controls** — Remap gestures\n• 🔊 **Sound modes** — Bass Boost, Studio, Game, Movie\n• 🔋 **Battery widget** — Live status on your phone\n• 🎙️ **Mic tuning** — Adjust ENC sensitivity\n• 📍 **Find my earbuds** — Last known location\n\n**Download:** Search "BeatBox" on Google Play or App Store.`,
  },

  // ── Troubleshooting / not working ──────────────────────────
  {
    id: 'troubleshoot',
    keywords: ['not working', 'not connecting', 'pairing issue', 'broken', 'one side not working', 'no sound', 'cutting out', 'disconnecting', 'reset', 'factory reset'],
    response: `Let's fix that! 🔧\n\n**Quick Troubleshooting:**\n\n**Can't connect?**\n• Delete the device from your Bluetooth list\n• Put earbuds back in case for 10 sec, then re-pair\n\n**One earbud silent?**\n• Charge both fully → reset (hold both buttons 8 sec)\n\n**Audio cutting out?**\n• Move phone closer, remove obstructions\n• Check for Wi-Fi interference (switch Wi-Fi band)\n\n**Factory reset:** Hold the button on your device for 10 seconds until LED flashes red-white.\n\nStill stuck? Contact our support team!`,
    link: { label: '📞 Contact Support', path: '#/support' },
  },

  // ── Water resistance ────────────────────────────────────────
  {
    id: 'waterproof',
    keywords: ['waterproof', 'water resistant', 'water proof', 'rain', 'splash', 'swim', 'ipx rating', 'ipx4', 'ipx5', 'ipx7'],
    response: `IPX ratings explained! 💧\n\n**What IPX means:**\n• **IPX4** — Splash resistant (sweat, light rain) ✅ Gym safe\n• **IPX5** — Water jets resistant ✅ Running in rain\n• **IPX6** — Powerful jets resistant ✅ Heavy rain\n• **IPX7** — Submerged 1m/30min ✅ Pool edge\n\n⚠️ No BeatBox earbuds are designed for swimming.\n\n**BeatBox IPX Ratings:**\n• Most TWS: IPX4–IPX5\n• Sport neckbands: IPX5\n• Boom 360 Speaker: IPX7`,
  },

  // ── Voice assistant ─────────────────────────────────────────
  {
    id: 'voice_assistant',
    keywords: ['voice assistant', 'google assistant', 'alexa', 'siri', 'hey google', 'voice command', 'hands free'],
    response: `Hands-free control! 🗣️\n\n**Voice Assistant Support:**\n• ✅ Google Assistant (all Android-optimized models)\n• ✅ Siri (iOS-compatible models)\n• ✅ Alexa (on BeatBox HomePod & Watch series)\n\n**How to activate:**\n• Double-tap or long-press the touch area (varies by model)\n• Configure in the BeatBox App → Touch Controls\n\nCheck your product manual for the exact gesture for your model!`,
  },

  // ── Best for calls / WFH ───────────────────────────────────
  {
    id: 'calls_wfh',
    keywords: ['work from home', 'wfh', 'office', 'video call', 'zoom', 'teams', 'meet', 'calls', 'conference', 'professional'],
    response: `Crystal-clear calls for work! 💼\n\n**Best WFH Picks:**\n• 🎧 **BeatBox Studio X** — Dual mic, ANC, USB-C dongle\n• 🎧 **BeatBox Air Pro TWS** — 6-mic ENC, all-day battery\n• 🎵 **BeatBox Flex Pro Neckband** — Lightweight, 20hr, HD voice\n\n**Must-have WFH features:**\n• ENC mic (colleagues won't hear background noise)\n• ANC (you won't hear distractions)\n• 20hr+ battery (full workday)\n• Multipoint (phone + laptop together)`,
    link: { label: '💼 Shop WFH Audio', path: '#/products' },
  },

  // ── Travel ─────────────────────────────────────────────────
  {
    id: 'travel',
    keywords: ['travel', 'flight', 'airplane', 'commute', 'metro', 'train', 'portable', 'foldable', 'carry on', 'road trip'],
    response: `Your perfect travel companion! ✈️\n\n**Best for Travel:**\n• 🎧 **BeatBox Air Pro TWS** — Compact case, 50hr, ANC (great on planes!)\n• 🎧 **BeatBox Studio X** — Foldable, hard carry case included\n• 🔊 **BeatBox MiniRave Speaker** — Pocket-sized, TSA-approved\n\n**Travel Checklist:**\n• ANC → Blocks aircraft engine noise\n• Long battery → No dead earbuds mid-flight\n• Compact case → Fits in any bag pocket`,
  },

  // ── How to clean ────────────────────────────────────────────
  {
    id: 'clean',
    keywords: ['clean', 'cleaning', 'hygiene', 'dirty', 'ear wax', 'how to clean', 'maintain', 'maintenance'],
    response: `Keep your gear spotless! 🧹\n\n**Cleaning Guide:**\n\n**Earbuds/IEMs:**\n• Use a dry soft cloth or microfiber towel\n• Clean ear tips with slightly damp cloth, let dry before reattaching\n• Use a dry toothbrush for mesh grills — gently!\n• ❌ Never use water directly on the main body\n\n**Headphone cushions:**\n• Wipe with slightly damp cloth + mild soap\n• Let air dry completely before use\n\n**Charging case:**\n• Blow out dust with compressed air\n• Wipe contacts with a dry cotton swab`,
  },

  // ── Gift recommendations ────────────────────────────────────
  {
    id: 'gift_ideas',
    keywords: ['gift idea', 'what to gift', 'recommend a gift', 'gift for him', 'gift for her', 'gift for friend', 'best gift'],
    response: `Perfect gift ideas! 🎁\n\n**By Recipient:**\n• 🎮 **Gamer** → BeatBox Xtreme Pro Gaming Headset\n• 💼 **Professional** → BeatBox Air Pro TWS + ANC\n• 🏃 **Fitness Lover** → BeatBox Rush Sport + FitPro Watch\n• 🎵 **Music Lover** → BeatBox Studio X Headphone\n• 👶 **Kids** → BeatBox Junior (volume limited)\n• 👴 **Senior** → BeatBox HomePod Speaker\n\n💡 All come in **premium gift packaging** — just add a gift message at checkout!`,
    link: { label: '🎁 Explore Gift Store', path: '#/gifting' },
  },

  // ── Track order ─────────────────────────────────────────────
  {
    id: 'track_order',
    keywords: ['track order', 'where is my order', 'order status', 'not received', 'not delivered', 'order update', 'dispatch'],
    response: `Track your order easily! 📦\n\n**Steps to track:**\n1. Login to your account\n2. Go to **My Orders**\n3. Click on the order → View live tracking\n\n**Shipping Timeline:**\n• Order placed → Confirmed in 1 hour\n• Dispatched → Within 24 hours\n• Delivered → 5–7 days (standard) / 1–3 days (express)\n\n**Didn't receive tracking email?** Check your spam folder or contact support with your Order ID.`,
    link: { label: '📦 Track My Order', path: '#/orders' },
  },

  // ── Cancel order ────────────────────────────────────────────
  {
    id: 'cancel_order',
    keywords: ['cancel order', 'cancel my order', 'cancellation', 'how to cancel', 'stop order'],
    response: `You can cancel before dispatch! ❌\n\n**Cancellation Policy:**\n• ✅ **Before dispatch** — Cancel anytime from My Orders (instant refund)\n• ⚠️ **After dispatch** — Cannot cancel, but you can return after delivery\n• 💳 **Refund** — 5–7 business days to original payment method\n\n**How to cancel:**\n1. Go to **My Orders**\n2. Select the order\n3. Click **Cancel Order**\n4. Choose reason → Confirm`,
    link: { label: '📦 Go to My Orders', path: '#/orders' },
  },

  // ── Stock / availability ─────────────────────────────────────
  {
    id: 'stock',
    keywords: ['out of stock', 'available', 'stock', 'restock', 'when will', 'back in stock', 'notify me'],
    response: `Stock updates! 📊\n\n**If a product is out of stock:**\n• Click **"Notify Me"** on the product page\n• We'll email you the moment it's back in stock\n• You can also add to **Wishlist** for price drop alerts\n\n**Most items restock within 3–7 days.** For urgent needs, our support team can check warehouse stock and estimated restock dates!`,
    link: { label: '❤️ View Wishlist', path: '#/wishlist' },
  },

  // ── EMI / financing ─────────────────────────────────────────
  {
    id: 'emi',
    keywords: ['emi', 'installment', 'no cost emi', 'finance', 'pay later', 'monthly payment', 'bajaj', 'hdfc'],
    response: `Buy now, pay later! 💳\n\n**EMI Options:**\n• **No Cost EMI** — Available on orders above ₹3,000\n• **3/6/9/12 months** — Across major banks\n• **Bank offers** — HDFC, SBI, ICICI, Axis (5–15% off)\n• **BNPL** — Simpl, LazyPay, ZestMoney accepted\n\n**How to use:**\n1. Add to cart → Checkout\n2. Choose **EMI** as payment method\n3. Select bank and tenure\n4. Done! 🎉`,
  },

  // ── Fallback ───────────────────────────────────────────────
  {
    id: 'fallback',
    keywords: [],
    response: `Hmm, I didn't quite catch that! 🤔\n\nTry asking me things like:\n• **"Best earbuds under ₹2000"**\n• **"Which headphone is best for gaming?"**\n• **"How do I return a product?"**\n• **"Track my order"**\n• **"What is ANC?"**\n\nOr use the quick reply buttons below! 👇`,
  },
]

// ── Simple intent matcher ─────────────────────────────────────
export function matchIntent(userInput) {
  const text = userInput.toLowerCase().trim()
  for (const intent of INTENTS) {
    if (intent.id === 'fallback') continue
    if (intent.keywords.some(kw => text.includes(kw))) {
      return intent
    }
  }
  return INTENTS.find(i => i.id === 'fallback')
}
