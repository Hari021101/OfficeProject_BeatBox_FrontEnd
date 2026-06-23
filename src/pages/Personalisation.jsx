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
  { label: 'Your Name', text: 'ARYAN', color: '#00f3ff' },
  { label: 'A Date', text: '14·02·24', color: '#a820ff' },
  { label: 'A Message', text: '♡ LOVE', color: '#ff2a6d' },
]

export default function Personalisation() {
  const dispatch = useDispatch()
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)
  const [engravingText, setEngravingText] = useState('YOUR NAME')
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
              className="col-12 col-lg-6"
            >
              <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block fw-bold" style={{ background: 'rgba(0,243,255,0.1)', color: '#00f3ff', border: '1px solid rgba(0,243,255,0.25)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                ✦ CUSTOM ENGRAVING
              </span>
              <h1 className="fw-medium mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1px', color: '#e0e0e0' }}>
                IT'S MORE THAN A GIFT,
              </h1>
              <h2 className="fw-black mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1px' }}>
                It's An <span className="gradient-text">Experience</span>
              </h2>
              <p className="fs-5 mb-5" style={{ color: '#aaa', fontWeight: 500, maxWidth: '500px' }}>
                Add a personal touch with custom engraving — make every BeatBox product truly one of a kind.
              </p>

              {/* Live Engraving Preview */}
              <div className="mb-5">
                <p className="text-secondary small mb-3 fw-semibold">Preview your engraving:</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {ENGRAVING_EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      className="btn btn-sm rounded-pill px-3 fw-semibold"
                      style={{
                        background: activeExample === i ? ex.color : 'transparent',
                        color: activeExample === i ? '#000' : ex.color,
                        border: `1px solid ${ex.color}40`,
                        fontSize: '0.78rem',
                        transition: 'all 0.3s'
                      }}
                      onClick={() => { setActiveExample(i); setEngravingText(ex.text) }}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
                <input
                  maxLength={12}
                  value={engravingText}
                  onChange={e => setEngravingText(e.target.value.toUpperCase())}
                  className="bb-input"
                  placeholder="Type your text..."
                  style={{ paddingLeft: '16px !important', maxWidth: '300px', letterSpacing: '3px', fontWeight: 700, background: 'rgba(255,255,255,0.05) !important', border: '1px solid rgba(255,255,255,0.15) !important', color: '#fff !important', borderRadius: '10px !important' }}
                />
              </div>

              <Link
                to="/products"
                className="btn rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.35)',
                  fontSize: '1.1rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
              >
                Explore Personalisable Products <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* Right — Product Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-12 col-lg-6 position-relative"
            >
              <div className="position-relative d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
                {/* Stand effect */}
                <div className="position-absolute bottom-0" style={{ width: '80%', height: '20px', background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(5px)' }} />
                <div className="position-absolute bottom-0 mb-3" style={{ width: '60%', height: '4px', background: '#222', borderRadius: '50%', borderTop: '1px solid #444' }} />

                {/* Product */}
                <div className="position-relative" style={{ zIndex: 2 }}>
                  <img
                    src={heroEarbuds}
                    alt="Custom Engraved Earbuds"
                    className="img-fluid"
                    style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.85)) grayscale(15%)', transform: 'scale(1.2)' }}
                  />

                  {/* Dynamic Engraving Overlay */}
                  <motion.div
                    key={engravingText}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="position-absolute w-100 text-center"
                    style={{ top: '65%', left: '0', transform: 'translateY(-50%)' }}
                  >
                    <span
                      className="fw-black text-uppercase"
                      style={{
                        fontSize: '1.3rem',
                        letterSpacing: '4px',
                        color: ENGRAVING_EXAMPLES[activeExample]?.color || '#00f3ff',
                        textShadow: `0 0 20px ${ENGRAVING_EXAMPLES[activeExample]?.color || '#00f3ff'}80`,
                      }}
                    >
                      {engravingText || 'YOUR NAME'}
                    </span>
                  </motion.div>

                  {/* Laser tool */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="position-absolute d-flex align-items-center"
                    style={{ right: '-10%', top: '65%', transform: 'translateY(-50%)' }}
                  >
                    <div style={{ width: '60px', height: '2px', background: `linear-gradient(90deg, ${ENGRAVING_EXAMPLES[activeExample]?.color || '#ff0000'}, transparent)`, filter: 'blur(1px)' }} />
                    <Edit3 size={24} color="#555" style={{ transform: 'rotate(-45deg)' }} />
                  </motion.div>
                </div>

                {/* Floating labels */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="position-absolute d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                  style={{ top: '10%', right: '0', background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.25)', backdropFilter: 'blur(10px)' }}
                >
                  <Sparkles size={16} color="#00f3ff" />
                  <span className="small fw-bold" style={{ color: '#00f3ff' }}>Laser Precision</span>
                </motion.div>
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
