import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react'
import logo from '../assets/Logo.png'
import ParticleBackground from '../components/ui/ParticleBackground'
import ThemeToggle from '../components/ui/ThemeToggle'
import { registerUser, resetState, setOtpStep, setAuthFromOtp } from '../redux/authSlice'
import { otpService } from '../services/otpService'
import { toast } from 'react-hot-toast'

// ─── 6-digit OTP input component ─────────────────────────────────────────────
function OtpInput({ onComplete }) {
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
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="form-control text-center fw-black"
          style={{
            width: 52, height: 60,
            fontSize: '1.6rem',
            background: 'var(--bb-surface)',
            border: `2px solid ${d ? 'var(--bb-accent)' : 'var(--bb-border)'}`,
            color: 'var(--bb-accent)',
            borderRadius: 12,
            caretColor: 'var(--bb-accent)',
            boxShadow: d ? '0 0 12px rgba(0,243,255,0.2)' : 'none',
            transition: 'all 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ step }) {
  const steps = [
    { id: 1, label: 'Details' },
    { id: 2, label: 'Email OTP' },
    { id: 3, label: 'Phone OTP' },
  ]
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
      {steps.map((s, i) => (
        <div key={s.id} className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
            style={{
              width: 32, height: 32, fontSize: '0.8rem',
              background: step >= s.id ? 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))' : 'var(--bb-surface)',
              border: `2px solid ${step >= s.id ? 'transparent' : 'var(--bb-border)'}`,
              color: step >= s.id ? '#fff' : 'var(--bb-muted)',
              transition: 'all 0.3s ease',
            }}
          >
            {step > s.id ? <CheckCircle size={14} /> : s.id}
          </div>
          <span style={{ fontSize: '0.7rem', color: step >= s.id ? 'var(--bb-accent)' : 'var(--bb-muted)', fontWeight: 600 }}>
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div style={{ width: 20, height: 2, background: step > s.id ? 'var(--bb-accent)' : 'var(--bb-border)', margin: '0 2px' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, message, otpStep, pendingUserId, pendingEmail } = useSelector(s => s.auth)

  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' })
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [step, setStep] = useState(1) // 1=form, 2=email OTP, 3=phone OTP

  // Sync step with redux otpStep
  useEffect(() => {
    if (otpStep === 'email') setStep(2)
    if (otpStep === 'phone') setStep(3)
  }, [otpStep])

  // Error toast
  useEffect(() => {
    if (isError) {
      toast.error(typeof message === 'string' ? message : 'Registration failed.')
      dispatch(resetState())
    }
  }, [isError, message, dispatch])

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  // ── Step 1: Submit registration form ─────────────────────────────────────
  const handleSubmit = e => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }
    dispatch(registerUser({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
    }))
    setResendTimer(30)
  }

  // ── Step 2: Verify email OTP ──────────────────────────────────────────────
  const handleEmailOtp = async (code) => {
    try {
      setOtpLoading(true)
      await otpService.verifyEmailOtp(pendingUserId, code)
      toast.success('Email verified! Now verify your phone number.')
      // Send phone OTP
      await otpService.sendPhoneOtp(pendingUserId, formData.phoneNumber)
      dispatch(setOtpStep('phone'))
      setResendTimer(30)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // ── Step 3: Verify phone OTP → get JWT ───────────────────────────────────
  const handlePhoneOtp = async (code) => {
    try {
      setOtpLoading(true)
      const data = await otpService.verifyPhoneOtp(pendingUserId, code)
      // Store JWT and set auth state
      dispatch(setAuthFromOtp({ fullName: data.fullName, email: data.email, token: data.token }))
      toast.success('🎉 Account verified! Welcome to BeatBox.')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      if (step === 2) {
        await otpService.sendEmailOtp(pendingUserId)
        toast.success('Email OTP resent!')
      } else {
        await otpService.sendPhoneOtp(pendingUserId, formData.phoneNumber)
        toast.success('Phone OTP resent!')
      }
      setResendTimer(30)
    } catch {
      toast.error('Failed to resend OTP.')
    }
  }

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  }

  return (
    <div className="container-fluid min-vh-100 p-0 overflow-hidden" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      <ThemeToggle />

      <div className="row g-0 min-vh-100">

        {/* LEFT SIDE: Branding */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative login-split-bg">
          <ParticleBackground />
          <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-primary)', top: '10%', left: '10%' }} />
          <div className="bg-glow-orb" style={{ width: '500px', height: '500px', background: 'var(--bb-accent)', bottom: '-10%', right: '-10%', animationDelay: '2s' }} />
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="text-center position-relative" style={{ zIndex: 2 }}>
            <img src={logo} alt="BeatBox" style={{ width: '150px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} className="mb-5" />
            <h1 className="fw-black text-white display-4 mb-3" style={{ letterSpacing: '-1px' }}>
              Join the <br /><span className="gradient-text">Community.</span>
            </h1>
            <p className="text-white-50 fs-5 mx-auto" style={{ maxWidth: '400px' }}>
              Unlock exclusive access to premium gear, limited drops, and our global audiophile community.
            </p>
          </motion.div>
          <div className="position-absolute top-0 end-0 h-100 w-100" style={{ borderRight: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.4))' }} />
        </div>

        {/* RIGHT SIDE: Form / OTP */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center position-relative">
          <div className="d-lg-none position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
            <ParticleBackground />
            <div className="bg-glow-orb" style={{ width: '300px', height: '300px', background: 'var(--bb-primary)', top: '10%', left: '10%' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 p-md-5 w-100" style={{ maxWidth: '480px', zIndex: 1 }}
          >
            {/* Step dots */}
            <StepDots step={step} />

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Registration Form ─────────────────────────────────── */}
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <div className="mb-4">
                    <h2 className="fw-black mb-2" style={{ fontSize: '2.2rem', letterSpacing: '-1px', color: 'var(--bb-title-color)' }}>
                      Create <span className="gradient-text">Account</span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--bb-subtitle-color)' }}>Sign up to start your journey with BeatBox.</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="mb-3 input-group-custom position-relative">
                      <User size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                      <input type="text" name="fullName" className="form-control bb-input w-100"
                        placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    {/* Email */}
                    <div className="mb-3 input-group-custom position-relative">
                      <Mail size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                      <input type="email" name="email" className="form-control bb-input w-100"
                        placeholder="Email address" value={formData.email} onChange={handleChange} required />
                    </div>
                    {/* Phone */}
                    <div className="mb-3 input-group-custom position-relative">
                      <Phone size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                      <input type="tel" name="phoneNumber" className="form-control bb-input w-100"
                        placeholder="Phone Number (e.g. 9876543210)" value={formData.phoneNumber}
                        onChange={handleChange} required maxLength={15} />
                    </div>
                    {/* Password */}
                    <div className="mb-3 input-group-custom position-relative">
                      <Lock size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                      <input type={showPwd ? 'text' : 'password'} name="password" className="form-control bb-input w-100"
                        placeholder="Password" value={formData.password} onChange={handleChange} required />
                      <button type="button" className="btn icon position-absolute top-50 translate-middle-y end-0 border-0 px-3" onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {/* Confirm Password */}
                    <div className="mb-4 input-group-custom position-relative">
                      <Lock size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                      <input type={showConfirmPwd ? 'text' : 'password'} name="confirmPassword" className="form-control bb-input w-100"
                        placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                      <button type="button" className="btn icon position-absolute top-50 translate-middle-y end-0 border-0 px-3" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                        {showConfirmPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <button type="submit" disabled={isLoading}
                      className="btn btn-glow w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                      style={{ height: '55px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '12px' }}>
                      {isLoading
                        ? <><span className="spinner-border spinner-border-sm me-2" />Creating Account...</>
                        : <>Create Account <ArrowRight size={20} /></>}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="mb-0" style={{ color: 'var(--bb-footer-color)' }}>
                      Already have an account?{' '}
                      <Link to="/login" style={{ color: 'var(--bb-link-color)', textDecoration: 'none' }} className="fw-bold ms-1">Sign In</Link>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Email OTP ─────────────────────────────────────────── */}
              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                      style={{ width: 72, height: 72, background: 'linear-gradient(135deg,rgba(0,243,255,0.15),rgba(168,32,255,0.1))', border: '2px solid rgba(0,243,255,0.3)' }}>
                      <Mail size={32} style={{ color: 'var(--bb-accent)' }} />
                    </div>
                    <h3 className="fw-black text-theme-title mb-2">Verify <span className="gradient-text">Email</span></h3>
                    <p className="text-theme-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      We sent a 6-digit code to<br />
                      <strong style={{ color: 'var(--bb-accent)' }}>{pendingEmail || formData.email}</strong>
                    </p>
                    <p className="text-theme-muted mt-1" style={{ fontSize: '0.75rem' }}>
                      💡 Check the backend console if DevMode is on
                    </p>
                  </div>

                  {otpLoading
                    ? <div className="text-center py-3"><span className="spinner-border" style={{ color: 'var(--bb-accent)' }} /></div>
                    : <OtpInput onComplete={handleEmailOtp} key={`email-otp-${step}`} />
                  }

                  <div className="text-center mt-3">
                    <button onClick={handleResend} disabled={resendTimer > 0}
                      className="btn border-0 p-0 d-flex align-items-center gap-1 mx-auto"
                      style={{ color: resendTimer > 0 ? 'var(--bb-muted)' : 'var(--bb-accent)', fontSize: '0.85rem', background: 'transparent' }}>
                      <RefreshCw size={14} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Phone OTP ─────────────────────────────────────────── */}
              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                      style={{ width: 72, height: 72, background: 'linear-gradient(135deg,rgba(57,255,20,0.12),rgba(0,243,255,0.08))', border: '2px solid rgba(57,255,20,0.3)' }}>
                      <Phone size={32} style={{ color: '#39ff14' }} />
                    </div>
                    <h3 className="fw-black text-theme-title mb-2">Verify <span className="gradient-text">Phone</span></h3>
                    <p className="text-theme-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      We sent a 6-digit code to<br />
                      <strong style={{ color: '#39ff14' }}>{formData.phoneNumber}</strong>
                    </p>
                    <p className="text-theme-muted mt-1" style={{ fontSize: '0.75rem' }}>
                      💡 Check the backend console (phone OTP is in DevMode)
                    </p>
                  </div>

                  <div className="p-3 rounded-3 mb-3 d-flex align-items-center gap-2"
                    style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
                    <ShieldCheck size={18} style={{ color: '#39ff14', flexShrink: 0 }} />
                    <p className="mb-0 text-theme-muted" style={{ fontSize: '0.78rem' }}>
                      Email verified ✓ &nbsp;— One more step to secure your account!
                    </p>
                  </div>

                  {otpLoading
                    ? <div className="text-center py-3"><span className="spinner-border" style={{ color: '#39ff14' }} /></div>
                    : <OtpInput onComplete={handlePhoneOtp} key={`phone-otp-${step}`} />
                  }

                  <div className="text-center mt-3">
                    <button onClick={handleResend} disabled={resendTimer > 0}
                      className="btn border-0 p-0 d-flex align-items-center gap-1 mx-auto"
                      style={{ color: resendTimer > 0 ? 'var(--bb-muted)' : '#39ff14', fontSize: '0.85rem', background: 'transparent' }}>
                      <RefreshCw size={14} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  )
}