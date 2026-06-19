import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { productService } from '../../services/productService';
import { getCategoryCover } from '../../utils/categoryImageHelper';

export default function ExploreBestsellers() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await productService.fetchCategories();
        
        // Prioritize specific categories from request, secondary sorting by product count
        const priorities = [
          "tws",
          "wireless headphones",
          "portable speakers",
          "soundbars",
          "mobile accessories",
          "computer accessories",
          "car accessories",
          "smart gadgets"
        ];
        
        const mapped = data.map(c => {
          const idx = priorities.indexOf(c.name.trim().toLowerCase());
          return {
            ...c,
            priorityIndex: idx !== -1 ? idx : 999
          };
        });

        // Sort: Priorities first, then product count descending
        const sorted = mapped.sort((a, b) => {
          if (a.priorityIndex !== b.priorityIndex) {
            return a.priorityIndex - b.priorityIndex;
          }
          return b.productCount - a.productCount;
        });

        // Select top 8 categories
        setCategories(sorted.slice(0, 8));
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  // Framer Motion Spring settings as requested
  const springTransition = useMemo(() => ({
    type: "spring",
    stiffness: 120,
    damping: 12
  }), []);

  // Render Skeleton cards during loading
  if (loading) {
    return (
      <section className="py-5 storefront-section position-relative overflow-hidden">
        <div className="container px-lg-5">
          <div className="text-center mb-5">
            <div className="skeleton-pulse mx-auto rounded" style={{ width: '220px', height: '36px', background: 'var(--bb-surface-2)' }}></div>
            <div className="skeleton-pulse mx-auto mt-2 rounded" style={{ width: '310px', height: '20px', background: 'var(--bb-surface-2)' }}></div>
          </div>
          <div className="row g-4 row-cols-2 row-cols-lg-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="col">
                <div className="rounded-4" style={{ height: '300px', background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                  <div className="skeleton-pulse w-100 h-50 rounded-top" style={{ background: 'var(--bb-surface-2)' }}></div>
                  <div className="p-3">
                    <div className="skeleton-pulse rounded mb-2" style={{ width: '60%', height: '20px', background: 'var(--bb-surface-2)' }}></div>
                    <div className="skeleton-pulse rounded" style={{ width: '40%', height: '14px', background: 'var(--bb-surface-2)' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hide section gracefully on fetch error
  if (error || !categories || categories.length === 0) {
    return null;
  }

  console.log("Categories API:", categories);

  return (
    <section className="py-5 storefront-section position-relative overflow-hidden" id="explore-bestsellers" aria-labelledby="section-bestsellers-title">
      {/* Floating Particles in Background */}
      <FloatingBackgroundParticles />

      <div className="container px-lg-5 position-relative" style={{ zIndex: 1 }}>
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="d-inline-block position-relative">
            {/* Gradient Reveal and Shimmer Title */}
            <motion.h2
              id="section-bestsellers-title"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={springTransition}
              className="display-5 fw-black mb-1 tracking-tight text-center text-uppercase"
              style={{
                background: 'linear-gradient(90deg, #ffffff 0%, var(--bb-accent) 50%, var(--bb-primary-light) 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'textShimmer 6s linear infinite'
              }}
            >
              Explore Bestsellers ⭐
            </motion.h2>

            {/* Glowing line under heading */}
            <motion.div
              initial={shouldReduceMotion ? { width: '120px' } : { width: 0 }}
              whileInView={shouldReduceMotion ? {} : { width: '120px' }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="glow-underline mx-auto mt-2"
            />
          </div>
          
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="text-theme-muted mt-3 mb-0"
          >
            Discover our most loved categories
          </motion.p>
        </div>

        {/* Categories Grid (Desktop & Tablet) */}
        <div className="d-none d-md-flex row g-4 row-cols-md-2 row-cols-lg-4 justify-content-center">
          {categories.map((category, index) => (
            <div key={category.id} className="col">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...springTransition, delay: shouldReduceMotion ? 0 : index * 0.08 }}
              >
                <CategoryCard category={category} springTransition={springTransition} shouldReduceMotion={shouldReduceMotion} navigate={navigate} />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Categories Swipe Carousel (Mobile Layout) */}
        <div className="d-block d-md-none position-relative">
          <div className="mobile-carousel-container">
            <div className="mobile-carousel">
              {categories.map((category, index) => (
                <div key={category.id} className="mobile-card-wrapper">
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ ...springTransition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <CategoryCard category={category} springTransition={springTransition} shouldReduceMotion={shouldReduceMotion} navigate={navigate} />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-3 text-theme-muted small opacity-50">
            Swipe left/right to browse categories
          </div>
        </div>

      </div>

      {/* Styled styles local to this premium section to avoid leaking */}
      <style>{`
        @keyframes textShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .glow-underline {
          height: 4px;
          background: linear-gradient(90deg, var(--bb-primary), var(--bb-accent));
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.7);
          border-radius: 4px;
        }

        /* Continuous subtle gradient border rotation keyframe */
        @keyframes borderSweep {
          0% { border-color: rgba(168, 32, 255, 0.2); }
          50% { border-color: rgba(0, 243, 255, 0.4); }
          100% { border-color: rgba(168, 32, 255, 0.2); }
        }

        /* Mobile Swipe Styles */
        .mobile-carousel-container {
          overflow: hidden;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          padding: 10px 24px;
        }
        .mobile-carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          gap: 16px;
          padding-bottom: 12px;
          scrollbar-width: none;
        }
        .mobile-carousel::-webkit-scrollbar {
          display: none;
        }
        .mobile-card-wrapper {
          flex: 0 0 78vw;
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
}

/**
 * Individual Category Card with Micro-animations
 */
function CategoryCard({ category, springTransition, shouldReduceMotion, navigate }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse Parallax movement
  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // Normalized -1 to 1
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // Normalized -1 to 1
    setMousePos({ x: x * 10, y: y * 10 }); // Max offset ±10px
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/products?category=${encodeURIComponent(category.name)}`);
    }
  };

  const resolvedCover = useMemo(() => getCategoryCover(category.name, category.imageUrl), [category.name, category.imageUrl]);

  return (
    <div
      className="position-relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background glowing blurred circles behind cards */}
      <motion.div
        animate={shouldReduceMotion ? {} : {
          scale: isHovered ? 1.25 : 1,
          opacity: isHovered ? 0.35 : 0.15
        }}
        transition={springTransition}
        className="position-absolute rounded-circle"
        style={{
          width: '180px',
          height: '180px',
          background: `radial-gradient(circle, ${category.priorityIndex % 2 === 0 ? 'rgba(0,243,255,0.7)' : 'rgba(168,32,255,0.7)'} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          top: '15%',
          left: '15%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Main Card Container */}
      <div
        onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Explore category ${category.name}, ${category.productCount} products available`}
        className="premium-category-card"
        style={{
          display: 'block',
          position: 'relative',
          background: 'rgba(6, 11, 25, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 243, 255, 0.12)',
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isHovered 
            ? '0 15px 35px rgba(0, 243, 255, 0.18), 0 0 15px rgba(168, 32, 255, 0.15)' 
            : '0 10px 30px rgba(0, 0, 0, 0.4)',
          transform: isHovered && !shouldReduceMotion ? 'translateY(-12px) scale(1.03)' : 'translateY(0px) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease, border-color 0.4s ease',
          animation: 'borderSweep 8s linear infinite',
          zIndex: 1
        }}
      >
        {/* Shine sweep pseudo-element on hover */}
        <div className={`shine-sweep-element ${isHovered ? 'active' : ''}`} />

        {/* Visual Frame */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '190px' }}>
          <motion.img
            loading="lazy"
            animate={shouldReduceMotion ? {} : {
              x: mousePos.x,
              y: mousePos.y,
              scale: isHovered ? 1.12 : 1
            }}
            transition={springTransition}
            src={resolvedCover}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              willChange: 'transform'
            }}
          />
        </div>

        {/* Footer Details */}
        <div className="p-3" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(1, 3, 8, 0.8) 100%)' }}>
          <h4 className="fw-bold mb-1 text-theme-title" style={{ fontSize: '1.05rem', letterSpacing: '-0.3px', textTransform: 'capitalize' }}>
            {category.name}
          </h4>
          
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-theme-muted small fw-semibold">
              {category.productCount} Product{category.productCount !== 1 ? 's' : ''}
            </span>
            
            {/* Explore Button */}
            <span 
              className="d-flex align-items-center gap-1 text-accent font-black tracking-wide small" 
              style={{
                color: 'var(--bb-accent)', 
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase'
              }}
            >
              Explore 
              <motion.span
                animate={shouldReduceMotion ? {} : { x: isHovered ? 6 : 0 }}
                transition={springTransition}
                className="d-inline-block"
              >
                <ArrowRight size={14} />
              </motion.span>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        /* Focus state outline */
        .premium-category-card:focus-visible {
          border-color: var(--bb-accent) !important;
          box-shadow: 0 0 0 3px rgba(0, 243, 255, 0.4) !important;
        }

        /* Shine Sweep CSS */
        .shine-sweep-element {
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%);
          transform: skewX(-25deg);
          pointer-events: none;
          z-index: 2;
          transition: none;
        }
        .shine-sweep-element.active {
          left: 150%;
          transition: left 0.75s ease-out;
        }
      `}</style>
    </div>
  );
}

/**
 * Renders 12 slowly moving background particles with blur effects for premium atmosphere.
 */
function FloatingBackgroundParticles() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
      {[...Array(12)].map((_, i) => {
        // Deterministic properties based on index
        const size = 6 + (i * 4) % 18; // Size between 6px and 24px
        const left = (i * 8.5) % 100; // Left offset percentage
        const top = (i * 7.7) % 100; // Top offset percentage
        const duration = 12 + (i * 3) % 15; // Animation duration 12s - 27s
        const color = i % 2 === 0 ? 'var(--bb-accent-glow)' : 'var(--bb-primary-glow)';

        return (
          <div
            key={i}
            className="position-absolute rounded-circle floating-orb-particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              left: `${left}%`,
              top: `${top}%`,
              opacity: 0.18,
              filter: 'blur(3px)',
              animation: `floatUpSmooth ${duration}s linear infinite`,
              animationDelay: `${i * -1.5}s`
            }}
          />
        );
      })}
      
      <style>{`
        @keyframes floatUpSmooth {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-120px) translateX(25px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
