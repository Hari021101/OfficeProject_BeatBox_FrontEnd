import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, selectAllProducts, selectProductStatus } from '../redux/productSlice'
import { addToCart } from '../redux/cartSlice'
import { IMAGE_MAP } from '../data/products'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import AntiGravityPlayground from '../components/ui/AntiGravityPlayground'
import RecentlyViewed from '../components/ui/RecentlyViewed'
import ProductCard from '../components/ui/ProductCard'
import { productService } from '../services/productService'
import { BestSellersSkeleton } from '../components/ui/HomeSkeleton'
import BeatBoxCollections from '../components/ui/BeatBoxCollections'
import ShopByCategories from '../components/ui/ShopByCategories'
import PromotionalBanners from '../components/ui/PromotionalBanners'

// ScrollReveal component to handle scroll animations
function ScrollReveal({ children, id, className, style }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

const MotionLink = motion(Link)

// Asset imports
import heroHeadphones from '../assets/hero_headphones.png'
import heroEarbuds from '../assets/hero_earbuds.png'
import heroSpeaker from '../assets/hero_speaker.png'
import gamingHeadset from '../assets/gaming_headset.png'
import smartEarbuds from '../assets/smart_earbuds.png'
import heroSmartwatch from '../assets/hero_smartwatch.png'
import powerBank from '../assets/power_bank.png'
import trimmer from '../assets/trimmer.png'
import soundbar from '../assets/soundbar.png'
import dashCam from '../assets/dash_cam.png'
import projector from '../assets/projector.png'
import actionCam from '../assets/action_cam.png'
import gamingMouse from '../assets/gaming_mouse.png'
import smartTracker from '../assets/smart_tracker.png'
import phoneWallet from '../assets/phone_wallet.png'
import wiredEarphones from '../assets/wired_earphones.png'
import gamingKeyboard from '../assets/gaming_keyboard.png'
import logo from '../assets/beatbox_logo.png'

export default function Home() {
  const shouldReduceMotion = useReducedMotion()
  // 1. HERO CAROUSEL STATE
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeDealIndex, setActiveDealIndex] = useState(0)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)
  const dealProducts = allProducts.slice(0, 5)

  const dealProduct =
    dealProducts[activeDealIndex] ||
    null
 
    const featuredProducts =
  (allProducts || []).filter(p => p.isFeatured)

  const slides =
  (
    featuredProducts.length
      ? featuredProducts
      : (allProducts || [])
  )
    .slice(0, 6)
    .map(p => ({
      id: p.id,
      title: p.name,
      subtitle: p.categoryName,
      description: p.description,
      price: `₹${p.price ?? 0}`,
      oldPrice: `₹${p.oldPrice ?? 0}`,
      discount: `${p.discount ?? 0}% OFF`,
      image: p.imageUrl,
      productId: p.id,
      badge: p.tag || 'Popular',
      color: '#00f3ff'
    }))


  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true)
        const data = await productService.fetchCategories()
        const sorted = [...data].sort((a, b) => b.productCount - a.productCount)
        setCategories(sorted)
      } catch (err) {
        console.error("Failed to load categories:", err)
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, productStatus])

  const currentSlideData =
    slides[currentSlide] || {
      title: '',
      subtitle: '',
      description: '',
      price: '',
      oldPrice: '',
      discount: '',
      image: '',
      productId: '',
      badge: 'Popular',
      color: '#00f3ff'
    }
  useEffect(() => {
    const categories = [
      ...new Set(
        allProducts.map(
          p => (p.categoryName || p.category || '').toLowerCase()
        )
      )
    ]

    console.log('CATEGORIES:')
    console.log(categories)
  }, [allProducts])


  // Auto slide effect
  useEffect(() => {
    if (!slides.length) return

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    if (!slides.length) return
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (!slides.length) return
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  // 2. BEST SELLERS STATE & COLOR SWATCH HANDLING
  const [selectedColors, setSelectedColors] = useState({
    1: 'purple',
    2: 'cyan',
    3: 'carbon',
    4: 'neon'
  })

  const [activeFilter, setActiveFilter] = useState('all')


  const handleColorChange = (productId, colorName) => {
    setSelectedColors(prev => ({ ...prev, [productId]: colorName }))
    toast.success(`Selected ${colorName} theme color!`, { id: `color-${productId}` })
  }



  const sortedAllProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return []
    return [...allProducts].sort((a, b) => {
      // 1. Highest soldCount
      const aSold = a.soldCount || 0
      const bSold = b.soldCount || 0
      if (bSold !== aSold) return bSold - aSold
      
      // 2. Featured status
      const aFeatured = a.isFeatured || a.tag === 'Featured' ? 1 : 0
      const bFeatured = b.isFeatured || b.tag === 'Featured' ? 1 : 0
      if (bFeatured !== aFeatured) return bFeatured - aFeatured
      
      // 3. Highest rating
      const aRating = a.averageRating || a.rating || 0
      const bRating = b.averageRating || b.rating || 0
      return bRating - aRating
    })
  }, [allProducts])

  const topProducts = useMemo(() => sortedAllProducts.slice(0, 4), [sortedAllProducts])

  const displayProducts = useMemo(() => {
    const list = activeFilter === 'all'
      ? sortedAllProducts
      : sortedAllProducts.filter(prod => {
          const category = (prod.categoryName || prod.category || '').toLowerCase()
          if (activeFilter === 'earbuds')
            return category.includes('earbud') || category.includes('earbuds') || category.includes('tws')
          if (activeFilter === 'headphones')
            return category.includes('headphone') || category.includes('headphones') || category.includes('headset')
          if (activeFilter === 'speakers')
            return category.includes('speaker')
          if (activeFilter === 'gaming')
            return category.includes('gaming')
          if (activeFilter === 'gadgets')
            return category.includes('smart gadgets') || category.includes('gadget')
          if (activeFilter === 'wired')
            return category.includes('wired') || category.includes('earphone')
          return true
        })
    return list.slice(0, 8) // Limit to top 8 best sellers
  }, [activeFilter, sortedAllProducts])



  // 3. COUNTDOWN TIMER STATE FOR DAILY DEALS
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 })
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 24, minutes: 0, seconds: 0 } // Reset daily
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleAddToCartClick = (product) => {
    const selectedColor = selectedColors[product.id] || (product.colors && product.colors[0]?.name) || 'Default';
    const colorCode = (product.colors && product.colors.find(c => c.name === selectedColor)?.code) || '#000';

    dispatch(addToCart({
      id: product.id || product.name,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageKey: product.imageKey || 'heroHeadphones',
      imageUrl: product.imageUrl,
      selectedColor,
      selectedColorCode: colorCode,
      category: product.category || 'General'
    }))

    toast.success(`🎸 Added ${product.name} to your Cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#060b19',
        color: '#fff',
        border: '1px solid rgba(0, 243, 255, 0.3)',
      }
    })
  }

  // 5. LIVE ACTIVITY TOAST ALERTS (CONVERSION TRIGGERS)
  useEffect(() => {
    const locations = ['California', 'New York', 'London', 'Texas', 'Sydney', 'Mumbai', 'Berlin'];
    const productsList = ['BeatBox Pro 5.1', 'Airdopes Cyber 141', 'Gaming Headset X', 'Stone Beat 1200', 'Neon Neckband'];

    // Fire the first toast after 4 seconds
    const initialTimeout = setTimeout(() => {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const prod = productsList[Math.floor(Math.random() * productsList.length)];

      toast(`Someone in ${loc} just purchased a ${prod}!`, {
        icon: '🔥',
        position: 'bottom-left',
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: 'var(--bb-surface-2)',
          color: 'var(--bb-title-color)',
          border: '1px solid var(--bb-accent)',
          fontSize: '0.85rem'
        }
      });
    }, 4000);

    // Then set an interval to fire periodically (every 15-25 seconds)
    const interval = setInterval(() => {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const prod = productsList[Math.floor(Math.random() * productsList.length)];

      toast(`Someone in ${loc} just purchased a ${prod}!`, {
        icon: '🚀',
        position: 'bottom-left',
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: 'var(--bb-surface-2)',
          color: 'var(--bb-title-color)',
          border: '1px solid var(--bb-primary)',
          fontSize: '0.85rem'
        }
      });
    }, 22000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // 4. ZERO-GRAVITY (ANTI-GRAVITY) PHYSICS PLAYGROUND STATE
  const [isZeroGravity, setIsZeroGravity] = useState(false)
  const [zeroGravityElements, setZeroGravityElements] = useState([])

  const activateZeroGravity = () => {
    // Unique sections to capture for the gravity sandbox
    const elementIds = [
      { id: 'gravity-hero-text', render: () => renderHeroText() },
      { id: 'gravity-hero-image', render: () => renderHeroImage() },
      { id: 'gravity-categories', render: () => renderCategories() },
      { id: 'gravity-prod-1', render: () => renderProductCard(topProducts[0]) },
      { id: 'gravity-prod-2', render: () => renderProductCard(topProducts[1]) },
      { id: 'gravity-prod-3', render: () => renderProductCard(topProducts[2]) },
      { id: 'gravity-prod-4', render: () => renderProductCard(topProducts[3]) },
      { id: 'gravity-deal-image', render: () => renderDealImage() },
      { id: 'gravity-deal-details', render: () => renderDealDetails() },
      { id: 'gravity-highlight-1', render: () => renderHighlight(0, <Award size={32} />, "Top Rated Brand", "Millions of music enthusiasts choose BeatBox for outstanding signature high-bass soundscapes.") },
      { id: 'gravity-highlight-2', render: () => renderHighlight(1, <Sparkles size={32} />, "Flagship Innovation", "We collaborate with premier acoustic laboratories to deploy revolutionary dual-chamber audio tuning.") },
      { id: 'gravity-highlight-3', render: () => renderHighlight(2, <Clock size={32} />, "24/7 Support", "Got a warranty request? Our express claim network processes replacement orders in under 72 hours.") }
    ]

    // Instantly scroll to top so fixed physics aligns perfectly with bounding rects
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Brief timeout to let browser layout stabilize after scroll
    setTimeout(() => {
      const captured = elementIds.map((item) => {
        const el = document.getElementById(item.id)
        let rect = { left: 100, top: 100, width: 250, height: 150 }
        if (el) {
          rect = el.getBoundingClientRect()
        }
        return {
          id: item.id,
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          },
          render: item.render
        }
      })

      setZeroGravityElements(captured)
      setIsZeroGravity(true)
      toast.success("🌌 Defying Gravity! Drag & Fling Everything!", {
        style: {
          borderRadius: '10px',
          background: '#040712',
          color: '#00f3ff',
          border: '1px solid rgba(0, 243, 255, 0.4)'
        }
      })
    }, 60)
  }

  const handleRestoreComplete = () => {
    setIsZeroGravity(false)
    toast.success("🌍 Gravity Restored! Elements returned to base.", {
      style: {
        borderRadius: '10px',
        background: '#040712',
        color: '#a820ff',
        border: '1px solid rgba(168, 32, 255, 0.4)'
      }
    })
  }

  // --- MODULAR RENDER CLOSURES TO RENDER BOTH IN GRID AND IN FREE SPACE ---
  const renderHeroText = () => (
    <div style={{ zIndex: 10 }} className="text-start">
      {/* Launch Pill */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <span
          className="badge text-white px-3 py-2 fw-black text-uppercase tracking-wider"
          style={{
            background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
            fontSize: '0.75rem',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0, 243, 255, 0.3)'
          }}
        >
          <Zap size={12} className="d-inline-block me-1 align-text-top" /> {currentSlideData.badge || 'Popular'}
        </span>
      </div>

      {/* Headline titles */}
      <h2
        className="display-5 fw-black text-theme-title mb-2"
        style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}
      >
        {currentSlideData.title || ''}
      </h2>
      <h4
        className="gradient-text fw-extrabold mb-4 fs-4 text-uppercase tracking-wide"
      >
        {currentSlideData.subtitle || ''}
      </h4>

      {/* Description */}
      <p className="text-theme-muted fs-6 mb-4" style={{ lineHeight: '1.7', maxWidth: '520px' }}>
        {currentSlideData.description || ''}
      </p>

      {/* Price and Action Section */}
      <div className="d-flex flex-wrap align-items-center gap-4 mb-3">
        <div>
          <div className="d-flex align-items-baseline gap-2">
            <span className="fs-1 fw-black text-theme-title">{currentSlideData.price}</span>
            <span className="text-decoration-line-through text-theme-muted fs-5">{currentSlideData.oldPrice}</span>
          </div>
          <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-20 px-2 py-1 small fw-bold">
            {currentSlideData.discount}
          </span>
        </div>
        
        <div className="d-flex gap-3 w-100 mt-2">
          <motion.button 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (!currentSlideData.productId) return
              navigate(`/products/${currentSlideData.productId}`)
            }}
            className="btn btn-glow d-flex align-items-center justify-content-center gap-2 py-3 fw-bold w-100 w-sm-auto px-sm-5"
            style={{ borderRadius: '12px', height: '55px', border: 'none' }}
          >
            View Product <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  )

  const renderHeroImage = () => (
    <div
      className="position-relative text-center w-100 hover-scale transition-all d-flex justify-content-center align-items-center"
      style={{
        zIndex: 5,
        cursor: 'pointer',
        height: '500px'
      }}
      onClick={() =>
        navigate(`/products/${currentSlideData.productId}`)
      }
    >
      <img
        src={currentSlideData.image || '/placeholder-product.png'}
        alt={currentSlideData.title}
        className="hero-float"
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '500px',
          objectFit: 'contain'
        }}
        onError={(e) => {
          e.target.src = '/placeholder-product.png';
        }}
      />
    </div>
  )
  const renderCategories = () => (
    <div className="row g-4 row-cols-2 row-cols-sm-3 row-cols-md-5 justify-content-center w-100 m-0">
      {[
        { id: 'earbuds', name: 'AirPods & Earbuds', shortName: 'AirPods', image: heroEarbuds, badge: 'HOT' },
        { id: 'earbuds', name: 'TWS Earbuds', shortName: 'TWS', image: smartEarbuds, badge: 'PRO' },
        { id: 'gaming', name: 'Gaming Headsets', shortName: 'Gaming', image: gamingHeadset, badge: 'CYBER' },
        { id: 'wired earphones', name: 'Wired Headphones', shortName: 'Wired', image: wiredEarphones, badge: 'PURE' },
        { id: 'speakers', name: 'Speakers', shortName: 'Speakers', image: heroSpeaker, badge: 'LOUD' },
        { id: 'power bank', name: 'Power Banks', shortName: 'Power', image: powerBank, badge: 'CHARGE' },
        { id: 'soundbars', name: 'Soundbars', shortName: 'Soundbars', image: soundbar, badge: 'CINEMA' },
        { id: 'gaming keyboard', name: 'Gaming Accessories', shortName: 'Accessories', image: gamingKeyboard, badge: 'PRO' },
        { id: 'car accessories', name: 'Car Accessories', shortName: 'Car Accs', image: dashCam, badge: 'SAFE' },
        { id: 'projectors', name: 'Projectors', shortName: 'Projectors', image: projector, badge: 'HOME' },
        { id: 'smart gadgets', name: 'Smart Gadgets', shortName: 'Gadgets', image: smartTracker, badge: 'SPORT' },
        { id: 'trimmer', name: 'Personal Care', shortName: 'Care', image: trimmer, badge: 'MENS' },
        { id: 'mobile accessories', name: 'Mobile Accessories', shortName: 'Mobile', image: phoneWallet, badge: 'TECH' }
      ].map((cat, idx) => (
        <div key={idx} className="col">
          <button
            onClick={() => navigate(`/products?category=${cat.id}`)}
            className="category-card btn p-0 border-0 d-flex flex-column align-items-center justify-content-center text-center text-decoration-none w-100"
          >
            {cat.badge && <span className="category-badge">{cat.badge}</span>}

            <div className="image-wrapper mb-3">
              <img
                src={cat.image}
                alt={cat.name}
                className="category-img"
              />
            </div>

            <h6 className="fw-bold mb-1 text-theme-title" style={{ fontSize: '0.95rem', letterSpacing: '-0.2px' }}>{cat.shortName}</h6>

            <span className="text-accent small d-flex align-items-center gap-1 mt-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
              Shop Now <ArrowRight size={10} />
            </span>
          </button>
        </div>
      ))}
    </div>
  )

  const renderProductCard = (prod, index = 0) => {
    if (!prod) return null
    return <ProductCard product={prod} index={index} />
  }



  const sideDeals =
    dealProducts.filter(
      (_, index) => index !== activeDealIndex
    )

  const renderDealImage = () => (
    <div className="text-center">
      <img
        src={
          dealProduct?.imageUrl ||
          IMAGE_MAP[dealProduct?.imageKey]
        }
        alt={dealProduct?.name}
        className="img-fluid"
        style={{
          maxHeight: '320px',
          objectFit: 'contain',
          filter:
            'drop-shadow(0 20px 40px rgba(0,0,0,.25))'
        }}
      />
    </div>
  )


  const renderDealDetails = () => (
    <div>
      <span
        className="badge text-white px-3 py-2 mb-3"
        style={{
          background:
            'linear-gradient(135deg,#ef4444,#f97316)',
          borderRadius: '999px'
        }}
      >
        🔥 DEAL OF THE DAY
      </span>

      <h2 className="fw-bold mb-2">
        {dealProduct?.name}
      </h2>

      <h5
        style={{
          color: '#06b6d4'
        }}
        className="mb-3"
      >
        {dealProduct?.categoryName}
      </h5>

      <p className="text-muted mb-4">
        {dealProduct?.description}
      </p>

      <div className="d-flex gap-3 mb-4">
        <div className="text-center p-3 border rounded">
          <h4>{String(timeLeft.hours).padStart(2, '0')}</h4>
          <small>Hours</small>
        </div>

        <div className="text-center p-3 border rounded">
          <h4>{String(timeLeft.minutes).padStart(2, '0')}</h4>
          <small>Mins</small>
        </div>

        <div className="text-center p-3 border rounded">
          <h4>{String(timeLeft.seconds).padStart(2, '0')}</h4>
          <small>Secs</small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-4">
        <div>
          <h2 className="fw-bold mb-0">
            ₹{dealProduct?.price}
          </h2>

          <span
            style={{
              textDecoration: 'line-through',
              color: '#888'
            }}
          >
            ₹{dealProduct?.oldPrice || dealProduct?.price}
          </span>

          <div
            style={{
              color: '#16a34a',
              fontWeight: 'bold'
            }}
          >
            {dealProduct?.discount || 0}% OFF
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            navigate(`/products/${dealProduct?.id}`)
          }
          className="btn fw-bold d-flex align-items-center gap-2"
          style={{
            background:
              'linear-gradient(135deg,#7c3aed,#06b6d4)',
            color: '#fff',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '14px',
            boxShadow:
              '0 10px 30px rgba(124,58,237,.35)'
          }}
        >
          Claim Deal
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  )

  useEffect(() => {
    if (!dealProducts.length) return

    const timer = setInterval(() => {
      setActiveDealIndex(prev =>
        (prev + 1) % dealProducts.length
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [dealProducts.length])

  if (!allProducts || allProducts.length === 0) {
    if (productStatus === 'loading') {
      return <BestSellersSkeleton />
    }
    return null
  }
  
  const renderHighlight = (index, icon, title, text) => (
    <div className="highlight-card h-100 text-center">
      <div className="icon-wrapper" style={{
        background: index % 2 === 0 ? 'rgba(0, 243, 255, 0.05)' : 'rgba(168, 32, 255, 0.05)',
        color: index % 2 === 0 ? 'var(--bb-accent)' : 'var(--bb-primary-light)'
      }}>
        <div className="icon-glow" style={{
          backgroundColor: index % 2 === 0 ? 'var(--bb-accent)' : 'var(--bb-primary-light)'
        }}></div>
        {icon}
      </div>
      <h5 className="title-text text-theme-title">{title}</h5>
      <p className="desc-text text-theme-muted small mb-0">{text}</p>
    </div>
  )

  return (

    <div className="w-100 min-vh-100 position-relative" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {productStatus === 'loading' && (
        <div className="text-center py-5">
          Loading products...
        </div>
      )}
      {/* BACKGROUND GLOWS FOR AMBIENCE */}
      <div className="bg-glow-orb" style={{ width: '500px', height: '500px', background: 'var(--bb-primary-glow)', top: '10%', left: '-10%', filter: 'blur(130px)', pointerEvents: 'none' }}></div>
      <div className="bg-glow-orb" style={{ width: '600px', height: '600px', background: 'var(--bb-accent-glow)', bottom: '15%', right: '-15%', filter: 'blur(150px)', animationDelay: '3s', pointerEvents: 'none' }}></div>

      {/* ZERO-GRAVITY INTERACTIVE PHYSICS SANDBOX MODE */}
      {isZeroGravity && (
        <AntiGravityPlayground
          elements={zeroGravityElements}
          onRestoreComplete={handleRestoreComplete}
        />
      )}

      <div className="storefront-wrapper" style={{ opacity: isZeroGravity ? 0 : 1, pointerEvents: isZeroGravity ? 'none' : 'auto', transition: 'opacity 0.4s ease' }}>

        {/* ==================== 1. HERO CAROUSEL SECTION ==================== */}
        <section className="position-relative pt-3 pb-5 pt-lg-0 pb-lg-0 d-flex align-items-center" style={{
    paddingTop: '2rem',
    paddingBottom: '2rem'
}}>
          <div className="container-fluid px-lg-5">
            <div className="position-relative rounded-4 p-4 p-md-5 glass-card hero-carousel-card" style={{ border: '1px solid rgba(0, 243, 255, 0.15)', height: 'auto' }}>

              {/* Slide background glow ring */}
              <div className="position-absolute rounded-circle bg-glow-orb" style={{ width: '400px', height: '400px', background: currentSlideData.color || '#00f3ff', top: '20%', right: '20%', filter: 'blur(100px)', opacity: 0.3 }}></div>

              <div className="row align-items-center g-5 py-3">

                {/* Left Side: Product Information */}
                <div id="gravity-hero-text" className="col-12 col-lg-6 position-relative">
                  {renderHeroText()}
                </div>

                {/* Right Side: Product Image Display with animations */}
                <div id="gravity-hero-image" className="col-12 col-lg-6 d-flex justify-content-center align-items-center position-relative">
                  {renderHeroImage()}

                  {/* Cybernetic Grid design circles in background */}
                  <div
                    className="position-absolute rounded-circle border border-info border-opacity-10"
                    style={{ width: '450px', height: '450px', zIndex: 1, animation: 'spin 30s linear infinite' }}
                  ></div>
                  <div
                    className="position-absolute rounded-circle border border-primary border-opacity-10"
                    style={{ width: '320px', height: '320px', zIndex: 1, animation: 'spin 20s linear infinite reverse' }}
                  ></div>
                </div>

              </div>

              {/* Slider Nav & Indicators Console (Unified Bottom Row) */}
              <div className="d-flex align-items-center justify-content-center gap-3 mt-4" style={{ zIndex: 30 }}>
                {/* Left Arrow Button */}
                <button
                  onClick={prevSlide}
                  className="rounded-circle console-btn d-flex align-items-center justify-content-center"
                  style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)', width: '36px', height: '36px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Slide Indicators / Dots */}
                <div className="d-flex align-items-center gap-2">
                  {(slides || []).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className="btn p-0 rounded-circle transition-all"
                      style={{
                        width: currentSlide === index ? '20px' : '8px',
                        height: '8px',
                        backgroundColor: currentSlide === index ? 'var(--bb-accent)' : 'var(--bb-title-color)',
                        opacity: currentSlide === index ? 1 : 0.2,
                        border: 'none',
                        borderRadius: '4px',
                        transition: 'all 0.3s ease'
                      }}
                    ></button>
                  ))}
                </div>

                {/* Right Arrow Button */}
                <button
                  onClick={nextSlide}
                  className="rounded-circle console-btn d-flex align-items-center justify-content-center"
                  style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)', width: '36px', height: '36px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>



        {/* ==================== SHOP BY CATEGORIES ==================== */}
        <ShopByCategories />

        {/* ==================== BEATBOX COLLECTIONS ==================== */}
        <BeatBoxCollections />

        {/* ==================== 3. BEST SELLERS & TRENDING GRID ==================== */}
        <motion.section 
          className="py-5" 
          id="bestsellers"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <div className="container px-lg-5">

            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 text-center text-md-start">
              <div>
                <h3 className="fw-black text-theme-title mb-2 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                  <TrendingUp size={24} className="text-info" /> Best <span className="gradient-text">Sellers</span>
                </h3>
                <p className="text-theme-muted small mb-0">Our top-selling products that bassheads swear by.</p>
              </div>
              <MotionLink 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                to="/products" 
                className="btn btn-outline-secondary text-theme-title border-secondary border-opacity-25 px-4 mt-3 mt-md-0" 
                style={{ borderRadius: '10px' }}
              >
                View All Products
              </MotionLink>
            </div>

            {/* Interactive Category Filter Pills Bar (boAt style) */}
            <div className="d-flex align-items-center gap-2 mb-5 overflow-x-auto py-2 px-1 w-100 justify-content-start justify-content-md-center no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {[
                { id: 'all', label: '🔥 Best Sellers' },
                { id: 'earbuds', label: '🎵 Wireless Earbuds' },
                { id: 'headphones', label: '🎧 Headphones' },
                { id: 'speakers', label: '🔊 Speakers' },
                { id: 'gaming', label: '🎮 Gaming Gear' },
                { id: 'wired', label: '🎧 Wired' }
              ].map((pill) => {
                const isActive = activeFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActiveFilter(pill.id)}
                    className="btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all hover-scale"
                    style={{
                      fontSize: '0.85rem',
                      background: isActive
                        ? 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))'
                        : 'var(--bb-surface)',
                      color: isActive ? '#ffffff' : 'var(--bb-title-color)',
                      border: isActive ? 'none' : '1px solid var(--bb-border)',
                      boxShadow: isActive ? '0 8px 25px var(--bb-accent-glow)' : 'none',
                      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}
                  >
                    {pill.label}
                  </button>
                )
              })}
            </div>

            {/* Framer Motion Filtered Grid */}
            {productStatus === 'loading' ? (
              <BestSellersSkeleton />
            ) : (
              <div className="related-products-container">
                <AnimatePresence mode="popLayout">
                  {displayProducts.map((prod, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, cubicBezier: [0.165, 0.84, 0.44, 1] }}
                      key={prod.id}
                      className="related-product-col"
                      id={`gravity-prod-${prod.id}`}
                    >
                      <ProductCard product={prod} index={idx} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

          </div>
        </motion.section>

       

        {/* ==================== 4. DAILY DEALS Promotional Section ==================== */}
        {/* ==================== DAILY DEALS PREMIUM ==================== */}
        <motion.section 
          className="py-5" 
          id="newlaunches"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <div className="container px-lg-5">

            <div
              className="glass-card p-4 p-lg-5 rounded-4"
              style={{
                border: '1px solid var(--bb-border)',
                overflow: 'hidden'
              }}
            >
              <div className="text-center mb-5">
                <span
                  className="badge px-4 py-2 mb-3"
                  style={{
                    background:
                      'linear-gradient(135deg,#ef4444,#f97316)',
                    fontSize: '.85rem'
                  }}
                >
                  🔥 LIMITED TIME OFFERS
                </span>

                <h2 className="fw-black">
                  Daily <span className="gradient-text">Deals</span>
                </h2>

                <p className="text-theme-muted">
                  Best discounts selected from our premium collection
                </p>
              </div>

              {/* FEATURED PRODUCT */}

              <motion.div
                key={dealProduct?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: .4 }}
                className="row align-items-center mb-5"
              >

                <div className="col-lg-5 text-center">

                  <img
                    src={dealProduct?.imageUrl}
                    alt={dealProduct?.name}
                    className="img-fluid"
                    style={{
                      width: '100%',
                      maxWidth: '420px',
                      height: '420px',
                      objectFit: 'contain',
                      filter:
                        'drop-shadow(0 25px 50px rgba(0,0,0,.25))'
                    }}
                  />

                </div>

                <div className="col-lg-7">

                  <span
                    className="badge mb-3"
                    style={{
                      background:
                        'linear-gradient(135deg,#ef4444,#f97316)',
                      fontSize: '.8rem'
                    }}
                  >
                    DEAL OF THE DAY
                  </span>

                  <h1
                    className="fw-black mb-3"
                    style={{
                      fontSize: '3rem'
                    }}
                  >
                    {dealProduct?.name}
                  </h1>

                  <h4
                    className="mb-4"
                    style={{
                      color: '#06b6d4'
                    }}
                  >
                    {dealProduct?.categoryName}
                  </h4>

                  <p
                    className="text-theme-muted mb-4"
                    style={{
                      maxWidth: '600px'
                    }}
                  >
                    {dealProduct?.description}
                  </p>

                  {/* TIMER */}

                  <div className="d-flex gap-3 mb-4">

                    {[
                      {
                        value: String(timeLeft.hours).padStart(
                          2,
                          '0'
                        ),
                        label: 'Hours'
                      },
                      {
                        value: String(timeLeft.minutes).padStart(
                          2,
                          '0'
                        ),
                        label: 'Mins'
                      },
                      {
                        value: String(timeLeft.seconds).padStart(
                          2,
                          '0'
                        ),
                        label: 'Secs'
                      }
                    ].map(item => (

                      <div
                        key={item.label}
                        className="text-center"
                        style={{
                          minWidth: '80px'
                        }}
                      >
                        <div
                          className="glass-card py-3"
                          style={{
                            border:
                              '1px solid var(--bb-border)'
                          }}
                        >
                          <h3 className="fw-bold mb-0">
                            {item.value}
                          </h3>
                        </div>

                        <small>{item.label}</small>
                      </div>

                    ))}

                  </div>

                  {/* PRICE */}

                  <div className="mb-4">

                    <div className="d-flex align-items-center gap-3">

                      <h1 className="fw-black mb-0">
                        ₹{dealProduct?.price}
                      </h1>

                      <span
                        style={{
                          textDecoration: 'line-through',
                          color: '#888',
                          fontSize: '1.3rem'
                        }}
                      >
                        ₹
                        {dealProduct?.oldPrice ||
                          dealProduct?.price}
                      </span>

                    </div>

                    <div
                      className="fw-bold"
                      style={{
                        color: '#16a34a',
                        fontSize: '1.1rem'
                      }}
                    >
                      {dealProduct?.discount || 0}% OFF
                    </div>

                  </div>

                  {/* BUTTON */}

                  <button
                    onClick={() =>
                      navigate(
                        `/products/${dealProduct?.id}`
                      )
                    }
                    className="btn fw-bold d-flex align-items-center gap-2"
                    style={{
                      background:
                        'linear-gradient(135deg,#7c3aed,#06b6d4)',
                      color: '#fff',
                      border: 'none',
                      padding: '16px 40px',
                      borderRadius: '14px',
                      boxShadow:
                        '0 15px 40px rgba(124,58,237,.35)'
                    }}
                  >
                    Claim Deal
                    <ArrowRight size={18} />
                  </button>

                </div>

              </motion.div>

              {/* OTHER DEALS */}

              <div className="row g-4">

                {sideDeals.map(product => (

                  <div
                    key={product.id}
                    className="col-12 col-md-6 col-xl-3"
                  >
                    <motion.div
                      whileHover={{
                        y: -10,
                        scale: 1.03
                      }}
                      className="glass-card p-3 h-100"
                      style={{
                        cursor: 'pointer',
                        border:
                          '1px solid var(--bb-border)'
                      }}
                      onClick={() =>
                        navigate(
                          `/products/${product.id}`
                        )
                      }
                    >

                      <div
                        className="d-flex justify-content-center align-items-center mb-3"
                        style={{
                          height: '220px'
                        }}
                      >

                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'contain'
                          }}
                        />

                      </div>

                      <h6
                        className="fw-bold mb-2"
                        style={{
                          minHeight: '48px'
                        }}
                      >
                        {product.name}
                      </h6>

                      <div
                        className="text-info fw-bold fs-5"
                      >
                        ₹{product.price}
                      </div>

                    </motion.div>
                  </div>

                ))}

              </div>

            </div>
          </div>
        </motion.section>

        {/* ==================== 5. KEY COMPANY HIGHLIGHTS / BRAND STORY ==================== */}
        <motion.section 
          className="py-5 bg-theme-surface text-center border-top border-bottom" 
          id="support"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <div className="container px-lg-5">
            <div className="row g-4 row-cols-1 row-cols-md-3">

              <div id="gravity-highlight-1" className="col">
                {renderHighlight(0, <Award size={32} />, "Top Rated Brand", "Millions of music enthusiasts choose BeatBox for outstanding signature high-bass soundscapes.")}
              </div>

              <div id="gravity-highlight-2" className="col">
                {renderHighlight(1, <Sparkles size={32} />, "Flagship Innovation", "We collaborate with premier acoustic laboratories to deploy revolutionary dual-chamber audio tuning.")}
              </div>

              <div id="gravity-highlight-3" className="col">
                {renderHighlight(2, <Clock size={32} />, "24/7 Premium Support", "Got a warranty request? Our express claim network processes replacement orders in under 72 hours.")}
              </div>

            </div>
          </div>
        </motion.section>

        {/* ==================== SOCIAL PROOF & UGC ==================== */}
        <motion.section 
          className="py-5" 
          id="social-proof"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <div className="container px-lg-5">
            <div className="text-center mb-5">
              <h3 className="fw-black text-theme-title mb-2">#BeatBox<span className="gradient-text">Vibes</span></h3>
              <p className="text-theme-muted small">Real people, true sound. See how our community is leveling up their audio game.</p>
            </div>

            <div className="row g-4 row-cols-1 row-cols-md-3">
              {[
                { name: "@alex_beats", text: "The ANC on the Rockerz 550 is literally insane. I can't hear anything on the subway anymore! 🔥", img: "https://i.pravatar.cc/150?u=a" },
                { name: "@sarah.gamer", text: "Immortal Cyber Pro headset completely changed my streaming setup. The 7.1 surround is perfectly tuned for tactical games.", img: "https://i.pravatar.cc/150?u=b" },
                { name: "@dj_mike", text: "Took the Stone Beat to a pool party yesterday. Splashed it twice, still bumps the bass like crazy. 10/10.", img: "https://i.pravatar.cc/150?u=c" }
              ].map((review, idx) => (
                <div key={idx} className="col">
                  <div className="card border-0 p-4 h-100 hover-scale" style={{ background: 'var(--bb-surface)', borderRadius: '16px', borderTop: '2px solid var(--bb-accent)' }}>
                    <div className="d-flex gap-1 text-warning mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-theme-title fw-semibold mb-4" style={{ fontStyle: 'italic', lineHeight: '1.6' }}>"{review.text}"</p>
                    <div className="d-flex align-items-center gap-3 mt-auto">
                      <img src={review.img} alt={review.name} className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                      <span className="text-theme-muted fw-bold" style={{ fontSize: '0.85rem' }}>{review.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ==================== RECENTLY VIEWED ==================== */}
        <motion.section 
          className="py-4 px-3 px-lg-5"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <div className="container-fluid px-0">
            <RecentlyViewed />
          </div>
        </motion.section>

      </div>

      {/* FLOAT ANIMATION AND PULSING GLOW KEYFRAMES */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .hero-float {
          animation: float 4s ease-in-out infinite;
        }
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-scale:hover {
          transform: translateY(-5px) scale(1.03) !important;
        }
        .arrow-hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .arrow-hover-scale:hover {
          transform: scale(1.1) !important;
        }
        .console-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .console-btn:hover {
          transform: scale(1.15) !important;
        }
        .hero-carousel-card .console-btn {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, border-color 0.3s !important;
        }
        .hero-carousel-card:hover .console-btn {
          opacity: 1;
          pointer-events: auto;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 8px 25px rgba(0, 243, 255, 0.45); }
          50% { box-shadow: 0 8px 40px rgba(168, 32, 255, 0.7); }
          100% { box-shadow: 0 8px 25px rgba(0, 243, 255, 0.45); }
        }
      `}</style>

    </div>
  )
}
