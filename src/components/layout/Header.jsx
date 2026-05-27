import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
  Clock,
  Package
} from 'lucide-react'
import logo from '../../assets/beatbox_logo.png'
import { logout } from '../../redux/authSlice'
import { selectCartCount } from '../../redux/cartSlice'
import { selectWishlistCount } from '../../redux/wishlistSlice'
import { selectAllProducts, selectProductStatus, fetchProducts } from '../../redux/productSlice'
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
  const wishlistCount = useSelector(selectWishlistCount)
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [showMobileSearch, setShowMobileSearch] = useState(false)

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

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts())
    }
  }, [productStatus, dispatch])

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allProducts
      .filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.usp?.toLowerCase().includes(q))
      .slice(0, 5); // top 5
  }, [searchQuery, allProducts]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLogout = () => {
    dispatch(logout())
    toast.success("Successfully logged out!")
    navigate('/login')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowMobileSearch(false)
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

          {/* Mobile Widgets */}
          <div className="d-flex align-items-center gap-2 d-lg-none ms-auto me-1">
            {/* Mobile Profile Dropdown */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn border-0 p-1 dropdown-toggle profile-trigger-btn text-theme-muted hover-scale"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ background: 'transparent' }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #00f3ff, #a820ff)'
                    }}
                  >
                    <User size={15} color="#fff" />
                  </div>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end p-2 border-0 mt-3 premium-profile-dropdown"
                  style={{
                    width: '240px',
                    background: 'var(--bb-surface)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--bb-border)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                    zIndex: 1060
                  }}
                >
                  <li className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-2">
                    <h6 className="mb-0 text-theme-title fw-bold">{user.fullName}</h6>
                    <small className="text-theme-muted">{user.email}</small>
                  </li>
                  <li>
                    <Link to="/orders" className="dropdown-item premium-dropdown-item rounded-3 py-2 d-flex align-items-center gap-2"><Package size={15} style={{ color: 'var(--bb-accent)' }} /> My Orders</Link>
                  </li>
                  <li>
                    <Link to="/wishlist" className="dropdown-item premium-dropdown-item rounded-3 py-2 d-flex align-items-center gap-2">
                      <Heart size={15} style={{ color: 'var(--bb-danger, #ef4444)' }} /> My Wishlist
                      {wishlistCount > 0 && (
                        <span className="badge rounded-pill bg-danger ms-auto">{wishlistCount}</span>
                      )}
                    </Link>
                  </li>
                  <li><Link to="/settings" className="dropdown-item premium-dropdown-item rounded-3 py-2 d-flex align-items-center gap-2">⚙️ Settings</Link></li>
                  <li><Link to="/support" className="dropdown-item premium-dropdown-item rounded-3 py-2">🎧 Support</Link></li>
                  <li className="mt-2 pt-2 border-top border-secondary border-opacity-25">
                    <button className="dropdown-item rounded-3 py-2 text-danger fw-semibold d-flex align-items-center gap-2" onClick={handleLogout}><LogOut size={15} /> Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn border-0 p-1 text-theme-muted hover-scale">
                <User size={22} />
              </Link>
            )}

            {/* Mobile Search Toggle (Non-Home Pages) */}
            {!isHome && (
              <button
                className="btn border-0 p-1 position-relative text-theme-muted hover-scale"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                aria-label="Toggle mobile search"
                style={{ background: 'transparent' }}
              >
                <Search size={22} />
              </button>
            )}

            <button
              className="btn border-0 p-1 position-relative text-theme-muted"
              onClick={() => setShowCart(true)}
              aria-label="Open cart mobile"
              style={{ background: 'transparent' }}
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill cart-pulse-badge"
                  style={{ top: '4px', right: '-4px', fontSize: '0.65rem', padding: '3px 6px' }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            <div className="scale-90 origin-right">
              <ThemeToggle isFloating={false} />
            </div>
          </div>

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

          {/* Mobile Full Search Bar */}
          {(isHome || showMobileSearch) && (
            <div className="w-100 d-lg-none mt-3 mb-1 position-relative">
              <form onSubmit={handleSearchSubmit} className="position-relative">
                <input
                  type="text"
                  className="form-control premium-search-input w-100"
                  placeholder="Search drops, headsets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
                <button
                  type="submit"
                  className="btn position-absolute top-50 translate-middle-y end-0 border-0 text-theme-muted p-2 pe-3"
                  style={{ background: 'transparent' }}
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Search Suggestions */}
              <AnimatePresence>
                {searchFocused && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="position-absolute top-100 start-0 w-100 mt-2 rounded-3 shadow-lg"
                    style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', zIndex: 10500, overflow: 'hidden' }}
                  >
                    <div className="list-group list-group-flush">
                      {searchSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 px-3 py-2"
                          style={{ background: 'transparent', color: 'var(--bb-text)', cursor: 'pointer' }}
                          onClick={() => {
                            navigate(`/products/${item.id}`);
                            setSearchQuery('');
                            setSearchFocused(false);
                            setShowMobileSearch(false);
                            setIsOpen(false);
                          }}
                        >
                          <Search size={14} className="text-theme-muted flex-shrink-0" />
                          <div className="text-start text-truncate">
                            <p className="mb-0 fw-bold text-theme-title text-truncate" style={{ fontSize: '0.85rem' }}>{item.name}</p>
                            <p className="mb-0 text-theme-muted text-truncate" style={{ fontSize: '0.7rem' }}>{item.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Navbar Links & Widgets */}
          <div className={`collapse navbar-collapse mobile-dropdown-drawer ${isOpen ? 'show' : ''}`} id="navbarNav">

            {/* Mobile Drawer Header */}
            <div className="d-flex align-items-center justify-content-between d-lg-none mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <span className="fw-black fs-4 tracking-tight text-theme-title mb-0 d-flex align-items-center gap-2">
                <img src={logo} alt="BeatBox" style={{ width: '30px', height: '30px' }} className="rounded-3" />
                BEAT<span className="gradient-text">BOX</span>
              </span>
              <button 
                className="btn border-0 text-theme-muted p-2 hover-scale" 
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

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
                      className="dropdown-menu show premium-dropdown p-lg-3 mt-2 dropdown-mobile-static"
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
              {/* Mobile Only Wishlist Link */}
              <li className="nav-item d-lg-none mt-2 pt-2 border-top border-secondary border-opacity-25">
                <button 
                  className="nav-link premium-nav-link py-2 d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start"
                  onClick={() => { navigate('/wishlist'); setIsOpen(false); }}
                >
                  <Heart size={18} className="text-danger" /> Wishlist ({wishlistCount})
                </button>
              </li>
            </ul>

            {/* Right: Search bar & Utility Icons */}
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3">

              {/* Search Pill */}
              {/* Search Pill */}
              <form onSubmit={handleSearchSubmit} className="position-relative d-none d-lg-block">
                <input
                  type="text"
                  className="form-control premium-search-input"
                  placeholder="Search drops, headsets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
                <button
                  type="submit"
                  className="btn position-absolute top-50 translate-middle-y end-0 border-0 text-theme-muted p-2 pe-3"
                  style={{ background: 'transparent' }}
                >
                  <Search size={18} />
                </button>

                {/* Desktop Search Suggestions */}
                <AnimatePresence>
                  {searchFocused && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="position-absolute top-100 start-0 w-100 mt-2 rounded-3 shadow-lg"
                      style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', zIndex: 10500, overflow: 'hidden' }}
                    >
                      <div className="list-group list-group-flush">
                        {searchSuggestions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 px-3 py-2"
                            style={{ background: 'transparent', color: 'var(--bb-text)', cursor: 'pointer', transition: 'background 0.2s' }}
                            onClick={() => {
                              navigate(`/products/${item.id}`);
                              setSearchQuery('');
                              setSearchFocused(false);
                            }}
                          >
                            <Search size={14} className="text-theme-muted flex-shrink-0" />
                            <div className="text-start text-truncate">
                              <p className="mb-0 fw-bold text-theme-title text-truncate" style={{ fontSize: '0.85rem' }}>{item.name}</p>
                              <p className="mb-0 text-theme-muted text-truncate" style={{ fontSize: '0.7rem' }}>{item.category}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Icon Group */}
              <div className="d-flex align-items-center justify-content-center gap-3 mt-2 mt-lg-0 text-theme-title">

                {/* Shopping Cart Trigger */}
                <button
                  className="btn border-0 p-2 position-relative text-theme-muted hover-scale d-none d-lg-block"
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
                <div className="d-none d-lg-block">
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
                          background: 'var(--bb-surface)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid var(--bb-border)',
                          borderRadius: '18px',
                          boxShadow: '0 20px 45px rgba(0,0,0,0.25)'
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
                            to="/orders"
                            className="dropdown-item premium-dropdown-item rounded-3 py-3 d-flex align-items-center gap-2"
                            id="nav-my-orders"
                          >
                            <Package size={15} style={{ color: 'var(--bb-accent)' }} />
                            My Orders
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/wishlist"
                            className="dropdown-item premium-dropdown-item rounded-3 py-3 d-flex align-items-center gap-2"
                          >
                            <Heart size={15} style={{ color: 'var(--bb-danger, #ef4444)' }} />
                            My Wishlist
                            {wishlistCount > 0 && (
                              <span className="badge rounded-pill bg-danger ms-auto px-2">{wishlistCount}</span>
                            )}
                          </Link>
                        </li>

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
                </div>

                {/* Navbar Inline Theme Toggle */}
                <div className="d-none d-lg-block">
                  <ThemeToggle isFloating={false} />
                </div>

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
