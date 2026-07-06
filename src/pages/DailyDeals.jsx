import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Clock, Star, ShoppingBag, Lock, 
  Copy, Check, Percent, ArrowUpDown, ChevronDown, 
  ShieldCheck, RefreshCw, Flame, Filter, SlidersHorizontal
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProducts, selectProductStatus, fetchProducts } from '../redux/productSlice'
import { addToCart } from '../redux/cartSlice'
import { productService } from '../services/productService'
import { IMAGE_MAP } from '../data/products'
import { toast } from 'react-hot-toast'
import ProductCard from '../components/ui/ProductCard'
import RecentlyViewed from '../components/ui/RecentlyViewed'
import logo from '../assets/beatbox_logo.png'

export default function DailyDeals() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)

  // SEO Page Title
  useEffect(() => {
    document.title = '⚡ BeatBox Lightning Deals | Premium Audio & Gear'
  }, [])

  // Fetch products if not already loaded
  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts())
    }
  }, [productStatus, dispatch])

  // --- STATE VARIABLES ---
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeBrand, setActiveBrand] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000 })
  const [minDiscount, setMinDiscount] = useState(0)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [activeSort, setActiveSort] = useState('discount_desc')
  const [activeTab, setActiveTab] = useState('live') // 'live' or 'upcoming'
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Coupons state from database
  const [coupons, setCoupons] = useState([])
  const [loadingCoupons, setLoadingCoupons] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)

  // Hero selected color variant
  const [heroSelectedColor, setHeroSelectedColor] = useState(null)

  // Fetch active coupons
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const activeCoupons = await productService.getActiveCoupons()
        setCoupons(activeCoupons || [])
      } catch (err) {
        console.error('Error fetching coupons from backend:', err)
        setCoupons([])
      } finally {
        setLoadingCoupons(false)
      }
    }
    loadCoupons()
  }, [])

  // Countdown timer state (expires at 11:59 PM today)
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

  // --- HERO DEAL CALCULATION ---
  // Priority: IsFeatured -> Highest Discount -> Highest Rating -> Random stable fallback
  const heroDeal = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return null
    const sorted = [...allProducts].sort((a, b) => {
      // 1. IsFeatured
      const featA = a.isFeatured ? 1 : 0
      const featB = b.isFeatured ? 1 : 0
      if (featA !== featB) return featB - featA

      // 2. Highest Discount
      const discA = a.discount || 0
      const discB = b.discount || 0
      if (discA !== discB) return discB - discA

      // 3. Highest Rating
      const ratA = a.averageRating || a.rating || 0
      const ratB = b.averageRating || b.rating || 0
      if (ratA !== ratB) return ratB - ratA

      // 4. Fallback ID
      return a.id - b.id
    })
    return sorted[0]
  }, [allProducts])

  // Set default color for hero when heroDeal loads
  useEffect(() => {
    if (heroDeal) {
      if (heroDeal.colors && heroDeal.colors.length > 0) {
        setHeroSelectedColor(heroDeal.colors[0])
      } else {
        setHeroSelectedColor(null)
      }
    }
  }, [heroDeal])

  // Resolve active variant details for Hero Deal
  const heroDetails = useMemo(() => {
    if (!heroDeal) return null

    const colorObj = heroSelectedColor || heroDeal.colors?.[0] || null
    const variants = heroDeal.variants || []
    
    // Find matching variant
    const variant = variants.find(v => v.color === (colorObj?.name || colorObj?.color || '')) || variants[0] || null

    // Image resolution: Variant Primary Image -> Fallback: First Variant Image -> Product Default Image -> Logo Placeholder
    let imgUrl = null
    if (variant && variant.images && variant.images.length > 0) {
      const primaryImg = variant.images.find(img => img.isPrimary)
      imgUrl = primaryImg ? primaryImg.imageUrl : variant.images[0].imageUrl
    }

    if (!imgUrl) {
      imgUrl = colorObj?.imageUrl || heroDeal.imageUrl || IMAGE_MAP[heroDeal.imageKey] || logo
    }

    const originalPrice = variant ? variant.price : heroDeal.oldPrice
    const salePrice = variant ? (variant.discountPrice ?? variant.price) : heroDeal.price
    const stock = variant ? variant.stockQuantity : heroDeal.stockQuantity
    const discount = originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0

    return {
      colorObj,
      variant,
      imgUrl,
      originalPrice,
      salePrice,
      stock,
      discount
    }
  }, [heroDeal, heroSelectedColor])

  // --- TOP DEALS (6-10 products) ---
  // Ordered by Highest Discount or Featured
  const topDealsList = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return []
    const sorted = [...allProducts].sort((a, b) => {
      const featA = a.isFeatured ? 1 : 0
      const featB = b.isFeatured ? 1 : 0
      if (featA !== featB) return featB - featA
      return (b.discount || 0) - (a.discount || 0)
    })
    return sorted.slice(0, 10)
  }, [allProducts])

  // --- UPCOMING LOCKED DROPS (FOMO) ---
  const upcomingDeals = useMemo(() => {
    // Select products with moderate discounts
    return allProducts
      .filter(p => p.discount > 0 && p.discount < 50)
      .slice(4, 10)
  }, [allProducts])

  // --- DYNAMIC FILTER OPTIONS ---
  const uniqueCategories = useMemo(() => {
    const cats = allProducts.map(p => p.categoryName || p.category).filter(Boolean)
    return ['all', ...new Set(cats)]
  }, [allProducts])

  const uniqueBrands = useMemo(() => {
    const brands = allProducts.map(p => p.brand).filter(Boolean)
    return ['all', ...new Set(brands)]
  }, [allProducts])

  const maxPriceLimit = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return 25000
    return Math.max(...allProducts.map(p => p.price || 0), 25000)
  }, [allProducts])

  // Set the priceRange max limit once products load
  useEffect(() => {
    if (allProducts.length > 0) {
      setPriceRange(prev => ({ ...prev, max: maxPriceLimit }))
    }
  }, [maxPriceLimit, allProducts.length])

  // --- FILTER & SORT PIPELINE FOR GRID ---
  const filteredLiveProducts = useMemo(() => {
    let result = [...allProducts]

    // Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(p => (p.categoryName || p.category || '').toLowerCase() === activeCategory.toLowerCase())
    }

    // Brand Filter
    if (activeBrand !== 'all') {
      result = result.filter(p => (p.brand || '').toLowerCase() === activeBrand.toLowerCase())
    }

    // Price Range Filter
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)

    // Discount Filter
    if (minDiscount > 0) {
      result = result.filter(p => p.discount >= minDiscount)
    }

    // Availability Filter
    if (onlyInStock) {
      result = result.filter(p => p.inStock)
    }

    // Sorting
    switch (activeSort) {
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      case 'discount_desc':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
      case 'popularity':
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
        break
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating_desc':
        result.sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0))
        break
      default:
        break
    }

    return result
  }, [allProducts, activeCategory, activeBrand, priceRange, minDiscount, onlyInStock, activeSort])

  // --- HANDLERS ---
  const handleHeroAddToCart = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!heroDeal || !heroDetails) return

    dispatch(addToCart({
      id: heroDeal.id,
      variantId: heroDetails.variant?.id,
      name: heroDeal.name,
      price: heroDetails.salePrice,
      imageUrl: heroDetails.imgUrl,
      selectedColor: heroDetails.colorObj?.name || heroDetails.colorObj?.color || 'Default',
      selectedColorCode: heroDetails.colorObj?.code || heroDetails.colorObj?.colorCode || '#111111',
      category: heroDeal.category,
    }))

    toast.success(`⚡ Claimed! ${heroDeal.name} (${heroDetails.colorObj?.name || 'Default'}) added to cart!`, {
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
    <div className="w-100 min-vh-100 position-relative pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', overflowX: 'hidden', paddingTop: '80px' }}>
      
      {/* Background neon glows */}
      <div className="bg-glow-orb" style={{ width: '500px', height: '500px', background: 'var(--bb-primary-glow)', top: '5%', left: '-15%', filter: 'blur(130px)', pointerEvents: 'none' }}></div>
      <div className="bg-glow-orb" style={{ width: '600px', height: '600px', background: 'var(--bb-accent-glow)', top: '40%', right: '-15%', filter: 'blur(150px)', pointerEvents: 'none' }}></div>

      {/* ── TOP ANNOUNCEMENT BAR ────────────────── */}
      {coupons.length > 0 && (
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
            🔥 Lightning Loot: Apply code "{coupons[0].code}" at checkout for extra savings! 🔥
          </span>
        </div>
      )}

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
        {heroDeal && heroDetails && (
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
                  {heroDetails.discount > 0 && (
                    <div className="hero-deal-badge">
                      <Flame size={16} fill="currentColor" /> {heroDetails.discount}% OFF
                    </div>
                  )}
                  <img 
                    src={heroDetails.imgUrl} 
                    alt={heroDeal.name} 
                    className="img-fluid hero-float"
                    onClick={() => navigate(`/products/${heroDeal.id}`)}
                    style={{ 
                      maxHeight: '340px', 
                      objectFit: 'contain',
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 25px rgba(239, 68, 68, 0.25))',
                      transition: 'all 0.3s ease'
                    }}
                    onError={(e) => { e.target.src = logo }}
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
                      <Star size={14} className="text-warning fill-warning" /> {Number(heroDeal.averageRating || heroDeal.rating || 0).toFixed(1)} | {heroDeal.reviewCount} Reviews
                    </span>
                  </div>

                  <h2 
                    className="fw-black text-theme-title display-6 mb-2 cursor-pointer hover-text-accent" 
                    style={{ letterSpacing: '-1.5px', cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${heroDeal.id}`)}
                  >
                    {heroDeal.name}
                  </h2>
                  <h5 className="text-danger fw-extrabold mb-4">{heroDeal.usp}</h5>
                  <p className="text-theme-muted small mb-4" style={{ lineHeight: 1.6, maxWidth: '580px' }}>
                    {heroDeal.description}
                  </p>

                  {/* Quantity Claimed progress bar (Pseudo-live indicator based on ID) */}
                  <div className="mb-4" style={{ maxWidth: '380px' }}>
                    <div className="d-flex justify-content-between mb-1 small fw-bold">
                      <span className="text-danger">🔥 Stock Availability</span>
                      <span className={heroDetails.stock > 0 ? "text-success" : "text-danger"}>
                        {heroDetails.stock > 0 ? `${heroDetails.stock} units left in stock` : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '50px', overflow: 'hidden' }}>
                      <div 
                        className={`progress-bar progress-bar-striped progress-bar-animated ${heroDetails.stock > 10 ? 'bg-success' : 'bg-danger'}`}
                        role="progressbar" 
                        style={{ width: `${Math.min(100, (heroDetails.stock / 50) * 100)}%` }} 
                        aria-valuenow={heroDetails.stock} 
                        aria-valuemin="0" 
                        aria-valuemax="50"
                      ></div>
                    </div>
                  </div>

                  {/* Variant Selection */}
                  {heroDeal.colors && heroDeal.colors.length > 0 && (
                    <div className="mb-4">
                      <span className="small text-theme-muted d-block mb-2 fw-bold uppercase-label">Select Color Variant:</span>
                      <div className="d-flex gap-2">
                        {heroDeal.colors.map((clr, i) => (
                          <button
                            key={i}
                            onClick={() => setHeroSelectedColor(clr)}
                            className="btn p-0 rounded-circle border-0 transition-all"
                            style={{
                              width: 28, height: 28,
                              background: clr.code || clr.colorCode,
                              outline: (heroDetails.colorObj?.name === clr.name || heroDetails.colorObj?.color === clr.color) ? `2px solid white` : 'none',
                              outlineOffset: 2,
                              boxShadow: (heroDetails.colorObj?.name === clr.name || heroDetails.colorObj?.color === clr.color) ? `0 0 10px ${clr.code || clr.colorCode}` : 'none'
                            }}
                            title={clr.name}
                            aria-label={`Select ${clr.name}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Countdown Ticker */}
                  <div className="mb-4">
                    <span className="small text-theme-muted d-block mb-2 fw-bold uppercase-label">⚡ Today's Deal | Expires at 11:59 PM:</span>
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

                  {/* Pricing and Action */}
                  <div className="d-flex flex-wrap align-items-center gap-4 pt-2">
                    <div>
                      <div className="d-flex align-items-baseline gap-2">
                        <span className="fs-2 fw-black text-theme-title">₹{heroDetails.salePrice.toLocaleString('en-IN')}</span>
                        <span className="text-decoration-line-through text-theme-muted fs-5">₹{heroDetails.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      {heroDetails.originalPrice > heroDetails.salePrice && (
                        <span className="text-success small fw-extrabold d-block">
                          Save ₹{(heroDetails.originalPrice - heroDetails.salePrice).toLocaleString('en-IN')} (Free Delivery Included)
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={handleHeroAddToCart}
                      disabled={heroDetails.stock <= 0}
                      className="btn btn-danger-glow py-3 px-5 fw-bold d-flex align-items-center gap-2 hover-scale"
                      style={{ borderRadius: '12px', height: '55px' }}
                    >
                      <ShoppingBag size={18} /> {heroDetails.stock > 0 ? 'Claim Deal Now' : 'Out Of Stock'}
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </section>
        )}

        {/* ── DEALS COUPONS SECTION ────────────────── */}
        {!loadingCoupons && coupons.length > 0 && (
          <section className="mb-5">
            <div className="text-center mb-4">
              <h4 className="fw-black text-theme-title mb-1">Active Store Promotions</h4>
              <p className="text-theme-muted small">Click any coupon below to copy and apply at checkout for extra savings!</p>
            </div>
            
            <div className="row g-3 row-cols-1 row-cols-md-3">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="col">
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
                    <div className="coupon-notch-left"></div>
                    <div className="coupon-notch-right"></div>

                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge bg-secondary bg-opacity-25 text-theme-title small fw-bold px-2 py-1" style={{ fontSize: '0.65rem' }}>
                        ACTIVE OFFER
                      </span>
                      <div className="text-theme-muted">
                        {copiedCode === coupon.code ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                      </div>
                    </div>

                    <h3 className="fw-black text-theme-title mb-1" style={{ color: 'var(--bb-primary)' }}>
                      {coupon.discountPercentage ? `EXTRA ${coupon.discountPercentage}% OFF` : `EXTRA ₹${coupon.discountAmount} OFF`}
                    </h3>
                    <h6 className="fw-black text-accent mb-2 uppercase-label tracking-wide">{coupon.code}</h6>
                    <p className="text-theme-muted small mb-0">Minimum Purchase: ₹{coupon.minimumOrderAmount.toLocaleString('en-IN')}</p>
                    <p className="text-theme-muted small mb-0" style={{ fontSize: '0.7rem', opacity: 0.8 }}>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TOP DEALS DECK (6-10 Products Slider/Grid) ── */}
        {topDealsList.length > 0 && (
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-black text-theme-title mb-1">⚡ Mega Discount Drops</h3>
                <p className="text-theme-muted small mb-0">Today's absolute highest discount values across the catalog</p>
              </div>
            </div>

            <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
              {topDealsList.map((prod, idx) => (
                <div key={`top-deal-${prod.id}`} className="col">
                  <ProductCard product={prod} index={idx} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TAB SELECTOR (LIVE VS UPCOMING) ───────── */}
        <div className="d-flex justify-content-center gap-3 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
          <button 
            className={`btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all ${activeTab === 'live' ? 'active-deal-tab' : 'inactive-deal-tab'}`}
            onClick={() => setActiveTab('live')}
          >
            ⚡ Live Deals ({filteredLiveProducts.length})
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
              {/* ── FILTER & SORT CONTROLS ── */}
              <div className="glass-card p-3 rounded-4 mb-4 border border-secondary border-opacity-10 d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold text-white d-flex align-items-center gap-2">
                    <Filter size={16} className="text-accent" /> Filter & Refine Deals
                  </span>
                  <button 
                    className="btn btn-sm d-md-none border-0 text-accent font-semibold p-0"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <SlidersHorizontal size={16} /> Filters Menu
                  </button>
                </div>

                <div className={`row g-3 ${showMobileFilters ? 'd-flex' : 'd-none d-md-flex'}`}>
                  {/* Category Filter */}
                  <div className="col-12 col-md-3 text-start">
                    <label className="small text-theme-muted mb-1 fw-bold uppercase-label">Category</label>
                    <div className="position-relative">
                      <select 
                        value={activeCategory} 
                        onChange={e => setActiveCategory(e.target.value)}
                        className="form-select form-select-sm"
                        style={{ background: 'var(--bb-surface-2)', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '8px' }}
                      >
                        <option value="all">All Categories</option>
                        {uniqueCategories.filter(c => c !== 'all').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="col-12 col-md-3 text-start">
                    <label className="small text-theme-muted mb-1 fw-bold uppercase-label">Brand</label>
                    <div className="position-relative">
                      <select 
                        value={activeBrand} 
                        onChange={e => setActiveBrand(e.target.value)}
                        className="form-select form-select-sm"
                        style={{ background: 'var(--bb-surface-2)', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '8px' }}
                      >
                        <option value="all">All Brands</option>
                        {uniqueBrands.filter(b => b !== 'all').map(br => (
                          <option key={br} value={br}>{br}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price range selector */}
                  <div className="col-12 col-md-3 text-start">
                    <label className="small text-theme-muted mb-1 fw-bold uppercase-label d-flex justify-content-between">
                      <span>Max Price</span>
                      <span className="text-accent fw-black">₹{priceRange.max.toLocaleString('en-IN')}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max={maxPriceLimit} 
                      value={priceRange.max} 
                      onChange={e => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="form-range"
                    />
                  </div>

                  {/* Sort Selection */}
                  <div className="col-12 col-md-3 text-start">
                    <label className="small text-theme-muted mb-1 fw-bold uppercase-label">Sort By</label>
                    <div className="position-relative">
                      <select 
                        value={activeSort} 
                        onChange={e => setActiveSort(e.target.value)}
                        className="form-select form-select-sm"
                        style={{ background: 'var(--bb-surface-2)', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '8px' }}
                      >
                        <option value="discount_desc">Highest Discount</option>
                        <option value="popularity">Popularity (SoldCount)</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating_desc">Highest Rating</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={`d-flex flex-wrap gap-3 align-items-center pt-2 border-top border-secondary border-opacity-10 ${showMobileFilters ? 'd-flex' : 'd-none d-md-flex'}`}>
                  {/* Min Discount pills */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-theme-muted uppercase-label fw-bold">Min Discount:</span>
                    {[0, 10, 30, 50].map((d) => (
                      <button
                        key={d}
                        onClick={() => setMinDiscount(d)}
                        className={`btn btn-sm py-1 px-3 rounded-pill border-0 fw-bold transition-all ${minDiscount === d ? 'btn-glow' : 'glass-card text-theme-muted'}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {d === 0 ? 'Any' : `${d}%+`}
                      </button>
                    ))}
                  </div>

                  {/* Only In Stock Toggle */}
                  <div className="form-check form-switch ms-md-auto text-start">
                    <input 
                      className="form-check-input cursor-pointer" 
                      type="checkbox" 
                      id="inStockCheck" 
                      checked={onlyInStock}
                      onChange={e => setOnlyInStock(e.target.checked)}
                    />
                    <label className="form-check-label text-theme-title small fw-bold cursor-pointer" htmlFor="inStockCheck">
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>

              {/* ── DEAL PRODUCTS GRID ───────────────────── */}
              {productStatus === 'loading' ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="col">
                      <div className="rounded-4 overflow-hidden" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', height: 380 }}>
                        <div className="skeleton-pulse w-100 h-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredLiveProducts.length === 0 ? (
                <div className="text-center py-5 glass-card p-5" style={{ borderRadius: '16px', border: '1px solid var(--bb-border)' }}>
                  <div className="mb-3" style={{ fontSize: '3rem' }}>⚡</div>
                  <h4 className="text-theme-title fw-bold">No deals match your selection</h4>
                  <p className="text-theme-muted small">Try adjusting your filters, price range, or categories.</p>
                  <button 
                    onClick={() => { setActiveCategory('all'); setActiveBrand('all'); setPriceRange({ min: 0, max: maxPriceLimit }); setMinDiscount(0); setOnlyInStock(false); }} 
                    className="btn btn-glow mt-3 px-4 py-2 fw-bold" 
                    style={{ borderRadius: 10 }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <motion.div layout className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
                  <AnimatePresence mode="popLayout">
                    {filteredLiveProducts.map((prod, idx) => (
                      <motion.div
                        key={prod.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="col"
                      >
                        <ProductCard product={prod} index={idx} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* ── UPCOMING DROPS PORTAL (FOMO LOCKS) ── */
            <motion.div 
              key="upcoming"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"
            >
              {upcomingDeals.map((prod, idx) => (
                <div key={`upcoming-${prod.id}`} className="col">
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

                    {/* Image (Blurred/Grayscale) */}
                    <div className="w-100 position-relative p-4 d-flex align-items-center justify-content-center" style={{ height: '220px', background: 'var(--bb-surface-2)', filter: 'blur(4px) grayscale(0.8)' }}>
                      <img 
                        src={prod.imageUrl} 
                        alt="" 
                        className="img-fluid"
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.target.src = logo }}
                      />
                    </div>

                    {/* Locked overlay */}
                    <div className="position-absolute d-flex flex-column align-items-center justify-content-center" style={{ top: '100px', left: 0, right: 0, zIndex: 10 }}>
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
                        {prod.oldPrice > prod.price && (
                          <span className="text-decoration-line-through text-theme-muted small ms-2">₹{prod.oldPrice.toLocaleString('en-IN')}</span>
                        )}
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

        {/* ── BENEFIT BADGES ──────────────── */}
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
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
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
        .btn-danger-glow {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          border: none;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
          transition: all 0.3s ease;
        }
        .btn-danger-glow:hover:not(:disabled) {
          box-shadow: 0 12px 35px rgba(239, 68, 68, 0.5);
          filter: brightness(1.1);
        }
        .btn-danger-glow:disabled {
          background: #333 !important;
          color: #777 !important;
          box-shadow: none !important;
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
