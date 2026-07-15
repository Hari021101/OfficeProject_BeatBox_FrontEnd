import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { categoryService } from '../../services/categoryService'
import { getCategoryCover } from '../../utils/categoryImageHelper'

// ─── Framer Motion list / item variants ──────────────────────────────────────
const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 16 },
  },
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function ShopByCategories() {
  const navigate           = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await categoryService.getCategories()
        const sorted = [...data].sort((a, b) => {
          const countDiff = (b.productCount || 0) - (a.productCount || 0);
          if (countDiff !== 0) return countDiff;
          
          // Prioritize Keyboards when product counts are equal
          const aIsKeyboard = a.name.toLowerCase().includes('keyboard');
          const bIsKeyboard = b.name.toLowerCase().includes('keyboard');
          if (aIsKeyboard && !bIsKeyboard) return -1;
          if (!aIsKeyboard && bIsKeyboard) return 1;
          
          return a.name.localeCompare(b.name);
        });
        setCategoriesList(sorted.slice(0, 6))
      } catch (err) {
        console.error("Error loading categories in ShopByCategories:", err)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  if (loading && categoriesList.length === 0) {
    return null; // Silent load skeleton fallback
  }

  return (
    <section
      id="shop-by-categories"
      style={{
        padding: '52px 0 48px',
        borderBottom: '1px solid var(--bb-border)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '40px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: 'var(--bb-primary)',
                margin: '0 0 7px',
              }}
            >
              Explore
            </p>
            <h2
              style={{
                fontWeight: 900,
                fontSize: 'clamp(1.35rem, 2.8vw, 1.85rem)',
                color: 'var(--bb-title-color)',
                margin: 0,
                letterSpacing: '-0.4px',
                lineHeight: 1.15,
              }}
            >
              Shop by{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Category
              </span>
            </h2>
          </div>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { x: 4 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={() => navigate('/products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              color: 'var(--bb-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '4px 0',
              flexShrink: 0,
              lineHeight: 1,
            }}
            aria-label="View all categories"
          >
            View All <ArrowRight size={15} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* ── Category row ─────────────────────────────────────────────────── */}
        <motion.div
          variants={shouldReduceMotion ? {} : listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="sbc-row"
        >
          {categoriesList.map((cat, i) => (
            <CategoryItem
              key={cat.id}
              cat={cat}
              index={i}
              onNavigate={() =>
                navigate(`/products?category=${cat.slug}`)
              }
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Scoped responsive + animation CSS ───────────────────────────────── */}
      <style>{`
        /* Desktop: equal 6-column grid */
        .sbc-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }

        /* Tablet: switch to horizontal scroll flex */
        @media (max-width: 991px) {
          .sbc-row {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 14px !important;
            padding-bottom: 12px;
            scrollbar-width: none;
          }
          .sbc-row::-webkit-scrollbar { display: none; }
          .sbc-row > * {
            flex: 0 0 155px;
            scroll-snap-align: start;
          }
        }

        /* Mobile: slightly narrower tiles */
        @media (max-width: 575px) {
          .sbc-row > * {
            flex: 0 0 132px !important;
          }
        }

        /* ── Circle: dark mode base (default, no data-theme attr) */
        .sbc-circle {
          background: var(--bb-surface-2, #0d1527);
        }

        /* ── Circle: light mode base ── */
        [data-theme="light"] .sbc-circle {
          background: #eef0f8;
        }

        /* ── Image hover scale handled by group hover ── */
        .sbc-item:hover .sbc-img {
          transform: scale(1.12) !important;
        }
      `}</style>
    </section>
  )
}

// ─── Category item ────────────────────────────────────────────────────────────
function CategoryItem({ cat, index, onNavigate, shouldReduceMotion }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      variants={shouldReduceMotion ? {} : itemVariants}
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -6, transition: { type: 'spring', stiffness: 260, damping: 20 } }
      }
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      className="sbc-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={onNavigate}
      aria-label={`Shop ${cat.name}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 4px 6px',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* ── Circular image container ── */}
      <div
        className="sbc-circle"
        style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          overflow: 'hidden',          // ← clips white PNG edges to circle
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: hovered ? '0 8px 22px rgba(0,0,0,0.16)' : 'none',
          transition: 'all 0.3s ease',
          position: 'relative',
        }}
      >
        {/* Product image */}
        <img
          src={getCategoryCover(cat.name, cat.imageUrl)}
          alt={cat.name}
          loading="lazy"
          className="sbc-img"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100px',
            height: '100px',
            objectFit: 'contain',
            objectPosition: 'center',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
            transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </div>

      {/* ── Category name ── */}
      <span
        style={{
          fontWeight: 700,
          fontSize: '0.83rem',
          color: 'var(--bb-title-color)',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: '-0.1px',
          transition: 'color 0.25s ease',
        }}
      >
        {cat.name}
      </span>
    </motion.button>
  )
}
