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
  Package,
  Link2,
  Scale,
  MapPin
} from 'lucide-react'
import logo from '../../assets/beatbox_logo.png'
import { getCategoryCover } from '../../utils/categoryImageHelper'
import { logout } from '../../redux/authSlice'
import { selectCartCount } from '../../redux/cartSlice'
import { selectWishlistCount } from '../../redux/wishlistSlice'
import { selectAllProducts, selectProductStatus, fetchProducts } from '../../redux/productSlice'
import { toast } from 'react-hot-toast'
import ThemeToggle from '../ui/ThemeToggle'
import NotificationsPanel from '../ui/NotificationsPanel'
import { categoryService } from '../../services/categoryService'


export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [megaMenuExpanded, setMegaMenuExpanded] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const cartCount = useSelector(selectCartCount)
  const compareCount = useSelector((state) => state.compare?.items?.length || 0)
  const wishlistCount = useSelector(selectWishlistCount)
  const allProducts = useSelector(selectAllProducts)
  const productStatus = useSelector(selectProductStatus)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Use the debounced query for calculating suggestions
  const searchSuggestions = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    const q = debouncedSearchQuery.toLowerCase();
    return allProducts
      .filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.usp?.toLowerCase().includes(q))
      .slice(0, 5); // top 5
  }, [debouncedSearchQuery, allProducts]);

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

  const renderProfileMenu = () => (
    <>
      <li className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1 bg-theme-surface">
        <span className="text-theme-muted fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Your Account</span>
      </li>
      {user?.roles?.includes('Admin') && (
        <li className="mb-1">
          <Link to="/admin" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3 fw-bold text-primary">
            <User size={16} className="me-3" /> Admin Dashboard
          </Link>
        </li>
      )}
      <li className="mb-1">
        <Link to="/settings" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3">
          <User size={16} className="me-3 text-theme-muted" /> My Profile
        </Link>
      </li>
      <li className="mb-1">
        <Link to="/orders" id="nav-my-orders" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3">
          <Package size={16} className="me-3 text-theme-muted" /> Orders
        </Link>
      </li>
      <li className="mb-1">
        <Link to="/addresses" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3">
          <MapPin size={16} className="me-3 text-theme-muted" /> Saved Addresses
        </Link>
      </li>
      <li className="mb-1">
        <Link to="/wishlist" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3">
          <Heart size={16} className="me-3 text-theme-muted" /> Wishlist
        </Link>
      </li>
      <li className="mt-1 border-top border-secondary border-opacity-25 pt-1">
        <button className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3 text-danger fw-semibold w-100 bg-transparent border-0" onClick={handleLogout}>
          <LogOut size={16} className="me-3" /> Logout
        </button>
      </li>
    </>
  )

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

  // Category images are resolved via the shared getCategoryCover helper
  // (same source used by ShopByCategories & ShopByCategorySlider)

  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategoriesList(data);
      } catch (err) {
        console.error("Error loading categories in header:", err);
      }
    };
    loadCategories();
  }, []);

  const megaMenuCategories = useMemo(() => {
    if (!categoriesList.length) return [];

    // Exclude unimplemented/removed categories from the mega menu
    const excluded = /neckband|home.?audio/i;
    const filtered = categoriesList.filter(c => !excluded.test(c.name));

    const audioGear = filtered.filter(c =>
      /earbud|tws|headphone|earphone|headset/i.test(c.name)
    );
    const speakers = filtered.filter(c =>
      /speaker|soundbar/i.test(c.name)
    );
    const accessories = filtered.filter(c =>
      !/earbud|tws|headphone|earphone|headset|speaker|soundbar/i.test(c.name)
    );

    return [
      { title: "Audio Gear", items: audioGear },
      { title: "Speakers & Cinema", items: speakers },
      { title: "Smart Tech & Gear", items: accessories }
    ].filter(col => col.items.length > 0);
  }, [categoriesList]);

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
        className="navbar navbar-expand-xl py-3 border-0 border-bottom w-100 premium-navbar"
        style={{
          transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}
      >
        <div className="container-fluid px-2 px-xl-5 flex-wrap flex-xl-nowrap">
          {/* Mobile Toggle Button & Logo (Left Side) */}
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler d-xl-none border-0 text-theme-title p-1 p-sm-2 me-2"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="navbarNav"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
              style={{ outline: 'none', boxShadow: 'none' }}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
            
            {/* Logo & Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-1 gap-sm-2 me-2 premium-brand text-truncate" style={{ flexShrink: 1, minWidth: 0 }}>
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
          </div>

          {/* Mobile Right Side (Widgets) */}
          <div className="d-flex align-items-center gap-1 gap-sm-2 ms-auto d-xl-none">
            {/* Mobile Widgets */}
            <div className="d-flex align-items-center gap-1 gap-sm-2 me-1">
            {/* Mobile Search Toggle */}
            <button
              className="btn border-0 p-1 position-relative text-theme-muted hover-scale"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Toggle mobile search"
              style={{ background: 'transparent' }}
            >
              <Search size={22} />
            </button>
            
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
                  className="dropdown-menu dropdown-menu-end p-2 border-0 mt-3 premium-profile-dropdown mobile-profile-dropdown-panel"
                  style={{
                    width: '240px',
                    background: 'var(--bb-bg-navy)',
                    border: '1px solid var(--bb-border)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                    zIndex: 1060
                  }}
                >
                  {renderProfileMenu()}
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn border-0 p-1 text-theme-muted hover-scale">
                <User size={22} />
              </Link>
            )}

            <button
              className="btn border-0 p-1 position-relative text-theme-muted"
              onClick={() => navigate('/cart')}
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
            </div>
          </div>

          {/* Mobile Full Search Bar */}
          {showMobileSearch && (
            <div className="w-100 d-xl-none mt-3 mb-1 position-relative">
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

            {/* Desktop Center: Navigation Links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2 fw-semibold d-none d-xl-flex">

              {/* Categories Hover Dropdown */}
              <li
                className="nav-item position-static dropdown"
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
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="dropdown-menu show premium-dropdown p-4 mt-0 dropdown-mobile-static mega-menu-visual"
                      style={{
                        width: '100%',
                        left: '0',
                        right: '0',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderRadius: '0',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                        borderTop: '1px solid var(--bb-border)',
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        maxHeight: '65vh',
                        overflowY: 'auto'
                      }}
                    >
                      <div 
                        className="mega-menu-grid"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: window.innerWidth > 992 ? `repeat(${megaMenuCategories.length}, 1fr)` : 'repeat(2, 1fr)',
                          gap: '30px 20px',
                          maxWidth: '1400px',
                          margin: '0 auto'
                        }}
                      >
                        {megaMenuCategories.map((col, idx) => (
                          <div key={idx} className="mega-menu-column">
                            <h6 className="fw-black text-theme-title mb-4 pb-2 text-center" style={{ fontSize: '1rem' }}>
                              {col.title}
                            </h6>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                              {col.items.slice(0, megaMenuExpanded ? col.items.length : 5).map((item, i) => (
                                <li key={i}>
                                  <Link
    to={`/products?category=${item.slug}`}
    className="text-decoration-none text-theme-title transition-all d-flex align-items-center gap-3 mega-menu-item"
    style={{ fontSize: '0.85rem', fontWeight: 600 }}
    onClick={() => {
        setShowCategories(false)
        setIsOpen(false)
        setMegaMenuExpanded(false)
    }}
>
    <div
        className="rounded-circle d-flex align-items-center justify-content-center"
        style={{
            width: '40px',
            height: '40px',
            background: 'var(--bb-surface-2)',
            border: '1px solid var(--bb-border)',
            flexShrink: 0
        }}
    >
        <img
            src={getCategoryCover(item.name, item.imageUrl)}
            alt={item.name}
            style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                objectPosition: 'center'
            }}
        />
    </div>

    <span
        className="text-theme-muted transition-all text-start mega-menu-text"
        style={{ lineHeight: '1.2' }}
    >
        {item.name}
    </span>
</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      
                      <div className="d-flex justify-content-center mt-5 mb-2">
                        <button
                          className="btn d-flex align-items-center justify-content-center gap-2 rounded-pill border-0 hover-scale"
                          style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
                            color: '#fff',
                            padding: '12px 36px',
                            boxShadow: '0 8px 25px rgba(0, 243, 255, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={(e) => { 
                            e.preventDefault();
                            if (!megaMenuExpanded) {
                              setMegaMenuExpanded(true);
                            } else {
                              setShowCategories(false); 
                              setIsOpen(false);
                              setMegaMenuExpanded(false);
                              navigate('/products');
                            }
                          }}
                        >
                          {megaMenuExpanded ? 'Go To Product Catalog' : 'Explore All Categories'} <Sparkles size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li className="nav-item">
                <Link to="/daily-deals" className="nav-link premium-nav-link py-2 text-danger fw-bold d-flex align-items-center gap-1" onClick={() => setIsOpen(false)}>
                  <Sparkles size={14} /> Daily Deals
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/products?category=bestsellers" className="nav-link premium-nav-link py-2 text-warning" onClick={() => setIsOpen(false)}>
                  Best Sellers
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/gifting" className="nav-link premium-nav-link py-2" onClick={() => setIsOpen(false)}>
                  Gifting Store
                </Link>
              </li>

              {/* More Dropdown */}
              <li
                className="nav-item position-relative dropdown"
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => setShowMore(false)}
              >
                <button
                  className="nav-link text-theme-title d-flex align-items-center gap-1 border-0 bg-transparent py-2 premium-nav-link"
                  onClick={() => setShowMore(!showMore)}
                >
                  More <ChevronDown size={14} className={`transition-all duration-300 ${showMore ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showMore && (
                    <motion.ul
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="dropdown-menu show premium-dropdown p-2 mt-2 dropdown-mobile-static"
                      style={{
                        width: '240px',
                        left: '0'
                      }}
                    >
                      <li className="mb-1">
                        <Link to="/corporate" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3" onClick={() => { setShowMore(false); setIsOpen(false); }}>
                          <Package size={14} className="me-3 text-primary" /> Corporate Orders
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/personalisation" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3" onClick={() => { setShowMore(false); setIsOpen(false); }}>
                          <User size={14} className="me-3 text-info" /> Personalisation
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/refer" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3 text-success" onClick={() => { setShowMore(false); setIsOpen(false); }}>
                          <Heart size={14} className="me-3" /> Refer & Earn
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/studio" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3 text-accent" onClick={() => { setShowMore(false); setIsOpen(false); }}>
                          <Headphones size={14} className="me-3" /> BeatBox Studio
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/orders" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3" onClick={() => { setShowMore(false); setIsOpen(false); }}>
                          <Package size={14} className="me-3 text-warning" /> Track Order
                        </Link>
                      </li>
                      <li className="mb-1">
                        <Link to="/support" className="dropdown-item d-flex align-items-center premium-dropdown-item py-2 px-3" onClick={() => { setShowMore(false); setIsOpen(false); }}>
                          <Link2 size={14} className="me-3 text-secondary" /> Support
                        </Link>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
              
            </ul>

            {/* Mobile Sidebar Navigation */}
            <div className="d-xl-none w-100 pb-5">
              <div className="fw-bold text-theme-title mb-3" style={{ fontSize: '1rem' }}>Categories</div>
              <ul className="list-unstyled d-flex flex-column gap-1 mb-4">
                {megaMenuCategories.map((col, idx) => (
                  <li key={idx} className="border-bottom border-secondary border-opacity-25 pb-1 mb-1">
                    <div 
                      className="d-flex align-items-center justify-content-between p-2 rounded-3 text-theme-title" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => setExpandedMobileCategory(expandedMobileCategory === idx ? null : idx)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', border: '1px solid var(--bb-border)', backgroundColor: 'var(--bb-surface-2)', flexShrink: 0 }}>
                          <img src={getCategoryCover(col.items[0]?.name || '', col.items[0]?.imageUrl || '')} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain', objectPosition: 'center' }} />
                        </div>
                        <span className="fw-bold text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>{col.title}</span>
                      </div>
                      <ChevronDown size={18} className={`transition-all text-theme-muted ${expandedMobileCategory === idx ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                      {expandedMobileCategory === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <ul className="list-unstyled ps-5 ms-3 pe-2 py-2 mb-0 d-flex flex-column gap-3">
                            {col.items.map((item, i) => (
                              <li key={i}>
                                <Link 
                                  to={`/products?category=${item.slug}`} 
                                  className="text-decoration-none text-theme-muted text-truncate d-block fw-semibold hover-text-primary" 
                                  onClick={() => setIsOpen(false)} 
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>

              {/* Other Links */}
              <ul className="list-unstyled d-flex flex-column gap-3 border-top border-secondary border-opacity-25 pt-4 ps-2">
                <li><Link to="/products?category=new" className="text-decoration-none text-theme-title fw-semibold d-block" onClick={() => setIsOpen(false)}>New Arrivals</Link></li>
                <li><Link to="/gifting" className="text-decoration-none text-theme-title fw-semibold d-block" onClick={() => setIsOpen(false)}>Corporate Gifting</Link></li>
                <li><Link to="/support" className="text-decoration-none text-theme-title fw-semibold d-block" onClick={() => setIsOpen(false)}>Warranty Registration</Link></li>
                <li><Link to="/support" className="text-decoration-none text-theme-title fw-semibold d-block" onClick={() => setIsOpen(false)}>Support</Link></li>
                {!user && <li><Link to="/login" className="text-decoration-none text-theme-title fw-semibold d-block" onClick={() => setIsOpen(false)}>Login</Link></li>}
                <li><Link to="/orders" className="text-decoration-none text-theme-title fw-semibold d-block" onClick={() => setIsOpen(false)}>Track your order</Link></li>
              </ul>
            </div>

            {/* Right: Search bar & Utility Icons */}
            <div className="d-flex flex-column flex-xl-row align-items-stretch align-items-xl-center gap-3">

              {/* Search Pill */}
              {/* Search Pill */}
              <form onSubmit={handleSearchSubmit} className="position-relative d-none d-xl-block">
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
                      style={{ background: 'var(--bb-bg-navy)', border: '1px solid var(--bb-border)', zIndex: 10500, overflow: 'hidden' }}
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
              <div className="d-flex align-items-center justify-content-center gap-3 mt-2 mt-xl-0 text-theme-title">

                {/* Shopping Cart Trigger */}
                <button
                  className="btn border-0 p-2 position-relative text-theme-muted hover-scale d-none d-xl-block"
                  onClick={() => navigate('/cart')}
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

                {/* Compare Trigger */}
                <Link
                  to="/compare"
                  className="btn border-0 p-2 position-relative text-theme-muted hover-scale d-none d-xl-block"
                  style={{ background: 'transparent', transition: 'all 0.2s' }}
                  title="Compare Products"
                >
                  <Scale size={20} />
                  {compareCount > 0 && (
                    <span
                      className="position-absolute translate-middle badge rounded-pill cart-pulse-badge"
                      style={{
                        top: '4px',
                        right: '-2px',
                        fontSize: '0.65rem',
                        padding: '3px 6px',
                        background: 'var(--bb-accent)'
                      }}
                    >
                      {compareCount}
                    </span>
                  )}
                </Link>

                {/* Notifications Bell */}
                <div className="d-none d-xl-block">
                  <NotificationsPanel />
                </div>

                {/* Profile / Account Dropdown */}
                <div className="d-none d-xl-block">
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
                            {user.fullName?.split(' ')[0] || 'User'}
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
                          background: 'var(--bb-bg-navy)',
                          border: '1px solid var(--bb-border)',
                          borderRadius: '18px',
                          boxShadow: '0 20px 45px rgba(0,0,0,0.25)'
                        }}
                      >

                        {renderProfileMenu()}

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
                <div className="d-none d-xl-block">
                  <ThemeToggle isFloating={false} />
                </div>

              </div>

            </div>

          </div>
        </div>
      </nav>

    </header>
  )
}
