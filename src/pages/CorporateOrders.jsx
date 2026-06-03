import { motion } from 'framer-motion'
import { Gift, Briefcase, Users, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroHeadphones from '../assets/hero_headphones.png'
import smartEarbuds from '../assets/smart_earbuds.png'
import heroSmartwatch from '../assets/hero_smartwatch.png'
import heroSpeaker from '../assets/hero_speaker.png'

export default function CorporateOrders() {
  return (
    <div className="min-vh-100" style={{ backgroundColor: 'var(--bb-surface)', overflow: 'hidden' }}>
      
      {/* ── HERO SECTION (Light Theme) ── */}
      <div className="position-relative d-flex align-items-center" style={{ minHeight: '80vh', backgroundColor: '#f8f9fa' }}>
        <div className="container position-relative z-1">
          <div className="row align-items-center">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="col-12 col-lg-5"
            >
              <h1 className="fw-light mb-2 text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Don't Wait!
              </h1>
              <h2 className="fw-black mb-2 text-dark" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}>
                Pick a Gift
              </h2>
              <h3 className="fw-light mb-5 text-secondary" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Before they Start Complaining.
              </h3>
              
              <Link 
                to="/products"
                className="btn btn-dark rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-lg hover-scale"
                style={{ fontSize: '1.1rem' }}
              >
                Shop Corporate Gifts <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* Visual Composition */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-12 col-lg-7 position-relative mt-5 mt-lg-0"
              style={{ minHeight: '500px' }}
            >
              {/* Fake Gift Boxes Array */}
              <div className="position-absolute" style={{ bottom: '10%', right: '10%', width: '150px', height: '150px', backgroundColor: '#fff', border: '1px solid #eee', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <div className="w-100 h-100 position-relative">
                   <div style={{ position: 'absolute', top: '0', bottom: '0', left: '45%', width: '10%', backgroundColor: '#d4af37' }}></div>
                   <div style={{ position: 'absolute', left: '0', right: '0', top: '45%', height: '10%', backgroundColor: '#d4af37' }}></div>
                </div>
              </div>
              <div className="position-absolute" style={{ bottom: '20%', left: '10%', width: '200px', height: '150px', backgroundColor: '#fff', border: '1px solid #eee', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <div className="w-100 h-100 position-relative">
                   <div style={{ position: 'absolute', top: '0', bottom: '0', left: '45%', width: '10%', backgroundColor: '#d4af37' }}></div>
                   <div style={{ position: 'absolute', left: '0', right: '0', top: '45%', height: '10%', backgroundColor: '#d4af37' }}></div>
                </div>
              </div>

              {/* Floating Products */}
              <img src={heroHeadphones} className="position-absolute hero-float" style={{ top: '0%', left: '25%', width: '50%', filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.2))', zIndex: 3 }} alt="Headphones" />
              <img src={smartEarbuds} className="position-absolute" style={{ bottom: '0%', left: '30%', width: '30%', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.2))', zIndex: 4 }} alt="Earbuds" />
              <img src={heroSmartwatch} className="position-absolute hero-float" style={{ bottom: '5%', right: '25%', width: '35%', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.2))', zIndex: 5, animationDelay: '1s' }} alt="Smartwatch" />
              
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── SECONDARY HERO (Red Theme) ── */}
      <div className="position-relative py-5" style={{ background: 'linear-gradient(135deg, #cc0000 0%, #880000 100%)', color: '#fff' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="col-12 col-lg-5"
            >
              <h2 className="fw-black mb-1" style={{ fontSize: '3rem', letterSpacing: '-1px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                Thoughtful Gifts
              </h2>
              <h3 className="fw-medium mb-4" style={{ fontSize: '2rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                For Every Occasion
              </h3>
              <p className="fs-5 mb-4 opacity-75">
                Elevate your corporate gifting with premium audio gear and smart wearables. Reward your team and delight your clients.
              </p>
              <button className="btn btn-light rounded-pill px-4 py-2 fw-bold text-danger hover-scale shadow">
                Download Catalog
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-12 col-lg-7 position-relative mt-5 mt-lg-0"
              style={{ minHeight: '400px' }}
            >
               {/* Red Gift Box illusion */}
               <div className="position-absolute bottom-0 w-100" style={{ height: '120px', background: 'linear-gradient(180deg, #aa0000, #550000)', borderRadius: '10px 10px 0 0', border: '2px solid #ff3333', borderBottom: 'none', boxShadow: '0 -20px 50px rgba(0,0,0,0.5)' }}></div>
               
               {/* Bursting products */}
               <img src={heroSpeaker} className="position-absolute hero-float" style={{ bottom: '20%', right: '15%', width: '30%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))', zIndex: 4 }} alt="Speaker" />
               <img src={smartEarbuds} className="position-absolute hero-float" style={{ top: '10%', right: '40%', width: '25%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))', zIndex: 3, animationDelay: '0.5s' }} alt="Earbuds" />
               <img src={heroSmartwatch} className="position-absolute hero-float" style={{ bottom: '15%', left: '20%', width: '35%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))', zIndex: 5, animationDelay: '1.5s', transform: 'rotate(-15deg)' }} alt="Watch" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── BENEFITS ── */}
      <div className="container py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="fw-black text-theme-title">Why Choose BeatBox For Gifting?</h2>
          <p className="text-theme-muted">The ultimate corporate swag that people actually want to keep.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 rounded-4 text-center h-100" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(0,243,255,0.1)' }}>
                <Briefcase size={32} style={{ color: 'var(--bb-accent)' }} />
              </div>
              <h4 className="fw-bold text-theme-title">Bulk Discounts</h4>
              <p className="text-theme-muted mb-0">Exclusive tiered pricing for large corporate orders and festival gifting.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 text-center h-100" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(168,32,255,0.1)' }}>
                <Star size={32} style={{ color: '#a820ff' }} />
              </div>
              <h4 className="fw-bold text-theme-title">Custom Branding</h4>
              <p className="text-theme-muted mb-0">Add your company logo or personalized engravings to our premium products.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 text-center h-100" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(57,255,20,0.1)' }}>
                <Users size={32} style={{ color: '#39ff14' }} />
              </div>
              <h4 className="fw-bold text-theme-title">Dedicated Support</h4>
              <p className="text-theme-muted mb-0">A dedicated account manager to ensure smooth delivery for your entire team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
