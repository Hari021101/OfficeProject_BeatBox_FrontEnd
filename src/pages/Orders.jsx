import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle2, ArrowRight, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { orderService } from '../services/orderService'

const statusColor = {
  Pending: 'bg-warning bg-opacity-20 text-warning',
  Processing: 'bg-info bg-opacity-20 text-info',
  Shipped: 'bg-primary bg-opacity-20 text-primary',
  OutForDelivery: 'bg-secondary bg-opacity-20 text-secondary',
  Delivered: 'bg-success bg-opacity-20 text-success',
  Cancelled: 'bg-danger bg-opacity-20 text-danger',
}

export default function Orders() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await orderService.getMyOrders()
      setOrders(data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load your orders.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (order) => {
    if (!['Pending', 'Processing'].includes(order.status)) {
      toast.error('Cancellation is only allowed for pending or processing orders.')
      return
    }
    setProcessingId(order.orderId || order.id)
    try {
      await orderService.cancelOrder(order.orderId || order.id)
      toast.success('Order cancelled successfully.')
      await fetchOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to cancel this order.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-lg-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-black mb-2 text-theme-title">Order History</h1>
          <p className="text-theme-muted mb-0">Track all your purchases and payment details from one place.</p>
        </div>
        <Link to="/" className="btn btn-outline-secondary hover-scale" style={{ borderRadius: '12px' }}>
          Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="glass-card p-4 text-center text-theme-muted">Loading your orders...</div>
      ) : !orders.length ? (
        <div className="glass-card p-4 text-center">
          <p className="text-theme-muted mb-3">No orders found yet.</p>
          <Link to="/" className="btn btn-glow px-4 py-2">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => {
            const id = order.orderId || order.id
            const statusClass = statusColor[order.status] || 'bg-secondary bg-opacity-20 text-secondary'
            return (
              <div className="col-12" key={id}>
                <div className="glass-card p-4">
                  <div className="row align-items-center">
                    <div className="col-md-5">
                      <p className="text-theme-muted small mb-1">Order ID</p>
                      <h6 className="fw-bold text-theme-title mb-2">#{id}</h6>
                      <span className={`badge ${statusClass} rounded-pill py-2 px-3 fw-semibold`}>{order.status}</span>
                    </div>
                    <div className="col-md-4">
                      <p className="text-theme-muted small mb-1">Placed on</p>
                      <p className="mb-2 text-theme-title">{new Date(order.createdDate || order.createdAt || Date.now()).toLocaleDateString()}</p>
                      <p className="text-theme-muted small mb-0">Total: ₹{(order.totalAmount || order.total || 0).toFixed(2)}</p>
                    </div>
                    <div className="col-md-3 text-md-end mt-3 mt-md-0 d-flex flex-column gap-2">
                      <Link to={`/orders/${id}`} className="btn btn-outline-secondary rounded-pill px-4 py-2 hover-scale">
                        View Details <ArrowRight size={16} />
                      </Link>
                      {['Pending', 'Processing'].includes(order.status) && (
                        <button
                          className="btn btn-danger rounded-pill px-4 py-2"
                          disabled={processingId === id}
                          onClick={() => handleCancel(order)}
                        >
                          {processingId === id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
