import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, Search, ArrowUpDown, Tag } from 'lucide-react'
import { IMAGE_MAP } from '../data/products'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProducts, selectProductStatus, fetchProducts } from '../redux/productSlice'
import ProductCard from '../components/ui/ProductCard'
import { categoryService } from '../services/categoryService'

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'newest', label: 'Newest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'discount', label: 'Biggest Discount' },
]

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: '0-999', label: 'Under ₹999', min: 0, max: 999 },
  { id: '1000-1999', label: '₹1,000 – ₹1,999', min: 1000, max: 1999 },
  { id: '2000-2999', label: '₹2,000 – ₹2,999', min: 2000, max: 2999 },
  { id: '3000+', label: '₹3,000 & Above', min: 3000, max: Infinity },
]

export default function ProductListing() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSort, setActiveSort] = useState('popular')
  const [activePriceRange, setActivePriceRange] = useState('all')
  const [minRating, setMinRating] = useState(0)
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  // Performance optimizations: separated display search query and debounced query
  const [displaySearchQuery, setDisplaySearchQuery] = useState(initialQuery)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  
  // Pagination optimization: load 12 items initially and support Load More
  const [visibleCount, setVisibleCount] = useState(12)
  const [showFilters, setShowFilters] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  const dispatch = useDispatch()
  const allProducts = useSelector(selectAllProducts)
  console.log("activeCategory:", activeCategory, typeof activeCategory);

  console.table(
    allProducts.slice(0, 10).map(p => ({
      name: p.name,
      categoryId: p.categoryId,
      type: typeof p.categoryId,
      categoryName: p.categoryName
    }))
  );
  const [dbCategories, setDbCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setDbCategories(data)
      } catch (err) {
        console.error("Error loading categories in ProductListing:", err)
      }
    };
    loadCategories()
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = [
      {
        id: 'all',
        label: 'All Products',
        emoji: '🛍️',
        slug: 'all'
      }
    ]

    dbCategories.forEach(cat => {
      uniqueCategories.push({
        id: cat.id,
        label: cat.name,
        emoji: '📦',
        slug: cat.slug
      })
    })

    return uniqueCategories
  }, [dbCategories])

  const productStatus = useSelector(selectProductStatus)

  // Debounce search query updates to prevent laggy typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(displaySearchQuery)
    }, 300)
    return () => clearTimeout(handler)
  }, [displaySearchQuery])

  // Reset pagination when search query or filter options change
  useEffect(() => {
    setVisibleCount(12)
  }, [activeCategory, activeSort, activePriceRange, minRating, searchQuery, inStockOnly])

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts())
    }
  }, [productStatus, dispatch])

  // Sync URL search params with local state
  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null && q !== displaySearchQuery) {
      setDisplaySearchQuery(q)
    }

    const cat = searchParams.get('category')
    if (cat !== null && cat !== activeCategory) {
      setActiveCategory(cat)
    }
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = [...allProducts]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        (p.name?.toLowerCase() || '').includes(q) ||
        (p.category?.toLowerCase() || '').includes(q) ||
        (p.usp?.toLowerCase() || '').includes(q)
      )
    }

    // Category
    if (activeCategory && activeCategory !== 'all') {
      const activeLower = activeCategory.toLowerCase();

      // Collection / Group mappings (dynamic keyword matches)
      if (activeLower === 'signature-series') {
        list = list.filter(p => 
          /earbud|tws|headphone|earphone|neckband/i.test(p.categoryName)
        );
      } else if (activeLower === 'gaming-collection' || activeLower === 'gaming') {
        list = list.filter(p => 
          /gaming|keyboard|mouse/i.test(p.categoryName)
        );
      } else if (activeLower === 'home-audio') {
        list = list.filter(p => 
          /soundbar|home audio/i.test(p.categoryName)
        );
      } else if (activeLower === 'portable-audio' || activeLower === 'speakers' || activeLower === 'speaker') {
        list = list.filter(p => 
          /speaker|party/i.test(p.categoryName)
        );
      } else if (activeLower === 'pro-collection') {
        list = list.filter(p => 
          /watch|keyboard|mouse|gadget/i.test(p.categoryName)
        );
      } else {
        // Direct category slug or Guid ID match
        const matched = categories.find(c => c.slug === activeCategory || c.id === activeCategory);
        if (matched) {
          list = list.filter(p => p.categoryName?.toLowerCase() === matched.label?.toLowerCase());
        } else {
          // Fallback direct name/slug comparison
          list = list.filter(p => {
            const pSlug = p.categoryName?.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and') || '';
            return pSlug === activeLower || p.categoryName?.toLowerCase() === activeLower;
          });
        }
      }
    }

    // Price
    const range = PRICE_RANGES.find(r => r.id === activePriceRange)
    if (range && range.id !== 'all') list = list.filter(p => p.price >= range.min && p.price <= range.max)

    // Rating
    if (minRating > 0) list = list.filter(p => p.rating >= minRating)

    // In stock
    if (inStockOnly) list = list.filter(p => p.inStock)

    // Sort
    switch (activeSort) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break
      case 'price_desc': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'discount': list.sort((a, b) => b.discount - a.discount); break
      case 'newest': list.sort((a, b) => b.id - a.id); break
      default: list.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return list
  }, [allProducts, activeCategory, activeSort, activePriceRange, minRating, searchQuery, inStockOnly])

  const activeFilterCount = [
    activeCategory !== 'all',
    activePriceRange !== 'all',
    minRating > 0,
    inStockOnly,
  ].filter(Boolean).length

  const clearAll = useCallback(() => {
    setActiveCategory('all')
    setActivePriceRange('all')
    setMinRating(0)
    setInStockOnly(false)
    setDisplaySearchQuery('')
    setSearchQuery('')
  }, [])

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {/* Background orbs */}
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-primary-glow)', top: '5%', left: '-8%', filter: 'blur(120px)' }} />
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-accent-glow)', bottom: '10%', right: '-8%', filter: 'blur(120px)', animationDelay: '3s' }} />

      <div className="container-fluid px-3 px-lg-5 py-4">
        {/* ── PAGE HEADER ─────────────────────────── */}
        <div className="mb-5 text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span
              className="badge px-4 py-2 mb-3 text-white fw-bold"
              style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', borderRadius: 50, fontSize: '0.8rem', letterSpacing: 1 }}
            >
              🎧 COMPLETE COLLECTION
            </span>
            <h1 className="display-5 fw-black text-theme-title mb-2" style={{ letterSpacing: '-2px' }}>
              Shop <span className="gradient-text">Premium Audio</span>
            </h1>
            <p className="text-theme-muted">
              {allProducts.length} products · Free shipping above ₹999 · 1-Year warranty on all gear
            </p>
          </motion.div>
        </div>

        {/* ── SEARCH + SORT BAR ────────────────────── */}
        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3 mb-4">
          {/* Search */}
          <div className="position-relative flex-grow-1" style={{ maxWidth: 480 }}>
            <Search size={16} className="position-absolute" style={{ left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--bb-muted)', zIndex: 2 }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search headphones, earbuds, speakers..."
              value={displaySearchQuery}
              onChange={e => setDisplaySearchQuery(e.target.value)}
              style={{
                background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-text)',
                borderRadius: 50, paddingLeft: 44, paddingRight: displaySearchQuery ? 40 : 20, height: 46,
                fontSize: '0.9rem', outline: 'none'
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--bb-accent)'; e.target.style.boxShadow = '0 0 20px var(--bb-accent-glow)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--bb-border)'; e.target.style.boxShadow = 'none' }}
            />
            {displaySearchQuery && (
              <button onClick={() => { setDisplaySearchQuery(''); setSearchQuery('') }} className="btn border-0 p-0 position-absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', color: 'var(--bb-muted)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-grow-1 d-none d-md-block" />

          {/* Filters toggle (mobile) */}
          <button
            onClick={() => setShowFilters(true)}
            className="btn d-md-none d-flex align-items-center gap-2 fw-bold"
            style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)', borderRadius: 10, height: 46, padding: '0 18px' }}
          >
            <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && <span className="badge rounded-pill px-2" style={{ background: 'var(--bb-primary)', fontSize: '0.65rem' }}>{activeFilterCount}</span>}
          </button>

          {/* Sort dropdown */}
          <div className="position-relative">
            <select
              value={activeSort}
              onChange={e => setActiveSort(e.target.value)}
              className="form-select fw-semibold"
              style={{
                background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)',
                borderRadius: 10, height: 46, paddingLeft: 16, paddingRight: 36, fontSize: '0.9rem',
                appearance: 'none', cursor: 'pointer', minWidth: 200
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o.id} value={o.id} style={{ background: 'var(--bb-surface)' }}>{o.label}</option>)}
            </select>
            <ArrowUpDown size={14} className="position-absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--bb-muted)', pointerEvents: 'none' }} />
          </div>
        </div>

        <div className="row g-4">
          {/* ── SIDEBAR FILTERS (desktop) ─────────── */}
          <div className="col-12 col-md-3 d-none d-md-block">
            <FilterPanel
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activePriceRange={activePriceRange}
              setActivePriceRange={setActivePriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              activeFilterCount={activeFilterCount}
              clearAll={clearAll}
            />
          </div>

          {/* ── MOBILE FILTER DRAWER ───────────────── */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 19000 }}
                />
                <motion.div
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, background: 'var(--bb-surface)', borderRight: '1px solid var(--bb-border)', zIndex: 19001, overflowY: 'auto', padding: 24 }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-black text-theme-title fs-5">Filters</span>
                    <button onClick={() => setShowFilters(false)} className="btn border-0 p-1" style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-muted)', borderRadius: 8 }}><X size={18} /></button>
                  </div>
                  <FilterPanel
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    activePriceRange={activePriceRange}
                    setActivePriceRange={setActivePriceRange}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    activeFilterCount={activeFilterCount}
                    clearAll={clearAll}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── PRODUCT GRID ──────────────────────── */}
          <div className="col-12 col-md-9">
            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
                <span className="text-theme-muted small d-flex align-items-center gap-1"><Tag size={12} /> Active:</span>
                {activeCategory !== 'all' && (
                  <FilterPill label={categories.find(c => c.id === activeCategory)?.label} onRemove={() => setActiveCategory('all')} />
                )}
                {activePriceRange !== 'all' && (
                  <FilterPill label={PRICE_RANGES.find(r => r.id === activePriceRange)?.label} onRemove={() => setActivePriceRange('all')} />
                )}
                {minRating > 0 && (
                  <FilterPill label={`${minRating}+ Stars`} onRemove={() => setMinRating(0)} />
                )}
                {inStockOnly && <FilterPill label="In Stock" onRemove={() => setInStockOnly(false)} />}
                <button onClick={clearAll} className="btn border-0 small fw-bold" style={{ color: 'var(--bb-primary-light)', background: 'transparent', padding: '4px 8px' }}>
                  Clear all
                </button>
              </div>
            )}

            {/* Count */}
            <p className="text-theme-muted small mb-4">
              Showing <span className="text-theme-title fw-bold">{filtered.length}</span> product{filtered.length !== 1 && 's'}
            </p>

            {productStatus === 'loading' ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="col">
                    <div className="rounded-4 overflow-hidden" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', height: 400 }}>
                      <div className="skeleton-pulse w-100 h-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🎵</div>
                <h4 className="text-theme-title fw-bold">No products found</h4>
                <p className="text-theme-muted small">Try adjusting your filters or search query.</p>
                <button onClick={clearAll} className="btn btn-glow mt-3 px-4 py-2 fw-bold" style={{ borderRadius: 10 }}>Clear Filters</button>
              </div>
            ) : (
              <>
                <motion.div layout className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.slice(0, visibleCount).map((product, i) => (
                      <motion.div
                        key={product.id} layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="col"
                      >
                        <VirtualVisible height={400}>
                          <ProductCard product={product} index={i} />
                        </VirtualVisible>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {visibleCount < filtered.length && (
                  <div className="text-center mt-5">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="btn btn-glow px-5 py-3 fw-bold"
                      style={{
                        borderRadius: '50px',
                        background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 0 25px var(--bb-accent-glow)',
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 0 35px var(--bb-accent-glow), 0 0 15px var(--bb-primary-glow)'
                      }}
                      onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 0 25px var(--bb-accent-glow)'
                      }}
                    >
                      Load More Products ({filtered.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Filter Panel (reused desktop + mobile) ───────────────────────────────────
function FilterPanel({
  categories,
  activeCategory,
  setActiveCategory,
  activePriceRange,
  setActivePriceRange,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  activeFilterCount,
  clearAll
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 12);

  return (
    <div className="d-flex flex-column gap-4" style={{ position: 'sticky', top: 120 }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <span className="fw-black text-theme-title" style={{ fontSize: '1rem', letterSpacing: '-0.3px' }}>
          <SlidersHorizontal size={16} className="me-2" style={{ color: 'var(--bb-accent)' }} />
          Filters
        </span>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="btn border-0 small" style={{ color: 'var(--bb-primary-light)', background: 'transparent', padding: '2px 8px', fontSize: '0.8rem' }}>Clear all</button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="d-flex flex-column gap-1">
          {visibleCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 fw-semibold"
              style={{
                background: activeCategory === cat.id ? 'linear-gradient(90deg,rgba(168,32,255,0.2),rgba(0,243,255,0.1))' : 'transparent',
                color: activeCategory === cat.id ? 'var(--bb-accent)' : 'var(--bb-muted)',
                border: activeCategory === cat.id ? '1px solid rgba(0,243,255,0.25)' : '1px solid transparent',
                fontSize: '0.88rem', transition: 'all 0.2s'
              }}
            >
              <span>{cat.emoji} {cat.label}</span>
              {activeCategory === cat.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bb-accent)' }} />}
            </button>
          ))}
          {categories.length > 12 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="btn text-start px-3 py-2 border-0 fw-bold mt-1"
              style={{ color: 'var(--bb-primary)', fontSize: '0.85rem', background: 'rgba(0,243,255,0.05)', borderRadius: '8px' }}
            >
              {showAllCategories ? 'Show Less' : `Show More (+${categories.length - 12})`}
            </button>
          )}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="d-flex flex-column gap-1">
          {PRICE_RANGES.map(range => (
            <button
              key={range.id}
              onClick={() => setActivePriceRange(range.id)}
              className="btn text-start px-3 py-2 rounded-3 border-0 fw-semibold"
              style={{
                background: activePriceRange === range.id ? 'rgba(0,243,255,0.08)' : 'transparent',
                color: activePriceRange === range.id ? 'var(--bb-accent)' : 'var(--bb-muted)',
                border: activePriceRange === range.id ? '1px solid rgba(0,243,255,0.2)' : '1px solid transparent',
                fontSize: '0.88rem', transition: 'all 0.2s'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Min Rating */}
      <FilterSection title="Minimum Rating">
        <div className="d-flex flex-column gap-1">
          {[0, 4, 4.5, 4.7].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className="btn text-start px-3 py-2 rounded-3 border-0 fw-semibold"
              style={{
                background: minRating === r ? 'rgba(255,199,0,0.1)' : 'transparent',
                color: minRating === r ? '#ffc700' : 'var(--bb-muted)',
                border: minRating === r ? '1px solid rgba(255,199,0,0.25)' : '1px solid transparent',
                fontSize: '0.88rem', transition: 'all 0.2s'
              }}
            >
              {r === 0 ? 'All Ratings' : `⭐ ${r}+ Stars`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* In Stock */}
      <FilterSection title="Availability">
        <label className="d-flex align-items-center gap-3 px-3 py-2 rounded-3" style={{ cursor: 'pointer', border: `1px solid ${inStockOnly ? 'rgba(0,243,255,0.3)' : 'var(--bb-border)'}`, background: inStockOnly ? 'rgba(0,243,255,0.05)' : 'transparent', transition: 'all 0.2s' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            style={{ accentColor: 'var(--bb-accent)', width: 16, height: 16 }}
          />
          <span className="fw-semibold" style={{ fontSize: '0.88rem', color: inStockOnly ? 'var(--bb-accent)' : 'var(--bb-muted)' }}>In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  )
}

const FilterSection = React.memo(function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-3 p-3" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn border-0 w-100 text-start p-0 d-flex align-items-center justify-content-between mb-2"
        style={{ background: 'transparent', color: 'var(--bb-title-color)', fontWeight: 700, fontSize: '0.9rem' }}
      >
        {title}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s', color: 'var(--bb-muted)' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

function FilterPill({ label, onRemove }) {
  return (
    <span
      className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill small fw-semibold"
      style={{ background: 'rgba(0,243,255,0.1)', color: 'var(--bb-accent)', border: '1px solid rgba(0,243,255,0.2)', fontSize: '0.8rem' }}
    >
      {label}
      <button onClick={onRemove} className="btn border-0 p-0 ms-1" style={{ background: 'transparent', color: 'var(--bb-accent)', lineHeight: 1 }}><X size={11} /></button>
    </span>
  )
}

// ── Lightweight IntersectionObserver-based Viewport Virtualizer ──────────────
function VirtualVisible({ children, height = 300 }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' } // Pre-load 200px before scrolling into view
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : height, width: '100%' }}>
      {isVisible ? children : (
        <div className="rounded-4 overflow-hidden" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', height }}>
          <div className="skeleton-pulse w-100 h-100" />
        </div>
      )}
    </div>
  )
}
