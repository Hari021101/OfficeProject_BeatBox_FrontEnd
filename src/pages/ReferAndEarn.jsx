import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Share2, Gift, Coins, Copy, CheckCircle2, Sparkles, ShieldCheck, ArrowUpRight, Award } from 'lucide-react'
import { toast } from 'react-hot-toast'
import referralService from '../services/referralService'

// Import single premium studio hero banner asset
import heroBanner from '../assets/referral_hero_banner.jpg'

export default function ReferAndEarn() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    referralCode: 'BASS2026',
    referralLink: `${window.location.origin}${window.location.pathname}#/ref/BASS2026`,
    friendsInvited: 0,
    successfulReferrals: 0,
    totalRewardsEarned: 0,
    history: []
  })

  // Check Web Share API support
  const isWebShareSupported = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    async function fetchReferralInfo() {
      try {
        setLoading(true)
        const data = await referralService.getDashboard()
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to load referral dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReferralInfo()
  }, [])

  const handleCopy = async () => {
    const link = dashboardData.referralLink
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = link
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      
      setCopied(true)
      toast.success('✓ Link copied to clipboard!', {
        icon: '📋',
        style: {
          background: 'var(--bb-surface-2)',
          color: 'var(--bb-text)',
          border: '1px solid var(--bb-accent)'
        }
      })
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      toast.error('Failed to copy link.')
    }
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! Get ₹500 off your first purchase at BeatBox audio. Use my link: ${dashboardData.referralLink}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleNativeShare = async () => {
    if (isWebShareSupported) {
      try {
        await navigator.share({
          title: 'BeatBox Referral Code',
          text: 'Get ₹500 OFF your first order at BeatBox!',
          url: dashboardData.referralLink,
        })
      } catch (err) {
        // User cancelled share or error
      }
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'rewardcredited':
      case 'credited':
        return <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-semibold">Reward Credited</span>
      case 'qualified':
        return <span className="badge rounded-pill bg-info-subtle text-info border border-info-subtle px-3 py-2 fw-semibold">Qualified</span>
      case 'pending':
        return <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 fw-semibold">Pending</span>
      case 'expired':
        return <span className="badge rounded-pill bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 fw-semibold">Expired</span>
      default:
        return <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-semibold">{status}</span>
    }
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: 'var(--bb-bg-navy)', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Subtle Background Glow Orbs */}
      <div className="position-absolute" style={{ top: '-5%', left: '-10%', width: '500px', height: '500px', background: 'var(--bb-primary-glow)', filter: 'blur(160px)', opacity: 0.35, zIndex: 0, pointerEvents: 'none' }}></div>
      <div className="position-absolute" style={{ top: '40%', right: '-10%', width: '500px', height: '500px', background: 'var(--bb-accent-glow)', filter: 'blur(160px)', opacity: 0.3, zIndex: 0, pointerEvents: 'none' }}></div>

      <div className="container position-relative z-1 py-5">
        
        {/* 1. HERO SECTION */}
        <div className="row align-items-center g-5 py-3">
          
          {/* Left Column: Title & Link Action Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="col-12 col-lg-6"
          >
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(0, 243, 255, 0.1)', border: '1px solid rgba(0, 243, 255, 0.3)', color: 'var(--bb-accent)' }}>
              <Coins size={16} />
              <span className="fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>BEATBOX REWARDS</span>
            </div>
            
            <h1 className="fw-black text-theme-title mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', letterSpacing: '-1px', lineHeight: 1.1 }}>
              Refer & Earn
            </h1>
            
            <p className="fs-5 text-theme-muted mb-4" style={{ maxWidth: '540px' }}>
              Share BeatBox with your friends. They get a special discount, and you earn BeatBox rewards when they complete their first purchase.
            </p>
            
            {/* 3 Simple Benefit Cards */}
            <div className="row g-3 mb-4">
              <div className="col-4">
                <div className="p-3 rounded-4 h-100 text-center" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                  <div className="fw-black text-theme-title fs-4" style={{ color: 'var(--bb-accent)' }}>₹500 OFF</div>
                  <div className="text-theme-muted extra-small mt-1" style={{ fontSize: '0.75rem' }}>Friend's first order</div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-4 h-100 text-center" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                  <div className="fw-black text-theme-title fs-4" style={{ color: '#a820ff' }}>₹500 REWARD</div>
                  <div className="text-theme-muted extra-small mt-1" style={{ fontSize: '0.75rem' }}>You earn on purchase</div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-4 h-100 text-center" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                  <div className="fw-black text-theme-title fs-5 mt-1" style={{ color: '#39ff14' }}>EASY SHARING</div>
                  <div className="text-theme-muted extra-small mt-1" style={{ fontSize: '0.75rem' }}>Share link anywhere</div>
                </div>
              </div>
            </div>

            {/* Compact Referral Link Box with SINGLE Copy Action */}
            <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', boxShadow: '0 10px 30px var(--bb-shadow)' }}>
              <label className="fw-bold text-theme-title mb-2 d-block">Your Referral Link</label>
              <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
                <input 
                  type="text" 
                  value={dashboardData.referralLink} 
                  readOnly 
                  className="form-control fw-semibold" 
                  style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)', fontSize: '0.95rem' }}
                />
                <button 
                  onClick={handleCopy}
                  className={`btn ${copied ? 'btn-success' : 'btn-glow'} fw-bold px-4 py-2 text-nowrap d-flex align-items-center justify-content-center`}
                  style={{ minWidth: '130px', transition: 'all 0.3s ease' }}
                >
                  {copied ? (
                    <><CheckCircle2 size={18} className="me-2" /> COPIED</>
                  ) : (
                    <><Copy size={18} className="me-2" /> COPY LINK</>
                  )}
                </button>
              </div>
            </div>

            {/* Sharing Buttons: WhatsApp + Optional Native Web Share (NO Duplicate Copy Button) */}
            <div className="d-flex flex-wrap gap-2">
              <button 
                onClick={handleWhatsAppShare}
                className="btn rounded-pill px-4 py-2.5 fw-bold text-white d-flex align-items-center gap-2 shadow-sm" 
                style={{ backgroundColor: '#25D366', border: 'none' }}
              >
                <Share2 size={18} /> WhatsApp
              </button>

              {isWebShareSupported && (
                <button 
                  onClick={handleNativeShare}
                  className="btn btn-outline-secondary rounded-pill px-4 py-2.5 fw-bold text-theme-title d-flex align-items-center gap-2"
                  style={{ borderColor: 'var(--bb-border)' }}
                >
                  <ArrowUpRight size={18} /> More
                </button>
              )}
            </div>

          </motion.div>

          {/* Right Column: ONE Clean Studio Photography Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="col-12 col-lg-6 text-center"
          >
            <div className="position-relative d-inline-block w-100">
              <div 
                className="rounded-4 overflow-hidden position-relative"
                style={{ 
                  border: '1px solid var(--bb-border)', 
                  boxShadow: '0 20px 40px var(--bb-shadow)',
                  background: 'var(--bb-surface)'
                }}
              >
                <img 
                  src={heroBanner} 
                  alt="BeatBox Premium Studio Audio Lineup" 
                  className="img-fluid w-100 d-block"
                  style={{ objectFit: 'cover', maxHeight: '420px' }}
                />

                {/* Subtle Overlay Overlay Badges */}
                <div 
                  className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
                >
                  <span className="badge rounded-pill px-3 py-2 fw-semibold text-white d-flex align-items-center gap-1.5" style={{ background: 'rgba(0, 243, 255, 0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0, 243, 255, 0.4)' }}>
                    <Award size={14} className="text-info" /> Friend Gets ₹500
                  </span>
                  <span className="badge rounded-pill px-3 py-2 fw-semibold text-white d-flex align-items-center gap-1.5" style={{ background: 'rgba(168, 32, 255, 0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(168, 32, 255, 0.4)' }}>
                    <Gift size={14} style={{ color: '#a820ff' }} /> You Earn ₹500
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 2. HOW IT WORKS SECTION */}
        <div className="my-5 pt-5 border-top" style={{ borderColor: 'var(--bb-border)' }}>
          <div className="text-center mb-5">
            <h2 className="fw-black text-theme-title mb-2">How It Works</h2>
            <p className="text-theme-muted fs-6">3 simple steps to start earning store rewards</p>
          </div>

          <div className="row g-4 text-center">
            
            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 h-100 position-relative" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3" style={{ background: 'rgba(0,243,255,0.1)', color: 'var(--bb-accent)' }}>
                  <Share2 size={28} />
                </div>
                <h5 className="fw-bold text-theme-title mb-2">01 — Share</h5>
                <p className="text-theme-muted small mb-0">Copy your unique BeatBox referral link and share it with friends via WhatsApp, social media, or email.</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 h-100 position-relative" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3" style={{ background: 'rgba(168,32,255,0.1)', color: '#a820ff' }}>
                  <Gift size={28} />
                </div>
                <h5 className="fw-bold text-theme-title mb-2">02 — Friend Shops</h5>
                <p className="text-theme-muted small mb-0">Your friend signs up using your link and receives ₹500 OFF their very first qualifying BeatBox order.</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 h-100 position-relative" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3" style={{ background: 'rgba(57,255,20,0.1)', color: '#39ff14' }}>
                  <Coins size={28} />
                </div>
                <h5 className="fw-bold text-theme-title mb-2">03 — Earn</h5>
                <p className="text-theme-muted small mb-0">Once their qualifying order is confirmed, you automatically receive ₹500 in BeatBox reward credit.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. REFERRAL DASHBOARD & HISTORY */}
        <div className="my-5 pt-4">
          <h2 className="fw-black text-theme-title mb-4 text-center text-md-start">Your Referral Progress</h2>

          {/* Stats Bar */}
          <div className="row g-4 mb-4">
            
            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <span className="text-theme-muted fw-semibold small d-block mb-1">Friends Invited</span>
                <div className="fw-black fs-2 text-theme-title">{dashboardData.friendsInvited}</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <span className="text-theme-muted fw-semibold small d-block mb-1">Successful Referrals</span>
                <div className="fw-black fs-2 text-info">{dashboardData.successfulReferrals}</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <span className="text-theme-muted fw-semibold small d-block mb-1">Rewards Earned</span>
                <div className="fw-black fs-2 text-success">₹{dashboardData.totalRewardsEarned?.toLocaleString('en-IN')}</div>
              </div>
            </div>

          </div>

          {/* Referral History Table */}
          <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
            <h5 className="fw-bold text-theme-title mb-3">Referral History</h5>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-info" role="status"></div>
                <div className="text-theme-muted small mt-2">Loading referral records...</div>
              </div>
            ) : dashboardData.history && dashboardData.history.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle text-theme-title mb-0" style={{ backgroundColor: 'transparent' }}>
                  <thead>
                    <tr style={{ borderColor: 'var(--bb-border)', color: 'var(--bb-text-muted)', fontSize: '0.85rem' }}>
                      <th className="fw-bold py-3">FRIEND</th>
                      <th className="fw-bold py-3">STATUS</th>
                      <th className="fw-bold py-3 text-end">REWARD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.history.map((item) => (
                      <tr key={item.id} style={{ borderColor: 'var(--bb-border)' }}>
                        <td className="fw-semibold py-3">{item.friendName}</td>
                        <td className="py-3">{getStatusBadge(item.status)}</td>
                        <td className="fw-bold py-3 text-end text-success">₹{item.rewardAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-theme-muted">
                <Sparkles className="mb-2 text-secondary" size={32} />
                <h6>No referrals yet</h6>
                <p className="small mb-0">Share your link above to invite your friends and earn rewards!</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. TERMS & CONDITIONS */}
        <div className="my-5 pt-4">
          <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
            <h5 className="fw-bold text-theme-title mb-3 d-flex align-items-center gap-2">
              <ShieldCheck size={20} className="text-info" /> Referral Terms & Conditions
            </h5>
            
            <ul className="text-theme-muted small mb-0 lh-lg" style={{ paddingLeft: '1.2rem' }}>
              <li>Reward applies only to qualifying first orders placed by new eligible customers.</li>
              <li>Self-referrals (referring yourself using alternate accounts) are strictly prohibited and will be disqualified.</li>
              <li>Cancelled, failed, or refunded orders do not qualify for referral rewards.</li>
              <li>Rewards are credited to your BeatBox balance after the qualifying order is confirmed.</li>
              <li>One referral discount and reward per eligible customer.</li>
              <li>BeatBox reserves the right to review, reject, or cancel fraudulent or duplicate referral attempts.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
