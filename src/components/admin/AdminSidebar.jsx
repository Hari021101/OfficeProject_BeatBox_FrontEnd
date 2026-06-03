import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Archive 
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { id: 'inventory', label: 'Inventory', icon: Archive, path: '/admin/inventory' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
]

export default function AdminSidebar({ isSidebarOpen, isMobile, activeNavItem, setIsSidebarOpen }) {
  return (
    <>
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
    </>
  )
}
