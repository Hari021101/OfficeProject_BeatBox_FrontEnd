import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function PremiumCategoryShowcase({ categories, products = [], loading }) {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const filteredCategories = useMemo(() => {
    if (!categories || categories.length === 0 || !products || products.length === 0) {
      return []
    }
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
  }, [categories, products])

  const { featuredCategory, mediumCategories, smallCategories } = useMemo(() => {
    if (filteredCategories.length === 0) {
      return { featuredCategory: null, mediumCategories: [], smallCategories: [] }
    }
    return {
      featuredCategory: filteredCategories[0],
      mediumCategories: filteredCategories.slice(1, 3),
      smallCategories: filteredCategories.slice(3, 6)
    }
  }, [filteredCategories])

  if (loading || !featuredCategory) {
    return (
      <section className="py-5" style={{ backgroundColor: 'var(--bb-background)' }}>
        <div className="container px-lg-5">
          <div className="text-center mb-5">
            <div className="skeleton-pulse mx-auto rounded" style={{ width: '220px', height: '36px', background: 'var(--bb-surface-2)' }}></div>
          </div>
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="skeleton-pulse rounded-4" style={{ height: '480px', background: 'var(--bb-surface-2)', borderRadius: '18px', border: '1px solid var(--bb-border-light)' }}></div>
            </div>
            <div className="col-12 col-lg-6 d-flex flex-column gap-4">
              <div className="skeleton-pulse rounded-4" style={{ height: '228px', background: 'var(--bb-surface-2)', borderRadius: '18px', border: '1px solid var(--bb-border-light)' }}></div>
              <div className="skeleton-pulse rounded-4" style={{ height: '228px', background: 'var(--bb-surface-2)', borderRadius: '18px', border: '1px solid var(--bb-border-light)' }}></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--bb-background)' }} id="category-showcase">
      <div className="container px-lg-5">
        <div className="text-center mb-5">
          <h3 className="fw-black text-theme-title mb-2">
            Shop By <span style={{ color: 'var(--bb-primary, #7C3AED)' }}>Category</span>
          </h3>
          <p className="text-muted small">Explore premium audio systems engineered for high fidelity sound.</p>
        </div>

        {/* Top Section: 1 Large Left, 2 Medium Right */}
        <div className="row g-4 mb-4 align-items-stretch">
          {/* Large category (Left) */}
          <div className="col-12 col-lg-6">
            <ShowcaseCard 
              category={featuredCategory} 
              type="large" 
              navigate={navigate} 
              shouldReduceMotion={shouldReduceMotion} 
            />
          </div>

          {/* Two medium categories (Right) */}
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column gap-4 h-100 justify-content-between">
              {mediumCategories.map(cat => (
                <div key={cat.id} className="flex-grow-1" style={{ height: 'calc(50% - 12px)', minHeight: '228px' }}>
                  <ShowcaseCard 
                    category={cat} 
                    type="medium" 
                    navigate={navigate} 
                    shouldReduceMotion={shouldReduceMotion} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: 3 Small Categories */}
        {smallCategories.length > 0 && (
          <div className="row g-4">
            {smallCategories.map(cat => (
              <div key={cat.id} className="col-12 col-md-4">
                <ShowcaseCard 
                  category={cat} 
                  type="small" 
                  navigate={navigate} 
                  shouldReduceMotion={shouldReduceMotion} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ShowcaseCard({ category, type, navigate, shouldReduceMotion }) {
  const [isHovered, setIsHovered] = React.useState(false)

  const cardHeight = type === 'large' ? '480px' : type === 'medium' ? '100%' : '180px'
  const imageMaxHeight = type === 'large' ? '220px' : type === 'medium' ? '140px' : '90px'
  const isMedium = type === 'medium'

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={shouldReduceMotion ? {} : { y: -6, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
      className="p-4 d-flex rounded-4 position-relative"
      style={{
        height: cardHeight,
        minHeight: type === 'medium' ? '228px' : 'auto',
        backgroundColor: 'var(--bb-surface-2)',
        borderRadius: '18px',
        border: '1px solid var(--bb-border-light)',
        boxShadow: isHovered 
          ? '0 12px 24px var(--bb-shadow)' 
          : '0 4px 12px var(--bb-shadow)',
        cursor: 'pointer',
        overflow: 'hidden',
        flexDirection: isMedium ? 'row' : 'column',
        justifyContent: 'space-between',
        alignItems: isMedium ? 'center' : 'stretch',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
      }}
    >
      {/* Content Side */}
      <div 
        className="d-flex flex-column justify-content-between h-100"
        style={{ zIndex: 2, maxWidth: isMedium ? '55%' : '100%', width: isMedium ? 'auto' : '100%' }}
      >
        <div>
          <h4 
            className="fw-bold text-theme-title text-capitalize mb-1" 
            style={{ fontSize: type === 'large' ? '1.75rem' : '1.25rem', letterSpacing: '-0.5px' }}
          >
            {category.name}
          </h4>
          <p className="text-muted small mb-0">
            {category.productCount} Products
          </p>
        </div>

        {/* Explore Button */}
        <div className="pt-3">
          <button 
            className="btn d-flex align-items-center justify-content-center fw-bold"
            style={{
              padding: '8px 16px',
              borderRadius: '50px',
              border: '1px solid var(--bb-border-light)',
              backgroundColor: isHovered ? 'var(--bb-primary)' : 'var(--bb-surface-2)',
              color: isHovered ? '#FFFFFF' : 'var(--bb-primary)',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease',
              gap: '6px'
            }}
          >
            Explore <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Image Side */}
      <div 
        className="d-flex align-items-center justify-content-center"
        style={{ 
          height: isMedium ? '100%' : '55%', 
          maxHeight: isMedium ? '100%' : '260px',
          width: isMedium ? '40%' : '100%',
          overflow: 'hidden', 
          zIndex: 1,
          marginTop: isMedium ? '0' : '16px',
          marginBottom: isMedium ? '0' : '8px'
        }}
      >
        <img
          src={category.coverImage}
          alt={category.name}
          style={{
            maxHeight: imageMaxHeight,
            maxWidth: '100%',
            objectFit: 'contain',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
    </motion.div>
  )
}
