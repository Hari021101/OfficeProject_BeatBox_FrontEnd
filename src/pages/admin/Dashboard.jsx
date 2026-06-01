import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  IndianRupee, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Package, 
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { orderService } from '../../services/orderService'

const MetricCard = ({ title, value, trend, isPositive, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card border-0 h-100 p-4"
    style={{ 
      background: 'var(--bb-surface)', 
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
    }}
  >
    <div className="d-flex justify-content-between align-items-start mb-3">
      <div>
        <p className="text-theme-muted fw-bold mb-1" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </p>
        <h3 className="fw-black text-theme-title mb-0">{value}</h3>
      </div>
      <div 
        className="d-flex align-items-center justify-content-center rounded-3"
        style={{ width: '48px', height: '48px', background: 'rgba(0, 243, 255, 0.1)', color: 'var(--bb-accent)' }}
      >
        <Icon size={24} />
      </div>
    </div>
    
    <div className="d-flex align-items-center gap-2 mt-auto pt-3 border-top border-secondary border-opacity-25">
      <span 
        className={`d-flex align-items-center fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}
        style={{ fontSize: '0.85rem' }}
      >
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trend}
      </span>
      <span className="text-theme-muted" style={{ fontSize: '0.8rem' }}>vs last month</span>
    </div>
  </motion.div>
)

export default function Dashboard() {
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    // Fetch actual recent orders to make it somewhat dynamic
    const loadRecentOrders = async () => {
      try {
        const orders = await orderService.getAllOrders()
        if (orders && orders.length > 0) {
          // Sort by newest first and take top 5
          const sorted = [...orders].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 5)
          setRecentOrders(sorted)
        }
      } catch (e) {
        console.error("Failed to load recent orders", e)
      }
    }
    loadRecentOrders()
  }, [])

  return (
    <div className="py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Dashboard Overview</h2>
          <p className="text-theme-muted mb-0">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <button className="btn btn-glow d-flex align-items-center gap-2 px-4 py-2 fw-bold" style={{ borderRadius: '10px' }}>
          <Activity size={18} /> Generate Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Total Revenue" 
            value="₹4,25,890" 
            trend="+12.5%" 
            isPositive={true} 
            icon={IndianRupee} 
            delay={0.1} 
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Total Orders" 
            value="1,248" 
            trend="+8.2%" 
            isPositive={true} 
            icon={ShoppingCart} 
            delay={0.2} 
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Active Users" 
            value="8,492" 
            trend="+18.4%" 
            isPositive={true} 
            icon={Users} 
            delay={0.3} 
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Conversion Rate" 
            value="3.2%" 
            trend="-1.1%" 
            isPositive={false} 
            icon={TrendingUp} 
            delay={0.4} 
          />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-12 col-xl-8">
          <div 
            className="card border-0 h-100 p-4"
            style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold text-theme-title mb-0">Recent Orders</h5>
              <button className="btn border-0 text-accent fw-bold p-0">View All</button>
            </div>
            
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 text-theme-text">
                <thead style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  <tr>
                    <th className="py-3 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Order ID</th>
                    <th className="py-3 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Customer</th>
                    <th className="py-3 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
                    <th className="py-3 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Amount</th>
                    <th className="py-3 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-theme-muted">No recent orders.</td></tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr key={order.orderId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td className="py-3 fw-bold text-theme-title">#{order.orderId.toString().slice(-6)}</td>
                        <td className="py-3">
                          <span className="d-inline-block text-truncate text-theme-muted" style={{ maxWidth: '120px', fontSize: '0.9rem' }}>
                            {order.userId}
                          </span>
                        </td>
                        <td className="py-3 text-theme-muted" style={{ fontSize: '0.9rem' }}>
                          {new Date(order.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3 fw-black text-theme-title">₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span 
                            className="badge rounded-pill px-3 py-2"
                            style={{ 
                              background: order.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 
                                          order.status === 'Processing' ? 'rgba(168,32,255,0.1)' :
                                          order.status === 'Shipped' ? 'rgba(0,243,255,0.1)' :
                                          order.status === 'Delivered' ? 'rgba(57,255,20,0.1)' : 'rgba(239,68,68,0.1)',
                              color: order.status === 'Pending' ? '#f59e0b' : 
                                     order.status === 'Processing' ? '#a820ff' :
                                     order.status === 'Shipped' ? '#00f3ff' :
                                     order.status === 'Delivered' ? '#39ff14' : '#ef4444',
                              border: `1px solid currentColor`,
                              fontWeight: 'bold'
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products / Inventory alert */}
        <div className="col-12 col-xl-4">
          <div 
            className="card border-0 h-100 p-4"
            style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold text-theme-title mb-0">Low Stock Alerts</h5>
              <div className="p-2 rounded-circle" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <Package size={18} />
              </div>
            </div>
            
            <div className="d-flex flex-column gap-3">
              {[
                { name: "Rockerz Pro ANC 550", stock: 3, category: "Headphones" },
                { name: "Airdopes Cyber 141", stock: 8, category: "Earbuds" },
                { name: "Stone Beat Beast 1200", stock: 1, category: "Speakers" },
              ].map((item, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                  <div>
                    <h6 className="fw-bold text-theme-title mb-1" style={{ fontSize: '0.9rem' }}>{item.name}</h6>
                    <p className="text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>{item.category}</p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-danger rounded-pill px-2 py-1 mb-1">{item.stock} left</span>
                    <p className="text-danger fw-bold mb-0" style={{ fontSize: '0.7rem' }}>Restock ASAP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
