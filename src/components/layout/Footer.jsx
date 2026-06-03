import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Mail, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  CreditCard,
  Send
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      toast.success("🎸 Welcome to the Basshead Club! Check your inbox.")
      setEmail('')
    }
  }

  return (
    <footer 
      className="position-relative overflow-hidden" 
      style={{ 
        background: 'var(--bb-surface-2)', 
        borderTop: '1px solid var(--bb-border)',
        zIndex: 5
      }}
    >
      {/* 1. TRUST BADGES / ASSURANCE ROW */}
      <div 
        className="py-4 py-md-5" 
        style={{ background: 'var(--bb-surface)', borderBottom: '1px solid var(--bb-border)' }}
      >
        <div className="container px-lg-5">
          <div className="row g-4 text-center text-md-start">
            
            <div className="col-12 col-sm-6 col-md-3">
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <div className="p-3 rounded-circle" style={{ background: 'rgba(0, 243, 255, 0.05)', color: 'var(--bb-accent)' }}>
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-theme-title">1 Year Warranty</h6>
                  <p className="small mb-0 text-theme-muted">100% Genuine product warranty support.</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <div className="p-3 rounded-circle" style={{ background: 'rgba(168, 32, 255, 0.05)', color: 'var(--bb-primary-light)' }}>
                  <RotateCcw size={28} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-theme-title">7 Days Replacement</h6>
                  <p className="small mb-0 text-theme-muted">No questions asked return policy.</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <div className="p-3 rounded-circle" style={{ background: 'rgba(0, 243, 255, 0.05)', color: 'var(--bb-accent)' }}>
                  <Truck size={28} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-theme-title">Free Express Shipping</h6>
                  <p className="small mb-0 text-theme-muted">Super fast delivery to your doorstep.</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <div className="p-3 rounded-circle" style={{ background: 'rgba(168, 32, 255, 0.05)', color: 'var(--bb-primary-light)' }}>
                  <CreditCard size={28} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-theme-title">Secure Checkout</h6>
                  <p className="small mb-0 text-theme-muted">Fully encrypted transactions.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="py-5">
        <div className="container px-lg-5">
          <div className="row g-5">
            
            {/* Column 1: Newsletter & About */}
            <div className="col-12 col-lg-4">
              <div className="mb-4">
                <h5 className="fw-black mb-3 text-theme-title">BEAT<span className="gradient-text">BOX</span></h5>
                <p className="text-theme-muted small mb-4" style={{ lineHeight: 1.7 }}>
                  Subscribe to our newsletter to receive updates on new audio drops, exclusive deals, and premium products. Join the BeatBox revolution today!
                </p>
              </div>

              {/* Newsletter subscription form */}
              <form 
                onSubmit={handleSubscribe} 
                className="position-relative w-100 mb-4 d-flex align-items-center"
                style={{ 
                  background: 'var(--bb-surface-2)',
                  border: '1px solid var(--bb-border)',
                  borderRadius: '50px',
                  padding: '5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bb-accent)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bb-border)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                <div className="ps-3 pe-2 text-theme-muted d-flex align-items-center">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="form-control bg-transparent border-0 text-theme-title shadow-none px-2" 
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ textOverflow: 'ellipsis', fontSize: '0.9rem' }}
                />
                <button 
                  type="submit" 
                  className="btn btn-glow rounded-pill px-4 d-flex align-items-center justify-content-center gap-2"
                  style={{ height: '40px' }}
                >
                  <span className="d-none d-sm-inline fw-bold small">Subscribe</span>
                  <Send size={16} />
                </button>
              </form>

              {/* Social links */}
              <div className="d-flex gap-3">
                <a href="#facebook" className="btn btn-outline-secondary p-2 rounded-circle hover-scale text-theme-muted hover-text-white border-secondary border-opacity-25" style={{ transition: 'all 0.3s', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#instagram" className="btn btn-outline-secondary p-2 rounded-circle hover-scale text-theme-muted hover-text-white border-secondary border-opacity-25" style={{ transition: 'all 0.3s', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#twitter" className="btn btn-outline-secondary p-2 rounded-circle hover-scale text-theme-muted hover-text-white border-secondary border-opacity-25" style={{ transition: 'all 0.3s', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#youtube" className="btn btn-outline-secondary p-2 rounded-circle hover-scale text-theme-muted hover-text-white border-secondary border-opacity-25" style={{ transition: 'all 0.3s', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Shop Links */}
            <div className="col-6 col-md-3 col-lg-2 ms-lg-auto">
              <h6 className="fw-bold mb-4 text-theme-title uppercase" style={{ letterSpacing: '1px' }}>Shop</h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                <li><a href="#earbuds" className="text-theme-muted text-decoration-none transition-all">True Wireless Earbuds</a></li>
                <li><a href="#headphones" className="text-theme-muted text-decoration-none transition-all">Wireless Headphones</a></li>
                <li><a href="#neckbands" className="text-theme-muted text-decoration-none transition-all">Wireless Neckbands</a></li>
                <li><a href="#speakers" className="text-theme-muted text-decoration-none transition-all">Bluetooth Speakers</a></li>
                <li><a href="#gaming" className="text-theme-muted text-decoration-none transition-all">Wired & Gaming Gear</a></li>
                <li><a href="#powerbanks" className="text-theme-muted text-decoration-none transition-all">Power Banks</a></li>
                <li><a href="#trimmers" className="text-theme-muted text-decoration-none transition-all">Trimmers</a></li>
              </ul>
            </div>

            {/* Column 3: Help & Support */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-4 text-theme-title uppercase" style={{ letterSpacing: '1px' }}>Support</h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                <li><a href="mailto:beatbox80555@gmail.com" className="text-theme-muted text-decoration-none transition-all d-flex align-items-center gap-2"><Mail size={14} /> Email Support</a></li>
                <li><a href="#track" className="text-theme-muted text-decoration-none transition-all">Track Your Order</a></li>
                <li><a href="#warranty" className="text-theme-muted text-decoration-none transition-all">Warranty Claim</a></li>
                <li><a href="#service" className="text-theme-muted text-decoration-none transition-all">Service Centers</a></li>
                <li><a href="#returns" className="text-theme-muted text-decoration-none transition-all">Return & Exchanges</a></li>
                <li><a href="#faqs" className="text-theme-muted text-decoration-none transition-all">FAQs & Guides</a></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="col-12 col-sm-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-4 text-theme-title uppercase" style={{ letterSpacing: '1px' }}>Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                <li><a href="#about" className="text-theme-muted text-decoration-none transition-all">About BeatBox</a></li>
                <li><Link to="/corporate" className="text-theme-muted text-decoration-none transition-all fw-bold text-info">Corporate Orders</Link></li>
                <li><Link to="/personalisation" className="text-theme-muted text-decoration-none transition-all fw-bold text-warning">Personalisation</Link></li>
                <li><Link to="/refer" className="text-theme-muted text-decoration-none transition-all fw-bold text-success">Refer & Earn</Link></li>
                <li><a href="#careers" className="text-theme-muted text-decoration-none transition-all">Careers</a></li>
                <li><a href="#press" className="text-theme-muted text-decoration-none transition-all">Press & News</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* 3. COPYRIGHT & PAYMENT BRANDS ROW */}
      <div 
        className="py-4" 
        style={{ 
          background: 'var(--bb-surface)', 
          borderTop: '1px solid var(--bb-border)',
          fontSize: '0.85rem'
        }}
      >
        <div className="container px-lg-5">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-center text-md-start">
            
            <div>
              <p className="mb-1 text-theme-muted">
                © {new Date().getFullYear()} BeatBox Lifestyle. All Rights Reserved.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-start small" style={{ fontSize: '0.75rem' }}>
                <a 
                  href="#privacy" 
                  className="text-theme-muted text-decoration-none" 
                  style={{ transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--bb-accent)'}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  Privacy Policy
                </a>
                <span className="text-theme-muted">•</span>
                <a 
                  href="#terms" 
                  className="text-theme-muted text-decoration-none" 
                  style={{ transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--bb-accent)'}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  Terms of Service
                </a>
                <span className="text-theme-muted">•</span>
                <a 
                  href="#sitemap" 
                  className="text-theme-muted text-decoration-none" 
                  style={{ transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--bb-accent)'}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  Sitemap
                </a>
              </div>
            </div>

            <div className="d-flex flex-column align-items-center align-items-md-end gap-2">
              <span className="small text-theme-muted" style={{ fontSize: '0.75rem' }}>Secure Payment Partners</span>
              <div className="d-flex gap-2 flex-wrap justify-content-center">
                <span className="px-2 py-1 rounded small border border-secondary border-opacity-25 text-theme-muted" style={{ background: 'var(--bb-surface-2)', fontSize: '0.65rem' }}>VISA</span>
                <span className="px-2 py-1 rounded small border border-secondary border-opacity-25 text-theme-muted" style={{ background: 'var(--bb-surface-2)', fontSize: '0.65rem' }}>MASTERCARD</span>
                <span className="px-2 py-1 rounded small border border-secondary border-opacity-25 text-theme-muted" style={{ background: 'var(--bb-surface-2)', fontSize: '0.65rem' }}>UPI</span>
                <span className="px-2 py-1 rounded small border border-secondary border-opacity-25 text-theme-muted" style={{ background: 'var(--bb-surface-2)', fontSize: '0.65rem' }}>APPLE PAY</span>
                <span className="px-2 py-1 rounded small border border-secondary border-opacity-25 text-theme-muted" style={{ background: 'var(--bb-surface-2)', fontSize: '0.65rem' }}>PAYPAL</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </footer>
  )
}
