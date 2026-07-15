import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Wand2, Edit3, Gift, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProducts, selectProductStatus, fetchProducts } from '../redux/productSlice'
import { addToCart } from '../redux/cartSlice'
import { toast } from 'react-hot-toast'
import { IMAGE_MAP } from '../data/products'
import heroEarbuds from '../assets/hero_earbuds.png'
import engravingBanner from '../assets/banner/Encraving_banner.png'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5089'

const getVariantPricing = (product) => {
  const variants = product.variants || []
  if (!variants.length) return { price: product.price || 0, discountPrice: null }
  const sorted = [...variants].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
  const c = sorted[0]
  return { price: c.price, discountPrice: c.discountPrice }
}

const FEATURES = [
  {
    icon: <Wand2 size={28} />,
    color: '#00f3ff',
    bg: 'rgba(0,243,255,0.1)',
    title: 'Make It Yours',
    desc: 'Engrave your name, an important date, or a special message directly onto the case.',
  },
  {
    icon: <Sparkles size={28} />,
    color: '#a820ff',
    bg: 'rgba(168,32,255,0.1)',
    title: 'Premium Finish',
    desc: 'High-precision laser etching ensures a permanent, elegant finish that lasts a lifetime.',
  },
  {
    icon: <Gift size={28} />,
    color: '#ff2a6d',
    bg: 'rgba(255,42,109,0.1)',
    title: 'The Perfect Gift',
    desc: 'Surprise your loved ones with a bespoke audio experience they will cherish forever.',
  },
]

const ENGRAVE_CATEGORIES = ['tws', 'earbud', 'neckband', 'headphone']

const ENGRAVING_EXAMPLES = [
  { label: 'Your Name', name: 'ARYAN', date: '', message: '', color: '#00f3ff' },
  { label: 'A Date', name: '', date: '14.02.2026', message: '', color: '#a820ff' },
  { label: 'A Message', name: '', date: '', message: 'FOREVER TOGETHER ❤️', color: '#ff2a6d' },
]

export default function Personalisation() {
  const dispatch = useDispatch()
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)
  const [engravingName, setEngravingName] = useState('')
  const [engravingDate, setEngravingDate] = useState('')
  const [engravingMessage, setEngravingMessage] = useState('')
  const [activeExample, setActiveExample] = useState(0)

  useEffect(() => {
    if (productStatus === 'idle') dispatch(fetchProducts())
  }, [productStatus, dispatch])

  // Show products suitable for personalisation — TWS and neckbands primarily
  const personalisableProducts = useMemo(() => {
    return allProducts
      .filter(p => {
        const cat = p.categoryName?.toLowerCase() || p.category?.toLowerCase() || ''
        return ENGRAVE_CATEGORIES.some(k => cat.includes(k))
      })
      .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      .slice(0, 8)
  }, [allProducts])

  const handleAddToCart = (product, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    const variants = product.variants || []
    const best = variants.length
      ? [...variants].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))[0]
      : null
    const rawImg = product.images?.[0]?.imageUrl || product.variants?.[0]?.images?.[0]?.imageUrl || product.imageUrl
    const img = rawImg?.startsWith('/images/') ? `${API_BASE}${rawImg}` : rawImg?.startsWith('http') ? rawImg : IMAGE_MAP[product.imageKey] || rawImg

    const personalizationText = [
      engravingName ? `Name: ${engravingName}` : '',
      engravingDate ? `Date: ${engravingDate}` : '',
      engravingMessage ? `Msg: ${engravingMessage}` : ''
    ].filter(Boolean).join(' | ')

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: best?.discountPrice || best?.price || product.price || 0,
      originalPrice: best?.price || product.oldPrice || 0,
      variantId: best?.id,
      selectedColor: best?.color || 'Default',
      selectedColorCode: best?.colorCode || '#111111',
      category: product.categoryName,
      imageUrl: img,
      personalization: personalizationText,
    }))
    toast.success(`✨ ${product.name} added! Request engraving at checkout.`, {
      style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-accent)', borderRadius: '10px' }
    })
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#000', color: '#fff', overflow: 'hidden' }}>

      {/* ── HERO ── */}
      <div className="position-relative min-vh-100 d-flex align-items-center" style={{ paddingTop: '80px', overflow: 'hidden' }}>
        {/* Background glows */}
        <div className="position-absolute" style={{ top: '15%', right: '8%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />
        <div className="position-absolute" style={{ bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,243,255,0.08) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />

        <div className="container position-relative z-1 py-5">
          <div className="row align-items-center g-5">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-12 col-lg-5 col-xl-5"
            >
              <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block fw-bold" style={{ background: 'rgba(0,243,255,0.1)', color: '#00f3ff', border: '1px solid rgba(0,243,255,0.25)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                ✦ CUSTOM ENGRAVING
              </span>
              <h1 className="fw-medium mb-2" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '-1px', color: '#e0e0e0', lineHeight: '1.1' }}>
                IT'S MORE THAN A GIFT,
              </h1>
              <h2 className="fw-black mb-4" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '-1px', lineHeight: '1.1' }}>
                It's An <span className="gradient-text">Experience</span>
              </h2>
              <p className="fs-6 mb-4" style={{ color: '#aaa', fontWeight: 500, maxWidth: '500px', lineHeight: '1.6' }}>
                Add a personal touch with custom engraving — make every BeatBox product truly one of a kind.
              </p>

              {/* Live Engraving Inputs */}
              <div className="mb-4 p-4 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                <p className="text-secondary small mb-3 fw-bold tracking-wider text-uppercase">Presets & Examples:</p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {ENGRAVING_EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      className="btn btn-sm rounded-pill px-3 fw-semibold transition-all"
                      style={{
                        background: activeExample === i ? ex.color : 'transparent',
                        color: activeExample === i ? '#000' : ex.color,
                        border: `1px solid ${ex.color}40`,
                        fontSize: '0.75rem',
                      }}
                      onClick={() => {
                        setActiveExample(i)
                        setEngravingName(ex.name)
                        setEngravingDate(ex.date)
                        setEngravingMessage(ex.message)
                      }}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>

                {/* Form fields */}
                <div className="d-flex flex-column gap-3">
                  <div>
                    <label className="text-secondary small mb-1 fw-bold tracking-wider">YOUR NAME (MAX 12 CHARS)</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={engravingName}
                      onChange={e => setEngravingName(e.target.value.toUpperCase())}
                      className="bb-input w-100"
                      placeholder="ENGRAVE NAME"
                      style={{
                        letterSpacing: '2px',
                        fontWeight: 600,
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 16px',
                        color: '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-secondary small mb-1 fw-bold tracking-wider">IMPORTANT DATE (E.G. DD.MM.YYYY)</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={engravingDate}
                      onChange={e => setEngravingDate(e.target.value)}
                      className="bb-input w-100"
                      placeholder="E.G. 14.02.2026"
                      style={{
                        fontWeight: 600,
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 16px',
                        color: '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-secondary small mb-1 fw-bold tracking-wider">SPECIAL MESSAGE (MAX 2 LINES)</label>
                    <textarea
                      maxLength={40}
                      value={engravingMessage}
                      onChange={e => setEngravingMessage(e.target.value.toUpperCase())}
                      className="bb-input w-100"
                      placeholder="E.G. FOREVER TOGETHER"
                      rows={2}
                      style={{
                        fontWeight: 600,
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 16px',
                        color: '#fff',
                        resize: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <Link
                to="/products"
                className="btn btn-glow rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 transition-all w-100 justify-content-center w-sm-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, var(--bb-primary, #7C3AED), var(--bb-accent, #00f3ff))',
                  color: '#fff',
                  border: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 25px rgba(0, 243, 255, 0.25)',
                }}
              >
                Explore Personalisable Products <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* Right — Product custom engraving preview wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-12 col-lg-7 col-xl-7"
            >
              <div
                className="position-relative w-100 overflow-hidden shadow-lg border border-secondary border-opacity-10"
                style={{
                  containerType: 'inline-size',
                  borderRadius: '24px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
                  background: '#050508'
                }}
              >
                {/* Banner Image */}
                <img
                  src={engravingBanner}
                  alt="Custom Engraved Product Banner"
                  className="img-fluid w-100 h-auto d-block"
                  style={{
                    borderRadius: '24px',
                    objectFit: 'cover',
                  }}
                />

                {/* Dynamic Engraving Text Overlays (Positioned independently relative to image) */}
                {/* 1. Name: Centered exactly over the metallic horizontal strip */}
                {engravingName && (
                  <motion.div
                    key={`name-${engravingName}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="position-absolute d-flex align-items-center justify-content-center text-center pointer-events-none"
                    style={{
                      left: '59.3%',
                      top: '53.3%',
                      width: '23%',
                      height: '4.5%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: engravingName.length > 8 ? '2.0cqw' : '2.4cqw',
                        fontWeight: 900,
                        letterSpacing: '1.5px',
                        color: '#d4d8db',
                        textShadow: '0 0 10px rgba(0, 243, 255, 0.45), 0 0 2px rgba(255,255,255,0.7)',
                        opacity: 0.9,
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                      }}
                    >
                      {engravingName}
                    </span>
                  </motion.div>
                )}

                {/* 2. Date: Centered below the metallic strip */}
                {engravingDate && (
                  <motion.div
                    key={`date-${engravingDate}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="position-absolute d-flex align-items-center justify-content-center text-center pointer-events-none"
                    style={{
                      left: '59.3%',
                      top: '56.5%',
                      width: '23%',
                      height: '3.5%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.7cqw',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: '#b0b5b9',
                        textShadow: '0 0 5px rgba(0, 243, 255, 0.3)',
                        opacity: 0.8,
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                      }}
                    >
                      {engravingDate}
                    </span>
                  </motion.div>
                )}

                {/* 3. Message: Centered below the Date */}
                {engravingMessage && (
                  <motion.div
                    key={`msg-${engravingMessage}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="position-absolute d-flex align-items-center justify-content-center text-center pointer-events-none"
                    style={{
                      left: '59.3%',
                      top: '59.5%',
                      width: '23%',
                      height: '6.5%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: engravingMessage.length > 20 ? '1.3cqw' : '1.5cqw',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        color: '#a0a5a9',
                        textShadow: '0 0 5px rgba(0, 243, 255, 0.25)',
                        opacity: 0.75,
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.2',
                      }}
                    >
                      {engravingMessage}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Feature Strip */}
          <div className="row g-4 mt-4 pt-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} className="col-md-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: f.bg }}>
                  <span style={{ color: f.color }}>{f.icon}</span>
                </div>
                <h5 className="fw-bold mb-2">{f.title}</h5>
                <p className="text-secondary small">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIVE PRODUCT GRID ── */}
      <div className="py-5" style={{ background: 'var(--bb-bg-navy)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black text-theme-title" style={{ fontSize: '2rem' }}>
              <span className="gradient-text">Engrave-Ready</span> Products
            </h2>
            <p className="text-theme-muted mt-2">Earbuds and neckbands — our most popular choices for custom engraving gifts.</p>
          </div>

          {productStatus === 'loading' ? (
            <div className="row g-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className="rounded-4 skeleton-pulse" style={{ height: 330, background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }} />
                </div>
              ))}
            </div>
          ) : personalisableProducts.length === 0 ? (
            <div className="text-center py-5 glass-card p-5 rounded-4">
              <div className="mb-3" style={{ fontSize: '3rem' }}>✨</div>
              <h5 className="text-theme-title fw-bold">Products loading...</h5>
              <p className="text-theme-muted small">Please check back shortly.</p>
            </div>
          ) : (
            <div className="row g-4">
              {personalisableProducts.map((product, idx) => {
                const { price, discountPrice } = getVariantPricing(product)
                const discPct = discountPrice && discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0
                const rawImg = product.images?.[0]?.imageUrl || product.variants?.[0]?.images?.[0]?.imageUrl || product.imageUrl
                const src = rawImg?.startsWith('/images/') ? `${API_BASE}${rawImg}` : rawImg?.startsWith('http') ? rawImg : IMAGE_MAP[product.imageKey] || rawImg

                return (
                  <motion.div key={product.id} className="col-12 col-sm-6 col-lg-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 4) * 0.08 }}
                  >
                    <div className="glass-card bestseller-card h-100 d-flex flex-column position-relative">
                      {/* Engraving badge */}
                      <div className="position-absolute top-0 start-0 m-3 z-3">
                        <span className="badge badge-left" style={{ background: 'linear-gradient(135deg, #00f3ff, #a820ff)', fontSize: '0.62rem' }}>
                          ✦ ENGRAVABLE
                        </span>
                      </div>
                      {discPct > 0 && (
                        <div className="position-absolute top-0 end-0 m-3 z-3">
                          <span className="badge rounded-pill" style={{ background: '#ff2a6d', fontSize: '0.65rem' }}>{discPct}% OFF</span>
                        </div>
                      )}

                      <Link to={`/products/${product.id}`} className="product-frame text-decoration-none p-4 d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                        <img
                          src={src}
                          alt={product.name}
                          className="product-img img-fluid"
                          style={{ maxHeight: '150px', objectFit: 'contain' }}
                          onError={e => { e.target.src = IMAGE_MAP.heroEarbuds }}
                        />
                      </Link>

                      <div className="card-body p-3 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <Link to={`/products/${product.id}`} className="text-decoration-none flex-grow-1 me-2">
                            <h6 className="card-title text-theme-title fw-bold mb-0 text-truncate">{product.name}</h6>
                          </Link>
                          <div className="rating-pill flex-shrink-0">
                            <Star size={11} fill="currentColor" className="text-warning" /> {Number(product.rating || 0).toFixed(1)}
                          </div>
                        </div>

                        <p className="text-theme-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.description}
                        </p>

                        <div className="d-flex align-items-center mb-3">
                          <span className="fw-black text-theme-title" style={{ fontSize: '1.1rem' }}>
                            ₹{(discountPrice || price || 0).toLocaleString('en-IN')}
                          </span>
                          {discountPrice && discountPrice < price && (
                            <span className="text-decoration-line-through text-theme-muted ms-2 small">
                              ₹{price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={e => handleAddToCart(product, e)}
                          className="btn btn-add-to-cart w-100 d-flex align-items-center justify-content-center gap-2"
                          style={{ fontSize: '0.85rem' }}
                        >
                          <ShoppingCart size={15} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-glow rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2">
              Browse All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
