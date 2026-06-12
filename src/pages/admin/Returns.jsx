import React, { useState } from 'react'
import { PackageX, CheckCircle, XCircle, ArrowLeftRight } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import { toast } from 'react-hot-toast'

const MOCK_RETURNS = [
  { id: 'RMA-901', orderId: 'ORD-8821', customer: 'Alex Johnson', product: 'BeatBox Soundbar Pro', reason: 'Defective audio', status: 'Pending Approval', date: '2026-06-11' },
  { id: 'RMA-902', orderId: 'ORD-8805', customer: 'Sarah Smith', product: 'TWS Earbuds Sport', reason: 'Changed mind', status: 'Approved', date: '2026-06-10' },
  { id: 'RMA-903', orderId: 'ORD-8799', customer: 'Mike Ross', product: 'Gaming Headset X', reason: 'Wrong item received', status: 'Refunded', date: '2026-06-08' },
  { id: 'RMA-904', orderId: 'ORD-8750', customer: 'Emma Watson', product: 'Party Speaker Boom', reason: 'Arrived damaged', status: 'Rejected', date: '2026-06-05' },
]

export default function Returns() {
  const [returns, setReturns] = useState(MOCK_RETURNS)

  const handleAction = (id, newStatus) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    toast.success(`RMA ${id} marked as ${newStatus}`)
  }

  const columns = [
    { key: 'id', label: 'RMA ID', sortable: true, render: (row) => <span className="fw-bold text-accent">{row.id}</span> },
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'reason', label: 'Reason', sortable: false },
    { key: 'date', label: 'Date Requested', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (row) => {
        let color = 'text-warning';
        if (row.status === 'Approved') color = 'text-info';
        if (row.status === 'Refunded') color = 'text-success';
        if (row.status === 'Rejected') color = 'text-danger';
        return <span className={`badge bg-opacity-25 ${color} bg-${color.split('-')[1]}`}>{row.status}</span>
      } 
    },
    { key: 'actions', label: 'Actions', sortable: false, render: (row) => (
        <div className="d-flex gap-2">
          {row.status === 'Pending Approval' && (
            <>
              <button className="btn btn-sm btn-outline-success p-1" onClick={() => handleAction(row.id, 'Approved')} title="Approve">
                <CheckCircle size={16} />
              </button>
              <button className="btn btn-sm btn-outline-danger p-1" onClick={() => handleAction(row.id, 'Rejected')} title="Reject">
                <XCircle size={16} />
              </button>
            </>
          )}
          {row.status === 'Approved' && (
            <button className="btn btn-sm btn-outline-info p-1" onClick={() => handleAction(row.id, 'Refunded')} title="Process Refund">
              <ArrowLeftRight size={16} />
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="py-2 animate__animated animate__fadeIn">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Returns & Claims</h2>
          <p className="text-theme-muted mb-0">Manage customer returns, RMAs, and refunds.</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <h6 className="text-theme-muted fw-bold text-uppercase mb-2">Pending RMAs</h6>
            <h3 className="fw-black text-warning mb-0">12</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <h6 className="text-theme-muted fw-bold text-uppercase mb-2">Approved</h6>
            <h3 className="fw-black text-info mb-0">8</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <h6 className="text-theme-muted fw-bold text-uppercase mb-2">Refunded (30d)</h6>
            <h3 className="fw-black text-success mb-0">₹45,200</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <h6 className="text-theme-muted fw-bold text-uppercase mb-2">Return Rate</h6>
            <h3 className="fw-black text-danger mb-0">2.4%</h3>
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={returns}
        searchPlaceholder="Search RMAs, orders, or customers..."
        searchableFields={['id', 'orderId', 'customer', 'product']}
      />
    </div>
  )
}
