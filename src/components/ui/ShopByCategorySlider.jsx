import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { categoryService } from '../../services/categoryService'
import { getCategoryCover } from '../../utils/categoryImageHelper'

const CARD_W = 130   // px — width of each card
const CARD_GAP = 12  // px — gap between cards
const SCROLL_STEP = (CARD_W + CARD_GAP) * 4 // scroll 4 cards at a time

export default function ShopByCategorySlider() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await categoryService.getCategories()
        setCategoriesList(data)
      } catch (err) {
        console.error("Error loading categories in ShopByCategorySlider:", err)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scroll = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' })
    // update after animation settles
    setTimeout(updateScrollState, 400)
  }

  return (
    <section
      id="shop-by-category"
      style={{
        padding: '28px 0 20px',
        borderBottom: '1px solid var(--bb-border)',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 16px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <div>
          <h3
            style={{
              fontWeight: 900,
              fontSize: '1.15rem',
              color: 'var(--bb-title-color)',
              margin: 0,
              letterSpacing: '-0.3px',
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
          </h3>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--bb-muted-color, var(--bb-muted))',
              margin: '3px 0 0',
            }}
          >
            Browse our full range of premium audio &amp; tech
          </p>
        </div>

        {/* Arrow controls – desktop */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <NavBtn
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </NavBtn>
          <NavBtn
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </NavBtn>
        </div>
      </div>

      {/* ── Slider Track ── */}
      <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Left fade edge */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '40px',
            background:
              'linear-gradient(to right, var(--bb-bg-navy, #010308), transparent)',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: canScrollLeft ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        {/* Right fade edge */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '40px',
            background:
              'linear-gradient(to left, var(--bb-bg-navy, #010308), transparent)',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: canScrollRight ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        <div
          ref={trackRef}
          onScroll={updateScrollState}
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            overflowX: 'auto',
            padding: '8px 20px 14px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',       // Firefox
            msOverflowStyle: 'none',      // IE/Edge
          }}
          // Hide scrollbar in WebKit
          className="sbc-track"
        >
          {categoriesList.map((cat) => (
            <CategoryPill
              key={cat.id}
              cat={cat}
              onNavigate={() =>
                navigate(`/products?category=${cat.slug}`)
              }
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>

      {/* Inline scoped style — hide webkit scrollbar */}
      <style>{`
        .sbc-track::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}

/* ── Individual Category Pill ── */
function CategoryPill({ cat, onNavigate, shouldReduceMotion }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Shop ${cat.name}`}
      style={{
        flex: `0 0 ${CARD_W}px`,
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 10px 12px',
        borderRadius: '16px',
        border: `1px solid ${hovered ? 'var(--bb-accent)' : 'var(--bb-border)'}`,
        background: hovered
          ? 'var(--bb-surface-2, #0d1527)'
          : 'var(--bb-surface)',
        cursor: 'pointer',
        outline: 'none',
        transition: shouldReduceMotion
          ? 'none'
          : 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
        transform: hovered && !shouldReduceMotion ? 'translateY(-5px)' : 'none',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.2)'
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Image frame */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '12px',
          background: hovered
            ? 'rgba(0,0,0,0.12)'
            : 'rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'background 0.25s ease',
          flexShrink: 0,
        }}
      >
        <img
          src={getCategoryCover(cat.name, cat.imageUrl)}
          alt={cat.name}
          style={{
            width: '58px',
            height: '58px',
            objectFit: 'contain',
            transform: hovered && !shouldReduceMotion ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))',
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: hovered ? 'var(--bb-title-color)' : 'var(--bb-muted-color, var(--bb-muted))',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: '0.1px',
          transition: 'color 0.25s ease',
        }}
      >
        {cat.name}
      </span>

      {/* "Shop →" hint – appears on hover */}
      <span
        style={{
          fontSize: '0.65rem',
          fontWeight: 600,
          color: 'var(--bb-accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        Shop <ArrowRight size={9} />
      </span>
    </button>
  )
}

/* ── Arrow Navigation Button ── */
function NavBtn({ children, onClick, disabled, 'aria-label': ariaLabel }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        border: '1px solid var(--bb-border)',
        background: hovered && !disabled ? 'var(--bb-surface-2, #0d1527)' : 'var(--bb-surface)',
        color: disabled ? 'var(--bb-muted)' : 'var(--bb-title-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'background 0.2s ease, opacity 0.2s ease',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
