import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { LogOut, Menu, User as UserIcon, ChevronLeft, X } from 'lucide-react'
import logo from '../../assets/beatbox_logo.png'
import { logout } from '../../redux/authSlice'
import { toast } from 'react-hot-toast'
import AdminSidebar, { NAV_ITEMS } from '../admin/AdminSidebar'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 992
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false)
  }, [location.pathname, isMobile])

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Admin logged out')
    navigate('/login')
  }

  const sidebarWidth = isSidebarOpen ? '260px' : '0px'
  const activeNavItem = NAV_ITEMS.find(item => location.pathname.includes(item.path))?.id || 'dashboard'

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--bb-bg-navy)', overflow: 'hidden' }}>

      {/* ── TOP NAVBAR ────────────────────────────────────────── */}
      <nav
        className="navbar fixed-top px-2 px-md-4"
        style={{
          height: '62px',
          background: 'var(--bb-surface)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--bb-border)',
          zIndex: 1040
        }}
      >
        <div className="d-flex align-items-center w-100 gap-2">

          {/* Hamburger */}
          <button
            className="btn border-0 text-theme-title p-1 flex-shrink-0 hover-scale"
            onClick={() => setIsSidebarOpen(prev => !prev)}
            aria-label="Toggle sidebar"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
          >
            {isSidebarOpen && isMobile ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 me-2 me-md-4">
            <img src={logo} alt="BeatBox" style={{ width: '30px', height: '30px', borderRadius: '8px' }} />
            <span className="fw-black text-theme-title" style={{ fontSize: '1rem' }}>
              BEAT<span className="gradient-text">BOX</span>{' '}
              <span className="text-theme-muted fw-normal d-none d-sm-inline" style={{ fontSize: '0.72rem' }}>Admin</span>
            </span>
          </Link>

          {/* Breadcrumb / current page — tablet+ */}
          <div className="d-none d-md-flex align-items-center gap-2 ms-2">
            <span style={{ color: 'var(--bb-border)', fontSize: '1.2rem' }}>/</span>
            <span className="text-theme-muted fw-semibold" style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
              {activeNavItem.replace('-', ' ')}
            </span>
          </div>

          <div className="ms-auto d-flex align-items-center gap-2">
            {/* Exit admin — md+ */}
            <Link
              to="/"
              className="btn btn-sm border-0 d-none d-md-flex align-items-center gap-1 text-theme-muted hover-scale"
              style={{ borderRadius: '10px', fontSize: '0.85rem' }}
            >
              <ChevronLeft size={15} /> Exit Admin
            </Link>

            {/* User dropdown */}
            <div className="dropdown">
              <button className="btn border-0 p-0 d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00f3ff, #a820ff)' }}
                >
                  <UserIcon size={16} color="#fff" />
                </div>
                <div className="text-start d-none d-md-block">
                  <p className="mb-0 fw-bold text-theme-title" style={{ fontSize: '0.82rem', lineHeight: 1.2 }}>
                    {user?.fullName?.split(' ')[0] || 'Admin'}
                  </p>
                  <p className="mb-0 text-theme-muted" style={{ fontSize: '0.68rem' }}>Super Admin</p>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-2 mt-2" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', borderRadius: '12px', minWidth: '160px' }}>
                <li>
                  <Link to="/" className="dropdown-item py-2 text-theme-muted d-flex align-items-center gap-2 rounded-2" style={{ fontSize: '0.875rem' }}>
                    <ChevronLeft size={14} /> Exit Admin
                  </Link>
                </li>
                <li><hr className="dropdown-divider" style={{ borderColor: 'var(--bb-border)' }} /></li>
                <li>
                  <button className="dropdown-item py-2 text-danger fw-bold d-flex align-items-center gap-2 rounded-2" onClick={handleLogout} style={{ fontSize: '0.875rem' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="d-flex flex-grow-1" style={{ marginTop: '62px', position: 'relative' }}>

        {/* Sidebar */}
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          activeNavItem={activeNavItem}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main content */}
        <main
          className="flex-grow-1 p-3 p-lg-4"
          style={{
            minWidth: 0,                      // prevent flex overflow
            maxWidth: isMobile ? '100%' : `calc(100% - ${sidebarWidth})`,
            transition: 'max-width 0.3s ease',
            overflowX: 'hidden',
            paddingBottom: isMobile ? '80px' : undefined // room for bottom nav
          }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV (visible < 992px) ──────────── */}
      {isMobile && (
        <nav
          className="d-flex d-lg-none position-fixed bottom-0 start-0 w-100"
          style={{
            height: '60px',
            background: 'var(--bb-surface)',
            borderTop: '1px solid var(--bb-border)',
            zIndex: 1035,
            backdropFilter: 'blur(20px)',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        >
          {NAV_ITEMS.slice(0, 5).map(item => {
            const Icon = item.icon
            const isActive = activeNavItem === item.id
            return (
              <Link
                key={item.id}
                to={item.path}
                className="d-flex flex-column align-items-center justify-content-center gap-1 text-decoration-none"
                style={{
                  flex: 1,
                  height: '100%',
                  color: isActive ? 'var(--bb-accent)' : 'var(--bb-muted)',
                  transition: 'color 0.2s',
                  position: 'relative'
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="position-absolute top-0 start-50"
                    style={{ width: '28px', height: '2px', background: 'var(--bb-accent)', borderRadius: '0 0 4px 4px', transform: 'translateX(-50%)' }}
                  />
                )}
                <Icon size={20} />
                <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.3px' }}>
                  {item.label.split(' ')[0]}
                </span>
              </Link>
            )
          })}

          {/* "More" button for items beyond 5 */}
          <button
            className="d-flex flex-column align-items-center justify-content-center gap-1 border-0"
            style={{ flex: 1, height: '100%', background: 'transparent', color: 'var(--bb-muted)', cursor: 'pointer' }}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
            <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.3px' }}>More</span>
          </button>
        </nav>
      )}
    </div>
  )
}
