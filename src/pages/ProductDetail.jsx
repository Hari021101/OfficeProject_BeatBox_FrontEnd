import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  Star, ShoppingBag, ArrowLeft, Heart, Share2, Zap,
  CheckCircle, Shield, Truck, RotateCcw, ChevronRight, Minus, Plus,
  Battery, Smartphone, Mic, Gamepad2, ChevronDown, ChevronUp
} from 'lucide-react'
import { addToCart } from '../redux/cartSlice'
import { getRelatedProducts, IMAGE_MAP } from '../data/products'
import ProductCard from '../components/ui/ProductCard'
import { toast } from 'react-hot-toast'
import logo from '../assets/beatbox_logo.png'
import { productService } from '../services/productService'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //const allProducts = useSelector(selectAllProducts)
  //const productStatus = useSelector(selectProductStatus)
  //const product = allProducts.find(p => p.id.toString() === id)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)

  // Use a fallback to local getRelatedProducts for now until we have related product logic in backend
  const related = product ? getRelatedProducts(product, 4) : []

  //   useEffect(() => {
  //   if (productStatus === 'idle') {
  //     dispatch(fetchProducts())
  //   }
  // }, [productStatus, dispatch])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getProductById(id)
        setProduct(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  // useEffect(() => {
  //   if (productStatus === 'idle') {
  //     dispatch(fetchProducts())
  //   }
  // }, [productStatus, dispatch])
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  // Scroll to top when product page loads or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [activeTab, setActiveTab] = useState('specs')

  // New feature states
  const [pincode, setPincode] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  // Sticky Cart Logic
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 500) setShowStickyCart(true)
    else setShowStickyCart(false)
  })

  // Icons mapper for features
  const IconMap = {
    Battery,
    Smartphone,
    Mic,
    Gamepad2
  }

  // Initialize selectedColor once product is loaded
  useEffect(() => {
    if (product && !selectedColor) {
      setSelectedColor({
        name: product.color || 'Black',
        code: '#000000'
      })
    }
  }, [product])

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center gap-4 px-4" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
        <div className="spinner-border" style={{ color: 'var(--bb-accent)', width: '3rem', height: '3rem' }} />
        <h2 className="text-theme-title fw-black">Loading Product...</h2>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center gap-4 px-4" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
        <div style={{ fontSize: '4rem' }}>🎧</div>
        <h2 className="text-theme-title fw-black">Product Not Found</h2>
        <p className="text-theme-muted">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-glow px-5 py-3 fw-bold" style={{ borderRadius: 12 }}>
          Browse All Products
        </Link>
      </div>
    )
  }

  const submitReview = async () => {
    try {
      await productService.addReview(product.id, {
        rating: Number(reviewRating),
        comment: reviewText
      })

      toast.success('Review Added Successfully')

      const updated = await productService.getProductById(id)
      setProduct(updated)

      setReviewText('')
      setReviewRating(5)
    } catch (error) {
      toast.error('Failed to add review')
    }
  }

  // Three-level fallback: variant URL → backend URL → local bundled asset
  const img =
    (selectedVariant?.imageUrl && selectedVariant.imageUrl !== 'string' && selectedVariant.imageUrl.startsWith('http')
      ? selectedVariant.imageUrl
      : null) ||
    (product.imageUrl && product.imageUrl !== 'string' && product.imageUrl.startsWith('http')
      ? product.imageUrl
      : null) ||
    IMAGE_MAP[product.imageKey] ||
    IMAGE_MAP['heroHeadphones']
  const originalPrice =
    Math.max(product.price || 0,
      product.discountPrice || 0)

  const salePrice =
    Math.min(product.price || 0,
      product.discountPrice || 0)

  const savings =
    originalPrice - salePrice

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) return
    setAdding(true)
    dispatch(addToCart({
      id: product.id, name: product.name, price: salePrice,
      imageKey: product.imageKey, quantity: quantity,
      selectedColor: selectedColor?.name, selectedColorCode: selectedColor?.code,
      category: product.category,
    }))
    toast.success(`🎸 ${product.name} added to cart!`, {
      style: { background: '#060b19', color: '#fff', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '10px' }
    })
    setTimeout(() => setAdding(false), 600)
  }

  const handleBuyNow = () => {
    if (product.stockQuantity <= 0) return
    dispatch(addToCart({
      id: product.id, name: product.name, price: salePrice,
      imageKey: product.imageKey, quantity: quantity,
      selectedColor: selectedColor?.name, selectedColorCode: selectedColor?.code,
      category: product.category,
    }))
    navigate('/checkout')
  }

  const discount =
    originalPrice > 0
      ? Math.round(
        ((originalPrice - salePrice) /
          originalPrice) *
        100
      )
      : 0

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!', {
        style: { background: '#060b19', color: '#fff', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '10px' }
      })
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleCheckDelivery = () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setDeliveryStatus({ error: true, message: 'Please enter a valid 6-digit pincode.' })
      return
    }
    setDeliveryStatus({ error: false, message: 'Checking...' })
    setTimeout(() => {
      setDeliveryStatus({ error: false, message: `Delivery available by ${new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} to ${pincode} 🚚` })
    }, 800)
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!reviewText.trim()) return
    toast.success('Review submitted successfully for moderation!', {
      style: { background: '#060b19', color: '#fff', border: '1px solid rgba(39,255,20,0.3)', borderRadius: '10px' }
    })
    setShowReviewForm(false)
    setReviewText('')
    setReviewRating(5)
  }

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {/* Ambient orbs */}
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-primary-glow)', top: '0%', left: '-5%', filter: 'blur(130px)' }} />
      <div className="bg-glow-orb" style={{ width: 350, height: 350, background: 'var(--bb-accent-glow)', top: '10%', right: '-5%', filter: 'blur(130px)', animationDelay: '2s' }} />

      <div className="container-fluid px-3 px-lg-5 py-4">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
            <li className="breadcrumb-item"><Link to="/" className="text-theme-muted text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-theme-muted text-decoration-none">Products</Link></li>
            <li className="breadcrumb-item active text-theme-title fw-semibold" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</li>
          </ol>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn border-0 d-inline-flex align-items-center gap-2 mb-4 fw-semibold"
          style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', borderRadius: 10, padding: '8px 18px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* ── MAIN PRODUCT SECTION ─── */}
        <div className="row g-5 mb-5">
          {/* Left: Image Gallery */}
          <motion.div className="col-12 col-lg-5" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div
              className="position-relative rounded-4 d-flex align-items-center justify-content-center"
              style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', minHeight: 380, overflow: 'hidden' }}
            >
              {/* Out of stock badge */}
              {product.stockQuantity <= 0 && (
                <div className="position-absolute top-0 end-0 m-3 z-10">
                  <span className="badge px-3 py-2 fw-black" style={{ background: 'rgba(220,53,69,0.9)', letterSpacing: 1, fontSize: '0.75rem' }}>OUT OF STOCK</span>
                </div>
              )}

              {/* Discount badge */}
              <div className="position-absolute top-0 start-0 m-3 z-10">
                <span className="badge px-3 py-2 fw-black text-white" style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', borderRadius: 50, fontSize: '0.75rem' }}>
                  <Zap size={11} className="me-1" />{discount}% OFF
                </span>
              </div>

              {/* Brand seal */}
              <div className="position-absolute bottom-0 start-0 m-3 d-flex align-items-center gap-2 px-3 py-1 rounded-pill z-10" style={{ background: 'rgba(6,11,25,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,243,255,0.25)' }}>
                <img src={logo} alt="BeatBox" style={{ width: 14, height: 14 }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff', letterSpacing: '0.8px' }}>BEATBOX ORIGINAL</span>
              </div>

              {/* Ambient glow behind product */}
              <div style={{ position: 'absolute', width: 250, height: 250, background: selectedColor ? selectedColor.code : 'var(--bb-accent)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.12, zIndex: 0 }} />

              <motion.img
                key={`${product.imageKey}-${activeImageIndex}`}
                src={img}
                alt={product.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="img-fluid hero-float"
                style={{ maxHeight: 340, objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', transform: `rotate(${activeImageIndex * -5}deg)` }}
              />
            </div>

            {/* Thumbnail row (same image for mock) */}
            <div className="d-flex gap-2 mt-3 justify-content-center">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 70, height: 70, background: 'var(--bb-surface)', border: `1px solid ${i === activeImageIndex ? 'var(--bb-accent)' : 'var(--bb-border)'}`, cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.2s' }}
                >
                  <img src={img} alt="" style={{ width: 50, height: 50, objectFit: 'contain', opacity: i === activeImageIndex ? 1 : 0.5, transform: `rotate(${i * -5}deg)` }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div className="col-12 col-lg-7" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            {/* Tag + brand */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge px-3 py-1 fw-bold text-white" style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-primary-light))', fontSize: '0.7rem', borderRadius: 50 }}>{product.tag}</span>
              <span className="text-theme-muted small">{product.brand}</span>
            </div>

            <h1 className="fw-black text-theme-title mb-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '-1px', lineHeight: 1.15 }}>
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(product.averageRating) ? '#ffc700' : 'none'} stroke={s <= Math.round(product.averageRating) ? '#ffc700' : 'var(--bb-border)'} />
                ))}
                <span className="fw-bold ms-1" style={{ color: '#ffc700' }}>{Number(product.averageRating).toFixed(1)}</span>
              </div>
              <span className="text-theme-muted small">({product.reviewCount.toLocaleString('en-IN')} reviews)</span>
              <span className={`badge px-2 py-1 small fw-bold ${product.stockQuantity > 0 ? 'text-success' : 'text-danger'}`} style={{ background: product.stockQuantity > 0 ? 'rgba(39,255,20,0.08)' : 'rgba(220,53,69,0.08)', border: `1px solid ${product.stockQuantity > 0 ? 'rgba(39,255,20,0.2)' : 'rgba(220,53,69,0.2)'}` }}>
                {product.stockQuantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            {/* USP pill */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4" style={{ background: 'linear-gradient(90deg,#ffc700,#ffb800)', color: '#000' }}>
              <Zap size={12} fill="#000" />
              <span className="fw-black" style={{ fontSize: '0.8rem' }}>{product.usp}</span>
            </div>

            {/* Price block */}
            <div
              className="p-4 rounded-3 mb-4"
              style={{
                background: 'var(--bb-surface)',
                border: '1px solid var(--bb-border)'
              }}
            >
              <div className="d-flex align-items-baseline gap-3 mb-1">

                <span
                  className="display-5 fw-black text-theme-title"
                  style={{ letterSpacing: '-2px' }}
                >
                  ₹{salePrice.toLocaleString('en-IN')}
                </span>

                <span
                  className="fs-4 text-decoration-line-through text-theme-muted"
                >
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>

                <span
                  className="badge text-success fw-bold"
                  style={{
                    background: 'rgba(39,255,20,0.1)',
                    border: '1px solid rgba(39,255,20,0.2)',
                    fontSize: '0.9rem'
                  }}
                >
                  {discount}% OFF
                </span>

              </div>

              <p className="text-success small fw-semibold mb-0">
                You save ₹{savings.toLocaleString('en-IN')} 🎉
              </p>
            </div>

            {/* Color selection */}
            <div className="mb-4">
              <p className="text-theme-muted small fw-semibold mb-3">
                COLOR —
                <span className="text-theme-title ms-2">
                  {selectedVariant?.colorName}
                </span>
              </p>

              <div className="d-flex gap-3">
                {product.variants?.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: variant.colorCode,
                      border:
                        selectedVariant?.colorName === variant.colorName
                          ? '3px solid white'
                          : '1px solid gray',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="d-flex align-items-center gap-4 mb-4">
              <span className="text-theme-muted small fw-semibold">QUANTITY</span>
              <div className="d-flex align-items-center rounded-3" style={{ border: '1px solid var(--bb-border)', background: 'var(--bb-surface)' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn border-0 px-3 py-2" style={{ color: 'var(--bb-muted)', background: 'transparent' }}><Minus size={16} /></button>
                <span className="fw-black text-theme-title px-4" style={{ fontSize: '1.1rem', minWidth: 50, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="btn border-0 px-3 py-2" style={{ color: 'var(--bb-accent)', background: 'transparent' }}><Plus size={16} /></button>
              </div>
            </div>

            {/* CTAs */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0 || adding}
                className="btn btn-glow flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: 12, minWidth: 200, height: 56 }}
              >
                {adding ? <><span className="spinner-border spinner-border-sm" /> Adding...</> : <><ShoppingBag size={18} /> Add to Cart</>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="btn flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: 12, minWidth: 180, height: 56, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }}
              >
                Buy Now <ChevronRight size={16} />
              </button>
              <button
                onClick={() => { setWishlisted(!wishlisted); toast.success(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist!') }}
                className="btn d-flex align-items-center justify-content-center"
                style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: wishlisted ? '#ff4d7d' : 'var(--bb-muted)', flexShrink: 0 }}
              >
                <Heart size={20} fill={wishlisted ? '#ff4d7d' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="btn d-flex align-items-center justify-content-center"
                style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', flexShrink: 0 }}
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="row g-2">
              {[
                { icon: <Shield size={16} />, text: '1 Year Warranty', color: 'var(--bb-accent)' },
                { icon: <RotateCcw size={16} />, text: '7-Day Replacement', color: 'var(--bb-primary-light)' },
                { icon: <CheckCircle size={16} />, text: '100% Genuine', color: '#39ff14' },
              ].map((badge, i) => (
                <div key={i} className="col-12 col-sm-4">
                  <div className="d-flex align-items-center gap-2 p-2 rounded-3 h-100 justify-content-center text-center flex-row justify-content-sm-start text-sm-start" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <span style={{ color: badge.color, background: `color-mix(in srgb, ${badge.color} 15%, transparent)`, padding: '8px', borderRadius: '50%', display: 'inline-flex' }}>{badge.icon}</span>
                    <span className="text-theme-title" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{badge.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Check */}
            <div className="mt-4 p-4 rounded-3" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <p className="text-theme-title fw-bold mb-3 small d-flex align-items-center gap-2"><Truck size={16} className="text-theme-muted" /> Check Delivery Estimate</p>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit Pincode"
                  className="form-control flex-grow-1"
                  style={{ background: 'var(--bb-bg-navy)', border: '1px solid var(--bb-border)', color: '#fff', borderRadius: 8, padding: '10px 16px' }}
                />
                <button onClick={handleCheckDelivery} className="btn px-4 fw-bold" style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-accent)', border: '1px solid var(--bb-accent)', borderRadius: 8 }}>
                  Check
                </button>
              </div>
              {deliveryStatus && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`mb-0 mt-3 small fw-semibold ${deliveryStatus.error ? 'text-danger' : 'text-success'}`}>
                  {deliveryStatus.message}
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── IMMERSIVE MARKETING FEATURE SHOWCASE ─── */}
        {product.features && product.features.length > 0 && (
          <div className="mb-5 py-5 border-top border-bottom" style={{ borderColor: 'var(--bb-border)' }}>
            <div className="text-center mb-5">
              <span className="badge px-3 py-1 fw-bold mb-2 text-white" style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', borderRadius: 50 }}>EXPERIENCE TRUE AUDIO</span>
              <h2 className="display-5 fw-black text-theme-title">Designed for <span className="gradient-text">Perfection</span></h2>
            </div>

            <div className="row g-4">
              {product.features.map((feature, idx) => {
                const FeatureIcon = IconMap[feature.iconName] || Zap
                return (
                  <div key={feature.id} className="col-12 col-md-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-5 rounded-4 h-100 d-flex flex-column justify-content-end position-relative overflow-hidden"
                      style={{
                        background: feature.gradient,
                        minHeight: '300px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }}
                    >
                      {/* Large decorative icon in background */}
                      <FeatureIcon size={180} className="position-absolute" style={{ top: '-20px', right: '-20px', opacity: 0.1, color: '#fff' }} />

                      <div className="position-relative z-10 text-white">
                        <div className="mb-3 d-inline-flex align-items-center justify-content-center bg-white rounded-circle" style={{ width: 48, height: 48, color: '#000' }}>
                          <FeatureIcon size={24} />
                        </div>
                        <h3 className="fw-black mb-2" style={{ fontSize: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{feature.title}</h3>
                        <p className="mb-0 fw-medium" style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{feature.description}</p>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── DETAIL TABS ─── */}
        <div className="mb-5">
          {/* Tab nav */}
          <div className="d-flex gap-1 mb-4 overflow-x-auto no-scrollbar py-1" style={{ borderBottom: '1px solid var(--bb-border)' }}>
            {[
              { id: 'specs', label: '⚙️ Specifications' },
              { id: 'reviews', label: `⭐ Reviews (${product.reviews.length || 0})` },
              { id: 'faqs', label: '❓ FAQs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn border-0 fw-bold px-4 py-2 text-nowrap"
                style={{
                  background: 'transparent',
                  color: activeTab === tab.id ? 'var(--bb-accent)' : 'var(--bb-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--bb-accent)' : '2px solid transparent',
                  borderRadius: 0,
                  transition: 'all 0.2s',
                  marginBottom: -1,
                  fontSize: '0.95rem'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'specs' && (
                <div className="row g-4">
                  {/* Detailed Description */}
                  <div className="col-12 mb-2">
                    <p className="text-theme-muted fw-medium" style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>
                  </div>

                  {/* Two-Column Specification Grid */}
                  <div className="col-12">
                    <div className="rounded-4 overflow-hidden" style={{ border: '1px solid var(--bb-border)' }}>
                      {Object.entries(product.specs || {}).map(([key, val], i) => (
                        <div
                          key={i}
                          className="d-flex flex-column flex-sm-row"
                          style={{ borderBottom: i < Object.entries(product.specs || {}).length - 1 ? '1px solid var(--bb-border)' : 'none', background: i % 2 === 0 ? 'var(--bb-surface)' : 'var(--bb-surface-2)' }}
                        >
                          <div className="px-4 py-3 fw-bold text-theme-muted" style={{ minWidth: 200, fontSize: '0.88rem' }}>{key}</div>
                          <div className="px-4 py-3 text-theme-title fw-semibold flex-grow-1" style={{ fontSize: '0.88rem', borderLeft: '1px solid var(--bb-border)' }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="text-theme-title fw-bold m-0">Customer Reviews</h4>
                    {!showReviewForm && (
                      <button onClick={() => setShowReviewForm(true)} className="btn btn-sm btn-glow fw-bold px-4" style={{ borderRadius: 8 }}>Write a Review</button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showReviewForm && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                        <form onSubmit={handleSubmitReview} className="p-4 rounded-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                          <h5 className="text-theme-title fw-bold mb-3">Rate this product</h5>
                          <div className="d-flex gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={24} onClick={() => setReviewRating(s)} fill={s <= reviewRating ? '#ffc700' : 'none'} stroke={s <= reviewRating ? '#ffc700' : 'var(--bb-muted)'} style={{ cursor: 'pointer', transition: 'all 0.2s' }} />
                            ))}
                          </div>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="form-control mb-3"
                            rows="3"
                            placeholder="What did you like or dislike?"
                            style={{ background: 'var(--bb-bg-navy)', border: '1px solid var(--bb-border)', color: '#fff', borderRadius: 8 }}
                            required
                          />
                          <div className="d-flex gap-2 justify-content-end mt-3">
                            <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-sm text-theme-muted fw-bold px-3">Cancel</button>
                            <button type="submit" className="btn btn-sm btn-glow fw-bold px-4" style={{ borderRadius: 8 }}>Submit Review</button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Rating summary */}
                  <div className="p-4 rounded-3 mb-2 d-flex align-items-center gap-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <div className="text-center">
                      <div className="display-4 fw-black text-theme-title" style={{ color: '#ffc700' }}>{Number(product.averageRating).toFixed(1)}</div>
                      <div className="d-flex justify-content-center gap-1 my-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= Math.round(product.averageRating) ? '#ffc700' : 'none'} stroke='#ffc700' />)}
                      </div>
                      <span className="text-theme-muted small">{product.reviewCount.toLocaleString('en-IN')} reviews</span>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-3 mb-3"
                    style={{
                      background: 'var(--bb-surface)',
                      border: '1px solid var(--bb-border)'
                    }}
                  >
                    <h5 className="text-theme-title fw-bold mb-3">
                      Write a Review
                    </h5>

                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="form-control mb-3"
                      rows="4"
                      placeholder="Write your review..."
                      style={{
                        background: 'var(--bb-surface-2)',
                        border: '1px solid var(--bb-border)',
                        color: 'white'
                      }}
                    />

                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      className="form-select mb-3"
                      style={{
                        background: 'var(--bb-surface-2)',
                        border: '1px solid var(--bb-border)',
                        color: 'white'
                      }}
                    >
                      <option>5</option>
                      <option>4</option>
                      <option>3</option>
                      <option>2</option>
                      <option>1</option>
                    </select>

                    <button
                      className="btn btn-glow"
                      onClick={submitReview}
                    >
                      Submit Review
                    </button>
                  </div>

                  {product.reviews?.map((review, i) => (
                    <div key={i} className="p-4 rounded-3" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center rounded-circle fw-black" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', color: '#fff', fontSize: '0.85rem' }}>
                            {review.userName.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="fw-bold text-theme-title mb-0" style={{ fontSize: '0.9rem' }}>{review.userName}</p>
                            <div className="d-flex gap-1">
                              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} fill={s <= review.rating ? '#ffc700' : 'none'} stroke='#ffc700' />)}
                            </div>
                          </div>
                        </div>
                        <span className="badge px-2 py-1" style={{ background: 'rgba(39,255,20,0.08)', color: '#39ff14', fontSize: '0.65rem', border: '1px solid rgba(39,255,20,0.15)' }}>✓ Verified Purchase</span>
                      </div>
                      <p className="text-theme-muted mb-0" style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="d-flex flex-column gap-3">
                  {product.faqs && product.faqs.length > 0 ? (
                    product.faqs.map((faq, i) => (
                      <div key={i} className="rounded-3 overflow-hidden" style={{ border: '1px solid var(--bb-border)', background: 'var(--bb-surface)' }}>
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-100 d-flex align-items-center justify-content-between p-4 border-0 text-start"
                          style={{ background: 'transparent' }}
                        >
                          <span className="fw-bold text-theme-title" style={{ fontSize: '1rem', paddingRight: '20px' }}>Q. {faq.question}</span>
                          <div className="text-theme-muted">
                            {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </button>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4"
                            >
                              <p className="text-theme-muted mb-0 fw-medium" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <p className="text-theme-muted fw-medium">No frequently asked questions for this product yet.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RELATED PRODUCTS ─── */}
        {related.length > 0 && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="fw-black text-theme-title mb-0">You May Also <span className="gradient-text">Like</span></h3>
              <Link to="/products" className="btn border-0 fw-semibold small" style={{ color: 'var(--bb-accent)', background: 'transparent' }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
              {related.map((p, i) => (
                <div key={p.id} className="col">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY ADD TO CART BAR ─── */}
      <AnimatePresence>
        {showStickyCart && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="position-fixed bottom-0 start-0 w-100 py-3 px-3 px-md-5 d-flex align-items-center justify-content-between"
            style={{ background: 'rgba(6, 11, 25, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--bb-border)', boxShadow: '0 -10px 40px rgba(0,0,0,0.6)', zIndex: 1050 }}
          >
            <div className="d-flex align-items-center gap-3">
              <img src={img} alt={product.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, background: 'var(--bb-surface)' }} />
              <div className="d-none d-sm-block">
                <p className="text-theme-title fw-bold mb-0 text-truncate" style={{ maxWidth: 250 }}>{product.name}</p>
                <p className="text-theme-muted small mb-0 fw-semibold">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-none d-md-flex align-items-center rounded-3 px-2 py-1" style={{ border: '1px solid var(--bb-border)', background: 'var(--bb-surface)' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn border-0 p-1 d-flex align-items-center" style={{ color: 'var(--bb-muted)' }}><Minus size={14} /></button>
                <span className="fw-black text-theme-title px-3" style={{ fontSize: '0.9rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="btn border-0 p-1 d-flex align-items-center" style={{ color: 'var(--bb-accent)' }}><Plus size={14} /></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0 || adding}
                className="btn btn-glow fw-bold px-4 py-2"
                style={{ borderRadius: 8 }}
              >
                {adding ? 'Adding...' : `Add to Cart - ₹${(salePrice * quantity).toLocaleString('en-IN')}`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
