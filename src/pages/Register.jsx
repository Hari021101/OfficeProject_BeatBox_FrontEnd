import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'
import logo from '../assets/Logo.png'
import ParticleBackground from '../components/ui/ParticleBackground'
import ThemeToggle from '../components/ui/ThemeToggle'
import { registerUser, resetState } from '../redux/authSlice'
import { toast } from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed.")
      dispatch(resetState())
    }
    if (isSuccess) {
      toast.success("Account created successfully! Please sign in.")
      navigate('/login')
      dispatch(resetState())
    }
  }, [isError, isSuccess, message, navigate, dispatch])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    dispatch(registerUser({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    }))
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
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-center position-relative" 
            style={{ zIndex: 2 }}
          >
            <img src={logo} alt="BeatBox" style={{ width: '150px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} className="mb-5" />
            <h1 className="fw-black text-white display-4 mb-3" style={{ letterSpacing: '-1px' }}>
              Join the <br/><span className="gradient-text">Community.</span>
            </h1>
            <p className="text-white-50 fs-5 mx-auto" style={{ maxWidth: '400px' }}>
              Unlock exclusive access to premium gear, limited drops, and our global audiophile community.
            </p>
          </motion.div>
          
          {/* Glass overlay border to separate left and right perfectly */}
          <div className="position-absolute top-0 end-0 h-100 w-100" style={{ borderRight: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.4))' }}></div>
        </div>

        {/* RIGHT SIDE: Register Form */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center position-relative">
          
          {/* Mobile/Tablet Background Animation (Hidden on Desktop) */}
          <div className="d-lg-none position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
            <ParticleBackground />
            <div className="bg-glow-orb" style={{ width: '300px', height: '300px', background: 'var(--bb-primary)', top: '10%', left: '10%' }}></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 p-md-5 w-100" 
            style={{ maxWidth: '480px', zIndex: 1 }}
          >
            <div className="mb-4">
              <h2 className="fw-black mb-2" style={{ fontSize: '2.5rem', letterSpacing: '-1px', color: '#fff' }}>
                Create <span className="gradient-text">Account</span>
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(0, 243, 255, 0.6)' }}>Sign up to start your journey with BeatBox.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="mb-3 input-group-custom position-relative">
                <User size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                <input 
                  type="text" name="fullName"
                  className="form-control bb-input w-100" 
                  placeholder="Full Name"
                  value={formData.fullName} onChange={handleChange} required 
                />
              </div>

              {/* Email Input */}
              <div className="mb-3 input-group-custom position-relative">
                <Mail size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                <input 
                  type="email" name="email"
                  className="form-control bb-input w-100" 
                  placeholder="Email address"
                  value={formData.email} onChange={handleChange} required 
                />
              </div>

              {/* Password Input */}
              <div className="mb-3 input-group-custom position-relative">
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

              {/* Confirm Password Input */}
              <div className="mb-4 input-group-custom position-relative">
                <Lock size={20} className="icon position-absolute top-50 translate-middle-y" style={{ left: '18px' }} />
                <input 
                  type={showConfirmPwd ? "text" : "password"} name="confirmPassword"
                  className="form-control bb-input w-100" 
                  placeholder="Confirm Password"
                  value={formData.confirmPassword} onChange={handleChange} required 
                />
                <button type="button" className="btn icon position-absolute top-50 translate-middle-y end-0 border-0 px-3"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                  {showConfirmPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Register Button */}
              <button 
                type="submit" 
                className="btn btn-glow w-100 mb-4 d-flex align-items-center justify-content-center gap-2" 
                style={{ height: '55px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '12px' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--bb-primary-light)', textDecoration: 'none' }} className="fw-bold ms-1">Sign In</Link>
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}