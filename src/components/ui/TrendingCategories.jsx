import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

export default function TrendingCategories({ categories, products = [], loading }) {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const trendingList = useMemo(() => {
    if (!categories || categories.length === 0 || !products || products.length === 0) return []
    
    return categories
      .map(cat => {
        const catProds = products.filter(p =>
          (p.categoryName && p.categoryName.toLowerCase() === cat.name.toLowerCase()) ||
          (p.category && p.category.toLowerCase() === cat.name.toLowerCase())
        )
        if (catProds.length === 0) return null

        const sortedProds = [...catProds].sort((a, b) => b.soldCount - a.soldCount)
        const topProduct = sortedProds[0]

        return {
          ...cat,
          coverImage: topProduct.imageUrl,
          productCount: catProds.length
        }
      })
      .filter(Boolean)
      .slice(0, 5) // Show top 5 categories
  }, [categories, products])

  if (loading) {
    return (
      <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container px-lg-5">
          <div className="text-center mb-5">
            <div className="skeleton-pulse mx-auto rounded" style={{ width: '240px', height: '36px', background: '#E2E8F0' }}></div>
            <div className="skeleton-pulse mx-auto mt-2 rounded" style={{ width: '320px', height: '18px', background: '#E2E8F0' }}></div>
          </div>
          <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-5 justify-content-center">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="col">
                <div className="rounded-4 p-4 d-flex flex-column align-items-center justify-content-center gap-3" style={{ height: '260px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px' }}>
                  <div className="skeleton-pulse rounded" style={{ width: '100px', height: '100px', background: '#E2E8F0' }}></div>
                  <div className="skeleton-pulse rounded" style={{ width: '80px', height: '18px', background: '#E2E8F0' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (trendingList.length === 0) return null

  return (
    <section className="py-5" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }} id="trending-categories">
      <div className="container px-lg-5 position-relative">
        <div className="text-center mb-5">
          <h3 className="fw-black text-dark mb-2">
            Trending <span style={{ color: 'var(--bb-primary, #7C3AED)' }}>Categories</span>
          </h3>
          <p className="text-muted small">Explore the hottest category gear buzzing right now.</p>
        </div>

        {/* Desktop & Tablet grid */}
        <div className="d-none d-md-flex row g-4 row-cols-md-3 row-cols-lg-5 justify-content-center">
          {trendingList.map((cat, idx) => (
            <div key={cat.id} className="col">
              <TrendingCard category={cat} index={idx} navigate={navigate} shouldReduceMotion={shouldReduceMotion} />
            </div>
          ))}
        </div>

        {/* Mobile snap carousel */}
        <div className="d-block d-md-none position-relative">
          <div className="mobile-carousel-container" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            <div className="mobile-carousel" style={{ display: 'flex', gap: '16px', paddingBottom: '12px' }}>
              {trendingList.map((cat, idx) => (
                <div key={cat.id} className="mobile-card-wrapper" style={{ flex: '0 0 68vw', scrollSnapAlign: 'center' }}>
                  <TrendingCard category={cat} index={idx} navigate={navigate} shouldReduceMotion={shouldReduceMotion} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrendingCard({ category, index, navigate, shouldReduceMotion }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={shouldReduceMotion ? {} : { y: -6, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
      className="p-3 d-flex flex-column align-items-center justify-content-between text-center"
      style={{
        height: '260px',
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        boxShadow: isHovered 
          ? '0 12px 24px rgba(0, 0, 0, 0.08)' 
          : '0 4px 12px rgba(0, 0, 0, 0.03)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      {/* Category Image Frame - covers 65% of card height */}
      <div 
        className="d-flex align-items-center justify-content-center w-100" 
        style={{ height: '65%', overflow: 'hidden' }}
      >
        <img
          src={category.coverImage}
          alt={category.name}
          style={{
            maxHeight: '100%',
            maxWidth: '90%',
            objectFit: 'contain',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* Category Text Details */}
      <div className="pt-2">
        <h6 
          className="fw-bold text-dark mb-1 text-capitalize"
          style={{ fontSize: '0.95rem' }}
        >
          {category.name}
        </h6>
        <span className="text-muted small" style={{ fontSize: '0.8rem' }}>
          {category.productCount} Items
        </span>
      </div>
    </motion.div>
  )
}
