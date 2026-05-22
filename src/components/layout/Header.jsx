import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  Headphones,
  Speaker,
  Gamepad2,
  Clock
} from 'lucide-react'
import logo from '../../assets/beatbox_logo.png'
import { logout } from '../../redux/authSlice'
import { selectCartCount } from '../../redux/cartSlice'
import { toast } from 'react-hot-toast'
import ThemeToggle from '../ui/ThemeToggle'
import CartDrawer from '../ui/CartDrawer'


export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCart, setShowCart] = useState(false)
  
  const { user } = useSelector((state) => state.auth)
  const cartCount = useSelector(selectCartCount)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    toast.success("Successfully logged out!")
    navigate('/login')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.success(`Searching for "${searchQuery}"...`)
      setSearchQuery('')
    }
  }

  const categories = [
    { name: 'Wireless Earbuds', icon: <Sparkles size={16} className="text-info me-2" />, href: '#earbuds' },
    { name: 'Over-Ear Headphones', icon: <Headphones size={16} className="text-primary me-2" />, href: '#headphones' },
    { name: 'Wireless Neckbands', icon: <Clock size={16} className="text-warning me-2" />, href: '#neckbands' },
    { name: 'Bluetooth Speakers', icon: <Speaker size={16} className="text-success me-2" />, href: '#speakers' },
    { name: 'Gaming Headsets', icon: <Gamepad2 size={16} className="text-danger me-2" />, href: '#gaming' },
  ]

  return (
    <header className="fixed-top w-100" style={{ zIndex: 10000 }}>
      {/* 1. TOP MARQUEE BANNER */}
      <div 
        className="d-flex align-items-center justify-content-center text-center px-3"
        style={{ 
          background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)',
          backgroundSize: '200% 200%',
          animation: 'gradientBG 6s linear infinite',
          height: '34px', 
          fontSize: '0.8rem', 
          fontWeight: '700',
          color: '#ffffff',
          letterSpacing: '1px'
        }}
      >
        <span className="d-flex align-items-center gap-2">
          ⚡ GRAB THE LOOT: Free Shipping & 1-Year Warranty on All Gear! ⚡
        </span>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav 
        className="navbar navbar-expand-lg py-3 border-0 border-bottom w-100 premium-navbar"
        style={{
          transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}
      >
        <div className="container-fluid px-lg-5">
          {/* Logo & Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 me-4 premium-brand">
            <img 
              src={logo} 
              alt="BeatBox Logo" 
              className="rounded-3"
              style={{ width: '40px', height: '40px', boxShadow: '0 4px 15px rgba(0, 243, 255, 0.2)' }} 
            />
            <span className="fw-black fs-4 tracking-tight text-theme-title mb-0">
              BEAT<span className="gradient-text">BOX</span>
            </span>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            className="navbar-toggler border-0 text-theme-title p-2" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="navbarNav" 
            aria-expanded={isOpen} 
            aria-label="Toggle navigation"
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Navbar Links & Widgets */}
          <div className={`collapse navbar-collapse ${isOpen ? 'show mt-3 mt-lg-0' : ''}`} id="navbarNav">
            
            {/* Center: Navigation Links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2 fw-semibold">
              
              {/* Categories Hover Dropdown */}
              <li 
                className="nav-item position-relative dropdown"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button 
                  className="nav-link text-theme-title d-flex align-items-center gap-1 border-0 bg-transparent py-2 premium-nav-link"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  Categories <ChevronDown size={14} className={`transition-all duration-300 ${showCategories ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showCategories && (
                    <motion.ul 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="dropdown-menu show premium-dropdown p-3 position-absolute mt-2"
                      style={{ 
                        width: '260px'
                      }}
                    >
                      {categories.map((cat, idx) => (
                        <li key={idx} className="mb-1">
                          <a 
                            href={cat.href} 
                            className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3"
                            onClick={() => setShowCategories(false)}
                          >
                            {cat.icon}
                            {cat.name}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li className="nav-item">
                <Link to="/products" className="nav-link premium-nav-link py-2">
                  Best Sellers
                </Link>
              </li>
              
              <li className="nav-item">
                <Link to="/products" className="nav-link premium-nav-link py-2">
                  New Launches
                </Link>
              </li>

              <li className="nav-item">
                <a href="#support" className="nav-link premium-nav-link py-2">
                  Support
                </a>
              </li>
            </ul>

            {/* Right: Search bar & Utility Icons */}
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3">
              
              {/* Search Pill */}
              <form onSubmit={handleSearchSubmit} className="position-relative">
                <input 
                  type="text" 
                  className="form-control premium-search-input"
                  placeholder="Search drops, headsets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <button 
                  type="submit" 
                  className="btn position-absolute top-50 translate-middle-y end-0 border-0 text-theme-muted p-2 pe-3"
                  style={{ background: 'transparent' }}
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Icon Group */}
              <div className="d-flex align-items-center justify-content-center gap-3 mt-2 mt-lg-0 text-theme-title">
                
                {/* Wishlist Link */}
                <button 
                  className="btn border-0 p-2 position-relative text-theme-muted hover-scale"
                  onClick={() => toast.success("Wishlist coming soon!")}
                  style={{ background: 'transparent', transition: 'all 0.2s' }}
                >
                  <Heart size={20} />
                </button>

                {/* Shopping Cart Trigger */}
                <button 
                  className="btn border-0 p-2 position-relative text-theme-muted hover-scale"
                  onClick={() => setShowCart(true)}
                  style={{ background: 'transparent', transition: 'all 0.2s' }}
                  aria-label="Open cart"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span 
                      className="position-absolute translate-middle badge rounded-pill cart-pulse-badge"
                      style={{ 
                        top: '4px', 
                        right: '-2px', 
                        fontSize: '0.65rem', 
                        padding: '3px 6px'
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Profile / Account Dropdown */}
                {user ? (
                  <div className="dropdown">
                    <button 
                      className="btn border-0 p-2 text-theme-muted d-flex align-items-center gap-1 dropdown-toggle"
                      id="userMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ background: 'transparent' }}
                    >
                      <User size={20} className="text-accent" />
                      <span className="small d-none d-xl-inline text-theme-muted">{user.fullName.split(' ')[0]}</span>
                    </button>
                    <ul 
                      className="dropdown-menu dropdown-menu-end glass-card p-2 border-1 mt-2 text-white" 
                      aria-labelledby="userMenuButton"
                      style={{ 
                        background: 'var(--bb-surface)', 
                        borderColor: 'var(--bb-border)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        borderRadius: '12px'
                      }}
                    >
                      <li className="px-3 py-2 border-bottom border-secondary mb-1">
                        <p className="small mb-0 text-theme-title fw-bold">{user.fullName}</p>
                        <p className="small mb-0 text-theme-muted text-truncate" style={{ fontSize: '0.8rem', maxWidth: '160px' }}>{user.email}</p>
                      </li>
                      <li>
                        <Link 
                          to="/profile" 
                          className="dropdown-item text-theme-title py-2 rounded"
                          style={{ fontSize: '0.9rem', background: 'transparent' }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(0, 243, 255, 0.08)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <button 
                          className="dropdown-item text-danger py-2 rounded d-flex align-items-center gap-2 border-0 bg-transparent w-100"
                          onClick={handleLogout}
                          style={{ fontSize: '0.9rem' }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 0, 0, 0.08)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="btn border-0 p-2 text-theme-muted d-flex align-items-center gap-1 hover-scale"
                    style={{ background: 'transparent', transition: 'all 0.2s' }}
                  >
                    <User size={20} />
                    <span className="small d-none d-xl-inline text-theme-muted fw-semibold">Login</span>
                  </Link>
                )}

                {/* Navbar Inline Theme Toggle */}
                <ThemeToggle isFloating={false} />

              </div>

            </div>

          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </header>
  )
}
