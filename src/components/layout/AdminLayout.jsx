import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Archive, 
  LogOut, 
  Menu,
  X,
  User as UserIcon,
  ChevronLeft
} from 'lucide-react'
import logo from '../../assets/beatbox_logo.png'
import { logout } from '../../redux/authSlice'
import { toast } from 'react-hot-toast'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { id: 'inventory', label: 'Inventory', icon: Archive, path: '/admin/inventory' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
]

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
      if (mobile) setIsSidebarOpen(false)
      else setIsSidebarOpen(true)
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
    toast.success("Admin logged out")
    navigate('/login')
  }

  const sidebarWidth = isSidebarOpen ? '260px' : '0px'
  const activeNavItem = NAV_ITEMS.find(item => location.pathname.includes(item.path))?.id || 'dashboard'

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--bb-bg-navy)', overflow: 'hidden' }}>
      
      {/* ── TOP NAVBAR ────────────────────────────────────────── */}
      <nav 
        className="navbar fixed-top px-3 px-lg-4"
        style={{ 
          height: '70px', 
          background: 'var(--bb-surface)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--bb-border)',
          zIndex: 1040
        }}
      >
        <div className="d-flex align-items-center w-100">
          <button 
            className="btn border-0 text-theme-title p-1 me-3 hover-scale"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 me-4">
            <img src={logo} alt="BeatBox" style={{ width: '32px', height: '32px' }} className="rounded-3" />
            <span className="fw-black fs-5 text-theme-title d-none d-sm-block">
              BEAT<span className="gradient-text">BOX</span> <span className="text-theme-muted fw-normal" style={{ fontSize: '0.8rem' }}>Admin</span>
            </span>
          </Link>

          <div className="ms-auto d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-sm border-0 d-none d-md-flex align-items-center gap-1 text-theme-muted hover-scale">
              <ChevronLeft size={16} /> Exit Admin
            </Link>
            
            <div className="dropdown">
              <button 
                className="btn border-0 p-0 d-flex align-items-center gap-2" 
                data-bs-toggle="dropdown"
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00f3ff, #a820ff)' }}
                >
                  <UserIcon size={18} color="#fff" />
                </div>
                <div className="text-start d-none d-md-block">
                  <p className="mb-0 fw-bold text-theme-title" style={{ fontSize: '0.85rem' }}>{user?.fullName || 'Admin'}</p>
                  <p className="mb-0 text-theme-muted" style={{ fontSize: '0.7rem' }}>Super Admin</p>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-2 mt-3" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', borderRadius: '12px' }}>
                <li><button className="dropdown-item py-2 text-danger fw-bold d-flex align-items-center gap-2 rounded-2" onClick={handleLogout}><LogOut size={16} /> Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1" style={{ marginTop: '70px', position: 'relative' }}>
        
        {/* ── SIDEBAR ────────────────────────────────────────── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{
                width: '260px',
                position: isMobile ? 'fixed' : 'relative',
                top: isMobile ? '70px' : 0,
                bottom: 0,
                left: 0,
                background: 'var(--bb-surface)',
                borderRight: '1px solid var(--bb-border)',
                zIndex: 1030,
                overflowY: 'auto'
              }}
              className="d-flex flex-column"
            >
              <div className="p-3 d-flex flex-column gap-2 mt-2">
                <span className="small text-theme-muted fw-bold ps-3 mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Menu</span>
                
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = activeNavItem === item.id
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`btn w-100 text-start d-flex align-items-center gap-3 px-3 py-3 rounded-4 fw-bold transition-all`}
                      style={{
                        background: isActive ? 'linear-gradient(90deg, rgba(0, 243, 255, 0.1), transparent)' : 'transparent',
                        color: isActive ? 'var(--bb-accent)' : 'var(--bb-muted)',
                        border: isActive ? '1px solid rgba(0, 243, 255, 0.2)' : '1px solid transparent',
                        fontSize: '0.95rem'
                      }}
                    >
                      <Icon size={20} className={isActive ? 'text-accent' : ''} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Backdrop Overlay */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: '70px 0 0 0',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 1020
              }}
            />
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT AREA ────────────────────────────────────────── */}
        <main 
          className="flex-grow-1 p-3 p-lg-4"
          style={{
            maxWidth: isMobile ? '100%' : `calc(100% - ${sidebarWidth})`,
            transition: 'max-width 0.3s ease',
            overflowX: 'hidden'
          }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>

      </div>
    </div>
  )
}
