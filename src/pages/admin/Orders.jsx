import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DataTable from '../../components/admin/DataTable'

const STATUS_CONFIG = {
  Pending:    { className: 'bb-badge-warning', icon: Clock },
  Processing: { className: 'bb-badge-info', icon: Package },
  Shipped:    { className: 'bb-badge-info', icon: Truck },
  Delivered:  { className: 'bb-badge-success', icon: CheckCircle },
  Cancelled:  { className: 'bb-badge-danger', icon: XCircle },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const navigate = useNavigate()

  const { user } = useSelector(state => state.auth)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await orderService.getAllOrders()
      setOrders(data?.map(o => ({...o, id: o.orderId})) || [])
    } catch (err) {
      toast.error('Failed to load orders. Are you an admin?')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return;
    }
    fetchOrders()
  }, [user, navigate])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      await orderService.updateOrderStatus(orderId, newStatus)
      toast.success(`Order #${orderId.toString().substring(0, 8)} status updated to ${newStatus}`)
      toast.success('Order status updated successfully')
      fetchOrders()
    } catch (err) {
      toast.error('Failed to update order status')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleBulkStatusUpdate = async (selectedIds, status) => {
    try {
      setIsLoading(true)
      await orderService.bulkUpdateOrderStatus(selectedIds, status)
      toast.success(`${selectedIds.length} orders updated to ${status}`)
      fetchOrders()
    } catch (err) {
      toast.error('Failed to update bulk status')
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async (selectedIds) => {
    if (!window.confirm(`Are you sure you want to cancel/delete ${selectedIds.length} orders?`)) return;
    try {
      setIsLoading(true)
      await orderService.bulkDeleteOrders(selectedIds)
      toast.success(`${selectedIds.length} orders cancelled`)
      fetchOrders()
    } catch (err) {
      toast.error('Failed to delete bulk orders')
      setIsLoading(false)
    }
  }

  const bulkActions = [
    { label: 'Mark Shipped', icon: Truck, onClick: (ids) => handleBulkStatusUpdate(ids, 'Shipped') },
    { label: 'Mark Delivered', icon: CheckCircle, onClick: (ids) => handleBulkStatusUpdate(ids, 'Delivered') },
    { label: 'Cancel Orders', icon: XCircle, danger: true, onClick: (ids) => handleBulkDelete(ids) }
  ]

  const columns = [
    { key: 'orderId', label: 'Order ID', sortable: true, render: (row) => <span className="fw-bold text-theme-title" style={{ fontSize: '0.9rem' }}>#{row.orderId}</span> },
    { key: 'userId', label: 'Customer', sortable: true, render: (row) => <span className="d-inline-block text-truncate text-theme-muted" style={{ maxWidth: '120px', fontSize: '0.9rem' }}>{row.userId}</span> },
    { key: 'createdDate', label: 'Date', sortable: true, render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.9rem' }}>{new Date(row.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> },
    { key: 'totalAmount', label: 'Amount', sortable: true, render: (row) => <span className="fw-black text-theme-title">₹{Number(row.totalAmount || 0).toLocaleString('en-IN')}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (row) => {
      const config = STATUS_CONFIG[row.status] || STATUS_CONFIG.Pending
      const Icon = config.icon
      return (
        <span className={config.className}>
          <Icon size={14} /> {row.status}
        </span>
      )
    }},
    { key: 'actions', label: 'Update Status', render: (row) => (
      <select 
        className="form-select form-select-sm premium-search-input"
        style={{ width: '130px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
        value={row.status}
        onChange={(e) => handleStatusChange(row.orderId, e.target.value)}
        disabled={updatingId === row.orderId}
      >
        {Object.keys(STATUS_CONFIG).map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    )},
    { key: 'details', label: 'Details', render: (row) => (
      <button 
        className="btn btn-sm btn-outline-info fw-bold py-1 px-2"
        onClick={() => setSelectedOrder(row)}
        style={{ borderRadius: '6px', fontSize: '0.8rem' }}
      >
        View
      </button>
    )}
  ]

  return (
    <div className="py-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Order Management</h2>
          <p className="text-theme-muted mb-0">Manage and track all customer orders</p>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={orders}
        searchPlaceholder="Search by Order ID, Customer, or Status..."
        searchableFields={['orderId', 'userId', 'status']}
        selectable={true}
        bulkActions={bulkActions}
        loading={isLoading}
      />

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null

  return (
    <div
      className="modal-backdrop d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060, backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="card p-4 text-theme-title animate__animated animate__zoomIn"
        style={{
          background: 'var(--bb-surface)',
          border: '1px solid var(--bb-border)',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '650px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2" style={{ borderColor: 'var(--bb-border)' }}>
          <h4 className="fw-black mb-0 text-theme-title">Order Details #{order.orderId}</h4>
          <button onClick={onClose} className="btn border-0 p-1 text-theme-muted hover-scale" style={{ background: 'transparent' }}>
            <XCircle size={24} />
          </button>
        </div>

        <div className="row g-3 small mb-4">
          <div className="col-sm-6">
            <span className="text-theme-muted d-block uppercase fw-bold">Customer ID:</span>
            <span>{order.userId}</span>
          </div>
          <div className="col-sm-6">
            <span className="text-theme-muted d-block uppercase fw-bold">Order Date:</span>
            <span>{new Date(order.createdDate).toLocaleString('en-IN')}</span>
          </div>
          <div className="col-sm-6">
            <span className="text-theme-muted d-block uppercase fw-bold">Payment Method:</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="col-sm-6">
            <span className="text-theme-muted d-block uppercase fw-bold">Payment Status:</span>
            <span className="badge bg-secondary">{order.paymentStatus}</span>
          </div>
          <div className="col-12">
            <span className="text-theme-muted d-block uppercase fw-bold">Shipping Address:</span>
            <span>{order.shippingAddress}</span>
          </div>
        </div>

        <h5 className="fw-bold mb-3">Order Items</h5>
        <div className="d-flex flex-column gap-3 mb-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="p-3 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="fw-bold mb-1">{item.productName || 'Unknown Product'}</h6>
                  <div className="d-flex gap-3 small text-theme-muted">
                    {item.color && <span>Color: {item.color}</span>}
                    <span>Qty: {item.quantity}</span>
                    <span>Unit: ₹{Number(item.unitPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <span className="fw-bold">₹{Number(item.totalPrice).toLocaleString('en-IN')}</span>
              </div>

              {item.isPersonalised && (
                <div className="mt-3 p-3 rounded-3 animate__animated animate__fadeIn" style={{ background: 'rgba(0, 243, 255, 0.04)', border: '1px dashed rgba(0, 243, 255, 0.25)' }}>
                  <div className="d-flex align-items-center gap-2 mb-2 text-info fw-bold" style={{ fontSize: '0.85rem' }}>
                    <span>✨ CUSTOM ENGRAVING</span>
                    <span className="ms-auto badge bg-info text-dark">₹{item.engravingPrice}</span>
                  </div>
                  <div className="row g-2 small">
                    <div className="col-sm-4">
                      <span className="text-theme-muted d-block">Name:</span>
                      <span className="fw-bold text-white">{item.engravingName}</span>
                    </div>
                    {item.engravingDate && (
                      <div className="col-sm-4">
                        <span className="text-theme-muted d-block">Date:</span>
                        <span className="fw-bold text-white">{item.engravingDate}</span>
                      </div>
                    )}
                    {item.engravingMessage && (
                      <div className="col-sm-12">
                        <span className="text-theme-muted d-block">Message:</span>
                        <span className="fw-bold text-white">{item.engravingMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--bb-border)' }}>
          <span className="fw-bold">Grand Total:</span>
          <h4 className="fw-black text-theme-title mb-0">₹{Number(order.totalAmount).toLocaleString('en-IN')}</h4>
        </div>
      </div>
    </div>
  )
}
