import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PackageX, CheckCircle, XCircle, ArrowLeftRight, RefreshCw,
  Eye, MessageSquare, Package, RotateCcw, X, ChevronDown, ChevronRight
} from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import adminService from '../../services/adminService'
import { toast } from 'react-hot-toast'

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_FLOW = [
  'Pending Approval',
  'Under Review',
  'Approved',
  'Rejected',
  'Refunded',
  'Replacement Sent',
  'Completed',
]

function statusBadgeClass(status) {
  if (status === 'Approved' || status === 'Completed') return 'bb-badge-success'
  if (status === 'Rejected') return 'bb-badge-danger'
  if (status === 'Refunded' || status === 'Replacement Sent') return 'bb-badge-info'
  return 'bb-badge-warning' // Pending, Under Review
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function ReturnDetailModal({ returnReq, onClose, onUpdate }) {
  const [newStatus, setNewStatus] = useState(returnReq.status)
  const [adminNotes, setAdminNotes] = useState(returnReq.adminNotes || '')
  const [saving, setSaving] = useState(false)

  const images = returnReq.imageUrls
    ? returnReq.imageUrls.split(',').filter(Boolean)
    : []

  const handleSave = async () => {
    if (newStatus === returnReq.status && adminNotes === (returnReq.adminNotes || '')) {
      toast('No changes to save')
      return
    }
    setSaving(true)
    try {
      await adminService.updateReturnStatus(returnReq.id, newStatus, adminNotes)
      toast.success(`Return updated to "${newStatus}"`)
      onUpdate()
      onClose()
    } catch {
      toast.error('Failed to update return request')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="p-4 rounded-4 mx-3 w-100"
        style={{
          background: 'var(--bb-surface)',
          border: '1px solid var(--bb-border)',
          boxShadow: '0 0 60px rgba(0,0,0,0.6)',
          maxWidth: 620,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 44, height: 44, background: 'rgba(0,243,255,0.1)', border: '1px solid var(--bb-border)' }}>
              <RotateCcw size={20} style={{ color: 'var(--bb-accent)' }} />
            </div>
            <div>
              <h5 className="fw-black text-theme-title mb-0">Return Details</h5>
              <p className="text-theme-muted mb-0" style={{ fontSize: '0.78rem' }}>
                RMA #{returnReq.id?.toString().slice(-8)}
              </p>
            </div>
          </div>
          <button className="btn btn-sm p-1" onClick={onClose}
            style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: 8, color: 'var(--bb-text)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Customer & Order Info */}
        <div className="row g-3 mb-4">
          {[
            ['Customer', returnReq.customerName || 'Unknown'],
            ['Product', returnReq.productName || '—'],
            ['Preferred Resolution', returnReq.preferredResolution || '—'],
            ['Requested On', returnReq.requestDate ? new Date(returnReq.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
          ].map(([label, val]) => (
            <div key={label} className="col-6">
              <p className="text-theme-muted mb-0" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
              <p className="fw-bold text-theme-title mb-0" style={{ fontSize: '0.88rem' }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Reason & Description */}
        <div className="mb-3 p-3 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
          <p className="text-theme-muted mb-1" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Reason</p>
          <p className="fw-bold text-theme-title mb-2" style={{ fontSize: '0.9rem' }}>{returnReq.reason}</p>
          {returnReq.description && (
            <>
              <p className="text-theme-muted mb-1" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Description</p>
              <p className="text-theme-title mb-0" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{returnReq.description}</p>
            </>
          )}
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-theme-muted mb-2 fw-bold" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>Customer Images</p>
            <div className="d-flex flex-wrap gap-2">
              {images.map((src, i) => (
                <img key={i} src={src} alt={`Return ${i + 1}`}
                  style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--bb-border)', cursor: 'pointer' }}
                  onClick={() => window.open(src, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Status Update */}
        <div className="mb-3">
          <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.85rem' }}>Update Status</label>
          <select
            className="form-select"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-text)', border: '1px solid var(--bb-border)', borderRadius: 10 }}
          >
            {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Admin Notes */}
        <div className="mb-4">
          <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.85rem' }}>Internal Notes</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Add internal notes for this return..."
            value={adminNotes}
            onChange={e => setAdminNotes(e.target.value)}
            style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-text)', border: '1px solid var(--bb-border)', borderRadius: 10, resize: 'vertical' }}
          />
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <button className="btn fw-bold flex-grow-1" onClick={onClose} disabled={saving}
            style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-text)', borderRadius: 10 }}>
            Close
          </button>
          <button className="btn fw-bold flex-grow-1" onClick={handleSave} disabled={saving}
            style={{ background: 'rgba(0,243,255,0.15)', border: '1px solid rgba(0,243,255,0.4)', color: 'var(--bb-accent)', borderRadius: 10 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Returns() {
  const [returns, setReturns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReturn, setSelectedReturn] = useState(null)

  const fetchReturns = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getAllReturns()
      setReturns(data || [])
    } catch {
      toast.error('Failed to load return requests')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchReturns() }, [])

  const handleQuickAction = async (id, newStatus) => {
    try {
      await adminService.updateReturnStatus(id, newStatus, undefined)
      toast.success(`Status updated to "${newStatus}"`)
      fetchReturns()
    } catch {
      toast.error('Failed to update return status')
    }
  }

  // KPI counts
  const kpis = [
    { label: 'Pending', count: returns.filter(r => r.status === 'Pending Approval').length, color: 'var(--bb-warning)', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Under Review', count: returns.filter(r => r.status === 'Under Review').length, color: 'var(--bb-info)', bg: 'rgba(0,243,255,0.1)' },
    { label: 'Approved', count: returns.filter(r => r.status === 'Approved').length, color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
    { label: 'Refunded', count: returns.filter(r => r.status === 'Refunded' || r.status === 'Replacement Sent').length, color: 'var(--bb-success)', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Rejected', count: returns.filter(r => r.status === 'Rejected').length, color: 'var(--bb-danger)', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Completed', count: returns.filter(r => r.status === 'Completed').length, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  ]

  const columns = [
    {
      key: 'id', label: 'RMA ID', sortable: true,
      render: (row) => <span className="fw-bold" style={{ color: 'var(--bb-accent)', fontFamily: 'monospace', fontSize: '0.82rem' }}>#{row.id?.toString().slice(-8)}</span>
    },
    {
      key: 'customerName', label: 'Customer', sortable: true,
      render: (row) => <span className="fw-bold text-theme-title">{row.customerName || 'Guest'}</span>
    },
    {
      key: 'productName', label: 'Product', sortable: true,
      render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>{row.productName}</span>
    },
    {
      key: 'reason', label: 'Reason', sortable: false,
      render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.82rem' }}>{row.reason}</span>
    },
    {
      key: 'preferredResolution', label: 'Resolution', sortable: false,
      render: (row) => row.preferredResolution
        ? <span className="bb-badge-info" style={{ fontSize: '0.7rem' }}>{row.preferredResolution}</span>
        : <span className="text-theme-muted" style={{ fontSize: '0.82rem' }}>—</span>
    },
    {
      key: 'requestDate', label: 'Requested', sortable: true,
      render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.82rem' }}>
        {new Date(row.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
      </span>
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (row) => <span className={statusBadgeClass(row.status)}>{row.status}</span>
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (row) => (
        <div className="d-flex gap-1 flex-wrap">
          {/* View Details */}
          <button className="btn btn-sm p-1" title="View Details"
            onClick={() => setSelectedReturn(row)}
            style={{ background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)', color: 'var(--bb-accent)', borderRadius: 6 }}>
            <Eye size={14} />
          </button>
          {/* Quick actions based on status */}
          {row.status === 'Pending Approval' && (
            <>
              <button className="btn btn-sm p-1" title="Approve"
                onClick={() => handleQuickAction(row.id, 'Approved')}
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: 6 }}>
                <CheckCircle size={14} />
              </button>
              <button className="btn btn-sm p-1" title="Under Review"
                onClick={() => handleQuickAction(row.id, 'Under Review')}
                style={{ background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)', color: 'var(--bb-accent)', borderRadius: 6 }}>
                <RefreshCw size={14} />
              </button>
              <button className="btn btn-sm p-1" title="Reject"
                onClick={() => handleQuickAction(row.id, 'Rejected')}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 6 }}>
                <XCircle size={14} />
              </button>
            </>
          )}
          {row.status === 'Under Review' && (
            <>
              <button className="btn btn-sm p-1" title="Approve"
                onClick={() => handleQuickAction(row.id, 'Approved')}
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: 6 }}>
                <CheckCircle size={14} />
              </button>
              <button className="btn btn-sm p-1" title="Reject"
                onClick={() => handleQuickAction(row.id, 'Rejected')}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 6 }}>
                <XCircle size={14} />
              </button>
            </>
          )}
          {row.status === 'Approved' && (
            <>
              <button className="btn btn-sm p-1" title="Mark Refunded"
                onClick={() => handleQuickAction(row.id, 'Refunded')}
                style={{ background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)', color: 'var(--bb-accent)', borderRadius: 6 }}>
                <ArrowLeftRight size={14} />
              </button>
              <button className="btn btn-sm p-1" title="Replacement Sent"
                onClick={() => handleQuickAction(row.id, 'Replacement Sent')}
                style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', color: '#818cf8', borderRadius: 6 }}>
                <Package size={14} />
              </button>
            </>
          )}
          {(row.status === 'Refunded' || row.status === 'Replacement Sent') && (
            <button className="btn btn-sm p-1" title="Mark Completed"
              onClick={() => handleQuickAction(row.id, 'Completed')}
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 6 }}>
              <CheckCircle size={14} />
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="py-2 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Returns & Claims</h2>
          <p className="text-theme-muted mb-0">Manage customer returns, RMAs, and refunds.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpis.map(({ label, count, color, bg }) => (
          <div key={label} className="col-6 col-md-4 col-xl-2">
            <div className="p-3 h-100 rounded-4"
              style={{ background: 'var(--bb-surface)', border: `1px solid ${color}25`, boxShadow: '0 4px 20px var(--bb-shadow)' }}>
              <h6 className="fw-bold mb-1" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--bb-text-muted)' }}>{label}</h6>
              <h3 className="fw-black mb-0" style={{ color }}>{isLoading ? '...' : count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Status Lifecycle Legend */}
      <div className="mb-4 p-3 rounded-4 d-flex flex-wrap align-items-center gap-2"
        style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
        <span className="text-theme-muted fw-bold" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Workflow:</span>
        {STATUS_FLOW.map((s, i) => (
          <React.Fragment key={s}>
            <span className={statusBadgeClass(s)} style={{ fontSize: '0.68rem' }}>{s}</span>
            {i < STATUS_FLOW.length - 1 && <ChevronRight size={12} style={{ color: 'var(--bb-text-muted)', opacity: 0.5 }} />}
          </React.Fragment>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={returns}
        searchPlaceholder="Search RMAs, customers, products..."
        searchableFields={['id', 'customerName', 'productName', 'reason', 'status']}
        loading={isLoading}
      />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReturn && (
          <ReturnDetailModal
            returnReq={selectedReturn}
            onClose={() => setSelectedReturn(null)}
            onUpdate={fetchReturns}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
