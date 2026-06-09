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
  Package,
  Watch,
  Link2,
  BatteryCharging,
  Scissors
} from 'lucide-react'
import logo from '../../assets/beatbox_logo.png'
import heroEarbuds from '../../assets/hero_earbuds.png'
import smartEarbuds from '../../assets/smart_earbuds.png'
import heroHeadphones from '../../assets/hero_headphones.png'
import wirelessNeckband from '../../assets/wireless_neckband.png'
import gamingHeadset from '../../assets/gaming_headset.png'
import heroWired from '../../assets/hero_wired.png'
import heroSmartwatch from '../../assets/hero_smartwatch.png'
import heroSpeaker from '../../assets/hero_speaker.png'
import powerBank from '../../assets/power_bank.png'
import soundbar from '../../assets/soundbar.png'
import dashCam from '../../assets/dash_cam.png'
import projector from '../../assets/projector.png'
import actionCam from '../../assets/action_cam.png'
import gamingMouse from '../../assets/gaming_mouse.png'
import trimmer from '../../assets/trimmer.png'
import keyboardMouse from '../../assets/keyboard_mouse.png'
import carCharger from '../../assets/car_charger.png'
import portableFan from '../../assets/portable_fan.png'
import premiumCables from '../../assets/cables.png'
import wirelessCharger from '../../assets/wireless_charger.png'
import mobileHolder from '../../assets/mobile_holder.png'
import laptopStand from '../../assets/laptop_stand.png'
import usbHub from '../../assets/usb_hub.png'
import laptopBag from '../../assets/laptop_bag.png'
import tyreInflator from '../../assets/tyre_inflator.png'
import vacuumCleaner from '../../assets/vacuum_cleaner.png'
import hairDryer from '../../assets/hair_dryer.png'
import electricKettle from '../../assets/electric_kettle.png'
import smartTracker from '../../assets/smart_tracker.png'
import phoneWallet from '../../assets/phone_wallet.png'
import wiredEarphones from '../../assets/wired_earphones.png'
import gamingKeyboard from '../../assets/gaming_keyboard.png'
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
  const [showMore, setShowMore] = useState(false)
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

  const getMegaMenuImage = (name) => {
    const n = name.toLowerCase();
    
    // Audio
    if (n.includes('soundbar') || n.includes('tv')) return soundbar;
    if (n.includes('tws') || n.includes('earbud')) return smartEarbuds;
    if (n.includes('wired')) return wiredEarphones;
    if (n.includes('headphone') || n.includes('earphone')) return heroHeadphones;
    if (n.includes('neckband')) return wirelessNeckband;
    if (n.includes('speaker') || n.includes('mic')) return heroSpeaker;
    
    // Mobile Accessories
    if (n.includes('power bank') || n.includes('battery')) return powerBank;
    if (n.includes('cable') || n.includes('wire') || n.includes('organiser')) return premiumCables;
    if (n.includes('wireless charger')) return wirelessCharger;
    if (n.includes('charger') || n.includes('adapter')) return carCharger;
    if (n.includes('holder') || n.includes('stand')) return mobileHolder;
    if (n.includes('wallet')) return phoneWallet;
    if (n.includes('cleaner')) return trimmer;

    // Computer Accessories
    if (n.includes('keyboard')) return gamingKeyboard;
    if (n.includes('mouse') || n.includes('pad')) return gamingMouse;
    if (n.includes('laptop bag')) return laptopBag;
    if (n.includes('laptop') || n.includes('board') || n.includes('table')) return laptopStand;
    if (n.includes('hub')) return usbHub;
    if (n.includes('projector') || n.includes('presenter')) return projector;

    // Car Accessories
    if (n.includes('car charger')) return carCharger;
    if (n.includes('inflator') || n.includes('washer')) return tyreInflator;
    if (n.includes('vacuum') || n.includes('cleaner')) return vacuumCleaner;
    if (n.includes('car') || n.includes('bike') || n.includes('dash')) return dashCam;

    // Smart Gadgets
    if (n.includes('watch') || n.includes('band') || n.includes('timer')) return heroSmartwatch;
    if (n.includes('tracker')) return smartTracker;
    if (n.includes('hair') || n.includes('dryer')) return hairDryer;
    if (n.includes('kettle')) return electricKettle;
    if (n.includes('trimmer') || n.includes('shaver') || n.includes('ear')) return trimmer;
    if (n.includes('fan') || n.includes('blower') || n.includes('humidifier')) return portableFan;
    if (n.includes('sealer') || n.includes('massager')) return powerBank;
    if (n.includes('stick') || n.includes('flashlight') || n.includes('stylus')) return actionCam;
    
    return heroEarbuds; // Ultimate fallback
  }

  const [megaMenuCategories, setMegaMenuCategories] = useState([
    {
      title: "Audio",
      expanded: false,
      items: ["Soundbars", "Party Speakers", "Portable Speakers", "TWS", "Neckbands", "Wireless Headphones", "Wired Earphones", "USB Speakers", "Conference Speakers", "Wireless Microphones"]
    },
    {
      title: "Mobile Accessories",
      expanded: false,
      items: ["Power bank", "Cables", "Wireless Charger", "Chargers", "Mobile Holder", "Gadget Cleaners", "Phone Wallet", "Cable Organiser"]
    },
    {
      title: "Computer Accessories",
      expanded: false,
      items: ["Keyboard And Mouse", "Wireless Keyboard", "Wired Keyboard", "Gaming Keyboard", "Wireless Mouse", "Wired Mouse", "Laptop Stand", "Laptop Table", "Extension Board", "Projectors", "USB Hub", "LCD Writing Pads", "Laptop Bags", "Computer Cables", "Wireless Presenter"]
    },
    {
      title: "Car Accessories",
      expanded: false,
      items: ["Car Charger", "Car Bluetooth", "Tyre Inflator", "Car Mobile Holder", "Bike Mobile Holder", "Vacuum Cleaner", "Car Wireless Charger", "Pressure Washer"]
    },
    {
      title: "Smart Gadgets",
      expanded: false,
      items: ["Ear Cleaners", "Portable Fans", "Selfie Stick", "Flashlight", "Stylus", "Location tracker", "Electric Kettle", "Hair Dryer", "Tool Kit", "Humidifiers", "Air Blower", "Timers", "Massagers", "smart Sealers", "Rechargeable Battery"]
    }
  ])

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
                    background: 'var(--bb-bg-navy)',
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
                  {user.roles && user.roles.includes('Admin') && (
                    <li>
                      <Link to="/admin" className="dropdown-item premium-dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 fw-bold text-primary">
                        🛡️ Admin Dashboard
                      </Link>
                    </li>
                  )}
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
                          gridTemplateColumns: window.innerWidth > 992 ? 'repeat(5, 1fr)' : 'repeat(2, 1fr)',
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
                              {col.items.slice(0, col.expanded ? col.items.length : 5).map((item, i) => (
                                <li key={i}>
                                  <Link
                                    to={`/products?q=${encodeURIComponent(item.toLowerCase())}`}
                                    className="text-decoration-none text-theme-title transition-all d-flex align-items-center gap-3 mega-menu-item"
                                    style={{ fontSize: '0.85rem', fontWeight: 600 }}
                                    onClick={() => { setShowCategories(false); setIsOpen(false); }}
                                  >
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', flexShrink: 0 }}>
                                      <img src={getMegaMenuImage(item)} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                    </div>
                                    <span className="text-theme-muted transition-all text-start mega-menu-text" style={{ lineHeight: '1.2' }}>{item}</span>
                                  </Link>
                                </li>
                              ))}
                              {col.items.length > 5 && (
                                <li className="mt-2 text-center">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const newCategories = [...megaMenuCategories];
                                      newCategories[idx].expanded = !newCategories[idx].expanded;
                                      setMegaMenuCategories(newCategories);
                                    }}
                                    className="btn btn-sm w-100 fw-bold rounded-pill border-0"
                                    style={{ fontSize: '0.8rem', background: 'var(--bb-primary-light)', color: '#fff' }}
                                  >
                                    {col.expanded ? 'View Less' : `View All (${col.items.length})`}
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li className="nav-item">
                <Link to="/products?sale=true" className="nav-link premium-nav-link py-2 text-danger fw-bold d-flex align-items-center gap-1" onClick={() => setIsOpen(false)}>
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

                        {user.roles && user.roles.includes('Admin') && (
                          <li>
                            <Link
                              to="/admin"
                              className="dropdown-item premium-dropdown-item rounded-3 py-3 d-flex align-items-center gap-2 fw-bold text-primary"
                            >
                              🛡️ Admin Dashboard
                            </Link>
                          </li>
                        )}

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
