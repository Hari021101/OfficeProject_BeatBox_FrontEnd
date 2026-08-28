import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Gift, Briefcase, Users, Star, ArrowRight, ShoppingCart, CheckCircle, Building2, Trophy, Headphones, Volume2, Truck, ShieldCheck, Mail } from 'lucide-react'
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
import giftingBanner from '../assets/gifting_hero_banner.png'

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
    icon: <Briefcase size={26} />,
    color: 'var(--bb-primary)',
    glow: 'rgba(168,32,255,0.12)',
    title: 'Bulk Discounts',
    desc: 'Exclusive tiered pricing for large corporate orders and festival gifting drives.',
  },
  {
    icon: <Gift size={26} />,
    color: '#00f3ff',
    glow: 'rgba(0,243,255,0.12)',
    title: 'Custom Branding',
    desc: 'Add your company logo or personalized engravings to our premium products.',
  },
  {
    icon: <Truck size={26} />,
    color: '#39ff14',
    glow: 'rgba(57,255,20,0.12)',
    title: 'Fast Delivery',
    desc: 'Express nationwide dispatch and reliable delivery across India.',
  },
  {
    icon: <ShieldCheck size={26} />,
    color: '#ff9f1c',
    glow: 'rgba(255,159,28,0.12)',
    title: 'Dedicated Support',
    desc: 'Priority account manager & 1-year official warranty on all units.',
  },
]

const GIFT_COLLECTIONS = [
  {
    id: 'audio',
    category: 'headphone',
    title: 'Audio Gear',
    subtitle: 'Over-Ear & On-Ear Headphones',
    image: heroHeadphones,
    badge: 'Popular Pick',
  },
  {
    id: 'wearables',
    category: 'watch',
    title: 'Smart Wearables',
    subtitle: 'Smartwatches & Trackers',
    image: heroSmartwatch,
    badge: 'Executive',
  },
  {
    id: 'speakers',
    category: 'speaker',
    title: 'Speakers',
    subtitle: 'Portable & Soundbars',
    image: heroSpeaker,
    badge: 'Best Value',
  },
  {
    id: 'tws',
    category: 'tws',
    title: 'True Wireless',
    subtitle: 'ANC Earbuds & TWS',
    image: smartEarbuds,
    badge: 'Trending',
  },
  {
    id: 'bundles',
    category: 'all',
    title: 'Gift Bundles',
    subtitle: 'Curated Corporate Sets',
    image: giftingBanner,
    badge: 'Premium Box',
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
      list = list.filter(p => {
        const cat = (p.categoryName || p.category || '').toLowerCase()
        if (activeTab === 'headphone') return cat.includes('headphone') || cat.includes('neckband') || cat.includes('earphone')
        if (activeTab === 'tws') return cat.includes('tws') || cat.includes('earbud')
        if (activeTab === 'speaker') return cat.includes('speaker') || cat.includes('soundbar')
        if (activeTab === 'watch') return cat.includes('watch') || cat.includes('wearable')
        return cat.includes(activeTab)
      })
    }
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

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bb-corporate-page min-vh-100">

      {/* ── 1. PREMIUM SPLIT HERO SECTION ── */}
      <section className="corp-hero-section">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="container position-relative z-1">
          <div className="row align-items-center gy-5">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="col-12 col-lg-5 text-center text-lg-start"
            >
              <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block fw-bold corporate-hero-badge" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                🏢 CORPORATE GIFTING
              </span>
              
              <h1 className="fw-light mb-1 text-theme-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
                Don't Wait!
              </h1>
              <h2 className="fw-black mb-2 text-theme-title" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)', lineHeight: 1.1 }}>
                Pick the Perfect Gift
              </h2>
              <h3 className="fw-black mb-4" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)' }}>
                <span className="gradient-text">They'll Actually Love.</span>
              </h3>

              <p className="text-theme-muted mb-4 fs-6" style={{ maxWidth: '480px', margin: '0 auto 1.5rem 0' }}>
                Elevate your business relationships with premium BeatBox audio gear and smart wearables. Reward your team and delight your clients with gifts they'll actually use every day.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <button
                  className="btn btn-glow rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-lg"
                  style={{ fontSize: '1rem' }}
                  onClick={() => scrollToId('corporate-products')}
                >
                  Explore Corporate Gifts <ArrowRight size={18} />
                </button>
                <button
                  className="btn rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 glass-card text-theme-title"
                  style={{ border: '1px solid var(--bb-border)', fontSize: '1rem' }}
                  onClick={() => scrollToId('bulk-inquiry')}
                >
                  Bulk Inquiry
                </button>
              </div>
            </motion.div>

            {/* Right Product Composition (3 Distinct Products) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-12 col-lg-7"
            >
              <div className="hero-product-stage">
                {/* Product 1: Main Headphones (Center) */}
                <img
                  src={heroHeadphones}
                  alt="Premium Wireless Headphones"
                  className="corp-hero-main-img"
                  fetchPriority="high"
                  decoding="async"
                />

                {/* Product 2: ANC Earbuds (Bottom Left) */}
                <img
                  src={smartEarbuds}
                  alt="True Wireless Earbuds"
                  className="corp-hero-sub-img-1"
                  decoding="async"
                />

                {/* Product 3: Portable Speaker (Bottom Right) */}
                <img
                  src={heroSpeaker}
                  alt="Portable Bluetooth Speaker"
                  className="corp-hero-sub-img-2"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. BENEFITS STRIP (4-Column) ── */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black text-theme-title" style={{ fontSize: '2rem' }}>Why Choose BeatBox For Gifting?</h2>
            <p className="text-theme-muted mt-2">The ultimate corporate swag that people actually want to keep.</p>
          </div>

          <div className="row g-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                className="col-12 col-sm-6 col-lg-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="corp-benefit-card">
                  <div className="corp-benefit-icon-wrapper" style={{ background: b.glow, color: b.color }}>
                    {b.icon}
                  </div>
                  <h5 className="fw-bold text-theme-title mb-2" style={{ fontSize: '1.1rem' }}>{b.title}</h5>
                  <p className="text-theme-muted mb-0 small">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. GIFT COLLECTIONS SECTION ── */}
      <section className="py-5" style={{ background: 'var(--bb-surface-2)', borderTop: '1px solid var(--bb-border)', borderBottom: '1px solid var(--bb-border)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black text-theme-title" style={{ fontSize: '2.2rem' }}>
              Thoughtful Gifts <span className="gradient-text">For Every Occasion</span>
            </h2>
            <p className="text-theme-muted mt-2 fs-6" style={{ maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Elevate your corporate gifting with premium audio gear and smart wearables. Reward your team and delight your clients.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {GIFT_COLLECTIONS.map((c, i) => (
              <motion.div
                key={c.id}
                className="col-12 col-sm-6 col-md-4 col-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div
                  className="corp-collection-card cursor-pointer"
                  onClick={() => {
                    setActiveTab(c.category)
                    scrollToId('corporate-products')
                  }}
                >
                  <div className="corp-collection-img-box">
                    <span className="badge rounded-pill position-absolute top-0 start-0 m-3 z-2 px-2 py-1" style={{ background: 'var(--bb-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>
                      {c.badge}
                    </span>
                    <img
                      src={c.image}
                      alt={c.title}
                      className="corp-collection-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-3 text-center flex-grow-1 d-flex flex-column justify-content-center">
                    <h6 className="fw-bold text-theme-title mb-1">{c.title}</h6>
                    <p className="text-theme-muted small mb-0" style={{ fontSize: '0.78rem' }}>{c.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. LIVE PRODUCT SHOWCASE GRID ── */}
      <section id="corporate-products" className="py-5">
        <div className="container">
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
                style={{ border: activeTab !== tab.value ? '1px solid var(--bb-border)' : 'none', fontSize: '0.85rem' }}
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
                          loading="lazy"
                          decoding="async"
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
      </section>

      {/* ── 5. PREMIUM CTA BANNER SECTION ── */}
      <section className="py-5">
        <div className="container">
          <div className="corp-cta-banner">
            <h2 className="fw-black mb-3 text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
              Make Every Gift Memorable
            </h2>
            <p className="text-white opacity-75 mb-4 fs-6" style={{ maxWidth: '560px', margin: '0 auto 1.5rem auto' }}>
              Create a better gifting experience for your team, clients and partners with official BeatBox bulk pricing.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <button
                className="btn btn-light rounded-pill px-4 py-3 fw-bold shadow"
                style={{ fontSize: '0.95rem' }}
                onClick={() => scrollToId('bulk-inquiry')}
              >
                Request Corporate Catalog
              </button>
              <button
                className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold"
                style={{ fontSize: '0.95rem' }}
                onClick={() => scrollToId('bulk-inquiry')}
              >
                Talk to Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. BULK INQUIRY FORM SECTION ── */}
      <section id="bulk-inquiry" className="corp-inquiry-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="text-center mb-5">
                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(168,32,255,0.12)', color: 'var(--bb-primary)' }}>
                  <Building2 size={32} />
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
      </section>
    </div>
  )
}
