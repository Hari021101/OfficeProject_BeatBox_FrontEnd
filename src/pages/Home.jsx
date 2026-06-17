import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, selectAllProducts, selectProductStatus } from '../redux/productSlice'
import { addToCart } from '../redux/cartSlice'
import { IMAGE_MAP } from '../data/products'
import { motion, AnimatePresence } from 'framer-motion'
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

// Asset imports
import heroHeadphones from '../assets/hero_headphones.png'
import heroEarbuds from '../assets/hero_earbuds.png'
import heroSpeaker from '../assets/hero_speaker.png'
import gamingHeadset from '../assets/gaming_headset.png'
import wirelessNeckband from '../assets/wireless_neckband.png'
import smartEarbuds from '../assets/smart_earbuds.png'
import heroSmartwatch from '../assets/hero_smartwatch.png'
import heroWired from '../assets/hero_wired.png'
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
  // 1. HERO CAROUSEL STATE
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      id: 1,
      title: "BEATBOX ROCKERZ 550",
      searchKeyword: "rockerz",
      subtitle: "SILENCE THE NOISE, UNLEASH THE BASS",
      description: "Experience true audio purity with high-fidelity 40mm dynamic drivers, hybrid Active Noise Cancellation (ANC), and up to 60 hours of massive playback.",
      price: "₹1,999",
      oldPrice: "₹7,990",
      discount: "75% OFF",
      image: heroHeadphones,
      color: "var(--bb-primary-glow)",
      badge: "Flagship Launch"
    },
    {
      id: 2,
      title: "AIRDOPES CYBER 141",
      searchKeyword: "airdopes",
      subtitle: "NEXT-GEN TWS FOR CYBER GAMERS",
      description: "Equipped with 13mm immersive drivers, BEAST™ mode for 40ms low latency gaming, quad mics with ENx™ technology for clear calls, and a glowing neon charging case.",
      price: "₹1,299",
      oldPrice: "₹4,490",
      discount: "71% OFF",
      image: heroEarbuds,
      color: "var(--bb-accent-glow)",
      badge: "Bestseller"
    },
    {
      id: 3,
      title: "STONE BEAT BEAST 1200",
      searchKeyword: "stone beat",
      subtitle: "RUGGED OUTDOOR PARTY SOUND",
      description: "IPX7 waterproof portable bluetooth speaker. Features dual passive radiators, 14W signature high-bass sound, custom RGB light ring, and active water splash resistance.",
      price: "₹2,499",
      oldPrice: "₹6,990",
      discount: "64% OFF",
      image: heroSpeaker,
      color: "rgba(168, 32, 255, 0.4)",
      badge: "Summer Special"
    },
    {
      id: 4,
      title: "IMMORTAL CYBER PRO",
      searchKeyword: "immortal",
      subtitle: "PRO GAMING VIRTUAL 7.1 SURROUND",
      description: "Level up your gaming with dedicated RGB lights, 50mm dynamic drivers, a professional boom mic, and low-latency cybernetic soundscapes built for esports pros.",
      price: "₹1,599",
      oldPrice: "₹4,999",
      discount: "68% OFF",
      image: gamingHeadset,
      color: "rgba(57, 255, 20, 0.35)",
      badge: "Cyber Launch"
    },
    {
      id: 5,
      title: "TRIP ATHLETIC NEON",
      searchKeyword: "trip",
      subtitle: "PREMIUM SPORTY COLLAR EARPHONES",
      description: "Featherlight flexible silicon collar neckband. Features magnetic metal earbud tips, dual EQ modes for heavy bass, and up to 30 hours of continuous athletic playback.",
      price: "₹999",
      oldPrice: "₹2,990",
      discount: "66% OFF",
      image: wirelessNeckband,
      color: "rgba(0, 243, 255, 0.3)",
      badge: "Active Wear"
    },
    {
      id: 6,
      title: "CYBERWATCH X1",
      searchKeyword: "cyberwatch",
      subtitle: "FUTURISTIC FITNESS TRACKING",
      description: "Premium futuristic smartwatch with a glowing neon interface, health tracking, and 7-day battery life.",
      price: "₹3,499",
      oldPrice: "₹8,990",
      discount: "61% OFF",
      image: smartEarbuds,
      color: "rgba(255, 0, 243, 0.35)",
      badge: "Limited Edition"
    }
  ]

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

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

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts())
    }
  }, [productStatus, dispatch])

  const topProducts = allProducts.length > 0 ? allProducts.slice(0, 4) : []
  const displayProducts = allProducts.length > 0 ? allProducts.filter(prod => activeFilter === 'all' || (prod.category && prod.category.toLowerCase().includes(activeFilter.toLowerCase()))).slice(0, 4) : []



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
          <Zap size={12} className="d-inline-block me-1 align-text-top" /> {slides[currentSlide].badge}
        </span>
      </div>

      {/* Headline titles */}
      <h2 
        className="display-5 fw-black text-theme-title mb-2" 
        style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}
      >
        {slides[currentSlide].title}
      </h2>
      <h4 
        className="gradient-text fw-extrabold mb-4 fs-4 text-uppercase tracking-wide"
      >
        {slides[currentSlide].subtitle}
      </h4>

      {/* Description */}
      <p className="text-theme-muted fs-6 mb-4" style={{ lineHeight: '1.7', maxWidth: '520px' }}>
        {slides[currentSlide].description}
      </p>

      {/* Price and Action Section */}
      <div className="d-flex flex-wrap align-items-center gap-4 mb-3">
        <div>
          <div className="d-flex align-items-baseline gap-2">
            <span className="fs-1 fw-black text-theme-title">{slides[currentSlide].price}</span>
            <span className="text-decoration-line-through text-theme-muted fs-5">{slides[currentSlide].oldPrice}</span>
          </div>
          <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-20 px-2 py-1 small fw-bold">
            {slides[currentSlide].discount}
          </span>
        </div>
        
        <div className="d-flex gap-3 w-100 mt-2">
          <button 
            onClick={() => {
              const realProduct = allProducts.find(p => p.name.toLowerCase().includes(slides[currentSlide].searchKeyword)) || allProducts[0];
              if (realProduct) {
                navigate(`/products/${realProduct.id}`);
              } else {
                toast.error("Products not loaded yet");
              }
            }}
            className="btn btn-glow d-flex align-items-center justify-content-center gap-2 py-3 fw-bold w-100 w-sm-auto px-sm-5"
            style={{ borderRadius: '12px', height: '55px' }}
          >
            View Product <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderHeroImage = () => {
    const realProduct = allProducts.find(p => p.name.toLowerCase().includes(slides[currentSlide].searchKeyword)) || allProducts[0];
    
    return (
      <div 
        className="position-relative text-center w-100 hover-scale transition-all" 
        style={{ zIndex: 5, cursor: 'pointer' }}
        onClick={() => {
          if (realProduct) navigate(`/products/${realProduct.id}`);
        }}
      >
      <img 
        src={slides[currentSlide].image} 
        alt={slides[currentSlide].title} 
        className="img-fluid hero-float"
        style={{ 
          maxHeight: '380px', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5)) drop-shadow(0 0 30px rgba(0, 243, 255, 0.15))' 
        }} 
      />

    </div>
    )
  }
  const renderCategories = () => (
    <div className="row g-4 row-cols-2 row-cols-sm-3 row-cols-md-5 justify-content-center w-100 m-0">
      {[
        { id: 'earbuds', name: 'AirPods & Earbuds', shortName: 'AirPods', image: heroEarbuds, badge: 'HOT' },
        { id: 'earbuds', name: 'TWS Earbuds', shortName: 'TWS', image: smartEarbuds, badge: 'PRO' },
        { id: 'neckbands', name: 'Neckbands', shortName: 'Neckbands', image: wirelessNeckband, badge: 'DAILY' },
        { id: 'gaming', name: 'Gaming Headsets', shortName: 'Gaming', image: gamingHeadset, badge: 'CYBER' },
        { id: 'wired earphones', name: 'Wired Headphones', shortName: 'Wired', image: wiredEarphones, badge: 'PURE' },
        { id: 'smartwatches', name: 'Smart Watches', shortName: 'Watches', image: heroSmartwatch, badge: 'NEW' },
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

  const renderProductCard = (prod) => {
    // Dynamically retrieve the current display image based on color swatch state
    let displayImage = IMAGE_MAP[prod.imageKey] || prod.image;
    if (selectedColors[prod.id] === 'black' && prod.id === 1) {
      displayImage = heroHeadphones; // Add alternative dynamic state visual mapping if preferred
    }

    return (
      <div 
        className="card bestseller-card border-1 h-100 overflow-hidden text-start position-relative"
        onClick={() => navigate(`/products/${prod.id}`)}
        style={{ cursor: 'pointer' }}
      >
        {/* Card Badge Tag */}
        <div className="position-absolute top-0 start-0 m-3 z-3">
          <span className="badge badge-left text-white px-2 py-1 fw-bold text-uppercase">
            {prod.tag}
          </span>
        </div>

        {/* Product Visual Frame */}
        <div className="product-frame w-100 position-relative">
          <Link to={`/products/${prod.id}`} className="d-flex align-items-center justify-content-center w-100 h-100 text-decoration-none">
            <img 
              src={displayImage} 
              alt={prod.name} 
              className="product-img"
            />
          </Link>
        </div>

        {/* Signature boAt Gold Feature Ribbon */}
        <div 
          className="d-flex align-items-center justify-content-between px-3 py-2 fw-bold"
          style={{ 
            background: 'linear-gradient(90deg, #ffc700, #ffb800)', 
            color: '#000000', 
            fontSize: '0.75rem', 
            letterSpacing: '0.2px',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <span className="text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>{prod.usp}</span>
          <span 
            className="d-flex align-items-center gap-1 bg-white px-2 py-0.5 rounded-pill"
            style={{ fontSize: '0.65rem', color: '#000000', fontWeight: '800', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}
          >
            <Star size={10} className="fill-dark text-dark" style={{ fill: '#000000' }} />
            {Number(prod.rating || 0).toFixed(1)}
          </span>
        </div>

        {/* Product Details Panel */}
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            {/* Interactive Color Swatches */}
            <div className="d-flex gap-2 mb-3">
              {prod.colors.map((clr, cIdx) => (
                <button
                  key={cIdx}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleColorChange(prod.id, clr.name)
                  }}
                  className="btn p-0 rounded-circle border transition-all hover-scale"
                  style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: clr.code,
                    borderColor: selectedColors[prod.id] === clr.name ? '#ffffff' : 'transparent',
                    boxShadow: selectedColors[prod.id] === clr.name ? `0 0 8px ${clr.code}` : 'none'
                  }}
                  title={clr.name}
                ></button>
              ))}
            </div>

            {/* Product Name */}
            <Link to={`/products/${prod.id}`} className="text-decoration-none">
              <h5 className="fw-bold text-theme-title mb-2 text-truncate hover-text-accent transition-all" style={{ fontSize: '1rem', letterSpacing: '-0.2px' }}>
                {prod.name}
              </h5>
            </Link>
            <span className="text-theme-muted small d-block mb-3">
  Reviews ({prod.reviewCount || prod.reviews?.length || 0})
</span>
          </div>

          {/* Price and Purchase CTA Row */}
          <div>
            <div className="d-flex justify-content-between align-items-baseline mb-3">
              <div>
                <span className="fw-black fs-4 text-theme-title">₹{prod.price.toLocaleString('en-IN')}</span>
                <span className="text-decoration-line-through text-theme-muted small ms-2">₹{prod.oldPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-success small fw-bold">{prod.discount}% OFF</span>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCartClick(prod)
              }}
              className="btn btn-add-to-cart w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-bold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderDealImage = () => (
    <div className="text-center position-relative w-100">
      <img 
        src={heroEarbuds} 
        alt="Airdopes Cyber 141" 
        className="img-fluid hero-float"
        style={{ 
          maxHeight: '300px', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 25px var(--bb-accent-glow))'
        }} 
      />

    </div>
  )

  const renderDealDetails = () => (
    <div className="text-start">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="badge bg-danger text-white px-3 py-2 fw-black text-uppercase" style={{ fontSize: '0.7rem', borderRadius: '50px', letterSpacing: '1px' }}>
          ⚡ DEAL OF THE DAY
        </span>
      </div>

      <h3 className="fw-black text-theme-title display-6 mb-2">Airdopes Cyber 141</h3>
      <h5 className="gradient-text fw-bold mb-4">Ultimate Low-Latency Cyber Gaming TWS</h5>
      <p className="text-theme-muted small mb-4" style={{ lineHeight: 1.6 }}>
        Featuring BEAST™ Mode for 40ms audio low latency, perfect for hardcore mobile gaming. Take control with advanced touch widgets, ENx™ technology, and up to 42 hours of audio playtime. Grab this deal before time runs out!
      </p>

      {/* Countdown clock */}
      <div className="mb-4">
        <span className="small text-theme-muted d-block mb-2 fw-semibold">Offer Ends In:</span>
        <div className="d-flex align-items-center gap-2">
          <div className="p-3 rounded text-center text-theme-title" style={{ minWidth: '68px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
            <span className="d-block fw-black fs-4">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-theme-muted" style={{ fontSize: '0.6rem' }}>Hours</span>
          </div>
          <span className="fw-bold fs-4 text-theme-title">:</span>
          <div className="p-3 rounded text-center text-theme-title" style={{ minWidth: '68px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
            <span className="d-block fw-black fs-4">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-theme-muted" style={{ fontSize: '0.6rem' }}>Mins</span>
          </div>
          <span className="fw-bold fs-4 text-theme-title">:</span>
          <div className="p-3 rounded text-center text-theme-title" style={{ minWidth: '68px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
            <span className="d-block fw-black fs-4">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-theme-muted" style={{ fontSize: '0.6rem' }}>Secs</span>
          </div>
        </div>
      </div>

      {/* Special Price and CTA */}
      <div className="d-flex flex-wrap align-items-center gap-4 mt-4">
        <div>
          <div className="d-flex align-items-baseline gap-2">
            <span className="fs-2 fw-black text-theme-title">₹1,199</span>
            <span className="text-decoration-line-through text-theme-muted">₹4,490</span>
          </div>
          <span className="text-success small fw-bold">73% Off (Limited Deal)</span>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <button 
            onClick={() => {
              const realProduct = allProducts.find(p => p.name.includes("Airdopes")) || allProducts[0];
              if (realProduct) {
                handleAddToCartClick({ 
                  ...realProduct, 
                  price: 1199, // Promo price
                });
              } else {
                toast.error("Deal product not loaded yet");
              }
            }}
            className="btn btn-glow py-3 px-4 fw-bold d-flex align-items-center gap-2"
            style={{ borderRadius: '12px', height: '55px' }}
          >
            Claim Deal <ArrowRight size={18} />
          </button>

          <Link 
            to="/daily-deals"
            className="btn py-3 px-4 fw-bold d-flex align-items-center gap-2"
            style={{ 
              borderRadius: '12px', 
              height: '55px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--bb-title-color)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.08)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)' }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.04)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)' }}
          >
            View All Deals <Sparkles size={16} className="text-danger" />
          </Link>
        </div>
      </div>
    </div>
  )

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
    <div className="w-100 min-vh-100 overflow-hidden position-relative" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      
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
        <section className="position-relative pt-3 pb-5 pt-lg-0 pb-lg-0 d-flex align-items-center" style={{ minHeight: 'calc(80vh - 104px)' }}>
          <div className="container-fluid px-lg-5">
            <div className="position-relative overflow-hidden rounded-4 p-4 p-md-5 glass-card hero-carousel-card" style={{ border: '1px solid rgba(0, 243, 255, 0.15)' }}>
              
              {/* Slide background glow ring */}
              <div className="position-absolute rounded-circle bg-glow-orb" style={{ width: '400px', height: '400px', background: slides[currentSlide].color, top: '20%', right: '20%', filter: 'blur(100px)', opacity: 0.3 }}></div>

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
                  {slides.map((_, index) => (
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

        {/* ==================== 2. QUICK CATEGORIES NAV ==================== */}
        <section className="py-5" id="categories">
          <div className="container px-lg-5">
            <div className="text-center mb-5">
              <h3 className="fw-black text-theme-title mb-2">Shop by <span className="gradient-text">Categories</span></h3>
              <p className="text-theme-muted small">Find the perfect gear tailor-made for your lifestyle.</p>
            </div>

            <div id="gravity-categories" className="w-100">
              {renderCategories()}
            </div>
          </div>
        </section>

        {/* ==================== 3. BEST SELLERS & TRENDING GRID ==================== */}
        <section className="py-5" id="bestsellers">
          <div className="container px-lg-5">
            
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 text-center text-md-start">
              <div>
                <h3 className="fw-black text-theme-title mb-2 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                  <TrendingUp size={24} className="text-info" /> Best <span className="gradient-text">Sellers</span>
                </h3>
                <p className="text-theme-muted small mb-0">Our top-selling products that bassheads swear by.</p>
              </div>
              <Link to="/products" className="btn btn-outline-secondary hover-scale text-theme-title border-secondary border-opacity-25 px-4 mt-3 mt-md-0" style={{ borderRadius: '10px' }}>
                View All Products
              </Link>
            </div>

            {/* Interactive Category Filter Pills Bar (boAt style) */}
            <div className="d-flex align-items-center gap-2 mb-5 overflow-x-auto py-2 px-1 w-100 justify-content-start justify-content-md-center no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {[
                { id: 'all', label: '🔥 Best Sellers' },
                { id: 'earbuds', label: '🎵 Wireless Earbuds' },
                { id: 'headphones', label: '🎧 Headphones' },
                { id: 'speakers', label: '🔊 Speakers' },
                { id: 'gaming', label: '🎮 Gaming Gear' },
                { id: 'watches', label: '⌚ Smart Watches' },
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
            <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4 justify-content-center">
              <AnimatePresence mode="popLayout">
                {displayProducts
                  .map((prod) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, cubicBezier: [0.165, 0.84, 0.44, 1] }}
                      key={prod.id}
                      className="col"
                      id={`gravity-prod-${prod.id}`}
                    >
                      {renderProductCard(prod)}
                    </motion.div>
                  ))
                }
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ==================== 4. DAILY DEALS Promotional Section ==================== */}
        <section className="py-5" id="newlaunches">
          <div className="container px-lg-5">
            <div className="position-relative overflow-hidden p-5 rounded-4 glass-card" style={{ 
              border: '1px solid var(--bb-border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              
              {/* Background glowing particles */}
              <div className="bg-glow-orb" style={{ width: '300px', height: '300px', background: 'var(--bb-primary-glow)', bottom: '-5%', left: '-5%', filter: 'blur(90px)', pointerEvents: 'none' }}></div>
              <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-accent-glow)', top: '-10%', right: '-10%', filter: 'blur(100px)', animationDelay: '2s', pointerEvents: 'none' }}></div>

              <div className="row align-items-center g-5">
                
                {/* Product Visual */}
                <div id="gravity-deal-image" className="col-12 col-lg-5 text-center position-relative">
                  {renderDealImage()}
                </div>

                {/* Deal description & countdown timer */}
                <div id="gravity-deal-details" className="col-12 col-lg-7">
                  {renderDealDetails()}
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ==================== 5. KEY COMPANY HIGHLIGHTS / BRAND STORY ==================== */}
        <section className="py-5 bg-theme-surface text-center border-top border-bottom" id="support">
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
        </section>

        {/* ==================== SOCIAL PROOF & UGC ==================== */}
        <section className="py-5" id="social-proof">
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
        </section>

        {/* ==================== RECENTLY VIEWED ==================== */}
        <section className="py-4 px-3 px-lg-5">
          <div className="container-fluid px-0">
            <RecentlyViewed />
          </div>
        </section>

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
