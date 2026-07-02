import { useMemo, useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { selectAllProducts } from '../../redux/productSlice'
import { ArrowRight } from 'lucide-react'

// ─── Fallback assets (real product images, no placeholders) ──────────────────
import heroHeadphones  from '../../assets/hero_headphones.png'
import gamingHeadset   from '../../assets/gaming_headset.png'
import smartTracker    from '../../assets/action_cam.png'

// ─── Collection definitions ──────────────────────────────────────────────────
// categoryMatchers: array of lowercase substrings — if a product's categoryName
// matches any of them it belongs to this collection.
const COLLECTIONS = [
  {
    id:       'signature',
    title:    'BeatBox Signature Series',
    subtitle: 'Premium audio engineered for bass lovers',
    cta:      'Shop Signature',
    navCategory: 'signature-series',
    categoryMatchers: ['headphone', 'neckband', 'earphone', 'earbud', 'tws', 'wireless earbuds'],
    accentVar:   '--bb-primary',
    fallbackImg: heroHeadphones,
    // subtle gradient tint — works in both themes because it uses semi-transparent BB color
    tint: 'rgba(168,32,255,0.06)',
  },
  {
    id:       'gaming',
    title:    'BeatBox Gaming Collection',
    subtitle: 'Low-latency sound built for competitive gaming',
    cta:      'Shop Gaming',
    navCategory: 'gaming-collection',
    categoryMatchers: ['gaming', 'game', 'keyboard', 'mouse'],
    accentVar:   '--bb-accent',
    fallbackImg: gamingHeadset,
    tint: 'rgba(0,243,255,0.05)',
  },
  {
    id:       'pro',
    title:    'BeatBox Pro Collection',
    subtitle: 'Smart accessories and productivity gear',
    cta:      'Shop Pro',
    navCategory: 'pro-collection',
    categoryMatchers: ['smart watch', 'watch', 'keyboard', 'mouse', 'gadget'],
    accentVar:   '--bb-primary',
    fallbackImg: smartTracker,
    tint: 'rgba(168,32,255,0.06)',
  },
]

// ─── Utility: pick best product image per collection ─────────────────────────
function useBestImage(products) {
  return useMemo(() => {
    if (!products || products.length === 0) return {}

    const result = {}
    for (const col of COLLECTIONS) {
      const matching = products.filter(p => {
        const cat = (p.categoryName || p.category || '').toLowerCase()
        return col.categoryMatchers.some(m => cat.includes(m))
      })
      const sorted = [...matching].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      // prefer products with a real imageUrl
      const best = sorted.find(p => p.imageUrl) || sorted[0]
      result[col.id] = best?.imageUrl || null
    }
    return result
  }, [products])
}

// ─── Intersection Observer hook for scroll-reveal ────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BeatBoxCollections() {
  const allProducts      = useSelector(selectAllProducts)
  const bestImages       = useBestImage(allProducts)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="beatbox-collections"
      style={{ padding: '48px 0 0', background: 'var(--bb-bg-navy, #010308)' }}
      aria-label="BeatBox Collections"
    >
      {/* Section header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 32px' }}>
        <h2
          style={{
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: 'var(--bb-title-color)',
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Our{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Collections
          </span>
        </h2>
        <p style={{ color: 'var(--bb-muted)', marginTop: '6px', fontSize: '0.9rem' }}>
          Hand-picked product lines crafted for every lifestyle
        </p>
      </div>

      {/* Banners */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {COLLECTIONS.map((col, idx) => (
          <CollectionBanner
            key={col.id}
            collection={col}
            imageUrl={bestImages[col.id]}
            isReversed={idx % 2 !== 0}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </section>
  )
}

// ─── Individual Banner ───────────────────────────────────────────────────────
function CollectionBanner({ collection, imageUrl, isReversed, shouldReduceMotion }) {
  const navigate  = useNavigate()
  const [ref, visible] = useInView(0.12)
  const [hovered, setHovered] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)

  const imgSrc = imageUrl || collection.fallbackImg

  // Reveal animation values
  const translateY = visible ? '0px' : '48px'
  const opacity    = visible ? 1 : 0
  const transition = shouldReduceMotion ? 'none' : 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)'

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(${isReversed ? '135deg' : '225deg'}, ${collection.tint}, var(--bb-surface) 60%)`
          : 'var(--bb-surface)',
        borderTop:    '1px solid var(--bb-border)',
        borderBottom: '1px solid var(--bb-border)',
        transition: shouldReduceMotion ? 'none' : 'background 0.5s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateAreas: isReversed ? '"image text"' : '"text image"',
          alignItems: 'center',
          minHeight: '420px',
          gap: '32px',
          // Mobile: single column
        }}
        className="bb-collection-grid"
      >
        {/* ── Text Side ── */}
        <div
          style={{
            gridArea: 'text',
            opacity,
            transform: `translateY(${translateY})`,
            transition: `${transition}`,
            padding: '48px 0',
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              width: '40px',
              height: '3px',
              borderRadius: '2px',
              background: `var(${collection.accentVar})`,
              marginBottom: '20px',
              opacity: 0.75,
            }}
          />

          <h3
            style={{
              fontWeight: 900,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
              color: 'var(--bb-title-color)',
              letterSpacing: '-0.8px',
              lineHeight: 1.15,
              margin: '0 0 12px',
            }}
          >
            {collection.title}
          </h3>

          <p
            style={{
              color: 'var(--bb-muted)',
              fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
              lineHeight: 1.65,
              maxWidth: '440px',
              margin: '0 0 32px',
            }}
          >
            {collection.subtitle}
          </p>

          {/* CTA */}
          <button
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            onClick={() => navigate(`/products?category=${encodeURIComponent(collection.navCategory)}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '50px',
              border: `1.5px solid var(${collection.accentVar})`,
              background: btnHovered
                ? `var(${collection.accentVar})`
                : 'transparent',
              color: btnHovered
                ? '#ffffff'
                : `var(${collection.accentVar})`,
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: shouldReduceMotion ? 'none' : 'background 0.25s ease, color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease',
              transform: btnHovered && !shouldReduceMotion ? 'translateY(-2px)' : 'none',
              boxShadow: btnHovered ? `0 8px 24px rgba(0,0,0,0.18)` : 'none',
              letterSpacing: '0.2px',
            }}
            aria-label={`${collection.cta} — ${collection.title}`}
          >
            {collection.cta}
            <span
              style={{
                display: 'inline-flex',
                transform: btnHovered && !shouldReduceMotion ? 'translateX(4px)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        {/* ── Image Side ── */}
        <div
          style={{
            gridArea: 'image',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity,
            transform: `translateY(${shouldReduceMotion ? '0' : translateY})`,
            transition: `${transition} 0.1s`,
            padding: '40px 0',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Subtle radial glow behind image (uses surface colour, not neon) */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                width: '70%',
                height: '70%',
                borderRadius: '50%',
                background: `radial-gradient(circle, var(${collection.accentVar}) 0%, transparent 70%)`,
                opacity: hovered ? 0.07 : 0.04,
                transition: 'opacity 0.5s ease',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />

            <img
              src={imgSrc}
              alt={collection.title}
              style={{
                width: '100%',
                maxWidth: '400px',
                maxHeight: '340px',
                objectFit: 'contain',
                position: 'relative',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))',
                // Float animation + zoom on hover
                animation: !shouldReduceMotion ? 'bbCollectionFloat 5s ease-in-out infinite' : 'none',
                transform: hovered && !shouldReduceMotion ? 'scale(1.04)' : 'scale(1)',
                transition: shouldReduceMotion ? 'none' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}
              onError={e => { e.target.src = collection.fallbackImg }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
