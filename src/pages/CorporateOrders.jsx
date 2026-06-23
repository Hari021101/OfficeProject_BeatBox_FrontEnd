import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Gift, Briefcase, Users, Star, ArrowRight, ShoppingCart, CheckCircle, Building2, Trophy, Headphones, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProducts, selectProductStatus, fetchProducts } from '../redux/productSlice'
import { addToCart } from '../redux/cartSlice'
import { toast } from 'react-hot-toast'
import { IMAGE_MAP } from '../data/products'

import heroHeadphones from '../assets/hero_headphones.png'
import smartEarbuds from '../assets/smart_earbuds.png'
import heroSmartwatch from '../assets/hero_smartwatch.png'
import heroSpeaker from '../assets/hero_speaker.png'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5089'

const getVariantPricing = (product) => {
  const variants = product.variants || []
  if (!variants.length) return { price: product.price || 0, discountPrice: null }
  const sorted = [...variants].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
  const c = sorted[0]
  return { price: c.price, discountPrice: c.discountPrice }
}

const CATEGORY_TABS = [
  { label: 'All Products', value: 'all', icon: <Briefcase size={15} /> },
  { label: 'Headphones', value: 'headphone', icon: <Headphones size={15} /> },
  { label: 'Earbuds', value: 'tws', icon: <Star size={15} /> },
  { label: 'Speakers', value: 'speaker', icon: <Volume2 size={15} /> },
  { label: 'Smartwatches', value: 'watch', icon: <Trophy size={15} /> },
]

const BENEFITS = [
  {
    icon: <Briefcase size={32} />,
    color: 'var(--bb-accent)',
    glow: 'rgba(0,243,255,0.12)',
    title: 'Bulk Discounts',
    desc: 'Exclusive tiered pricing for large corporate orders and festival gifting drives.',
  },
  {
    icon: <Star size={32} />,
    color: '#a820ff',
    glow: 'rgba(168,32,255,0.12)',
    title: 'Custom Branding',
    desc: 'Add your company logo or personalized engravings to our premium products.',
  },
  {
    icon: <Users size={32} />,
    color: '#39ff14',
    glow: 'rgba(57,255,20,0.12)',
    title: 'Dedicated Support',
    desc: 'A dedicated account manager ensures smooth delivery for your entire team.',
  },
  {
    icon: <CheckCircle size={32} />,
    color: '#ff9f1c',
    glow: 'rgba(255,159,28,0.12)',
    title: 'Quality Assured',
    desc: 'Every unit is quality-checked before dispatch. 1-year warranty included.',
  },
]

export default function CorporateOrders() {
  const dispatch = useDispatch()
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)
  const [activeTab, setActiveTab] = useState('all')
  const [inquiryForm, setInquiryForm] = useState({ company: '', email: '', quantity: '', message: '' })
  const [formSent, setFormSent] = useState(false)

  useEffect(() => {
    if (productStatus === 'idle') dispatch(fetchProducts())
  }, [productStatus, dispatch])

  const displayedProducts = useMemo(() => {
    let list = [...allProducts]
    if (activeTab !== 'all') {
      list = list.filter(p => p.categoryName?.toLowerCase().includes(activeTab))
    }
    // Prioritise featured products first
    list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    return list.slice(0, 12)
  }, [allProducts, activeTab])

  const handleAddToCart = (product, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    const variants = product.variants || []
    const bestVariant = variants.length
      ? [...variants].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))[0]
      : null
    const rawImg = product.images?.[0]?.imageUrl || product.variants?.[0]?.images?.[0]?.imageUrl || product.imageUrl
    const resolvedImg = rawImg?.startsWith('/images/') ? `${API_BASE}${rawImg}` : rawImg?.startsWith('http') ? rawImg : IMAGE_MAP[product.imageKey] || rawImg
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: bestVariant?.discountPrice || bestVariant?.price || product.price || 0,
      originalPrice: bestVariant?.price || product.oldPrice || 0,
      variantId: bestVariant?.id,
      selectedColor: bestVariant?.color || 'Default',
      selectedColorCode: bestVariant?.colorCode || '#111111',
      category: product.categoryName,
      imageUrl: resolvedImg,
    }))
    toast.success(`🎁 ${product.name} added to cart!`, {
      style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-primary)', borderRadius: '10px' }
    })
  }

  const handleInquiry = (e) => {
    e.preventDefault()
    setFormSent(true)
    toast.success('Inquiry sent! Our team will contact you within 24 hours.', {
      style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-accent)', borderRadius: '10px' }
    })
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '80px' }}>

      {/* ── HERO ── */}
      <div className="position-relative d-flex align-items-center" style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div className="position-absolute" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(168,32,255,0.06)', border: '1px solid rgba(168,32,255,0.12)' }} />
        <div className="position-absolute" style={{ bottom: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.10)' }} />

        <div className="container position-relative z-1">
          <div className="row align-items-center gy-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="col-12 col-lg-5"
            >
              <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block fw-bold" style={{ background: 'rgba(168,32,255,0.12)', color: '#820df2', border: '1px solid rgba(168,32,255,0.25)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                🏢 CORPORATE GIFTING
              </span>
              <h1 className="fw-light mb-2 text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Don't Wait!</h1>
              <h2 className="fw-black mb-2 text-dark" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}>Pick a Gift</h2>
              <h3 className="fw-light mb-5 text-secondary" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Before they Start Complaining.</h3>

              <div className="d-flex flex-wrap gap-3">
                <button
                  className="btn btn-dark rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-lg"
                  style={{ fontSize: '1.05rem' }}
                  onClick={() => document.getElementById('corporate-products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Shop Corporate Gifts <ArrowRight size={18} />
                </button>
                <button
                  className="btn rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
                  style={{ background: 'rgba(130,13,242,0.1)', color: '#820df2', border: '2px solid rgba(130,13,242,0.3)', fontSize: '1.05rem' }}
                  onClick={() => document.getElementById('bulk-inquiry')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Bulk Inquiry
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-12 col-lg-7 position-relative"
              style={{ minHeight: '480px' }}
            >
              {/* Gift boxes */}
              {[
                { bottom: '10%', right: '8%', width: '140px', height: '140px', ribbon: '#d4af37' },
                { bottom: '18%', left: '8%', width: '190px', height: '145px', ribbon: '#cc0000' },
              ].map((box, i) => (
                <div key={i} className="position-absolute" style={{ ...box, backgroundColor: '#fff', border: '1px solid #eee', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 1 }}>
                  <div className="w-100 h-100 position-relative">
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '45%', width: '10%', backgroundColor: box.ribbon }} />
                    <div style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: '10%', backgroundColor: box.ribbon }} />
                  </div>
                </div>
              ))}
              <img src={heroHeadphones} className="position-absolute hero-float" style={{ top: '0%', left: '22%', width: '50%', filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.2))', zIndex: 3 }} alt="Headphones" />
              <img src={smartEarbuds} className="position-absolute" style={{ bottom: '0%', left: '28%', width: '30%', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.2))', zIndex: 4 }} alt="Earbuds" />
              <img src={heroSmartwatch} className="position-absolute hero-float" style={{ bottom: '5%', right: '22%', width: '32%', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.2))', zIndex: 5, animationDelay: '1s' }} alt="Smartwatch" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── RED SECONDARY HERO ── */}
      <div className="position-relative py-5" style={{ background: 'linear-gradient(135deg, #cc0000 0%, #880000 100%)', color: '#fff' }}>
        <div className="container py-4">
          <div className="row align-items-center gy-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="col-12 col-lg-5"
            >
              <h2 className="fw-black mb-1" style={{ fontSize: '3rem', letterSpacing: '-1px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>Thoughtful Gifts</h2>
              <h3 className="fw-medium mb-4" style={{ fontSize: '2rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>For Every Occasion</h3>
              <p className="fs-5 mb-4 opacity-75">Elevate your corporate gifting with premium audio gear and smart wearables. Reward your team and delight your clients.</p>
              <button
                className="btn btn-light rounded-pill px-4 py-2 fw-bold text-danger shadow"
                onClick={() => document.getElementById('bulk-inquiry')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request Catalog
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-12 col-lg-7 position-relative"
              style={{ minHeight: '360px' }}
            >
              <div className="position-absolute bottom-0 w-100" style={{ height: '100px', background: 'linear-gradient(180deg, #aa0000, #550000)', borderRadius: '10px 10px 0 0', border: '2px solid #ff3333', borderBottom: 'none', boxShadow: '0 -20px 50px rgba(0,0,0,0.5)' }} />
              <img src={heroSpeaker} className="position-absolute hero-float" style={{ bottom: '20%', right: '15%', width: '28%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))', zIndex: 4 }} alt="Speaker" />
              <img src={smartEarbuds} className="position-absolute hero-float" style={{ top: '10%', right: '42%', width: '24%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))', zIndex: 3, animationDelay: '0.5s' }} alt="Earbuds" />
              <img src={heroSmartwatch} className="position-absolute hero-float" style={{ bottom: '15%', left: '18%', width: '32%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))', zIndex: 5, animationDelay: '1.5s', transform: 'rotate(-12deg)' }} alt="Watch" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── BENEFITS ── */}
      <div className="container py-5 my-3">
        <div className="text-center mb-5">
          <h2 className="fw-black text-theme-title" style={{ fontSize: '2rem' }}>Why Choose BeatBox For Gifting?</h2>
          <p className="text-theme-muted mt-2">The ultimate corporate swag that people actually want to keep.</p>
        </div>
        <div className="row g-4">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} className="col-md-6 col-lg-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="p-4 rounded-4 text-center h-100 position-relative overflow-hidden" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = b.color; e.currentTarget.style.boxShadow = `0 15px 35px ${b.glow}` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bb-border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: b.glow }}>
                  <span style={{ color: b.color }}>{b.icon}</span>
                </div>
                <h5 className="fw-bold text-theme-title mb-2">{b.title}</h5>
                <p className="text-theme-muted mb-0 small">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── LIVE PRODUCT GRID ── */}
      <div id="corporate-products" className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-black text-theme-title" style={{ fontSize: '2rem' }}>
            <span className="gradient-text">Top Picks</span> For Corporate Gifting
          </h2>
          <p className="text-theme-muted mt-2">Curated from our live catalog — real prices, real products.</p>
        </div>

        {/* Category Tabs */}
        <div className="d-flex overflow-auto pb-3 gap-2 justify-content-lg-center mb-4" style={{ scrollbarWidth: 'none' }}>
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`btn rounded-pill px-4 py-2 fw-semibold text-nowrap d-flex align-items-center gap-2 ${activeTab === tab.value ? 'btn-glow' : 'glass-card text-theme-muted'}`}
              style={{ border: activeTab !== tab.value ? '1px solid rgba(255,255,255,0.1)' : 'none', fontSize: '0.85rem' }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {productStatus === 'loading' ? (
          <div className="row g-4">
            {[1, 2, 3, 4].map(i => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <div className="rounded-4 skeleton-pulse" style={{ height: 340, background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }} />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-5 glass-card p-5" style={{ borderRadius: '16px' }}>
            <div className="mb-3" style={{ fontSize: '3rem' }}>🎁</div>
            <h5 className="text-theme-title fw-bold">No products found in this category</h5>
            <p className="text-theme-muted small">Try selecting a different category above.</p>
          </div>
        ) : (
          <div className="row g-4">
            {displayedProducts.map((product, idx) => {
              const { price, discountPrice } = getVariantPricing(product)
              const discPct = discountPrice && discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0
              const rawImg = product.images?.[0]?.imageUrl || product.variants?.[0]?.images?.[0]?.imageUrl || product.imageUrl
              const src = rawImg?.startsWith('/images/') ? `${API_BASE}${rawImg}` : rawImg?.startsWith('http') ? rawImg : IMAGE_MAP[product.imageKey] || rawImg

              return (
                <motion.div key={product.id} className="col-12 col-sm-6 col-lg-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 4) * 0.07 }}
                >
                  <div className="glass-card bestseller-card h-100 d-flex flex-column position-relative">
                    <div className="position-absolute top-0 start-0 m-3 z-3">
                      <span className="badge badge-left" style={{ fontSize: '0.65rem' }}>
                        {product.isFeatured ? '⭐ FEATURED' : '🏢 CORP PICK'}
                      </span>
                    </div>
                    {discPct > 0 && (
                      <div className="position-absolute top-0 end-0 m-3 z-3">
                        <span className="badge rounded-pill" style={{ background: '#cc0000', fontSize: '0.65rem' }}>{discPct}% OFF</span>
                      </div>
                    )}

                    <Link to={`/products/${product.id}`} className="product-frame text-decoration-none p-4 d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                      <img
                        src={src}
                        alt={product.name}
                        className="product-img img-fluid"
                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                        onError={e => { e.target.src = IMAGE_MAP.heroHeadphones }}
                      />
                    </Link>

                    <div className="card-body p-3 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <Link to={`/products/${product.id}`} className="text-decoration-none flex-grow-1 me-2">
                          <h6 className="card-title text-theme-title fw-bold mb-0 text-truncate">{product.name}</h6>
                        </Link>
                        <div className="rating-pill flex-shrink-0">
                          <span className="text-warning">★</span> {Number(product.rating || 0).toFixed(1)}
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
            View Full Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* ── BULK INQUIRY FORM ── */}
      <div id="bulk-inquiry" className="py-5 mt-3" style={{ background: 'var(--bb-surface-2)', borderTop: '1px solid var(--bb-border)', borderBottom: '1px solid var(--bb-border)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="text-center mb-5">
                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(168,32,255,0.12)' }}>
                  <Building2 size={32} style={{ color: 'var(--bb-primary)' }} />
                </div>
                <h2 className="fw-black text-theme-title">Place a Bulk Corporate Order</h2>
                <p className="text-theme-muted">Fill in your requirements and our team will get back within 24 hours with custom pricing.</p>
              </div>

              {formSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-5 text-center rounded-4">
                  <CheckCircle size={56} style={{ color: '#39ff14' }} className="mb-3" />
                  <h4 className="fw-bold text-theme-title">Inquiry Received!</h4>
                  <p className="text-theme-muted">Our corporate sales team will contact you at <strong>{inquiryForm.email}</strong> within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-4 p-md-5 rounded-4"
                  onSubmit={handleInquiry}
                >
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="fw-semibold text-theme-muted small mb-2 d-block">Company Name *</label>
                      <input
                        required
                        type="text"
                        className="bb-input w-100"
                        placeholder="Acme Corp"
                        style={{ paddingLeft: '16px !important' }}
                        value={inquiryForm.company}
                        onChange={e => setInquiryForm(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-semibold text-theme-muted small mb-2 d-block">Business Email *</label>
                      <input
                        required
                        type="email"
                        className="bb-input w-100"
                        placeholder="you@company.com"
                        style={{ paddingLeft: '16px !important' }}
                        value={inquiryForm.email}
                        onChange={e => setInquiryForm(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-semibold text-theme-muted small mb-2 d-block">Approximate Quantity *</label>
                      <input
                        required
                        type="number"
                        min="10"
                        className="bb-input w-100"
                        placeholder="e.g. 50"
                        style={{ paddingLeft: '16px !important' }}
                        value={inquiryForm.quantity}
                        onChange={e => setInquiryForm(p => ({ ...p, quantity: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-semibold text-theme-muted small mb-2 d-block">Message / Requirements</label>
                      <textarea
                        rows={1}
                        className="bb-input w-100"
                        placeholder="Custom branding, specific models..."
                        style={{ paddingLeft: '16px !important', resize: 'none' }}
                        value={inquiryForm.message}
                        onChange={e => setInquiryForm(p => ({ ...p, message: e.target.value }))}
                      />
                    </div>
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-glow rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2">
                        <Gift size={18} /> Submit Bulk Inquiry
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
