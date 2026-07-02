import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles, Volume2, Percent, Flame } from 'lucide-react'

const PROMO_CARDS = [
  {
    id: 'summer_sale',
    type: 'Seasonal Offer',
    title: 'Summer Sale',
    description: 'Dive into sun-soaked savings. Upgrade your audio setup for the season.',
    link: '/products?sale=true',
    iconName: 'Flame',
    bg: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)',
    shadow: 'rgba(255, 78, 80, 0.2)',
    badgeBg: '#ffffff',
    badgeText: '#ff4e50',
    btnBg: '#ffffff',
    btnText: '#ff4e50',
    particleClass: 'promo-banner-summer'
  },
  {
    id: 'best_sellers',
    type: 'Popular Pick',
    title: 'Best Sellers',
    description: 'Discover our most-loved audio gear, chosen by music enthusiasts.',
    link: '/products?sort=bestseller',
    iconName: 'Sparkles',
    bg: 'linear-gradient(135deg, #00f3ff 0%, #a820ff 100%)',
    shadow: 'rgba(0, 243, 255, 0.2)',
    badgeBg: '#111111',
    badgeText: 'var(--bb-accent)',
    btnBg: '#111111',
    btnText: '#00f3ff',
    border: '1px solid rgba(0, 243, 255, 0.3)'
  },
  {
    id: 'new_launches',
    type: 'Fresh Release',
    title: 'New Launches',
    description: 'Be the first to experience the latest innovations in audio technology.',
    link: '/products?tag=new',
    iconName: 'Volume2',
    bg: '#060b19',
    border: '1px solid var(--bb-border)',
    shadow: 'rgba(0,0,0,0.3)',
    badgeBg: 'rgba(0, 243, 255, 0.1)',
    badgeText: 'var(--bb-accent)',
    btnBg: 'rgba(0, 243, 255, 0.15)',
    btnText: '#ffffff',
    hasWave: true
  },
  {
    id: 'gaming_collection',
    type: 'Pro Gaming',
    title: 'Gaming Collection',
    description: 'Level up with zero latency, spatial tracking, and crystal-clear comms.',
    link: '/products?category=gaming-collection',
    iconName: 'Sparkles',
    bg: 'linear-gradient(135deg, #09090e 0%, #15102a 100%)',
    border: '1px solid var(--bb-border)',
    shadow: 'rgba(168, 32, 255, 0.15)',
    badgeBg: 'rgba(168, 32, 255, 0.1)',
    badgeText: 'var(--bb-primary-light)',
    btnBg: 'transparent',
    btnText: 'var(--bb-accent)',
    hasParticles: true
  },
  {
    id: 'audio_collection',
    type: 'Premium Sound',
    title: 'Audio Collection',
    description: 'Studio-grade headphones, soundbars, and speakers for audiophiles.',
    link: '/products?category=signature-series',
    iconName: 'Volume2',
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    shadow: 'rgba(17, 153, 142, 0.2)',
    badgeBg: '#ffffff',
    badgeText: '#11998e',
    btnBg: '#ffffff',
    btnText: '#11998e'
  }
]

export default function PromotionalBanners({ products = [] }) {
  const shouldReduceMotion = useReducedMotion()
  const navigate = useNavigate()

  const visibleBanners = useMemo(() => {
    if (!products || products.length === 0) return []

    return PROMO_CARDS.filter(card => {
      const urlParams = new URLSearchParams(card.link.split('?')[1] || '')
      const categoryParam = urlParams.get('category')

      if (categoryParam) {
        const activeLower = categoryParam.toLowerCase();
        let matchedProducts = [];

        if (activeLower === 'signature-series') {
          matchedProducts = products.filter(p => 
            /earbud|tws|headphone|earphone|neckband/i.test(p.categoryName)
          );
        } else if (activeLower === 'gaming-collection' || activeLower === 'gaming') {
          matchedProducts = products.filter(p => 
            /gaming|keyboard|mouse/i.test(p.categoryName)
          );
        } else if (activeLower === 'home-audio') {
          matchedProducts = products.filter(p => 
            /soundbar|home audio/i.test(p.categoryName)
          );
        } else if (activeLower === 'portable-audio' || activeLower === 'speakers' || activeLower === 'speaker') {
          matchedProducts = products.filter(p => 
            /speaker|party/i.test(p.categoryName)
          );
        } else if (activeLower === 'pro-collection') {
          matchedProducts = products.filter(p => 
            /watch|keyboard|mouse|gadget/i.test(p.categoryName)
          );
        } else {
          matchedProducts = products.filter(p => {
            const pSlug = p.categoryName?.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and') || '';
            return pSlug === activeLower || p.categoryName?.toLowerCase() === activeLower;
          });
        }

        if (matchedProducts.length === 0) return false
      }

      return true
    })
  }, [products])

  const renderIcon = (iconName, colorClass) => {
    switch (iconName) {
      case 'Flame':
        return <Flame size={12} className={`me-1 align-text-top ${colorClass}`} fill="currentColor" />
      case 'Percent':
        return <Percent size={12} className={`me-1 align-text-top ${colorClass}`} />
      case 'Volume2':
        return <Volume2 size={12} className={`me-1 align-text-top ${colorClass}`} />
      case 'Sparkles':
      default:
        return <Sparkles size={12} className={`me-1 align-text-top ${colorClass}`} />
    }
  }

  return (
    <section className="py-5 storefront-section position-relative overflow-hidden" id="promo-banners">
      <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-primary-glow)', bottom: '-10%', left: '10%', filter: 'blur(120px)', opacity: 0.1 }}></div>

      <div className="container px-lg-5 position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5">
          <h3 className="fw-black text-theme-title mb-2">
            Exclusive <span className="gradient-text font-black">Deals & Launches</span>
          </h3>
          <p className="text-theme-muted small">Special pricing and limited releases you won't find anywhere else.</p>
        </div>

        <div className="row g-4 justify-content-center">
          {visibleBanners.map((card, idx) => (
            <div key={card.id} className="col-12 col-lg-6">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.015, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 90, damping: 14, delay: idx * 0.05 }}
                onClick={() => navigate(card.link)}
                className={`p-5 rounded-4 d-flex flex-column justify-content-between position-relative overflow-hidden ${card.particleClass || ''}`}
                style={{
                  minHeight: '280px',
                  height: '100%',
                  background: card.bg,
                  border: card.border || 'none',
                  color: '#ffffff',
                  boxShadow: `0 12px 30px ${card.shadow}`,
                  cursor: 'pointer'
                }}
              >
                {/* Custom Particles for specific cards */}
                {card.id === 'summer_sale' && (
                  <>
                    <div className="banner-particle" style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', top: '10%', left: '70%', filter: 'blur(20px)', animation: 'floatParticle 6s ease-in-out infinite' }} />
                    <div className="banner-particle" style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.15)', bottom: '5%', left: '20%', filter: 'blur(30px)', animation: 'floatParticle 8s ease-in-out infinite reverse' }} />
                  </>
                )}

                {card.id === 'best_sellers' && (
                  <>
                    <div className="position-absolute" style={{ width: 220, height: 220, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%', right: '-40px', top: '-40px' }} />
                    <div className="position-absolute" style={{ width: 140, height: 140, border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '50%', right: '20px', bottom: '-20px' }} />
                  </>
                )}

                {card.hasWave && (
                  <div className="position-absolute d-flex align-items-end gap-1" style={{ bottom: 20, right: 30, opacity: 0.25, height: 100 }}>
                    {[60, 90, 40, 110, 70, 100, 50, 80].map((h, i) => (
                      <div
                        key={i}
                        className="audio-wave-bar"
                        style={{
                          width: 5,
                          height: h,
                          background: 'linear-gradient(to top, var(--bb-primary), var(--bb-accent))',
                          borderRadius: 10,
                          animation: `waveBar 1.2s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                )}

                {card.hasParticles && (
                  <>
                    <div className="position-absolute rounded-circle" style={{ width: 140, height: 140, background: 'radial-gradient(circle, var(--bb-primary-glow) 0%, transparent 70%)', top: '10%', right: '10%', filter: 'blur(15px)', animation: 'floatParticle 12s linear infinite' }} />
                    <div className="position-absolute rounded-circle" style={{ width: 100, height: 100, background: 'radial-gradient(circle, var(--bb-accent-glow) 0%, transparent 70%)', bottom: '15%', right: '35%', filter: 'blur(10px)', animation: 'floatParticle 8s linear infinite reverse' }} />
                  </>
                )}

                <div className="position-relative z-2">
                  <span className="badge px-3 py-1.5 fw-black text-uppercase mb-3" style={{ fontSize: '0.65rem', borderRadius: 20, background: card.badgeBg, color: card.badgeText, border: card.border ? '1px solid rgba(0, 243, 255, 0.3)' : 'none' }}>
                    {renderIcon(card.iconName, '')}
                    {card.type}
                  </span>
                  <h3 className="display-6 fw-black mb-2" style={{ letterSpacing: '-1px' }}>{card.title}</h3>
                  <p className="mb-0 fw-medium opacity-90" style={{ maxWidth: '360px', fontSize: '0.95rem', color: '#ffffff' }}>
                    {card.description}
                  </p>
                </div>

                <div className="position-relative z-2 mt-4">
                  <button className="btn fw-black px-4 py-2.5 rounded-pill d-flex align-items-center gap-2 banner-cta-pulse" 
                    style={{ 
                      background: card.btnBg, 
                      color: card.btnText, 
                      border: card.border || 'none', 
                      fontSize: '0.85rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    Shop Now <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes waveBar {
          0% { height: 15px; }
          100% { height: 95px; }
        }
        .banner-cta-pulse:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </section>
  )
}
