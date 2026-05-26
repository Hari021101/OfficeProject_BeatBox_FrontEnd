import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Package, Clock, Truck, CheckCircle, XCircle, Search as SearchIcon } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const STATUS_CONFIG = {
  Pending:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  Processing: { color: '#a820ff', bg: 'rgba(168,32,255,0.1)', icon: Package },
  Shipped:    { color: '#00f3ff', bg: 'rgba(0,243,255,0.1)',  icon: Truck },
  Delivered:  { color: '#39ff14', bg: 'rgba(57,255,20,0.08)', icon: CheckCircle },
  Cancelled:  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: XCircle },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()

  // Authentication & Role check
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    // If not logged in or not admin, redirect
    // (Assuming simple client-side check. Backend still protects the data).
    if (!user) {
      navigate('/login')
      return;
    }
    fetchOrders()
  }, [user, navigate])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await orderService.getAllOrders()
      setOrders(data || [])
    } catch (err) {
      toast.error('Failed to load orders. Are you an admin?')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      await orderService.updateOrderStatus(orderId, newStatus)
      toast.success(`Order #${orderId} status updated to ${newStatus}`)
      
      // Optimistic update
      setOrders(prev => prev.map(o => 
        o.orderId === orderId ? { ...o, status: newStatus } : o
      ))
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = orders.filter(o => 
    o.orderId.toString().includes(searchQuery) ||
    o.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fmt = (amount) => Number(amount || 0).toLocaleString('en-IN')
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 pb-5 pt-4" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      <div className="container-fluid px-lg-5">
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-black text-theme-title mb-1">Order Management</h2>
            <p className="text-theme-muted mb-0">Manage and track all customer orders</p>
          </div>
          
          <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
            <SearchIcon size={18} className="position-absolute top-50 translate-middle-y ms-3 text-theme-muted" />
            <input 
              type="text" 
              className="form-control premium-search-input ps-5"
              placeholder="Search by ID or Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-responsive rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <table className="table table-borderless align-middle mb-0" style={{ color: 'var(--bb-text)' }}>
            <thead style={{ borderBottom: '1px solid var(--bb-border)', background: 'rgba(0,0,0,0.2)' }}>
              <tr>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Order ID</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Date</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>User ID</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Total Amount</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Status</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-theme-muted">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending
                  const Icon = cfg.icon

                  return (
                    <motion.tr 
                      key={order.orderId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td className="py-3 px-4 fw-bold text-theme-title">
                        #{order.orderId.toString().slice(-6)}
                      </td>
                      <td className="py-3 px-4 text-theme-muted" style={{ fontSize: '0.9rem' }}>
                        {fmtDate(order.createdDate)}
                      </td>
                      <td className="py-3 px-4 text-theme-muted" style={{ fontSize: '0.85rem' }}>
                        <span className="d-inline-block text-truncate" style={{ maxWidth: '120px' }}>
                          {order.userId}
                        </span>
                      </td>
                      <td className="py-3 px-4 fw-black text-theme-title">
                        ₹{fmt(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <div 
                          className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-bold"
                          style={{ 
                            background: cfg.bg, 
                            border: `1px solid ${cfg.color}40`, 
                            color: cfg.color,
                            fontSize: '0.75rem' 
                          }}
                        >
                          <Icon size={12} /> {order.status}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          className="form-select form-select-sm premium-search-input"
                          style={{ width: '140px', fontSize: '0.85rem' }}
                          value={order.status}
                          disabled={updatingId === order.orderId || order.status === 'Cancelled' || order.status === 'Delivered'}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled" disabled>Cancelled</option>
                        </select>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
