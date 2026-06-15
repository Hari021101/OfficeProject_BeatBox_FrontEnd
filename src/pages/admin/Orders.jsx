import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DataTable from '../../components/admin/DataTable'

const STATUS_CONFIG = {
  Pending:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  Processing: { color: '#a820ff', bg: 'rgba(168,32,255,0.1)', icon: Package },
  Shipped:    { color: '#00f3ff', bg: 'rgba(0,243,255,0.1)',  icon: Truck },
  Delivered:  { color: '#39ff14', bg: 'rgba(57,255,20,0.08)', icon: CheckCircle },
  Cancelled:  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: XCircle },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()

  const { user } = useSelector(state => state.auth)

  useEffect(() => {
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
      setOrders(data?.map(o => ({...o, id: o.orderId})) || [])
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
      toast.success(`Order #${orderId.toString().substring(0, 8)} status updated to ${newStatus}`)
      
      setOrders(prev => prev.map(o => 
        o.orderId === orderId ? { ...o, status: newStatus } : o
      ))
    } catch (err) {
      toast.error('Failed to update status')
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
    { key: 'orderId', label: 'Order ID', sortable: true, render: (row) => <span className="fw-bold text-theme-title">#{row.orderId.toString().substring(0, 8)}...</span> },
    { key: 'userId', label: 'Customer', sortable: true, render: (row) => <span className="d-inline-block text-truncate text-theme-muted" style={{ maxWidth: '120px', fontSize: '0.9rem' }}>{row.userId}</span> },
    { key: 'createdDate', label: 'Date', sortable: true, render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.9rem' }}>{new Date(row.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> },
    { key: 'totalAmount', label: 'Amount', sortable: true, render: (row) => <span className="fw-black text-theme-title">₹{Number(row.totalAmount || 0).toLocaleString('en-IN')}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (row) => {
      const config = STATUS_CONFIG[row.status] || STATUS_CONFIG.Pending
      const Icon = config.icon
      return (
        <span 
          className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2"
          style={{ 
            background: config.bg, 
            color: config.color, 
            border: `1px solid currentColor`,
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }}
        >
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

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <DataTable 
          columns={columns}
          data={orders}
          searchPlaceholder="Search by Order ID, Customer, or Status..."
          searchableFields={['orderId', 'userId', 'status']}
          selectable={true}
          bulkActions={bulkActions}
        />
      )}
    </div>
  )
}
