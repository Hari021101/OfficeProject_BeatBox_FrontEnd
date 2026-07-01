import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Clock, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react'
import { selectRecentlyViewed, clearRecentlyViewed } from '../../redux/recentlyViewedSlice'
import { IMAGE_MAP } from '../../data/products'

export default function RecentlyViewed({ excludeId = null, products = null }) {
  const reduxItems = useSelector(selectRecentlyViewed)
  const items = products || reduxItems
  const dispatch = useDispatch()
  const scrollRef = useRef(null)

  // Exclude the current product if on ProductDetail
  const filtered = excludeId ? items.filter(p => p.id !== excludeId) : items

  if (filtered.length === 0) return null

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-4"
      id="recently-viewed-section"
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 32, height: 32, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            <Clock size={15} style={{ color: '#f59e0b' }} />
          </div>
          <h2 className="fw-black text-theme-title mb-0" style={{ fontSize: 'clamp(1rem,2vw,1.3rem)', letterSpacing: '-0.5px' }}>
            Recently <span className="gradient-text">Viewed</span>
          </h2>
          <span
            className="rounded-pill px-2 fw-bold"
            style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '0.68rem', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            {filtered.length}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Scroll arrows (desktop) */}
          <button
            onClick={() => scroll(-1)}
            className="btn border-0 d-none d-md-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bb-surface-2)', color: 'var(--bb-muted)', border: '1px solid var(--bb-border)' }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="btn border-0 d-none d-md-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bb-surface-2)', color: 'var(--bb-muted)', border: '1px solid var(--bb-border)' }}
          >
            <ChevronRight size={16} />
          </button>

          {/* Clear all */}
          <button
            onClick={() => dispatch(clearRecentlyViewed())}
            className="btn border-0 d-flex align-items-center gap-1 fw-semibold"
            style={{ color: 'var(--bb-muted)', background: 'transparent', fontSize: '0.78rem', padding: '4px 8px' }}
            title="Clear history"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Strip */}
      <div
        ref={scrollRef}
        className="d-flex gap-3 pb-2"
        style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filtered.map((product, idx) => (
          <RecentCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </motion.section>
  )
}

// ─── Individual Card ──────────────────────────────────────────────────────────
function RecentCard({ product, index }) {
  const img =
    (product.imageUrl && product.imageUrl.startsWith('http') ? product.imageUrl : null) ||
    IMAGE_MAP[product.imageKey] ||
    IMAGE_MAP['heroHeadphones']

  const discount = product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : product.discount || 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{ flexShrink: 0, width: 160 }}
    >
      <Link
        to={`/products/${product.id}`}
        className="text-decoration-none d-block"
        id={`recently-viewed-${product.id}`}
      >
        <div
          className="rounded-3 overflow-hidden position-relative"
          style={{
            background: 'var(--bb-surface)',
            border: '1px solid var(--bb-border)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(0,243,255,0.4)'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,243,255,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--bb-border)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Discount badge */}
          {discount > 0 && (
            <span
              className="position-absolute fw-black"
              style={{
                top: 8, left: 8,
                background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
                color: '#fff',
                fontSize: '0.6rem',
                padding: '2px 7px',
                borderRadius: 20,
                zIndex: 2,
              }}
            >
              -{discount}%
            </span>
          )}

          {/* Image */}
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: 110, padding: 12, background: 'var(--bb-surface)' }}
          >
            <img
              src={img}
              alt={product.name}
              style={{ maxHeight: 90, maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
            />
          </div>

          {/* Info */}
          <div className="p-2 pt-0" style={{ borderTop: '1px solid var(--bb-border)' }}>
            <p
              className="fw-bold text-theme-title mb-1"
              style={{ fontSize: '0.75rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {product.name}
            </p>
            <div className="d-flex align-items-center gap-1 flex-wrap">
              <span className="fw-black" style={{ fontSize: '0.82rem', color: 'var(--bb-accent)' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-decoration-line-through" style={{ fontSize: '0.65rem', color: 'var(--bb-muted)' }}>
                  ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
