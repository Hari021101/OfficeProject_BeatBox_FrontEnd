import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Clock, Sparkles, Star, ShoppingBag, Lock, 
  Copy, Check, Percent, ArrowUpDown, ChevronDown, 
  AlertCircle, ShieldCheck, RefreshCw, Flame, Award
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProducts, selectProductStatus, fetchProducts } from '../redux/productSlice'
import { addToCart } from '../redux/cartSlice'
import { IMAGE_MAP } from '../data/products'
import { toast } from 'react-hot-toast'
import RecentlyViewed from '../components/ui/RecentlyViewed'
import logo from '../assets/beatbox_logo.png'

export default function DailyDeals() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)

  // Fetch products if not already loaded
  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts())
    }
  }, [productStatus, dispatch])

  // SEO Page Title
  useEffect(() => {
    document.title = '⚡ BeatBox Lightning Deals | Premium Audio & Gear'
  }, [])

  // --- STATE VARIABLES ---
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDiscountFilter, setActiveDiscountFilter] = useState('all') // 'all', '70+', '60-69', 'under-1499'
  const [activeSort, setActiveSort] = useState('discount_desc')
  const [copiedCode, setCopiedCode] = useState(null)
  const [activeTab, setActiveTab] = useState('live') // 'live' or 'upcoming'

  // Countdown timer state (counts down to midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight - now

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({ hours, minutes, seconds })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  // --- FLASH DEALS SEED (SIMULATED CLAIMED PERCENTAGE) ---
  // We'll generate persistent pseudo-random claimed percentages based on product ID
  const getClaimedPercentage = (id) => {
    const seededRandom = ((id * 9301 + 49297) % 233280) / 233280
    return Math.floor(seededRandom * 40) + 50 // between 50% and 90%
  }

  // --- FILTER & SORT LOGIC ---
  const dealProducts = useMemo(() => {
    // We only showcase high-discount items on the Daily Deals page
    let list = allProducts.filter(p => p.discount >= 45)

    // Category Filter
    if (activeCategory !== 'all') {
      const targetCat = activeCategory.toLowerCase()
      list = list.filter(p => p.category && p.category.toLowerCase().includes(targetCat))
    }

    // Discount / Price level Filter
    if (activeDiscountFilter === '70+') {
      list = list.filter(p => p.discount >= 70)
    } else if (activeDiscountFilter === '60-69') {
      list = list.filter(p => p.discount >= 60 && p.discount < 70)
    } else if (activeDiscountFilter === 'under-1499') {
      list = list.filter(p => p.price < 1499)
    }

    // Sort
    switch (activeSort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating_desc':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'discount_desc':
      default:
        list.sort((a, b) => b.discount - a.discount)
        break
    }

    return list
  }, [allProducts, activeCategory, activeDiscountFilter, activeSort])

  // --- UPCOMING DEALS SEED (FOMO) ---
  const upcomingDeals = useMemo(() => {
    // Select some products to show as "upcoming" locked deals
    return allProducts
      .filter(p => p.discount > 40 && p.discount < 60)
      .slice(5, 9)
  }, [allProducts])

  // --- HERO LIGHTNING DEAL ---
  // Select the single biggest discount product as today's Mega Deal
  const heroDeal = useMemo(() => {
    if (allProducts.length === 0) return null
    return [...allProducts].sort((a, b) => b.discount - a.discount)[0]
  }, [allProducts])

  // --- HANDLERS ---
  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageKey: product.imageKey,
      selectedColor: product.colors?.[0]?.name || 'Default',
      selectedColorCode: product.colors?.[0]?.code || '#111111',
      category: product.category,
      imageUrl: product.imageUrl,
    }))
    
    toast.success(`⚡ claimed! ${product.name} added to cart!`, {
      style: { 
        background: '#060b19', 
        color: '#fff', 
        border: '1px solid var(--bb-accent)', 
        borderRadius: '10px' 
      }
    })
  }

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code "${code}" copied!`, {
      icon: '🎫',
      style: {
        background: '#0a0d14',
        color: '#fff',
        border: '1px solid var(--bb-primary)',
        borderRadius: '10px'
      }
    })
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <div className="w-100 min-vh-100 position-relative pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', overflowX: 'hidden' }}>
      
      {/* Background neon glows */}
      <div className="bg-glow-orb" style={{ width: '500px', height: '500px', background: 'var(--bb-primary-glow)', top: '5%', left: '-15%', filter: 'blur(130px)', pointerEvents: 'none' }}></div>
      <div className="bg-glow-orb" style={{ width: '600px', height: '600px', background: 'var(--bb-accent-glow)', top: '40%', right: '-15%', filter: 'blur(150px)', pointerEvents: 'none' }}></div>

      {/* ── TOP ANNOUNCEMENT BAR ────────────────── */}
      <div 
        className="d-flex align-items-center justify-content-center text-center px-3"
        style={{
          background: 'linear-gradient(90deg, #ef4444, #f97316, #ef4444)',
          backgroundSize: '200% 200%',
          animation: 'gradientBG 4s linear infinite',
          height: '38px',
          fontSize: '0.85rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          zIndex: 100
        }}
      >
        <span className="d-flex align-items-center gap-2">
          🔥 Lightning Loot: Extra 10% Off with Code "DEAL10" at checkout! 🔥
        </span>
      </div>

      <div className="container-fluid px-3 px-lg-5 pt-4">
        
        {/* ── HEADER TITLE ──────────────────────── */}
        <div className="text-center mb-5 mt-3">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span
              className="badge px-4 py-2 mb-3 text-white fw-black d-inline-flex align-items-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444, #ec4899)', 
                borderRadius: '50px', 
                fontSize: '0.8rem', 
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
              }}
            >
              <span className="live-pulse"></span> LIVE LIGHTNING DEALS
            </span>
            <h1 className="display-4 fw-black text-theme-title mb-2" style={{ letterSpacing: '-2.5px' }}>
              BeatBox <span className="gradient-text-red">Loot Store</span>
            </h1>
            <p className="text-theme-muted mx-auto" style={{ maxWidth: '600px', fontSize: '0.95rem' }}>
              Exclusive, limited-quantity price drops. Grab your premium audio gears at their lowest prices ever. Resetting every day at midnight!
            </p>
          </motion.div>
        </div>

        {/* ── HERO BANNER: TODAY'S MEGA DEAL ──────────────── */}
        {heroDeal && (
          <section className="mb-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="position-relative overflow-hidden p-4 p-md-5 rounded-4 glass-card border border-danger border-opacity-20"
              style={{
                boxShadow: '0 20px 45px rgba(239, 68, 68, 0.12)',
                background: 'linear-gradient(135deg, rgba(20, 10, 15, 0.95), rgba(10, 15, 25, 0.95))'
              }}
            >
              {/* Decorative Glow backdrop */}
              <div className="position-absolute rounded-circle bg-glow-orb" style={{ width: '300px', height: '300px', background: 'rgba(239, 68, 68, 0.15)', top: '10%', right: '10%', filter: 'blur(100px)', zIndex: 1 }}></div>

              <div className="row align-items-center g-5 position-relative" style={{ zIndex: 2 }}>
                
                {/* Left Side: Product Image with Floating effect */}
                <div className="col-12 col-md-5 d-flex justify-content-center align-items-center position-relative">
                  <div className="hero-deal-badge">
                    <Flame size={16} fill="currentColor" /> {heroDeal.discount}% OFF
                  </div>
                  <img 
                    src={IMAGE_MAP[heroDeal.imageKey] || heroDeal.image} 
                    alt={heroDeal.name} 
                    className="img-fluid hero-float"
                    style={{ 
                      maxHeight: '340px', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 25px rgba(239, 68, 68, 0.25))'
                    }}
                    onError={(e) => { e.target.src = IMAGE_MAP.heroHeadphones }}
                  />
                  {/* Cyber Grid Circles */}
                  <div className="position-absolute rounded-circle border border-danger border-opacity-10" style={{ width: '380px', height: '380px', zIndex: -1, animation: 'spin 40s linear infinite' }}></div>
                </div>

                {/* Right Side: Deal Details */}
                <div className="col-12 col-md-7 text-start">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span 
                      className="badge text-white px-3 py-2 fw-black text-uppercase" 
                      style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', fontSize: '0.75rem', borderRadius: '50px', letterSpacing: '1px' }}
                    >
                      ⚡ DEAL OF THE DAY
                    </span>
                    <span className="text-theme-muted small fw-bold d-flex align-items-center gap-1">
                      <Star size={14} className="text-warning fill-warning" /> {heroDeal.rating} | {heroDeal.reviewCount} Reviews
                    </span>
                  </div>

                  <h2 className="fw-black text-theme-title display-6 mb-2" style={{ letterSpacing: '-1.5px' }}>{heroDeal.name}</h2>
                  <h5 className="text-danger fw-extrabold mb-4">{heroDeal.usp}</h5>
                  <p className="text-theme-muted small mb-4" style={{ lineHeight: 1.6, maxWidth: '580px' }}>
                    {heroDeal.description || 'Elevate your gaming and acoustic experience with our industry-leading audio response technology. Designed with soft protein ear cushions, deep sub-woofers, and ultra-high-definition audio components.'}
                  </p>

                  {/* Countdown Ticker */}
                  <div className="mb-4">
                    <span className="small text-theme-muted d-block mb-2 fw-bold uppercase-label">LIGHTNING DEAL ENDS IN:</span>
                    <div className="d-flex align-items-center gap-2">
                      <div className="timer-box">
                        <span className="d-block timer-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="timer-label">Hours</span>
                      </div>
                      <span className="timer-colon">:</span>
                      <div className="timer-box">
                        <span className="d-block timer-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="timer-label">Mins</span>
                      </div>
                      <span className="timer-colon">:</span>
                      <div className="timer-box">
                        <span className="d-block timer-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="timer-label">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Claimed progress bar */}
                  <div className="mb-4" style={{ maxWidth: '380px' }}>
                    <div className="d-flex justify-content-between mb-1 small fw-bold">
                      <span className="text-danger">🔥 {getClaimedPercentage(heroDeal.id)}% Claimed</span>
                      <span className="text-theme-muted">Only a few left in stock!</span>
                    </div>
                    <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '50px', overflow: 'hidden' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated bg-danger" 
                        role="progressbar" 
                        style={{ width: `${getClaimedPercentage(heroDeal.id)}%` }} 
                        aria-valuenow={getClaimedPercentage(heroDeal.id)} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="d-flex flex-wrap align-items-center gap-4 pt-2">
                    <div>
                      <div className="d-flex align-items-baseline gap-2">
                        <span className="fs-2 fw-black text-theme-title">₹{heroDeal.price.toLocaleString('en-IN')}</span>
                        <span className="text-decoration-line-through text-theme-muted fs-5">₹{heroDeal.oldPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-success small fw-extrabold">Save ₹{(heroDeal.oldPrice - heroDeal.price).toLocaleString('en-IN')} (Free Delivery Included)</span>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(heroDeal)}
                      className="btn btn-danger-glow py-3 px-5 fw-bold d-flex align-items-center gap-2 hover-scale"
                      style={{ borderRadius: '12px', height: '55px' }}
                    >
                      <ShoppingBag size={18} /> Claim Deal Now
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </section>
        )}

        {/* ── DEALS COUPONS SECTION ────────────────── */}
        <section className="mb-5">
          <div className="text-center mb-4">
            <h4 className="fw-black text-theme-title mb-1">Exclusive Coupon Codes</h4>
            <p className="text-theme-muted small">Click any coupon below to copy and apply at checkout for extra savings!</p>
          </div>
          
          <div className="row g-3 row-cols-1 row-cols-md-3">
            {[
              { code: 'DEAL10', value: 'EXTRA 10% OFF', desc: 'Valid on all Daily Deal products', badge: 'DEAL MAJESTIC' },
              { code: 'BEATVIP', value: 'EXTRA 15% OFF', desc: 'Valid on orders above ₹3,000', badge: 'HIGH ROLLER' },
              { code: 'FREESHIP', value: 'FREE EXPRESS SHIPPING', desc: 'No minimum order required today', badge: 'FAST & FREE' }
            ].map((coupon, idx) => (
              <div key={idx} className="col">
                <div 
                  className="coupon-card h-100 position-relative p-4 rounded-4"
                  onClick={() => copyCouponCode(coupon.code)}
                  style={{
                    background: 'var(--bb-surface)',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Left-right notch punches for coupon effect */}
                  <div className="coupon-notch-left"></div>
                  <div className="coupon-notch-right"></div>

                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-secondary bg-opacity-25 text-theme-title small fw-bold px-2 py-1" style={{ fontSize: '0.65rem' }}>
                      {coupon.badge}
                    </span>
                    <div className="text-theme-muted">
                      {copiedCode === coupon.code ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </div>
                  </div>

                  <h3 className="fw-black text-theme-title gradient-text mb-1">{coupon.value}</h3>
                  <h6 className="fw-black text-accent mb-2 uppercase-label tracking-wide">{coupon.code}</h6>
                  <p className="text-theme-muted small mb-0">{coupon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TAB SELECTOR (LIVE VS UPCOMING) ───────── */}
        <div className="d-flex justify-content-center gap-3 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
          <button 
            className={`btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all ${activeTab === 'live' ? 'active-deal-tab' : 'inactive-deal-tab'}`}
            onClick={() => setActiveTab('live')}
          >
            ⚡ Live Deals ({dealProducts.length})
          </button>
          <button 
            className={`btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all ${activeTab === 'upcoming' ? 'active-deal-tab-upcoming' : 'inactive-deal-tab'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            🔒 Upcoming Drops ({upcomingDeals.length})
          </button>
        </div>

        {/* ── ACTIVE DEALS PORTAL ──────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === 'live' ? (
            <motion.div 
              key="live"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── FILTERS AND SORTING TOOLBAR ─────────── */}
              <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-5">
                
                {/* Category Selection Filter Pills */}
                <div className="d-flex align-items-center gap-2 overflow-x-auto py-2 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {[
                    { id: 'all', label: 'All Deals' },
                    { id: 'tws', label: 'TWS Earbuds' },
                    { id: 'headphones', label: 'Headphones' },
                    { id: 'neckbands', label: 'Neckbands' },
                    { id: 'smartwatches', label: 'Smart Watches' },
                    { id: 'speakers', label: 'Speakers & Soundbars' }
                  ].map((pill) => {
                    const isActive = activeCategory === pill.id
                    return (
                      <button
                        key={pill.id}
                        onClick={() => setActiveCategory(pill.id)}
                        className="btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all hover-scale"
                        style={{
                          fontSize: '0.8rem',
                          background: isActive 
                            ? 'linear-gradient(135deg, #ef4444, #f97316)' 
                            : 'var(--bb-surface)',
                          color: isActive ? '#ffffff' : 'var(--bb-title-color)',
                          border: isActive ? 'none' : '1px solid var(--bb-border)',
                          boxShadow: isActive ? '0 8px 20px rgba(239, 68, 68, 0.2)' : 'none'
                        }}
                      >
                        {pill.label}
                      </button>
                    )
                  })}
                </div>

                {/* Discount Filter / Sorting */}
                <div className="d-flex align-items-center gap-3">
                  
                  {/* Discount Filters */}
                  <div className="position-relative">
                    <select
                      value={activeDiscountFilter}
                      onChange={e => setActiveDiscountFilter(e.target.value)}
                      className="form-select fw-semibold"
                      style={{
                        background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)',
                        borderRadius: 10, height: 42, paddingLeft: 16, paddingRight: 36, fontSize: '0.85rem',
                        appearance: 'none', cursor: 'pointer', minWidth: 160
                      }}
                    >
                      <option value="all">All Discounts</option>
                      <option value="70+">70% Off & Above</option>
                      <option value="60-69">60% - 69% Off</option>
                      <option value="under-1499">Deals Under ₹1,499</option>
                    </select>
                    <ChevronDown size={14} className="position-absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--bb-muted)', pointerEvents: 'none' }} />
                  </div>

                  {/* Sort selection */}
                  <div className="position-relative">
                    <select
                      value={activeSort}
                      onChange={e => setActiveSort(e.target.value)}
                      className="form-select fw-semibold"
                      style={{
                        background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)',
                        borderRadius: 10, height: 42, paddingLeft: 16, paddingRight: 36, fontSize: '0.85rem',
                        appearance: 'none', cursor: 'pointer', minWidth: 190
                      }}
                    >
                      <option value="discount_desc">Biggest Discount First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating_desc">Highest Rated First</option>
                    </select>
                    <ArrowUpDown size={14} className="position-absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--bb-muted)', pointerEvents: 'none' }} />
                  </div>

                </div>

              </div>

              {/* ── DEAL PRODUCTS GRID ───────────────────── */}
              {productStatus === 'loading' ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="col">
                      <div className="rounded-4 overflow-hidden" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', height: 380 }}>
                        <div className="skeleton-pulse w-100 h-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : dealProducts.length === 0 ? (
                <div className="text-center py-5 glass-card p-5" style={{ borderRadius: '16px', border: '1px solid var(--bb-border)' }}>
                  <div className="mb-3" style={{ fontSize: '3rem' }}>⚡</div>
                  <h4 className="text-theme-title fw-bold">No deals match your selection</h4>
                  <p className="text-theme-muted small">Try selecting another category or resetting filters.</p>
                  <button 
                    onClick={() => { setActiveCategory('all'); setActiveDiscountFilter('all'); }} 
                    className="btn btn-glow mt-3 px-4 py-2 fw-bold" 
                    style={{ borderRadius: 10 }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <motion.div layout className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4">
                  <AnimatePresence mode="popLayout">
                    {dealProducts.map((prod, idx) => (
                      <motion.div
                        key={prod.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="col"
                      >
                        <div 
                          className="card deal-product-card border-1 h-100 overflow-hidden text-start position-relative"
                          onClick={() => navigate(`/products/${prod.id}`)}
                          style={{ cursor: 'pointer', background: 'var(--bb-surface)', borderRadius: '20px', border: '1px solid var(--bb-border)', transition: 'all 0.3s ease' }}
                        >
                          {/* Lightning Tag */}
                          <div className="position-absolute top-0 start-0 m-3 z-3">
                            <span 
                              className="badge text-white px-2 py-1 fw-bold text-uppercase d-flex align-items-center gap-1"
                              style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', fontSize: '0.65rem' }}
                            >
                              <Zap size={10} fill="currentColor" /> {prod.discount}% OFF
                            </span>
                          </div>

                          {/* Image Box */}
                          <div className="product-frame w-100 position-relative p-4 d-flex align-items-center justify-content-center" style={{ height: '220px', background: 'var(--bb-surface-2)' }}>
                            <img 
                              src={IMAGE_MAP[prod.imageKey] || prod.image} 
                              alt={prod.name} 
                              className="product-img img-fluid"
                              style={{ maxHeight: '100%', objectFit: 'contain', transition: 'all 0.3s' }}
                              onError={(e) => { e.target.src = IMAGE_MAP.heroHeadphones }}
                            />
                            {/* Brand Tag Overlay */}
                            <div className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded-pill" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <span style={{ fontSize: '0.55rem', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>BEATBOX</span>
                            </div>
                          </div>

                          {/* Info Ribbon */}
                          <div 
                            className="d-flex align-items-center justify-content-between px-3 py-1.5 fw-bold"
                            style={{ background: 'linear-gradient(90deg, #ffc700, #ffb800)', color: '#000000', fontSize: '0.7rem' }}
                          >
                            <span className="text-uppercase tracking-wider text-truncate" style={{ maxWidth: '70%' }}>{prod.usp || 'BeatBox Signature Audio'}</span>
                            <span className="d-flex align-items-center gap-0.5 bg-white px-2 py-0.5 rounded-pill" style={{ fontSize: '0.65rem', color: '#000' }}>
                              <Star size={10} fill="#000" />
                              {Number(prod.rating || 0).toFixed(1)}
                            </span>
                          </div>

                          {/* Content Body */}
                          <div className="card-body d-flex flex-column justify-content-between p-3">
                            <div>
                              {/* Title */}
                              <h6 className="fw-black text-theme-title mb-1 text-truncate hover-text-accent transition-all" style={{ fontSize: '0.95rem' }}>
                                {prod.name}
                              </h6>
                              
                              {/* Claimed progress bar */}
                              <div className="mb-3 mt-2">
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                                  <span className="text-danger">🔥 {getClaimedPercentage(prod.id)}% Claimed</span>
                                  <span className="text-theme-muted">Selling fast!</span>
                                </div>
                                <div className="progress" style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '50px' }}>
                                  <div 
                                    className="progress-bar bg-danger progress-bar-striped" 
                                    role="progressbar" 
                                    style={{ width: `${getClaimedPercentage(prod.id)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* Pricing & Add to Cart */}
                            <div>
                              <div className="d-flex justify-content-between align-items-baseline mb-3">
                                <div>
                                  <span className="fw-black fs-5 text-theme-title">₹{prod.price.toLocaleString('en-IN')}</span>
                                  <span className="text-decoration-line-through text-theme-muted small ms-2" style={{ fontSize: '0.75rem' }}>₹{prod.oldPrice.toLocaleString('en-IN')}</span>
                                </div>
                              </div>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddToCart(prod)
                                }}
                                className="btn btn-add-to-cart w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-bold"
                                style={{ fontSize: '0.85rem' }}
                              >
                                <ShoppingBag size={14} /> Claim Deal
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* ── UPCOMING DROPS PORTAL ───────────────── */
            <motion.div 
              key="upcoming"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4"
            >
              {upcomingDeals.map((prod, idx) => (
                <div key={prod.id} className="col">
                  <div 
                    className="card h-100 position-relative"
                    style={{ 
                      background: 'var(--bb-surface)', 
                      borderRadius: '20px', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      overflow: 'hidden',
                      pointerEvents: 'none'
                    }}
                  >
                    {/* Locked badge */}
                    <div className="position-absolute top-0 start-0 m-3 z-3">
                      <span className="badge bg-secondary text-white px-2 py-1 fw-bold text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }}>
                        <Lock size={10} /> LOCKS IN 6H
                      </span>
                    </div>

                    {/* Image (Blurred to simulate upcoming drop) */}
                    <div className="w-100 position-relative p-4 d-flex align-items-center justify-content-center" style={{ height: '220px', background: 'var(--bb-surface-2)', filter: 'blur(6px) grayscale(0.8)' }}>
                      <img 
                        src={IMAGE_MAP[prod.imageKey] || prod.image} 
                        alt="" 
                        className="img-fluid"
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.target.src = IMAGE_MAP.heroHeadphones }}
                      />
                    </div>

                    {/* Locked center notification */}
                    <div className="position-absolute d-flex flex-column align-items-center justify-content-center" style={{ top: '110px', left: 0, right: 0, zIndex: 10 }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Lock size={20} className="text-accent" />
                      </div>
                      <span className="text-accent small fw-bold mt-2" style={{ textShadow: '0 0 10px rgba(0,243,255,0.5)' }}>Unlocking at 4:00 PM</span>
                    </div>

                    {/* Content Body */}
                    <div className="card-body p-3 text-start" style={{ opacity: 0.4 }}>
                      <h6 className="fw-black text-theme-title mb-1 text-truncate">{prod.name}</h6>
                      <div className="d-flex align-items-baseline mb-3">
                        <span className="fw-black fs-5 text-theme-title">₹{prod.price.toLocaleString('en-IN')}</span>
                        <span className="text-decoration-line-through text-theme-muted small ms-2">₹{prod.oldPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <button className="btn btn-secondary w-100 py-2 fw-bold" style={{ fontSize: '0.85rem' }} disabled>
                        Unlocks Soon
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOOT ENGINE BENEFIT BADGES ──────────────── */}
        <section className="py-5 mt-5 bg-theme-surface border-top border-bottom rounded-4" style={{ background: 'var(--bb-surface)' }}>
          <div className="row g-4 row-cols-1 row-cols-md-3 text-center">
            <div className="col">
              <div className="d-flex flex-column align-items-center p-3">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444' }}>
                  <Flame size={24} />
                </div>
                <h6 className="fw-bold text-theme-title mb-2">Price Drop Guaranteed</h6>
                <p className="text-theme-muted small mb-0" style={{ maxWidth: '280px' }}>These products are listed at their absolute lowest price point for the next 24 hours.</p>
              </div>
            </div>
            
            <div className="col">
              <div className="d-flex flex-column align-items-center p-3">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0, 243, 255, 0.08)', color: 'var(--bb-accent)' }}>
                  <ShieldCheck size={24} />
                </div>
                <h6 className="fw-bold text-theme-title mb-2">100% Brand Authenticity</h6>
                <p className="text-theme-muted small mb-0" style={{ maxWidth: '280px' }}>All items are shipped directly from BeatBox warehouses, complete with 1-Year Brand Warranty.</p>
              </div>
            </div>

            <div className="col">
              <div className="d-flex flex-column align-items-center p-3">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(168, 32, 255, 0.08)', color: 'var(--bb-primary-light)' }}>
                  <RefreshCw size={24} />
                </div>
                <h6 className="fw-bold text-theme-title mb-2">Easy Claims & Replacements</h6>
                <p className="text-theme-muted small mb-0" style={{ maxWidth: '280px' }}>Not happy with your gear? Get a replacement processed in under 72 hours through our warranty portal.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── RECENTLY VIEWED PRODUCTS ────────────────── */}
        <section className="py-5 px-0">
          <RecentlyViewed />
        </section>

      </div>

      <style>{`
        .live-pulse {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ef4444;
          box-shadow: 0 0 0 rgba(239, 68, 68, 0.4);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .gradient-text-red {
          background: linear-gradient(135deg, #ef4444 30%, #ec4899 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-float {
          animation: floatHero 4s ease-in-out infinite;
        }
        @keyframes floatHero {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .hero-deal-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ef4444;
          color: white;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.8rem;
          z-index: 10;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .timer-box {
          min-width: 65px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }
        .timer-number {
          font-size: 1.4rem;
          font-weight: 900;
          color: #ef4444;
        }
        .timer-label {
          font-size: 0.65rem;
          color: var(--bb-muted);
          text-transform: uppercase;
        }
        .timer-colon {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ef4444;
        }
        .coupon-card {
          border-radius: 16px;
          overflow: hidden;
        }
        .coupon-card:hover {
          border-color: var(--bb-primary) !important;
          box-shadow: 0 10px 30px rgba(0, 243, 255, 0.08);
          transform: translateY(-3px);
        }
        .coupon-notch-left {
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bb-bg-navy);
          border-right: 1px dashed rgba(255, 255, 255, 0.15);
          z-index: 5;
        }
        .coupon-notch-right {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bb-bg-navy);
          border-left: 1px dashed rgba(255, 255, 255, 0.15);
          z-index: 5;
        }
        .active-deal-tab {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: #fff;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
        }
        .active-deal-tab-upcoming {
          background: linear-gradient(135deg, var(--bb-primary), var(--bb-accent));
          color: #fff;
          box-shadow: 0 6px 20px rgba(0, 243, 255, 0.25);
        }
        .inactive-deal-tab {
          background: rgba(255, 255, 255, 0.03);
          color: var(--bb-muted);
          border: 1px solid var(--bb-border) !important;
        }
        .inactive-deal-tab:hover {
          color: var(--bb-text);
          background: rgba(255, 255, 255, 0.08);
        }
        .deal-product-card:hover {
          border-color: rgba(239, 68, 68, 0.3) !important;
          box-shadow: 0 12px 30px rgba(239, 68, 68, 0.08);
          transform: translateY(-4px);
        }
        .deal-product-card:hover .product-img {
          transform: scale(1.05) translateY(-2px);
        }
        .btn-danger-glow {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          border: none;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
          transition: all 0.3s ease;
        }
        .btn-danger-glow:hover {
          box-shadow: 0 12px 35px rgba(239, 68, 68, 0.5);
          filter: brightness(1.1);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .uppercase-label {
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      `}</style>

    </div>
  )
}
