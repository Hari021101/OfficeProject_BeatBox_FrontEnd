import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { orderService } from '../services/orderService'
import { paymentService } from '../services/paymentService'
import { toast } from 'react-hot-toast'

const statusColor = {
  Pending: 'bg-warning bg-opacity-20 text-warning',
  Processing: 'bg-info bg-opacity-20 text-info',
  Shipped: 'bg-primary bg-opacity-20 text-primary',
  OutForDelivery: 'bg-secondary bg-opacity-20 text-secondary',
  Delivered: 'bg-success bg-opacity-20 text-success',
  Cancelled: 'bg-danger bg-opacity-20 text-danger',
}

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [order, setOrder] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrder()
  }, [user, id])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const data = await orderService.getOrderById(id)
      setOrder(data)
      await fetchPayment(data?.orderId || id)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load order details.')
    } finally {
      setLoading(false)
    }
  }

  const fetchPayment = async (orderId) => {
    try {
      const paymentData = await paymentService.getPaymentByOrderId(orderId)
      setPayment(paymentData)
    } catch (error) {
      setPayment(null)
    }
  }

  const handleCancel = async () => {
    if (!['Pending', 'Processing'].includes(order?.status)) {
      toast.error('Cancellation is allowed only for pending or processing orders.')
      return
    }

    setCancelling(true)
    try {
      await orderService.cancelOrder(order.orderId || order.id)
      toast.success('Order cancelled successfully.')
      await fetchOrder()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to cancel order.')
    } finally {
      setCancelling(false)
    }
  }

  const items = order?.items || order?.orderItems || []
  const shipping = order?.shippingAddress || {}

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-lg-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <Link to="/orders" className="btn btn-outline-secondary rounded-pill px-4 py-2 hover-scale mb-3">
            <ArrowLeft size={18} /> Back to orders
          </Link>
          <h1 className="fw-black text-theme-title mb-2">Order Details</h1>
          <p className="text-theme-muted mb-0">Everything you need to know about this order in one view.</p>
        </div>
        {order && ['Pending', 'Processing'].includes(order.status) && (
          <button
            className="btn btn-danger rounded-pill px-4 py-2"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="glass-card p-5 text-center text-theme-muted">Loading order details...</div>
      ) : !order ? (
        <div className="glass-card p-5 text-center text-theme-muted">No order information available.</div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card p-4 mb-4">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                <div>
                  <p className="text-theme-muted small mb-1">Order ID</p>
                  <h5 className="fw-bold text-theme-title mb-0">#{order.orderId || order.id}</h5>
                </div>
                <span className={`badge ${statusColor[order.status] || 'bg-secondary bg-opacity-20 text-secondary'} rounded-pill py-2 px-3`}>{order.status}</span>
              </div>
              <div className="mt-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <p className="text-theme-muted small mb-1">Placed</p>
                    <p className="text-theme-title mb-0">{new Date(order.createdDate || order.createdAt || Date.now()).toLocaleString()}</p>
                  </div>
                  <div className="col-md-4">
                    <p className="text-theme-muted small mb-1">Order Total</p>
                    <p className="text-theme-title mb-0">₹{(order.totalAmount || order.total || 0).toFixed(2)}</p>
                  </div>
                  <div className="col-md-4">
                    <p className="text-theme-muted small mb-1">Payment Status</p>
                    <p className="text-theme-title mb-0">{payment?.status || order.paymentStatus || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 mb-4">
              <h5 className="fw-bold text-theme-title mb-3">Shipping Address</h5>
              <div className="d-flex gap-3 align-items-start">
                <div className="rounded-4 p-3" style={{ background: 'rgba(0, 243, 255, 0.08)' }}>
                  <MapPin size={24} className="text-accent" />
                </div>
                <div>
                  <p className="mb-1 text-theme-title fw-semibold">{shipping.fullName || 'Shipping Name'}</p>
                  <p className="text-theme-muted mb-1">{shipping.addressLine1}</p>
                  {shipping.addressLine2 && <p className="text-theme-muted mb-1">{shipping.addressLine2}</p>}
                  <p className="text-theme-muted mb-1">{shipping.city}, {shipping.state} {shipping.postalCode}</p>
                  <p className="text-theme-muted mb-0">{shipping.country}</p>
                  <p className="text-theme-muted small mt-2">Phone: {shipping.phone}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 mb-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="rounded-4 p-3" style={{ background: 'rgba(168, 32, 255, 0.1)' }}>
                  <CreditCard size={24} className="text-primary" />
                </div>
                <div>
                  <h5 className="fw-bold text-theme-title mb-1">Payment Details</h5>
                  <p className="small text-theme-muted mb-0">Method: {payment?.method || order.paymentMethod || 'Unknown'}</p>
                </div>
              </div>

              {payment ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <p className="text-theme-muted small mb-1">Transaction ID</p>
                    <p className="text-theme-title mb-0">{payment.transactionId}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-theme-muted small mb-1">Amount Paid</p>
                    <p className="text-theme-title mb-0">₹{(payment.amount || 0).toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-theme-muted">Payment information is not available for this order.</p>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-4 mb-4">
              <h5 className="fw-bold text-theme-title mb-3">Order Items</h5>
              <div className="d-flex flex-column gap-3">
                {items.map((item) => (
                  <div key={item.orderItemId || item.id || item.productId} className="d-flex align-items-center gap-3">
                    <div className="flex-shrink-0 rounded-3" style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)' }}>
                      <img
                        src={item.image || item.productImage || 'https://via.placeholder.com/64'}
                        alt={item.productName || item.name || 'Item'}
                        className="w-100 h-100 rounded-3"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 text-theme-title fw-semibold">{item.productName || item.name || 'Product'}</p>
                      <p className="small text-theme-muted mb-1">Qty {item.quantity}</p>
                      <p className="small text-theme-muted mb-0">₹{((item.unitPrice || item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h5 className="fw-bold text-theme-title mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Items total</span>
                <span>₹{((order.items || order.orderItems || []).reduce((sum, item) => sum + (item.quantity * (item.unitPrice || item.price || 0)), 0)).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Shipping</span>
                <span>₹{(order.shippingFee || 99).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Tax</span>
                <span>₹{(order.taxAmount || ((order.totalAmount || 0) * 0.12)).toFixed(2)}</span>
              </div>
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{(order.totalAmount || order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
