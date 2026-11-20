import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react'
import logo from '../assets/Logo.png'
import ParticleBackground from '../components/ui/ParticleBackground'
import ThemeToggle from '../components/ui/ThemeToggle'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

// --- 6-digit OTP input component ---
function OtpInput({ onComplete, disabled }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const refs = useRef([])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
    if (next.every(d => d !== '')) onComplete(next.join(''))
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const next = pasted.split('')
      setDigits(next)
      refs.current[5]?.focus()
      onComplete(pasted)
    }
  }

  return (
    <div className="d-flex gap-2 justify-content-center my-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="form-control text-center fw-black"
          style={{
            width: 48,
            height: 56,
            fontSize: '1.5rem',
            background: 'var(--bb-surface, #0d1117)',
            border: `2px solid ${d ? 'var(--bb-accent, #00f3ff)' : 'var(--bb-border, rgba(255,255,255,0.1))'}`,
            color: 'var(--bb-accent, #00f3ff)',
            borderRadius: 12,
            caretColor: 'var(--bb-accent, #00f3ff)',
            boxShadow: d ? '0 0 12px rgba(0,243,255,0.25)' : 'none',
            transition: 'all 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  
  // State
  const [step, setStep] = useState(1) // 1 = identifier, 2 = otp + new password, 3 = success
  const [identifierMode, setIdentifierMode] = useState('email') // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('')
  const [userId, setUserId] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Resend Countdown
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [step, countdown])

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!identifier.trim()) {
      toast.error('Please enter your email or phone number.')
      return
    }

    setIsLoading(true)
    try {
      const data = await authService.forgotPassword(identifier.trim())
      setUserId(data.userId)
      toast.success(data.message || 'Verification code sent!')
      setStep(2)
      setCountdown(60)
      setCanResend(false)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to send verification code. Please check your input.'
      toast.error(typeof msg === 'string' ? msg : 'Error sending verification code.')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    if (!canResend || isLoading) return
    setIsLoading(true)
    try {
      const data = await authService.forgotPassword(identifier.trim())
      toast.success('A fresh verification code has been dispatched!')
      setCountdown(60)
      setCanResend(false)
    } catch (err) {
      toast.error('Unable to resend code at this moment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (otpCode.length < 6) {
      toast.error('Please enter the full 6-digit verification code.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const data = await authService.resetPassword(userId, otpCode, newPassword)
      toast.success(data.message || 'Password reset successfully! 🎉')
      setStep(3)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to reset password. Please verify the code.'
      toast.error(typeof msg === 'string' ? msg : 'Failed to reset password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container-fluid min-vh-100 p-0 overflow-hidden" style={{ backgroundColor: 'var(--bb-bg-navy, #060b19)' }}>
      <ThemeToggle />

      <div className="row g-0 min-vh-100">
        {/* LEFT SIDE: Branding */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative login-split-bg">
          <ParticleBackground />
          <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-primary, #a820ff)', top: '10%', left: '10%' }} />
          <div className="bg-glow-orb" style={{ width: '500px', height: '500px', background: 'var(--bb-accent, #00f3ff)', bottom: '-10%', right: '-10%', animationDelay: '2s' }} />
          <div className="text-center position-relative" style={{ zIndex: 2 }}>
            <img src={logo} alt="BeatBox" style={{ width: '140px', borderRadius: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} className="mb-4" />
            <h1 className="fw-black text-white display-5 mb-3" style={{ letterSpacing: '-1px' }}>
              Account <br /><span className="gradient-text">Recovery.</span>
            </h1>
            <p className="text-white-50 fs-6 mx-auto" style={{ maxWidth: '380px' }}>
              Quickly recover access to your BeatBox wishlist, orders, and premium audio collection.
            </p>
          </div>
          <div className="position-absolute top-0 end-0 h-100 w-100"
            style={{ borderRight: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.4))' }} />
        </div>

        {/* RIGHT SIDE: Recovery Form */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center position-relative p-4">
          <div className="d-lg-none position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
            <ParticleBackground />
            <div className="bg-glow-orb" style={{ width: '300px', height: '300px', background: 'var(--bb-primary, #a820ff)', top: '10%', left: '10%' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-100 login-card-container position-relative"
            style={{ maxWidth: '460px', zIndex: 2 }}
          >
            {/* Back to Login link */}
            <Link
              to="/login"
              className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none fw-semibold"
              style={{ color: 'var(--bb-accent, #00f3ff)', fontSize: '0.9rem' }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>

            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.15), rgba(168, 32, 255, 0.2))',
                  border: '1px solid rgba(0, 243, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)'
                }}
              >
                {step === 3 ? (
                  <CheckCircle size={32} color="#00f3ff" />
                ) : step === 2 ? (
                  <ShieldCheck size={32} color="#00f3ff" />
                ) : (
                  <KeyRound size={32} color="#00f3ff" />
                )}
              </div>
              <h2 className="fw-black mb-1" style={{ color: 'var(--bb-title-color, #fff)' }}>
                {step === 3 ? 'Password Updated!' : step === 2 ? 'Verify & Reset' : 'Forgot Password?'}
              </h2>
              <p className="small mb-0" style={{ color: 'var(--bb-subtitle-color, #94a3b8)' }}>
                {step === 3
                  ? 'Your password has been reset. Redirecting to login...'
                  : step === 2
                  ? `Enter the 6-digit code sent to ${identifier}`
                  : 'Enter your registered email address or phone number to receive an OTP.'}
              </p>
            </div>

            {/* STEP 1: Enter Identifier */}
            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                {/* Mode Selector */}
                <div
                  className="d-flex rounded-3 p-1 mb-4"
                  style={{ background: 'var(--bb-surface-2, rgba(255,255,255,0.05))', border: '1px solid var(--bb-border, rgba(255,255,255,0.1))' }}
                >
                  <button
                    type="button"
                    className="btn flex-fill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      background: identifierMode === 'email' ? 'var(--bb-accent, #00f3ff)' : 'transparent',
                      color: identifierMode === 'email' ? '#000' : 'var(--bb-muted, #94a3b8)',
                      transition: 'all 0.2s ease',
                      border: 'none',
                    }}
                    onClick={() => {
                      setIdentifierMode('email')
                      setIdentifier('')
                    }}
                  >
                    <Mail size={16} /> Email
                  </button>
                  <button
                    type="button"
                    className="btn flex-fill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      background: identifierMode === 'phone' ? 'var(--bb-accent, #00f3ff)' : 'transparent',
                      color: identifierMode === 'phone' ? '#000' : 'var(--bb-muted, #94a3b8)',
                      transition: 'all 0.2s ease',
                      border: 'none',
                    }}
                    onClick={() => {
                      setIdentifierMode('phone')
                      setIdentifier('')
                    }}
                  >
                    <Phone size={16} /> Phone
                  </button>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--bb-label-color, #cbd5e1)' }}>
                    {identifierMode === 'email' ? 'Registered Email Address' : 'Registered Phone Number'}
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-muted, #94a3b8)',
                      }}
                    >
                      {identifierMode === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                    </span>
                    <input
                      type={identifierMode === 'email' ? 'email' : 'tel'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={identifierMode === 'email' ? 'name@example.com' : '9876543210'}
                      required
                      className="form-control"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-input-text, #fff)',
                        height: '50px',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-glow w-100 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    height: '52px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Dispatching Code...
                    </>
                  ) : (
                    <>
                      Send Verification Code <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP & Set New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword}>
                <div className="text-center mb-3">
                  <span className="small fw-semibold" style={{ color: 'var(--bb-label-color, #cbd5e1)' }}>
                    Enter 6-Digit Code
                  </span>
                  <OtpInput onComplete={setOtpCode} disabled={isLoading} />
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--bb-label-color, #cbd5e1)' }}>
                    New Password
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-muted, #94a3b8)',
                      }}
                    >
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="form-control"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-input-text, #fff)',
                        height: '48px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="input-group-text btn-outline-secondary"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-muted, #94a3b8)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--bb-label-color, #cbd5e1)' }}>
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-muted, #94a3b8)',
                      }}
                    >
                      <Lock size={18} />
                    </span>
                    <input
                      type={showConfirmPwd ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      className="form-control"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-input-text, #fff)',
                        height: '48px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      className="input-group-text btn-outline-secondary"
                      style={{
                        background: 'var(--bb-input-bg, rgba(255,255,255,0.04))',
                        borderColor: 'var(--bb-input-border, rgba(255,255,255,0.1))',
                        color: 'var(--bb-muted, #94a3b8)',
                        cursor: 'pointer',
                      }}
                    >
                      {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="btn btn-glow w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                  style={{
                    height: '52px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password <CheckCircle size={18} />
                    </>
                  )}
                </button>

                {/* Resend & Change options */}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-link p-0 text-decoration-none small"
                    style={{ color: 'var(--bb-muted, #94a3b8)' }}
                  >
                    Change Email / Phone
                  </button>

                  <button
                    type="button"
                    disabled={!canResend || isLoading}
                    onClick={handleResend}
                    className="btn btn-link p-0 text-decoration-none small d-flex align-items-center gap-1"
                    style={{
                      color: canResend ? 'var(--bb-accent, #00f3ff)' : 'var(--bb-muted, #64748b)',
                      cursor: canResend ? 'pointer' : 'default',
                    }}
                  >
                    <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
                    {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Success Screen */}
            {step === 3 && (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-info mb-3"
                  role="status"
                  style={{ width: '2.5rem', height: '2.5rem' }}
                >
                  <span className="visually-hidden">Redirecting...</span>
                </div>
                <p className="text-white-50 small">Taking you to the login screen...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

