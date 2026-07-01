import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft, Printer, Package, MapPin, CreditCard,
  Clock, CheckCircle, Truck, XCircle, RefreshCw,
  ShoppingBag, Receipt, Download
} from 'lucide-react'
import {
  fetchOrderById,
  clearCurrentOrder,
  selectCurrentOrder,
  selectOrderDetailStatus,
  cancelOrderThunk
} from '../redux/orderSlice'
import OrderTimeline from '../components/ui/OrderTimeline'
import logo from '../assets/beatbox_logo.png'
import { orderService } from '../services/orderService'
import { getImageUrl } from '../config/api'


// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', Icon: Clock },
  Processing: { label: 'Processing', color: '#a820ff', bg: 'rgba(168,32,255,0.1)', Icon: RefreshCw },
  Shipped: { label: 'Shipped', color: '#00f3ff', bg: 'rgba(0,243,255,0.1)', Icon: Truck },
  Delivered: { label: 'Delivered', color: '#39ff14', bg: 'rgba(57,255,20,0.08)', Icon: CheckCircle },
  Cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', Icon: XCircle },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount) {
  return Number(amount || 0).toLocaleString('en-IN')
}

function fmtDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function estimatedDelivery(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 5)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="d-flex flex-column gap-4">
      {[180, 280, 200, 180].map((h, i) => (
        <div
          key={i}
          className="skeleton-pulse rounded-4"
          style={{ height: h, width: '100%' }}
        />
      ))}
    </div>
  )
}

// ─── Section Card Wrapper ─────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children, id, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-4 mb-4"
      id={id}
      style={{
        background: 'var(--bb-surface)',
        border: `1px solid ${accent ? 'rgba(0,243,255,0.25)' : 'var(--bb-border)'}`,
        boxShadow: accent ? '0 0 30px rgba(0,243,255,0.06)' : 'none',
      }}
    >
      <h6
        className="fw-black text-theme-title mb-4 d-flex align-items-center gap-2 pb-3"
        style={{ borderBottom: '1px solid var(--bb-border)', fontSize: '0.95rem' }}
      >
        <Icon size={16} style={{ color: 'var(--bb-accent)' }} />
        {title}
      </h6>
      {children}
    </motion.div>
  )
}

// ─── Print Invoice (hidden UI, print-visible) ─────────────────────────────────

function PrintInvoice({ order }) {
  if (!order) return null
  const items = order.items || []
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const gst = Math.round(subtotal * 0.18)
  const shipping = subtotal >= 999 ? 0 : 79
  const total = subtotal + gst + shipping

  return (
    <div className="invoice-print-only">
      {/* Invoice Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 pb-3" style={{ borderBottom: '2px solid #ddd' }}>
        <div>
          <h2 style={{ fontWeight: 900, letterSpacing: '-1px', color: '#1a1a2e' }}>
            BEAT<span style={{ color: '#7c3aed' }}>BOX</span>
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>
            Premium Audio Gear · beatbox.in
          </p>
        </div>
        <div className="text-end">
          <h4 style={{ fontWeight: 800, color: '#1a1a2e' }}>TAX INVOICE</h4>
          <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>
            Invoice #{order.orderId?.toString().slice(-10) || order.orderId}
          </p>
          <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>
            Date: {fmtDate(order.orderDate)}
          </p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-4">
        <h6 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>BILL TO / SHIP TO</h6>
        <p style={{ color: '#444', margin: 0, fontSize: '0.9rem' }}>{order.shippingAddress || '—'}</p>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {['#', 'Product', 'Qty', 'Unit Price', 'Total'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: h === '#' || h === 'Qty' ? 'center' : h === 'Unit Price' || h === 'Total' ? 'right' : 'left', fontSize: '0.78rem', fontWeight: 800, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.85rem', color: '#555' }}>{i + 1}</td>
              <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#222', fontWeight: 600 }}>{item.productName}</td>
              <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.85rem', color: '#555' }}>{item.quantity}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.85rem', color: '#555' }}>₹{fmt(item.unitPrice)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 700, color: '#222' }}>₹{fmt(item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginLeft: 'auto', maxWidth: 280 }}>
        {[
          ['Subtotal', `₹${fmt(subtotal)}`],
          ['GST (18%)', `₹${fmt(gst)}`],
          ['Shipping', shipping === 0 ? 'FREE' : `₹${fmt(shipping)}`],
        ].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.85rem', color: '#555' }}>
            <span>{label}</span><span>{val}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #333', marginTop: 4, fontWeight: 800, fontSize: '1rem', color: '#1a1a2e' }}>
          <span>Grand Total</span><span>₹{fmt(total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 text-center" style={{ borderTop: '1px solid #ddd', color: '#999', fontSize: '0.78rem' }}>
        Thank you for shopping with BeatBox! · This is a computer-generated invoice.
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const order = useSelector(selectCurrentOrder)
  const detailStatus = useSelector(selectOrderDetailStatus)

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      await dispatch(cancelOrderThunk(order.orderId)).unwrap();
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
    } catch (err) {
      toast.error(err || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  }

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id))
    return () => { dispatch(clearCurrentOrder()) }
  }, [id, dispatch])

  const isLoading = detailStatus === 'loading' || detailStatus === 'idle'
  const isFailed = detailStatus === 'failed'

  // Derived financials
  const items = order?.items || []
  const subtotal = items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0)
  const gst = Math.round(subtotal * 0.18)
  const shipping = subtotal >= 999 ? 0 : 79
  const total = subtotal + gst + shipping

  const cfg = order ? (STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending) : null

  return (
    <div className="min-vh-100 storefront-wrapper pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {/* Background glows */}
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-primary-glow)', top: '0%', right: '-5%', filter: 'blur(140px)' }} />
      <div className="bg-glow-orb" style={{ width: 300, height: 300, background: 'var(--bb-accent-glow)', bottom: '10%', left: '-5%', filter: 'blur(140px)', animationDelay: '2s' }} />

      <div className="container-fluid px-3 px-lg-5 py-4 position-relative" style={{ zIndex: 1 }}>

        {/* ── Breadcrumb nav ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="d-flex align-items-center gap-2 mb-4"
        >
          <button
            onClick={() => navigate('/orders')}
            className="btn border-0 p-0 d-flex align-items-center gap-1 text-theme-muted fw-semibold"
            style={{ background: 'transparent', fontSize: '0.88rem', transition: 'all 0.2s' }}
            id="back-to-orders"
          >
            <ArrowLeft size={16} /> My Orders
          </button>
          <span style={{ color: 'var(--bb-border)' }}>/</span>
          <span className="text-theme-muted" style={{ fontSize: '0.88rem' }}>
            #{id?.toString().slice(-10) || id}
          </span>
        </motion.div>

        {isFailed ? (
          <div className="p-5 rounded-4 text-center" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
            <XCircle size={48} className="mb-3" style={{ color: '#ef4444' }} />
            <h5 className="fw-black text-theme-title mb-2">Order Not Found</h5>
            <p className="text-theme-muted mb-4">We couldn't find this order. It may have been removed or you don't have access.</p>
            <Link to="/orders" className="btn btn-glow px-5 py-2 fw-bold" style={{ borderRadius: 10 }}>
              Back to My Orders
            </Link>
          </div>
        ) : isLoading ? (
          <DetailSkeleton />
        ) : (
          <>
            {/* ── Order Header ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-4 mb-4 d-flex flex-wrap justify-content-between align-items-start gap-3"
              style={{
                background: 'var(--bb-surface)',
                border: '1px solid rgba(0,243,255,0.2)',
                boxShadow: '0 0 40px rgba(0,243,255,0.04)',
              }}
              id="order-detail-header"
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <img src={logo} alt="BeatBox" style={{ width: 20, height: 20 }} />
                  <span className="text-theme-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 600 }}>
                    BeatBox Order
                  </span>
                </div>
                <h1 className="fw-black text-theme-title mb-1" style={{ fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', letterSpacing: '-1px' }}>
                  Order <span className="gradient-text" style={{ fontFamily: 'monospace' }}>
                    #{order.orderId?.toString().slice(-10) || order.orderId}
                  </span>
                </h1>
                <p className="text-theme-muted mb-0" style={{ fontSize: '0.82rem' }}>
                  Placed on {fmtDate(order.orderDate)} · {items.length} item{items.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                {/* Status badge */}
                {cfg && (
                  <div
                    className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-bold"
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}60`,
                      color: cfg.color,
                      fontSize: '0.82rem',
                    }}
                  >
                    <cfg.Icon size={14} /> {cfg.label}
                  </div>
                )}
                {/* Print Invoice */}
                <button
                  onClick={() => window.print()}
                  className="btn d-flex align-items-center gap-2 fw-bold"
                  style={{
                    background: 'rgba(168,32,255,0.1)',
                    border: '1px solid rgba(168,32,255,0.3)',
                    color: '#d161ff',
                    borderRadius: 10,
                    fontSize: '0.82rem',
                    padding: '8px 16px',
                    transition: 'all 0.25s ease',
                  }}
                  id="print-invoice-btn"
                >
                  <Printer size={14} /> Print Invoice
                </button>
              </div>
            </motion.div>

            {/* ── Two-column layout ────────────────────────────────────────── */}
            <div className="row g-4">

              {/* LEFT COLUMN */}
              <div className="col-12 col-lg-8">

                {/* Tracking Timeline */}
                <SectionCard title="Order Tracking" icon={Truck} id="order-tracking-section" accent>
                  <OrderTimeline status={order.status} orderDate={order.orderDate} />
                  {order.status === 'Shipped' && (
                    <div
                      className="mt-4 p-3 rounded-3 d-flex align-items-center gap-3"
                      style={{ background: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.15)' }}
                    >
                      <Truck size={20} style={{ color: 'var(--bb-accent)', flexShrink: 0 }} />
                      <div>
                        <p className="fw-bold text-theme-title mb-0" style={{ fontSize: '0.85rem' }}>
                          Your order is on its way!
                        </p>
                        <p className="text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>
                          Estimated delivery by {estimatedDelivery(order.orderDate)}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.status === 'Delivered' && (
                    <div
                      className="mt-4 p-3 rounded-3 d-flex align-items-center gap-3"
                      style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.2)' }}
                    >
                      <CheckCircle size={20} style={{ color: '#39ff14', flexShrink: 0 }} />
                      <div>
                        <p className="fw-bold text-theme-title mb-0" style={{ fontSize: '0.85rem' }}>
                          Delivered successfully! 🎉
                        </p>
                        <p className="text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>
                          Delivered by {estimatedDelivery(order.orderDate)}. Enjoy your audio gear!
                        </p>
                      </div>
                    </div>
                  )}
                </SectionCard>

                {/* Order Items */}
                <SectionCard title="Order Items" icon={ShoppingBag} id="order-items-section">
                  <div className="d-flex flex-column gap-3">
                    {items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="d-flex align-items-center gap-3 p-3 rounded-3"
                        style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
                      >
                        {/* Icon placeholder */}
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                          style={{
                            width: 56, height: 56,
                            background: 'radial-gradient(circle, rgba(0,243,255,0.08), transparent)',
                            border: '1px solid var(--bb-border)',
                          }}
                        >
<img
  src={getImageUrl(item.productImageUrl)}
  alt={item.productName}
  style={{
    width: 50,
    height: 50,
    objectFit: 'contain'
  }}
/>
                        </div>

                        {/* Name & meta */}
                        <div className="flex-grow-1 min-width-0">
                          <p className="fw-bold text-theme-title mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                            {item.productName}
                          </p>
                          <p className="text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>
                            Qty: {item.quantity} × ₹{fmt(item.unitPrice)}
                          </p>
                        </div>
                       {item.color && (
  <div className="d-flex align-items-center gap-2 mt-1">
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: item.colorCode,
        border: '1px solid #ccc'
      }}
    />
    <small>{item.color}</small>
  </div>
)}

                        {/* Line total */}
                        <div className="text-end flex-shrink-0">
                          <p className="fw-black text-theme-title mb-0" style={{ fontSize: '0.95rem' }}>
                            ₹{fmt(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </SectionCard>

              </div>

              {/* RIGHT COLUMN */}
              <div className="col-12 col-lg-4">

                {/* Order Summary / Pricing */}
                <SectionCard title="Price Breakdown" icon={Receipt} id="order-summary-section">
                  <div className="d-flex flex-column gap-2">
                    {[
                      ['Subtotal', `₹${fmt(subtotal)}`],
                      ['GST (18%)', `₹${fmt(gst)}`],
                    ].map(([label, val]) => (
                      <div key={label} className="d-flex justify-content-between text-theme-muted" style={{ fontSize: '0.88rem' }}>
                        <span>{label}</span><span>{val}</span>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between" style={{ fontSize: '0.88rem' }}>
                      <span className="text-theme-muted">Shipping</span>
                      <span style={{ color: shipping === 0 ? '#39ff14' : 'var(--bb-muted)', fontWeight: 600 }}>
                        {shipping === 0 ? 'FREE' : `₹${fmt(shipping)}`}
                      </span>
                    </div>
                    <div
                      className="d-flex justify-content-between fw-black mt-2 pt-3"
                      style={{ borderTop: '1px solid var(--bb-border)', fontSize: '1.05rem' }}
                    >
                      <span className="text-theme-title">Grand Total</span>
                      <span style={{ color: 'var(--bb-accent)' }}>₹{fmt(total)}</span>
                    </div>
                  </div>
                </SectionCard>

                {/* Delivery Info */}
                <SectionCard title="Delivery Information" icon={MapPin} id="order-delivery-section">
                  <div className="d-flex flex-column gap-3">
                    <div>
                      <p className="text-theme-muted mb-1" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Shipping Address
                      </p>
                      <p className="text-theme-title fw-semibold mb-0" style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                        {order.shippingAddress || 'Address not available'}
                      </p>
                    </div>
                    <div
                      className="p-2 rounded-2"
                      style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
                    >
                      <p className="text-theme-muted mb-1" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Est. Delivery
                      </p>
                      <p className="fw-bold text-theme-title mb-0" style={{ fontSize: '0.88rem' }}>
                        {order.status === 'Delivered' ? '✅ Delivered' : estimatedDelivery(order.orderDate)}
                      </p>
                    </div>
                  </div>
                </SectionCard>

                {/* Payment Info */}
               <SectionCard title="Payment" icon={CreditCard}>
  <div
    className="d-flex align-items-center gap-3 p-3 rounded-3"
    style={{
      background: 'var(--bb-surface-2)',
      border: '1px solid var(--bb-border)'
    }}
  >
    <div
      className="d-flex align-items-center justify-content-center rounded-2"
      style={{
        width: 40,
        height: 40,
        background: 'rgba(0,243,255,0.1)',
        border: '1px solid rgba(0,243,255,0.2)'
      }}
    >
      <CreditCard size={18} style={{ color: 'var(--bb-accent)' }} />
    </div>

    <div>
      <p className="fw-bold text-theme-title mb-0">
        {order.paymentMethod}
      </p>

      <p className="text-theme-muted mb-0">
        {order.paymentStatus === "Success"
          ? `Paid · ₹${fmt(total)}`
          : `Pending · ₹${fmt(total)}`}
      </p>
    </div>

    <span
      className="ms-auto rounded-pill px-2 py-1 fw-bold"
      style={{
        background:
          order.paymentStatus === "Success"
            ? "rgba(57,255,20,0.1)"
            : "rgba(245,158,11,0.1)",
        color:
          order.paymentStatus === "Success"
            ? "#39ff14"
            : "#f59e0b",
        fontSize: '0.65rem'
      }}
    >
      {order.paymentStatus}
    </span>
  </div>
</SectionCard>

                {/* Actions */}
                <div className="d-flex flex-column gap-2">
                  {order && (order.status === 'Pending' || order.status === 'Processing') && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="btn fw-bold d-flex align-items-center justify-content-center gap-2 py-2 mb-2"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        borderRadius: 10,
                        fontSize: '0.85rem',
                      }}
                    >
                      <XCircle size={15} /> Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => orderService.downloadInvoice(order.orderId)}
                    className="btn fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
                    style={{
                      background: 'rgba(168,32,255,0.1)',
                      border: '1px solid rgba(168,32,255,0.3)',
                      color: '#d161ff',
                      borderRadius: 10,
                      fontSize: '0.85rem',
                    }}
                  >
                    <Download size={15} />
                    Download Invoice
                  </button>
                  <Link
                    to="/products"
                    className="btn btn-glow fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
                    style={{ borderRadius: 10, fontSize: '0.85rem' }}
                  >
                    <ShoppingBag size={15} /> Shop Again
                  </Link>
                </div>

              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Print-only invoice (hidden in browser, shown on Ctrl+P) ─────────── */}
      {order && <PrintInvoice order={order} />}

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1050 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="p-4 rounded-4 text-center mx-3"
              style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', maxWidth: 400 }}
            >
              <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 60, height: 60, background: 'rgba(239,68,68,0.1)' }}>
                <XCircle size={32} style={{ color: '#ef4444' }} />
              </div>
              <h5 className="fw-black text-theme-title mb-2">Cancel Order?</h5>
              <p className="text-theme-muted mb-4" style={{ fontSize: '0.9rem' }}>
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary flex-grow-1 fw-bold"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                  style={{ borderRadius: 10 }}
                >
                  No, keep it
                </button>
                <button
                  className="btn flex-grow-1 fw-bold"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  style={{ background: '#ef4444', color: '#fff', borderRadius: 10 }}
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
