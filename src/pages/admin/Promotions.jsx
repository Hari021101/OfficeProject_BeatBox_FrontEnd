import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tag, Plus, CheckCircle, Clock, XCircle, Edit3, Trash2,
  ToggleLeft, ToggleRight, Copy, X, Filter, RefreshCw, TrendingUp
} from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import adminService from '../../services/adminService'
import { toast } from 'react-hot-toast'

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmtCurrency = (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—'
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

function statusBadge(status) {
  if (status === 'Active') return 'bb-badge-success'
  if (status === 'Expired') return 'bb-badge-danger'
  if (status === 'Scheduled') return 'bb-badge-warning'
  return 'bb-badge-warning'
}

// ─── Coupon Modal ──────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  code: '', description: '', discountType: 'Percentage',
  discountAmount: 0, discountPercentage: '', minimumOrderAmount: 0,
  maximumDiscount: '', startDate: '', expiryDate: '', isActive: true, usageLimit: 0,
}

function CouponModal({ coupon, onClose, onSaved }) {
  const isEdit = !!coupon
  const [form, setForm] = useState(isEdit ? {
    code: coupon.code,
    description: coupon.description || '',
    discountType: coupon.discountType || 'Percentage',
    discountAmount: coupon.discountAmount || 0,
    discountPercentage: coupon.discountPercentage || '',
    minimumOrderAmount: coupon.minimumOrderAmount || 0,
    maximumDiscount: coupon.maximumDiscount || '',
    startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
    expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
    isActive: coupon.isActive,
    usageLimit: coupon.usageLimit || 0,
  } : { ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.code.trim()) errs.code = 'Code is required'
    if (form.discountType === 'Percentage') {
      const p = parseFloat(form.discountPercentage)
      if (!form.discountPercentage || isNaN(p) || p <= 0) errs.discountPercentage = 'Enter a valid percentage'
      if (p > 100) errs.discountPercentage = 'Cannot exceed 100%'
    } else if (form.discountType === 'Fixed') {
      if (!form.discountAmount || parseFloat(form.discountAmount) <= 0) errs.discountAmount = 'Enter a valid amount'
    }
    if (!form.expiryDate) errs.expiryDate = 'Expiry date is required'
    if (form.startDate && form.expiryDate && form.startDate >= form.expiryDate)
      errs.expiryDate = 'Expiry must be after start date'
    if (form.usageLimit < 0) errs.usageLimit = 'Cannot be negative'
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description || null,
        discountType: form.discountType,
        discountAmount: form.discountType === 'Fixed' ? parseFloat(form.discountAmount) || 0 : 0,
        discountPercentage: form.discountType === 'Percentage' ? parseFloat(form.discountPercentage) || null : null,
        minimumOrderAmount: parseFloat(form.minimumOrderAmount) || 0,
        maximumDiscount: form.maximumDiscount ? parseFloat(form.maximumDiscount) : null,
        startDate: form.startDate || null,
        expiryDate: form.expiryDate,
        isActive: form.isActive,
        usageLimit: parseInt(form.usageLimit) || 0,
      }
      if (isEdit) {
        await adminService.updateCoupon(coupon.id, payload)
        toast.success('Coupon updated!')
      } else {
        await adminService.createCoupon(payload)
        toast.success('Coupon created!')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to save coupon')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    background: 'var(--bb-surface-2)', color: 'var(--bb-text)',
    border: '1px solid var(--bb-border)', borderRadius: 10
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
          border: '1px solid rgba(168,32,255,0.3)',
          boxShadow: '0 0 60px rgba(168,32,255,0.1)',
          maxWidth: 600, maxHeight: '92vh', overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 44, height: 44, background: 'rgba(168,32,255,0.12)', border: '1px solid rgba(168,32,255,0.3)' }}>
              <Tag size={20} style={{ color: '#d161ff' }} />
            </div>
            <div>
              <h5 className="fw-black text-theme-title mb-0">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h5>
              <p className="text-theme-muted mb-0" style={{ fontSize: '0.78rem' }}>{isEdit ? `Editing ${coupon.code}` : 'Add a new promotional coupon'}</p>
            </div>
          </div>
          <button className="btn btn-sm p-1" onClick={onClose}
            style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: 8, color: 'var(--bb-text)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="row g-3">
          {/* Code */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Coupon Code *</label>
            <input className="form-control" value={form.code}
              onChange={e => set('code', e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20" style={{ ...inputStyle, fontFamily: 'monospace', fontWeight: 700 }} />
            {errors.code && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.code}</div>}
          </div>

          {/* Discount Type */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Discount Type</label>
            <select className="form-select" value={form.discountType} onChange={e => set('discountType', e.target.value)} style={inputStyle}>
              <option value="Percentage">Percentage (%)</option>
              <option value="Fixed">Fixed Amount (₹)</option>
              <option value="Shipping">Free Shipping</option>
            </select>
          </div>

          {/* Discount Value */}
          {form.discountType === 'Percentage' && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Discount % *</label>
              <input type="number" className="form-control" value={form.discountPercentage} min={1} max={100}
                onChange={e => set('discountPercentage', e.target.value)} placeholder="e.g. 20" style={inputStyle} />
              {errors.discountPercentage && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.discountPercentage}</div>}
            </div>
          )}
          {form.discountType === 'Fixed' && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Discount Amount (₹) *</label>
              <input type="number" className="form-control" value={form.discountAmount} min={1}
                onChange={e => set('discountAmount', e.target.value)} placeholder="e.g. 500" style={inputStyle} />
              {errors.discountAmount && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.discountAmount}</div>}
            </div>
          )}

          {/* Max Discount */}
          {form.discountType === 'Percentage' && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Max Discount Cap (₹)</label>
              <input type="number" className="form-control" value={form.maximumDiscount} min={0}
                onChange={e => set('maximumDiscount', e.target.value)} placeholder="Optional cap" style={inputStyle} />
            </div>
          )}

          {/* Min Order */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Min. Order Amount (₹)</label>
            <input type="number" className="form-control" value={form.minimumOrderAmount} min={0}
              onChange={e => set('minimumOrderAmount', e.target.value)} placeholder="0" style={inputStyle} />
          </div>

          {/* Usage Limit */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Usage Limit <span className="text-theme-muted">(0 = unlimited)</span></label>
            <input type="number" className="form-control" value={form.usageLimit} min={0}
              onChange={e => set('usageLimit', e.target.value)} placeholder="0" style={inputStyle} />
            {errors.usageLimit && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.usageLimit}</div>}
          </div>

          {/* Start Date */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Start Date <span className="text-theme-muted">(optional)</span></label>
            <input type="date" className="form-control" value={form.startDate}
              onChange={e => set('startDate', e.target.value)} style={inputStyle} />
          </div>

          {/* Expiry Date */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Expiry Date *</label>
            <input type="date" className="form-control" value={form.expiryDate}
              onChange={e => set('expiryDate', e.target.value)} style={inputStyle} />
            {errors.expiryDate && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.expiryDate}</div>}
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="form-label fw-bold text-theme-title" style={{ fontSize: '0.83rem' }}>Description <span className="text-theme-muted">(optional)</span></label>
            <textarea className="form-control" rows={2} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Internal description of this coupon..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Is Active */}
          <div className="col-12">
            <div className="d-flex align-items-center gap-3 p-3 rounded-3"
              style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
              <span className="fw-bold text-theme-title" style={{ fontSize: '0.85rem' }}>Active</span>
              <button type="button" onClick={() => set('isActive', !form.isActive)}
                className="btn p-0 ms-auto" style={{ color: form.isActive ? '#10b981' : 'var(--bb-text-muted)' }}>
                {form.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
              <span className="text-theme-muted" style={{ fontSize: '0.82rem' }}>
                {form.isActive ? 'Coupon is active' : 'Coupon is disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="d-flex gap-2 mt-4">
          <button className="btn fw-bold flex-grow-1" onClick={onClose} disabled={saving}
            style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-text)', borderRadius: 10 }}>
            Cancel
          </button>
          <button className="btn fw-bold flex-grow-1" onClick={handleSave} disabled={saving}
            style={{ background: 'rgba(168,32,255,0.2)', border: '1px solid rgba(168,32,255,0.5)', color: '#d161ff', borderRadius: 10 }}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Coupon'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({ coupon, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminService.deleteCoupon(coupon.id)
      toast.success(`Coupon "${coupon.code}" deleted`)
      onDeleted()
      onClose()
    } catch {
      toast.error('Failed to delete coupon')
    } finally {
      setDeleting(false)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="p-4 rounded-4 text-center mx-3"
        style={{ background: 'var(--bb-surface)', border: '1px solid rgba(239,68,68,0.3)', maxWidth: 380 }}
      >
        <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: 60, height: 60, background: 'rgba(239,68,68,0.12)' }}>
          <Trash2 size={28} style={{ color: '#ef4444' }} />
        </div>
        <h5 className="fw-black text-theme-title mb-2">Delete Coupon?</h5>
        <p className="text-theme-muted mb-4" style={{ fontSize: '0.88rem' }}>
          Are you sure you want to delete <strong style={{ color: '#d161ff' }}>{coupon.code}</strong>? This cannot be undone.
        </p>
        <div className="d-flex gap-2">
          <button className="btn fw-bold flex-grow-1" onClick={onClose} disabled={deleting}
            style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-text)', borderRadius: 10 }}>
            Cancel
          </button>
          <button className="btn fw-bold flex-grow-1" onClick={handleDelete} disabled={deleting}
            style={{ background: '#ef4444', color: '#fff', borderRadius: 10 }}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Promotions Page ──────────────────────────────────────────────────────
export default function Promotions() {
  const [coupons, setCoupons] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCoupon, setEditCoupon] = useState(null)
  const [deleteCoupon, setDeleteCoupon] = useState(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      const [data, statsData] = await Promise.all([
        adminService.getAllCoupons(),
        adminService.getCouponStats(),
      ])
      setCoupons(data || [])
      setStats(statsData)
    } catch {
      toast.error('Failed to load promotions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async (coupon) => {
    try {
      await adminService.toggleCoupon(coupon.id)
      toast.success(`Coupon ${coupon.isActive ? 'disabled' : 'enabled'}`)
      load()
    } catch {
      toast.error('Failed to toggle coupon')
    }
  }

  const handleDuplicate = (coupon) => {
    setEditCoupon({
      ...coupon,
      id: null, // null = create mode
      code: `${coupon.code}_COPY`,
    })
    setShowModal(true)
  }

  // Filter logic
  const filteredCoupons = coupons.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    const matchType = typeFilter === 'All' || c.discountType === typeFilter
    return matchStatus && matchType
  })

  // KPI cards
  const kpis = stats ? [
    { label: 'Active Coupons', value: stats.activeCount, icon: CheckCircle, color: '#10b981' },
    { label: 'Expired', value: stats.expiredCount, icon: XCircle, color: '#ef4444' },
    { label: 'Scheduled', value: stats.scheduledCount, icon: Clock, color: '#f59e0b' },
    { label: 'Total Redemptions', value: stats.totalRedemptions, icon: TrendingUp, color: '#00f3ff' },
    { label: 'Discount Given', value: fmtCurrency(stats.totalDiscountGiven), icon: Tag, color: '#d161ff' },
    { label: 'Total Coupons', value: coupons.length, icon: Tag, color: '#818cf8' },
  ] : Array(6).fill(null)

  const columns = [
    {
      key: 'code', label: 'Code', sortable: true,
      render: (row) => (
        <span className="fw-black px-2 py-1 rounded-2" style={{
          background: 'rgba(168,32,255,0.1)', color: '#d161ff',
          fontFamily: 'monospace', fontSize: '0.88rem', letterSpacing: '0.5px'
        }}>{row.code}</span>
      )
    },
    {
      key: 'discountType', label: 'Type', sortable: true,
      render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>{row.discountType}</span>
    },
    {
      key: 'discountValue', label: 'Discount', sortable: false,
      render: (row) => {
        if (row.discountType === 'Percentage') return <span className="fw-bold text-theme-title">{row.discountPercentage}%</span>
        if (row.discountType === 'Shipping') return <span className="fw-bold" style={{ color: '#10b981' }}>Free Ship</span>
        return <span className="fw-bold text-theme-title">{fmtCurrency(row.discountAmount)}</span>
      }
    },
    {
      key: 'usageInfo', label: 'Usage', sortable: false,
      render: (row) => (
        <div>
          <span className="text-theme-title fw-bold" style={{ fontSize: '0.85rem' }}>{row.usedCount}</span>
          <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>
            {row.usageLimit > 0 ? ` / ${row.usageLimit}` : ' / ∞'}
          </span>
          {row.usageLimit > 0 && (
            <div className="mt-1" style={{ background: 'var(--bb-border)', borderRadius: 4, height: 4, width: 60 }}>
              <div style={{
                background: 'var(--bb-accent)', borderRadius: 4, height: '100%',
                width: `${Math.min(100, (row.usedCount / row.usageLimit) * 100)}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'expiryDate', label: 'Expires', sortable: true,
      render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.82rem' }}>{fmtDate(row.expiryDate)}</span>
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (row) => {
        const Icon = row.status === 'Active' ? CheckCircle : row.status === 'Expired' ? XCircle : Clock
        return (
          <span className={statusBadge(row.status)} style={{ gap: 4 }}>
            <Icon size={11} />
            {row.status}
          </span>
        )
      }
    },
    {
      key: 'isActive', label: 'Enabled', sortable: false,
      render: (row) => (
        <button onClick={() => handleToggle(row)} className="btn p-0"
          style={{ color: row.isActive ? '#10b981' : 'var(--bb-text-muted)', transition: 'color 0.2s' }}
          title={row.isActive ? 'Disable' : 'Enable'}>
          {row.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
        </button>
      )
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (row) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm p-1" title="Edit"
            onClick={() => { setEditCoupon(row); setShowModal(true) }}
            style={{ background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)', color: 'var(--bb-accent)', borderRadius: 6 }}>
            <Edit3 size={13} />
          </button>
          <button className="btn btn-sm p-1" title="Duplicate"
            onClick={() => handleDuplicate(row)}
            style={{ background: 'rgba(168,32,255,0.1)', border: '1px solid rgba(168,32,255,0.3)', color: '#d161ff', borderRadius: 6 }}>
            <Copy size={13} />
          </button>
          <button className="btn btn-sm p-1" title="Delete"
            onClick={() => setDeleteCoupon(row)}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 6 }}>
            <Trash2 size={13} />
          </button>
        </div>
      )
    }
  ]

  // Filter slot for DataTable
  const filterSlot = (
    <div className="d-flex gap-2 flex-wrap">
      <select className="form-select form-select-sm fw-bold"
        style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-text)', border: '1px solid var(--bb-border)', borderRadius: 8, minWidth: 120 }}
        value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Expired">Expired</option>
        <option value="Scheduled">Scheduled</option>
      </select>
      <select className="form-select form-select-sm fw-bold"
        style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-text)', border: '1px solid var(--bb-border)', borderRadius: 8, minWidth: 130 }}
        value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
        <option value="All">All Types</option>
        <option value="Percentage">Percentage</option>
        <option value="Fixed">Fixed</option>
        <option value="Shipping">Shipping</option>
      </select>
    </div>
  )

  return (
    <div className="py-2 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Promotions Engine</h2>
          <p className="text-theme-muted mb-0">Create and manage marketing campaigns and discounts.</p>
        </div>
        <button
          className="btn btn-glow fw-bold d-flex align-items-center gap-2"
          style={{ borderRadius: 12 }}
          onClick={() => { setEditCoupon(null); setShowModal(true) }}
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-6 col-md-4 col-xl-2">
            <div className="p-3 h-100 rounded-4"
              style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', boxShadow: '0 4px 20px var(--bb-shadow)', transition: 'all 0.3s' }}>
              {isLoading || !kpi ? (
                <div className="skeleton-pulse rounded-3" style={{ height: 56 }} />
              ) : (
                <>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <kpi.icon size={14} style={{ color: kpi.color, flexShrink: 0 }} />
                    <h6 className="fw-bold mb-0 text-theme-muted" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</h6>
                  </div>
                  <h3 className="fw-black mb-0" style={{ color: kpi.color, fontSize: '1.6rem' }}>{kpi.value}</h3>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Table */}
      <DataTable
        columns={columns}
        data={filteredCoupons}
        searchPlaceholder="Search coupons by code..."
        searchableFields={['code', 'description', 'status', 'discountType']}
        loading={isLoading}
        filterSlot={filterSlot}
        onAdd={() => { setEditCoupon(null); setShowModal(true) }}
        addLabel="Create Coupon"
      />

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <CouponModal
            coupon={editCoupon}
            onClose={() => { setShowModal(false); setEditCoupon(null) }}
            onSaved={load}
          />
        )}
        {deleteCoupon && (
          <DeleteConfirmModal
            coupon={deleteCoupon}
            onClose={() => setDeleteCoupon(null)}
            onDeleted={load}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
