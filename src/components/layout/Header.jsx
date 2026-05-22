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
  Tv,
  Speaker,
  Gamepad2,
  Clock
} from 'lucide-react'
import logo from '../../assets/beatbox_logo.png'
import { logout } from '../../redux/authSlice'
import { toast } from 'react-hot-toast'
import ThemeToggle from '../ui/ThemeToggle'


export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // For demonstration, mock cart item count or set to 0. Let's make it 3 items initially
  const [cartCount, setCartCount] = useState(3)

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
                <a href="#bestsellers" className="nav-link premium-nav-link py-2">
                  Best Sellers
                </a>
              </li>

              <li className="nav-item">
                <a href="#newlaunches" className="nav-link premium-nav-link py-2">
                  New Launches
                </a>
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
                  onClick={() => toast.success("Shopping Cart drawer!")}
                  style={{ background: 'transparent', transition: 'all 0.2s' }}
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

                    {/* Trigger Button */}
                    <button
                      className="btn border-0 p-2 text-theme-muted d-flex align-items-center gap-2 dropdown-toggle profile-trigger-btn"
                      id="userMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        background: 'transparent'
                      }}
                    >

                      {/* Avatar */}
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '34px',
                          height: '34px',
                          background:
                            'linear-gradient(135deg, #00f3ff, #a820ff)',
                          boxShadow:
                            '0 0 15px rgba(0,243,255,0.35)'
                        }}
                      >
                        <User size={16} color="#fff" />
                      </div>

                      {/* Username */}
                      <div className="d-none d-xl-flex flex-column text-start">
                        <span
                          className="fw-bold text-theme-title"
                          style={{
                            fontSize: '0.85rem',
                            lineHeight: '1'
                          }}
                        >
                          {user.fullName.split(' ')[0]}
                        </span>

                        <span
                          className="text-theme-muted"
                          style={{
                            fontSize: '0.7rem'
                          }}
                        >
                          Premium User
                        </span>
                      </div>

                    </button>

                    {/* Dropdown Menu */}
                    <ul
                      className="dropdown-menu dropdown-menu-end p-2 border-0 mt-3 premium-profile-dropdown"
                      aria-labelledby="userMenuButton"
                      style={{
                        width: '280px',
                        background: 'rgba(10, 15, 30, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border:
                          '1px solid rgba(0,243,255,0.15)',
                        borderRadius: '18px',
                        boxShadow:
                          '0 20px 45px rgba(0,0,0,0.45)'
                      }}
                    >

                      {/* User Top Section */}
                      <li className="px-3 py-3 border-bottom border-secondary border-opacity-25">

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '48px',
                              height: '48px',
                              background:
                                'linear-gradient(135deg, #00f3ff, #a820ff)'
                            }}
                          >
                            <User size={22} color="#fff" />
                          </div>

                          <div>
                            <h6 className="mb-1 text-theme-title fw-bold">
                              {user.fullName}
                            </h6>

                            <p
                              className="mb-0 text-theme-muted"
                              style={{
                                fontSize: '0.75rem'
                              }}
                            >
                              {user.email}
                            </p>
                          </div>

                        </div>

                      </li>

                      {/* Menu Links */}

                      <li>
                        <Link
                          to="/settings"
                          className="dropdown-item premium-dropdown-item rounded-3 py-3"
                        >
                          ⚙️ Settings
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/support"
                          className="dropdown-item premium-dropdown-item rounded-3 py-3"
                        >
                          🎧 Support
                        </Link>
                      </li>

                      {/* Logout */}
                      <li className="mt-2 pt-2 border-top border-secondary border-opacity-25">

                        <button
                          className="dropdown-item rounded-3 py-3 text-danger fw-semibold d-flex align-items-center gap-2"
                          onClick={handleLogout}
                          style={{
                            transition: 'all 0.25s ease'
                          }}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>

                      </li>

                    </ul>

                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="btn border-0 p-2 text-theme-muted d-flex align-items-center gap-1 hover-scale"
                    style={{
                      background: 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <User size={20} />
                    <span className="small d-none d-xl-inline text-theme-muted fw-semibold">
                      Login
                    </span>
                  </Link>
                )}

                {/* Navbar Inline Theme Toggle */}
                <ThemeToggle isFloating={false} />

              </div>

            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}
