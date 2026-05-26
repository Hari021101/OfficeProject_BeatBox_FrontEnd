import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
import logo from '../assets/Logo.png'
import ParticleBackground from '../components/ui/ParticleBackground'
import ThemeToggle from '../components/ui/ThemeToggle'
import { loginUser, resetState } from '../redux/authSlice'
import { toast } from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPwd, setShowPwd] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message || "Invalid credentials.")
      dispatch(resetState())
    }
    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.fullName}!`)
      navigate('/')
      dispatch(resetState())
    }
  }, [isError, isSuccess, user, message, navigate, dispatch])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email: formData.email, password: formData.password }))
  }

  return (
    <div className="container-fluid min-vh-100 p-0 overflow-hidden" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {/* Floating Premium Theme Toggle */}
      <ThemeToggle />

      <div className="row g-0 min-vh-100">
        
        {/* LEFT SIDE: Premium Animated Branding Panel */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative login-split-bg">
          
          {/* Antigravity Canvas Animation */}
          <ParticleBackground />

          {/* Abstract background orbs for extra depth */}
          <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-primary)', top: '10%', left: '10%' }}></div>
          <div className="bg-glow-orb" style={{ width: '500px', height: '500px', background: 'var(--bb-accent)', bottom: '-10%', right: '-10%', animationDelay: '2s' }}></div>
          
          <div 
            className="text-center position-relative" 
            style={{ zIndex: 2 }}
          >
            <img src={logo} alt="BeatBox" style={{ width: '150px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} className="mb-5" />
            <h1 className="fw-black text-white display-4 mb-3" style={{ letterSpacing: '-1px' }}>
              Experience <br/><span className="gradient-text">True Sound.</span>
            </h1>
            <p className="text-white-50 fs-5 mx-auto" style={{ maxWidth: '400px' }}>
              Your portal to the ultimate collection of premium audio gear and lifestyle gadgets.
            </p>
          </div>
          
          {/* Glass overlay border to separate left and right perfectly */}
          <div className="position-absolute top-0 end-0 h-100 w-100" style={{ borderRight: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.4))' }}></div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center position-relative">
          
          {/* Mobile/Tablet Background Animation (Hidden on Desktop) */}
          <div className="d-lg-none position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
            <ParticleBackground />
            <div className="bg-glow-orb" style={{ width: '300px', height: '300px', background: 'var(--bb-primary)', top: '10%', left: '10%' }}></div>
          </div>

          <div 
            className="p-4 p-md-5 w-100" 
            style={{ maxWidth: '480px', zIndex: 1 }}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="btn d-flex align-items-center gap-2 mb-4 fw-semibold"
              style={{
                background: 'transparent',
                border: '1px solid var(--bb-border)',
                color: 'var(--bb-muted)',
                borderRadius: '10px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--bb-accent)'
                e.currentTarget.style.color = 'var(--bb-accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--bb-border)'
                e.currentTarget.style.color = 'var(--bb-muted)'
              }}
              id="login-back-btn"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="mb-5">
              <h2 className="fw-black mb-2" style={{ fontSize: '2.5rem', letterSpacing: '-1px', color: 'var(--bb-title-color)' }}>
                Welcome <span className="gradient-text">Back</span>
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--bb-subtitle-color)' }}>Enter your details to access your account.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4 input-group-custom position-relative">
                <Mail size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                <input 
                  type="email" name="email"
                  className="form-control bb-input w-100" 
                  placeholder="Email address"
                  value={formData.email} onChange={handleChange} required 
                />
              </div>

              {/* Password Input */}
              <div className="mb-4 input-group-custom position-relative">
                <Lock size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                <input 
                  type={showPwd ? "text" : "password"} name="password"
                  className="form-control bb-input w-100" 
                  placeholder="Password"
                  value={formData.password} onChange={handleChange} required 
                />
                <button type="button" className="btn icon position-absolute top-50 translate-middle-y end-0 border-0 px-3"
                  onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Extra Row: Remember Me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="form-check d-flex align-items-center gap-2">
                  <input 
                    className="form-check-input mt-0" 
                    type="checkbox" 
                    id="rememberMe" 
                    style={{ cursor: 'pointer', backgroundColor: 'transparent', borderColor: 'var(--bb-checkbox-border)' }} 
                  />
                  <label 
                    className="form-check-label small" 
                    htmlFor="rememberMe" 
                    style={{ cursor: 'pointer', color: 'var(--bb-subtitle-color)', marginTop: '2px' }}
                  >
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" style={{ color: 'var(--bb-accent)', textDecoration: 'none', fontSize: '0.85rem' }} className="fw-semibold">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                className="btn btn-glow w-100 mb-4 d-flex align-items-center justify-content-center gap-2" 
                style={{ height: '55px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '12px' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-5">
              <p className="mb-0" style={{ color: 'var(--bb-footer-color)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--bb-link-color)', textDecoration: 'none' }} className="fw-bold ms-1">Create an account</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
