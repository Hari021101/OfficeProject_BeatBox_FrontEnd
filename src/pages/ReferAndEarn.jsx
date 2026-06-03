import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Share2, Gift, Coins, ArrowRight, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import heroSmartwatch from '../assets/hero_smartwatch.png'

export default function ReferAndEarn() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://beatbox.com/ref/BASS2026"

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied to clipboard!', { style: { background: '#0a0d14', color: '#fff', border: '1px solid rgba(0,243,255,0.3)' } })
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: 'var(--bb-bg-navy)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Orbs */}
      <div className="position-absolute" style={{ top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--bb-primary-glow)', filter: 'blur(150px)', opacity: 0.6, zIndex: 0 }}></div>
      <div className="position-absolute" style={{ bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--bb-accent-glow)', filter: 'blur(150px)', opacity: 0.5, zIndex: 0 }}></div>

      <div className="container position-relative z-1 py-5 min-vh-100 d-flex flex-column justify-content-center">
        <div className="row align-items-center g-5">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="col-12 col-lg-6"
          >
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4" style={{ background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)', color: 'var(--bb-accent)' }}>
              <Coins size={16} />
              <span className="fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>BEATBOX REWARDS</span>
            </div>
            
            <h1 className="fw-black mb-3 text-theme-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1px' }}>
              Refer Friends. <br />
              <span className="gradient-text">Earn Big.</span>
            </h1>
            
            <p className="fs-5 mb-5 text-theme-muted" style={{ maxWidth: '500px' }}>
              Give your friends ₹500 off their first purchase. When they buy, you get ₹500 in BeatBox store credit. It's a win-win!
            </p>
            
            {/* Referral Link Box */}
            <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <p className="fw-bold text-theme-title mb-2">Your Unique Referral Link</p>
              <div className="d-flex align-items-center gap-2">
                <input 
                  type="text" 
                  value={referralLink} 
                  readOnly 
                  className="form-control fw-medium" 
                  style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }}
                />
                <button 
                  onClick={handleCopy}
                  className="btn btn-glow d-flex align-items-center justify-content-center px-4"
                  style={{ minWidth: '120px' }}
                >
                  {copied ? 'Copied!' : <><Copy size={16} className="me-2" /> Copy</>}
                </button>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button className="btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" style={{ background: '#25D366', color: '#fff' }}>
                <Share2 size={18} /> Share on WhatsApp
              </button>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-12 col-lg-6 position-relative text-center"
          >
            <div className="position-relative d-inline-block">
              {/* Decorative elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="position-absolute" 
                style={{ top: '10%', right: '-10%', background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', padding: '10px 20px', borderRadius: '12px', zIndex: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
              >
                <span className="fw-black text-success">You Get ₹500</span>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="position-absolute" 
                style={{ bottom: '20%', left: '-10%', background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', padding: '10px 20px', borderRadius: '12px', zIndex: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
              >
                <span className="fw-black text-info">They Get ₹500</span>
              </motion.div>

              <img 
                src={heroSmartwatch} 
                alt="Rewards" 
                className="img-fluid position-relative" 
                style={{ filter: 'drop-shadow(0 30px 40px rgba(0,243,255,0.2))', zIndex: 2, maxWidth: '80%' }} 
              />
            </div>
          </motion.div>
        </div>

        {/* How it works */}
        <div className="mt-5 pt-5 text-center border-top" style={{ borderColor: 'var(--bb-border) !important' }}>
          <h3 className="fw-black text-theme-title mb-5">How It Works</h3>
          <div className="row justify-content-center g-4">
            <div className="col-md-4">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                <Share2 size={24} style={{ color: 'var(--bb-accent)' }} />
              </div>
              <h5 className="fw-bold text-theme-title">1. Share Your Link</h5>
              <p className="text-theme-muted small">Send your unique referral link to your friends via WhatsApp, Email, or Social Media.</p>
            </div>
            <div className="col-md-4">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                <Gift size={24} style={{ color: '#a820ff' }} />
              </div>
              <h5 className="fw-bold text-theme-title">2. They Get a Discount</h5>
              <p className="text-theme-muted small">Your friends get an instant ₹500 discount applied to their very first BeatBox purchase.</p>
            </div>
            <div className="col-md-4">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                <Coins size={24} style={{ color: '#39ff14' }} />
              </div>
              <h5 className="fw-bold text-theme-title">3. You Earn Rewards</h5>
              <p className="text-theme-muted small">Once their order is delivered, ₹500 is credited to your BeatBox wallet automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
