import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  Star, ShoppingBag, ArrowLeft, Heart, Share2, Zap,
  CheckCircle, Shield, Truck, RotateCcw, ChevronRight, Minus, Plus
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

  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('highlights')
  const [adding, setAdding] = useState(false)
  const [reviewText, setReviewText] = useState('')
const [reviewRating, setReviewRating] = useState(5)

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

 const img =
  selectedVariant?.imageUrl ||
  product.imageUrl
  const savings =
  (product.price || 0) -
  (product.discountPrice || 0)

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) return
    setAdding(true)
    dispatch(addToCart({
      id: product.id, name: product.name, price: product.price,
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
      id: product.id, name: product.name, price: product.price,
      imageKey: product.imageKey, quantity: quantity,
      selectedColor: selectedColor?.name, selectedColorCode: selectedColor?.code,
      category: product.category,
    }))
    navigate('/checkout')
  }

  const discount =
  Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  )

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
                key={product.imageKey}
                src={img}
                alt={product.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="img-fluid hero-float"
                style={{ maxHeight: 340, objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
              />
            </div>

            {/* Thumbnail row (same image for mock) */}
            <div className="d-flex gap-2 mt-3 justify-content-center">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 70, height: 70, background: 'var(--bb-surface)', border: `1px solid ${i === 1 ? 'var(--bb-accent)' : 'var(--bb-border)'}`, cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.2s' }}
                >
                  <img src={img} alt="" style={{ width: 50, height: 50, objectFit: 'contain', opacity: i === 1 ? 1 : 0.5 }} />
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
                {[1,2,3,4,5].map(s => (
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
            <div className="p-4 rounded-3 mb-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <div className="d-flex align-items-baseline gap-3 mb-1">
                <span className="display-5 fw-black text-theme-title" style={{ letterSpacing: '-2px' }}>₹{product.discountPrice?.toLocaleString('en-IN')}</span>
                <span className="fs-4 text-decoration-line-through text-theme-muted">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="badge text-success fw-bold" style={{ background: 'rgba(39,255,20,0.1)', border: '1px solid rgba(39,255,20,0.2)', fontSize: '0.9rem' }}>{discount}% OFF</span>
              </div>
              <p className="text-success small fw-semibold mb-0">You save ₹{savings.toLocaleString('en-IN')} 🎉</p>
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
            </div>

            {/* Trust badges */}
            <div className="row g-2">
              {[
                { icon: <Shield size={16} />, text: '1 Year Warranty', color: 'var(--bb-accent)' },
                { icon: <RotateCcw size={16} />, text: '7-Day Returns', color: 'var(--bb-primary-light)' },
                { icon: <Truck size={16} />, text: 'Free Shipping ≥₹999', color: 'var(--bb-accent)' },
                { icon: <CheckCircle size={16} />, text: 'Genuine Product', color: '#39ff14' },
              ].map((badge, i) => (
                <div key={i} className="col-6">
                  <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <span style={{ color: badge.color }}>{badge.icon}</span>
                    <span className="text-theme-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{badge.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── DETAIL TABS ─── */}
        <div className="mb-5">
          {/* Tab nav */}
          <div className="d-flex gap-1 mb-4 overflow-x-auto no-scrollbar py-1" style={{ borderBottom: '1px solid var(--bb-border)' }}>
            {[
              { id: 'highlights', label: '✨ Highlights' },
              { id: 'specs', label: '⚙️ Specifications' },
              { id: 'faq', label: '❓ FAQs' },
              { id: 'reviews', label: `⭐ Reviews (${product.reviewCount || 0})` },
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
              {activeTab === 'highlights' && (
                <div className="row g-3">
                  {[
  'Premium Sound Quality',
  'Deep Bass Experience',
  'Bluetooth 5.4 Connectivity',
  'Fast Charging Support',
  '1 Year Warranty',
  '50 Hours Playback'
].map((h, i) => (
  <div key={i} className="col-12 col-md-6">
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-3"
      style={{
        background: 'var(--bb-surface)',
        border: '1px solid var(--bb-border)'
      }}
    >
      <CheckCircle
        size={18}
        style={{
          color: 'var(--bb-accent)',
          flexShrink: 0,
          marginTop: 2
        }}
      />

      <span
        className="text-theme-title fw-semibold"
        style={{ fontSize: '0.9rem' }}
      >
        {h}
      </span>
    </div>
  </div>
))}
                  <div className="col-12 mt-2">
                    <p className="text-theme-muted" style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
               <div
  className="rounded-4 overflow-hidden"
  style={{
    border: '1px solid var(--bb-border)'
  }}
>
  {[
    ['Brand', product.brand],
    ['Battery Life', product.batteryLife],
    ['Connectivity', product.connectivity],
    ['Color', product.color],
    ['Category', product.categoryName],
    ['Stock', product.stockQuantity]
  ].map(([key, value], i) => (
    <div
      key={i}
      className="d-flex"
      style={{
        borderBottom:
          i < 5
            ? '1px solid var(--bb-border)'
            : 'none',
        background:
          i % 2 === 0
            ? 'var(--bb-surface)'
            : 'var(--bb-surface-2)'
      }}
    >
      <div
        className="px-4 py-3 fw-bold text-theme-muted"
        style={{
          minWidth: 180,
          fontSize: '0.88rem'
        }}
      >
        {key}
      </div>

      <div
        className="px-4 py-3 text-theme-title fw-semibold flex-grow-1"
        style={{
          fontSize: '0.88rem',
          borderLeft: '1px solid var(--bb-border)'
        }}
      >
        {value}
      </div>
    </div>
  ))}
</div>
              )}

              {activeTab === 'faq' && (
  <div className="d-flex flex-column gap-3">
    {product.faqs?.map((faq, index) => (
      <div
        key={index}
        className="p-4 rounded-3"
        style={{
          background: 'var(--bb-surface)',
          border: '1px solid var(--bb-border)'
        }}
      >
        <h6 className="fw-bold text-theme-title mb-2">
          Q: {faq.question}
        </h6>

        <p className="text-theme-muted mb-0">
          A: {faq.answer}
        </p>
      </div>
    ))}
  </div>
)}

              {activeTab === 'reviews' && (
                <div className="d-flex flex-column gap-3">
                  {/* Rating summary */}
                  <div className="p-4 rounded-3 mb-2 d-flex align-items-center gap-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <div className="text-center">
                      <div className="display-4 fw-black text-theme-title" style={{ color: '#ffc700' }}>{Number(product.averageRating).toFixed(1)}</div>
                      <div className="d-flex justify-content-center gap-1 my-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.round(product.averageRating) ? '#ffc700' : 'none'} stroke='#ffc700' />)}
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
                              {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= review.rating ? '#ffc700' : 'none'} stroke='#ffc700' />)}
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
    </div>
  )
}
