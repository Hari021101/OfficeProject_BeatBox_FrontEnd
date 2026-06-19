import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  Package, ShoppingBag, ChevronRight, Clock, CheckCircle,
  Truck, XCircle, RefreshCw, ArrowRight, Filter
} from 'lucide-react'
import { fetchMyOrders, selectAllOrders, selectOrderStatus } from '../redux/orderSlice'
import logo from '../assets/beatbox_logo.png'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Pending:    { label: 'Pending',    color: '#f59e0b', glow: 'rgba(245,158,11,0.25)',  bg: 'rgba(245,158,11,0.1)',   Icon: Clock },
  Processing: { label: 'Processing', color: '#a820ff', glow: 'rgba(168,32,255,0.25)', bg: 'rgba(168,32,255,0.1)',  Icon: RefreshCw },
  Shipped:    { label: 'Shipped',    color: '#00f3ff', glow: 'rgba(0,243,255,0.25)',  bg: 'rgba(0,243,255,0.1)',   Icon: Truck },
  Delivered:  { label: 'Delivered',  color: '#39ff14', glow: 'rgba(57,255,20,0.25)',  bg: 'rgba(57,255,20,0.08)', Icon: CheckCircle },
  Cancelled:  { label: 'Cancelled',  color: '#ef4444', glow: 'rgba(239,68,68,0.25)',  bg: 'rgba(239,68,68,0.08)', Icon: XCircle },
}

const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png'

  if (path.startsWith('http')) return path

  return `http://localhost:5089${path}`
}

const TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="p-4 rounded-4"
      style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="skeleton-pulse rounded-2" style={{ width: 140, height: 18 }} />
        <div className="skeleton-pulse rounded-pill" style={{ width: 80, height: 26 }} />
      </div>
      <div className="skeleton-pulse rounded-2 mb-3" style={{ width: 200, height: 14 }} />
      <div className="d-flex gap-2 mb-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-pulse rounded-3" style={{ width: 56, height: 56 }} />
        ))}
      </div>
      <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid var(--bb-border)' }}>
        <div className="skeleton-pulse rounded-2" style={{ width: 100, height: 22 }} />
        <div className="skeleton-pulse rounded-3" style={{ width: 110, height: 38 }} />
      </div>
    </div>
  )
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, index }) {
  const navigate = useNavigate()
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending
  const StatusIcon = cfg.Icon
  const formattedDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : 'N/A'

  const items = order.items || []
  const visibleItems = items.slice(0, 3)
  const extraCount = items.length - 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.165, 0.84, 0.44, 1] }}
      className="order-card p-4 rounded-4"
      onClick={() => navigate(`/orders/${order.orderId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/orders/${order.orderId}`)}
      id={`order-card-${order.orderId}`}
    >
      {/* Header row */}
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2 flex-wrap">
        <div>
          <p className="text-theme-muted mb-0" style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Order ID
          </p>
          <span className="fw-black" style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--bb-accent)' }}>
            #{order.orderId?.toString().slice(-10) || order.orderId}
          </span>
        </div>
        {/* Status Badge */}
        <div
          className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-bold"
          style={{
            background: cfg.bg,
            border: `1px solid ${cfg.color}50`,
            color: cfg.color,
            fontSize: '0.75rem',
            boxShadow: `0 0 12px ${cfg.glow}`,
          }}
        >
          <StatusIcon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* Date */}
      <p className="text-theme-muted mb-3" style={{ fontSize: '0.8rem' }}>
        📅 Placed on {formattedDate}
      </p>

      {/* Item thumbnails */}
      {visibleItems.length > 0 && (
        <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
          {visibleItems.map((item, i) => (
            <div
              key={i}
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: 54, height: 54,
                background: 'var(--bb-surface-2)',
                border: '1px solid var(--bb-border)',
                fontSize: '0.65rem',
                color: 'var(--bb-muted)',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <div className="text-center px-1">
 <img
  src={getImageUrl(item.productImageUrl)}
  alt={item.productName}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }}
/>
                <div style={{ fontSize: '0.55rem', marginTop: 2, color: 'var(--bb-muted)', lineHeight: 1.2 }}>
                  {item.productName?.split(' ')[0] || 'Item'}
                </div>
              </div>
            </div>
          ))}
          {extraCount > 0 && (
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: 54, height: 54,
                background: 'var(--bb-surface-2)',
                border: '1px solid var(--bb-border)',
                color: 'var(--bb-muted)',
                fontSize: '0.78rem',
              }}
            >
              +{extraCount}
            </div>
          )}
          <div className="ms-1">
            <p className="text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Footer: total + CTA */}
      <div
        className="d-flex justify-content-between align-items-center pt-3"
        style={{ borderTop: '1px solid var(--bb-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-theme-muted mb-0" style={{ fontSize: '0.72rem' }}>Order Total</p>
          <span className="fw-black text-theme-title" style={{ fontSize: '1.1rem' }}>
            ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
          </span>
        </div>
        <Link
          to={`/orders/${order.orderId}`}
          className="btn d-flex align-items-center gap-1 fw-bold"
          style={{
            background: 'rgba(0,243,255,0.08)',
            border: '1px solid rgba(0,243,255,0.25)',
            color: 'var(--bb-accent)',
            borderRadius: 10,
            fontSize: '0.82rem',
            padding: '8px 16px',
            transition: 'all 0.25s ease',
          }}
          id={`view-order-${order.orderId}`}
        >
          View Details <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ activeTab }) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="d-flex flex-column align-items-center justify-content-center text-center py-5"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="d-flex align-items-center justify-content-center rounded-circle mb-4"
        style={{
          width: 100, height: 100,
          background: 'radial-gradient(circle, rgba(0,243,255,0.1), rgba(168,32,255,0.08))',
          border: '2px dashed rgba(0,243,255,0.25)',
        }}
      >
        <Package size={40} style={{ color: 'var(--bb-accent)', opacity: 0.7 }} />
      </motion.div>
      <h5 className="fw-black text-theme-title mb-2">
        {activeTab === 'All' ? 'No orders yet' : `No ${activeTab} orders`}
      </h5>
      <p className="text-theme-muted mb-4" style={{ maxWidth: 320 }}>
        {activeTab === 'All'
          ? "You haven't placed any orders. Start shopping to see your orders here!"
          : `You don't have any ${activeTab.toLowerCase()} orders at the moment.`}
      </p>
      {activeTab === 'All' && (
        <button
          onClick={() => navigate('/products')}
          className="btn btn-glow px-5 py-2 fw-bold d-flex align-items-center gap-2"
          style={{ borderRadius: 12 }}
        >
          Shop Now <ArrowRight size={16} />
        </button>
      )}
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Orders() {
  const dispatch = useDispatch()
  const allOrders = useSelector(selectAllOrders)
  const status = useSelector(selectOrderStatus)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return allOrders
    return allOrders.filter(o => o.status === activeTab)
  }, [allOrders, activeTab])

  const isLoading = status === 'loading'
  const isFailed = status === 'failed'

  return (
    <div className="min-vh-100 storefront-wrapper pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {/* Background glows */}
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-primary-glow)', top: '5%', left: '-8%', filter: 'blur(140px)' }} />
      <div className="bg-glow-orb" style={{ width: 350, height: 350, background: 'var(--bb-accent-glow)', bottom: '10%', right: '-5%', filter: 'blur(140px)', animationDelay: '2s' }} />

      <div className="container-fluid px-3 px-lg-5 py-4 position-relative" style={{ zIndex: 1 }}>

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <div className="d-flex align-items-center gap-2 mb-1">
            <img src={logo} alt="BeatBox" style={{ width: 24, height: 24 }} />
            <span className="text-theme-muted small fw-semibold" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
              My Account
            </span>
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h1 className="fw-black mb-0" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', letterSpacing: '-1.5px', color: 'var(--bb-title-color)' }}>
              My <span className="gradient-text">Orders</span>
            </h1>
            {!isLoading && allOrders.length > 0 && (
              <span
                className="px-3 py-1 rounded-pill fw-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(168,32,255,0.2), rgba(0,243,255,0.15))',
                  border: '1px solid rgba(0,243,255,0.25)',
                  color: 'var(--bb-accent)',
                  fontSize: '0.82rem',
                }}
              >
                {allOrders.length} order{allOrders.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-theme-muted mt-2 mb-0" style={{ fontSize: '0.92rem' }}>
            Track, review, and manage all your purchases in one place.
          </p>
        </motion.div>

        {/* ── Filter Tabs ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="d-flex gap-2 mb-4 flex-wrap"
        >
          <Filter size={16} style={{ color: 'var(--bb-muted)', alignSelf: 'center', marginRight: 4 }} />
          {TABS.map(tab => {
            const isActive = activeTab === tab
            const count = tab === 'All' ? allOrders.length : allOrders.filter(o => o.status === tab).length
            return (
              <button
                key={tab}
                id={`order-tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className="btn fw-bold d-flex align-items-center gap-1"
                style={{
                  borderRadius: 50,
                  padding: '6px 18px',
                  fontSize: '0.82rem',
                  border: isActive ? '1px solid var(--bb-accent)' : '1px solid var(--bb-border)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0,243,255,0.15), rgba(168,32,255,0.1))'
                    : 'transparent',
                  color: isActive ? 'var(--bb-accent)' : 'var(--bb-muted)',
                  boxShadow: isActive ? '0 0 15px rgba(0,243,255,0.2)' : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {tab}
                {count > 0 && (
                  <span
                    className="rounded-pill px-1"
                    style={{
                      background: isActive ? 'rgba(0,243,255,0.2)' : 'var(--bb-surface-2)',
                      color: isActive ? 'var(--bb-accent)' : 'var(--bb-muted)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      minWidth: 18,
                      textAlign: 'center',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </motion.div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        {isFailed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-4 text-center"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <XCircle size={40} style={{ color: '#ef4444' }} className="mb-3" />
            <h5 className="fw-black text-danger mb-2">Could not load orders</h5>
            <p className="text-theme-muted mb-3 small">
              There was a problem fetching your orders. Please try again.
            </p>
            <button
              className="btn btn-glow px-4 py-2 fw-bold"
              style={{ borderRadius: 10 }}
              onClick={() => dispatch(fetchMyOrders())}
            >
              Retry
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <div className="row g-4" key={activeTab}>
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="col-12 col-md-6 col-xl-4">
                    <SkeletonCard />
                  </div>
                ))
              ) : filteredOrders.length === 0 ? (
                <div className="col-12">
                  <EmptyState activeTab={activeTab} />
                </div>
              ) : (
                filteredOrders.map((order, idx) => (
                  <div key={order.orderId} className="col-12 col-md-6 col-xl-4">
                    <OrderCard order={order} index={idx} />
                  </div>
                ))
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
