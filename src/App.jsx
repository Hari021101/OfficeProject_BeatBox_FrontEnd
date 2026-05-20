import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import logo from './assets/Logo.png'
import ThemeToggle from './components/ui/ThemeToggle'
import ParticleBackground from './components/ui/ParticleBackground'

export default function App() {
  return (
    <div 
      className="container-fluid min-vh-100 p-0 overflow-hidden position-relative d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: 'var(--bb-bg-navy)' }}
    >
      {/* Floating Theme Toggle */}
      <ThemeToggle />

      {/* Floating Twinkling Electric Particles in the Background */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1, opacity: 0.9 }}>
        <ParticleBackground />
      </div>

      {/* Glowing Neon Lighting backdrops */}
      <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-primary-glow)', top: '20%', left: '20%', filter: 'blur(100px)', zIndex: 2 }}></div>
      <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-accent-glow)', bottom: '20%', right: '20%', filter: 'blur(100px)', zIndex: 2 }}></div>

      {/* Centered Premium Glass Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-5 text-center shadow-lg position-relative d-flex flex-column align-items-center"
        style={{ 
          maxWidth: '480px', 
          width: '90%',
          zIndex: 10,
          background: 'var(--bb-surface)',
          borderColor: 'var(--bb-border)'
        }}
      >
        {/* Logo Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4"
        >
          <img 
            src={logo} 
            alt="BeatBox Logo" 
            className="img-fluid rounded-4 mb-3" 
            style={{ width: '120px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }} 
          />
          <h1 className="fw-black display-5 mb-0" style={{ letterSpacing: '-1.5px', color: 'var(--bb-title-color)' }}>
            BEAT<span className="gradient-text">BOX</span>
          </h1>
        </motion.div>

        {/* Core Headline Text */}
        <h2 className="fw-bold mb-3 fs-3" style={{ letterSpacing: '-0.5px', color: 'var(--bb-title-color)' }}>
          Experience <span className="gradient-text">True Sound.</span>
        </h2>

        {/* Subtitle Description */}
        <p 
          className="mb-5 small" 
          style={{ color: 'var(--bb-subtitle-color)', lineHeight: '1.6', maxWidth: '360px' }}
        >
          Your premium gateway to professional-grade studio headsets, acoustic amplifiers, and high-fidelity wireless audio gear.
        </p>

        {/* Sign In & Register Buttons */}
        <div className="d-flex flex-column gap-3 w-100">
          <Link 
            to="/login" 
            className="btn btn-glow d-flex align-items-center justify-content-center gap-2 py-3 fw-bold w-100"
            style={{ borderRadius: '12px', fontSize: '1.05rem', height: '55px' }}
          >
            Sign In <ArrowRight size={18} />
          </Link>
          
          <Link 
            to="/register" 
            className="btn d-flex align-items-center justify-content-center gap-2 py-3 fw-bold w-100 theme-toggle-btn"
            style={{ 
              borderRadius: '12px', 
              fontSize: '1.05rem', 
              height: '55px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--bb-title-color)'
            }}
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
