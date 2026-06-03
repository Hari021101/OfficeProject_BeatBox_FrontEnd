import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { LogOut, Menu, User as UserIcon, ChevronLeft } from 'lucide-react'
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
        <AdminSidebar 
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          activeNavItem={activeNavItem}
          setIsSidebarOpen={setIsSidebarOpen}
        />

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
