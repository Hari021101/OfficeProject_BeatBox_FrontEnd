import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Phone } from 'lucide-react'
import logo from '../assets/Logo.png'
import ParticleBackground from '../components/ui/ParticleBackground'
import ThemeToggle from '../components/ui/ThemeToggle'
import { loginUser, resetState } from '../redux/authSlice'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required').refine(val => {
    const isPhone = /^[+]?[0-9\s-]{8,15}$/.test(val.replace(/\s+/g, ''));
    if (isPhone) return true;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    return isEmail;
  }, {
    message: 'Must be a valid email address or phone number (8-15 digits)'
  }),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPwd, setShowPwd] = useState(false)
  const [loginMode, setLoginMode] = useState('email') // 'email' | 'phone'

  const { user, isLoading, isError, isSuccess, message } = useSelector(s => s.auth)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' }
  })

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Invalid credentials.')
      dispatch(resetState())
    }
    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.fullName}! --`)
      navigate('/')
      dispatch(resetState())
    }
  }, [isError, isSuccess, user, message, navigate, dispatch])

  // Clear identifier when switching modes
  const handleModeSwitch = (mode) => {
    setLoginMode(mode)
    setValue('identifier', '')
  }

  const onSubmit = (data) => {
    dispatch(loginUser({ identifier: data.identifier, password: data.password }))
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
          <div className="text-center position-relative" style={{ zIndex: 2 }}>
            <img src={logo} alt="BeatBox" style={{ width: '150px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} className="mb-5" />
            <h1 className="fw-black text-white display-4 mb-3" style={{ letterSpacing: '-1px' }}>
              Experience <br /><span className="gradient-text">True Sound.</span>
            </h1>
            <p className="text-white-50 fs-5 mx-auto" style={{ maxWidth: '400px' }}>
              Your portal to the ultimate collection of premium audio gear and lifestyle gadgets.
            </p>
          </div>
          <div className="position-absolute top-0 end-0 h-100 w-100"
            style={{ borderRight: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.4))' }} />
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center position-relative">
          <div className="d-lg-none position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
            <ParticleBackground />
            <div className="bg-glow-orb" style={{ width: '300px', height: '300px', background: 'var(--bb-primary)', top: '10%', left: '10%' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 p-md-5 w-100" style={{ maxWidth: '480px', zIndex: 1 }}
          >
            {/* Back Button */}
            <button onClick={() => navigate(-1)} id="login-back-btn"
              className="btn d-flex align-items-center gap-2 mb-4 fw-semibold"
              style={{ background: 'transparent', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', transition: 'all 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bb-accent)'; e.currentTarget.style.color = 'var(--bb-accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bb-border)'; e.currentTarget.style.color = 'var(--bb-muted)' }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {/* Title */}
            <div className="mb-4">
              <h2 className="fw-black mb-2" style={{ fontSize: '2.5rem', letterSpacing: '-1px', color: 'var(--bb-title-color)' }}>
                Welcome <span className="gradient-text">Back</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--bb-subtitle-color)' }}>
                Sign in with your email or phone number.
              </p>
            </div>

            {/* -- Email / Phone Toggle ------------------------------------- */}
            <div
              className="d-none rounded-3 p-1 mb-4"
              style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
            >
              {[
                { id: 'email', label: 'Email', Icon: Mail },
                { id: 'phone', label: 'Phone', Icon: Phone },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleModeSwitch(id)}
                  id={`login-mode-${id}`}
                  className="btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-bold"
                  style={{
                    borderRadius: 8,
                    padding: '10px 0',
                    fontSize: '0.9rem',
                    transition: 'all 0.25s ease',
                    background: loginMode === id
                      ? 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))'
                      : 'transparent',
                    color: loginMode === id ? '#fff' : 'var(--bb-muted)',
                    border: 'none',
                    boxShadow: loginMode === id ? '0 4px 20px rgba(0,243,255,0.25)' : 'none',
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* -- Identifier Input (email or phone) -------------------- */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={loginMode}
                  initial={{ opacity: 0, x: loginMode === 'email' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: loginMode === 'email' ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 input-group-custom position-relative"
                >
                  {loginMode === 'email'
                    ? <Mail size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                    : <Phone size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                  }
                  <input
                    key={loginMode}
                    type={loginMode === 'email' ? 'email' : 'tel'}
                    id={`login-identifier-${loginMode}`}
                    className="form-control bb-input w-100"
                    placeholder={loginMode === 'email' ? 'Email address' : 'Phone number (e.g. 9876543210)'}
                    {...register('identifier')}
                    autoFocus
                    maxLength={loginMode === 'phone' ? 15 : undefined}
                  />
                  {errors.identifier && (
                    <div className="text-danger small mt-1 position-absolute w-100" style={{ fontSize: '0.75rem', bottom: '-20px', left: '4px' }}>
                      {errors.identifier.message}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Password */}
              <div className="mb-4 input-group-custom position-relative">
                <Lock size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  id="login-password"
                  className="form-control bb-input w-100"
                  placeholder="Password"
                  {...register('password')}
                />
                <button type="button" className="btn icon position-absolute top-50 translate-middle-y end-0 border-0 px-3"
                  onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <div className="text-danger small mt-1 position-absolute w-100" style={{ fontSize: '0.75rem', bottom: '-20px', left: '4px' }}>
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="form-check d-flex align-items-center gap-2">
                  <input className="form-check-input mt-0" type="checkbox" id="rememberMe"
                    style={{ cursor: 'pointer', backgroundColor: 'transparent', borderColor: 'var(--bb-checkbox-border)' }} />
                  <label className="form-check-label small" htmlFor="rememberMe"
                    style={{ cursor: 'pointer', color: 'var(--bb-subtitle-color)', marginTop: '2px' }}>
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password"
                  style={{ color: 'var(--bb-accent)', textDecoration: 'none', fontSize: '0.85rem' }}
                  className="fw-semibold">
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button type="submit" id="login-submit-btn" disabled={isLoading}
                className="btn btn-glow w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
                style={{ height: '55px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '12px' }}>
                {isLoading
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Signing In...</>
                  : <>Sign In <ArrowRight size={20} /></>
                }
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="mb-0" style={{ color: 'var(--bb-footer-color)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--bb-link-color)', textDecoration: 'none' }} className="fw-bold ms-1">
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
