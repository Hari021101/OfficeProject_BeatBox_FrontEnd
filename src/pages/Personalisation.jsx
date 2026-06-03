import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Wand2, Edit3, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroEarbuds from '../assets/hero_earbuds.png'

export default function Personalisation() {
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#000', color: '#fff', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background glow effects */}
      <div className="position-absolute" style={{ top: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>

      <div className="container position-relative z-1 py-5 min-vh-100 d-flex flex-column justify-content-center">
        <div className="row align-items-center g-5">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="col-12 col-lg-6"
          >
            <h1 className="fw-medium mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1px', color: '#e0e0e0' }}>
              IT'S MORE THAN A GIFT,
            </h1>
            <h2 className="fw-black mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1px' }}>
              It's An <span style={{ color: '#fff' }}>Experience</span>
            </h2>
            <p className="fs-4 mb-5" style={{ color: '#aaa', fontWeight: 500, maxWidth: '500px' }}>
              Add A Personal Touch With Custom Engraving
            </p>
            
            <Link 
              to="/products"
              className="btn rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 hover-scale"
              style={{ 
                background: 'rgba(255,255,255,0.15)', 
                color: '#fff', 
                border: '2px solid #fff',
                fontSize: '1.2rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#fff';
              }}
            >
              Explore Now <ArrowRight size={20} />
            </Link>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-12 col-lg-6 position-relative"
          >
            <div className="position-relative d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
              {/* Turntable / Stand illusion */}
              <div className="position-absolute bottom-0" style={{ width: '80%', height: '20px', background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(5px)' }}></div>
              <div className="position-absolute bottom-0 mb-3" style={{ width: '60%', height: '4px', background: '#333', borderRadius: '50%', borderTop: '1px solid #555' }}></div>
              
              {/* Main Product Image Mockup */}
              <div className="position-relative" style={{ zIndex: 2 }}>
                <img 
                  src={heroEarbuds} 
                  alt="Custom Engraved Earbuds" 
                  className="img-fluid" 
                  style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.8)) grayscale(20%)', transform: 'scale(1.2)' }} 
                />
                
                {/* Engraving text overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="position-absolute w-100 text-center"
                  style={{ top: '65%', left: '0', transform: 'translateY(-50%)' }}
                >
                  <span className="fw-black text-uppercase" style={{ fontSize: '1.5rem', letterSpacing: '4px', color: '#111', textShadow: '0px 1px 1px rgba(255,255,255,0.3)' }}>
                    RANVEER
                  </span>
                </motion.div>
                
                {/* Laser tool illusion */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="position-absolute d-flex align-items-center"
                  style={{ right: '-10%', top: '65%', transform: 'translateY(-50%)' }}
                >
                  <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #ff0000, transparent)', filter: 'blur(1px)' }}></div>
                  <Edit3 size={24} color="#555" style={{ transform: 'rotate(-45deg)' }} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features section below */}
        <div className="row g-4 mt-5 pt-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
          <div className="col-md-4 text-center">
            <Wand2 size={32} className="mb-3 text-info" />
            <h4 className="fw-bold mb-2">Make It Yours</h4>
            <p className="text-secondary">Engrave your name, an important date, or a special message directly onto the case.</p>
          </div>
          <div className="col-md-4 text-center">
            <Sparkles size={32} className="mb-3 text-warning" />
            <h4 className="fw-bold mb-2">Premium Finish</h4>
            <p className="text-secondary">High-precision laser etching ensures a permanent, elegant finish that lasts a lifetime.</p>
          </div>
          <div className="col-md-4 text-center">
            <Gift size={32} className="mb-3 text-danger" />
            <h4 className="fw-bold mb-2">The Perfect Gift</h4>
            <p className="text-secondary">Surprise your loved ones with a bespoke audio experience they'll cherish forever.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
