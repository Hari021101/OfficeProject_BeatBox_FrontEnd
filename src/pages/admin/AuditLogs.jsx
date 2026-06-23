import React, { useState } from 'react'
import { ShieldAlert, User, Edit, Trash2, PlusCircle, Search, Filter } from 'lucide-react'

const MOCK_LOGS = [
  { id: 1, admin: 'Sarah Jenkins', role: 'Super Admin', action: 'UPDATED', target: 'Product: BeatBox Soundbar Pro 5.1', details: 'Changed price from ₹7999 to ₹6999', timestamp: '2 mins ago', icon: Edit, color: 'text-info', bg: 'bg-info' },
  { id: 2, admin: 'John Doe', role: 'Store Manager', action: 'DELETED', target: 'Product: Old Stock Earbuds', details: 'Removed item from catalog', timestamp: '1 hour ago', icon: Trash2, color: 'text-danger', bg: 'bg-danger' },
  { id: 3, admin: 'System', role: 'Automated', action: 'ALERT', target: 'Inventory', details: 'Stock for "TWS Sport Pro" dropped below critical threshold (5 units)', timestamp: '3 hours ago', icon: ShieldAlert, color: 'text-warning', bg: 'bg-warning' },
  { id: 4, admin: 'Sarah Jenkins', role: 'Super Admin', action: 'CREATED', target: 'Coupon: SUMMER50', details: 'Created 50% discount code valid until Aug 31', timestamp: 'Yesterday', icon: PlusCircle, color: 'text-success', bg: 'bg-success' },
  { id: 5, admin: 'Mike Ross', role: 'Support Agent', action: 'REFUNDED', target: 'Order #ORD-8821', details: 'Issued full refund of ₹2499 to customer wallet', timestamp: 'Yesterday', icon: User, color: 'text-primary', bg: 'bg-primary' },
]

const ACTION_COLORS = {
  UPDATED: { bg: 'rgba(0,243,255,0.1)', text: '#00f3ff', border: 'rgba(0,243,255,0.3)' },
  DELETED: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  ALERT:   { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  CREATED: { bg: 'rgba(57,255,20,0.1)',  text: '#39ff14', border: 'rgba(57,255,20,0.3)' },
  REFUNDED:{ bg: 'rgba(168,32,255,0.1)', text: '#a820ff', border: 'rgba(168,32,255,0.3)' },
}

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = MOCK_LOGS.filter(log =>
    log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="py-2">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.7rem)' }}>Audit Logs</h2>
          <p className="text-theme-muted mb-0" style={{ fontSize: '0.875rem' }}>Track administrative activity, security events, and system alerts.</p>
        </div>
        {/* Search */}
        <div className="position-relative" style={{ width: '100%', maxWidth: '300px' }}>
          <Search className="position-absolute top-50 translate-middle-y text-theme-muted" style={{ left: '14px', pointerEvents: 'none' }} size={16} />
          <input
            type="text"
            className="form-control text-theme-title fw-bold"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '42px',
              background: 'var(--bb-surface-2)',
              border: '1px solid var(--bb-border)',
              borderRadius: '12px',
              height: '40px',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div className="card border-0 p-3 p-md-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        {filteredLogs.length === 0 ? (
          <p className="text-theme-muted text-center py-5 mb-0">No logs found matching your search.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredLogs.map((log, idx) => {
              const colors = ACTION_COLORS[log.action] || ACTION_COLORS.UPDATED
              return (
                <div
                  key={log.id}
                  className="p-3 rounded-4"
                  style={{
                    background: 'var(--bb-surface-2)',
                    border: `1px solid ${colors.border}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Accent left bar */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: colors.text, borderRadius: '4px 0 0 4px' }} />

                  {/* Top row: action badge + icon + timestamp */}
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      {/* Icon */}
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{ width: '32px', height: '32px', background: colors.bg, color: colors.text }}
                      >
                        <log.icon size={15} />
                      </div>
                      {/* Action badge */}
                      <span
                        className="badge fw-bold"
                        style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontSize: '0.7rem', letterSpacing: '0.5px' }}
                      >
                        {log.action}
                      </span>
                    </div>
                    {/* Timestamp */}
                    <span className="text-theme-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>{log.timestamp}</span>
                  </div>

                  {/* Target */}
                  <h6 className="fw-bold text-theme-title mb-1" style={{ fontSize: '0.875rem' }}>{log.target}</h6>

                  {/* Details */}
                  <p className="text-theme-muted mb-2" style={{ fontSize: '0.8rem' }}>{log.details}</p>

                  {/* Admin info */}
                  <div className="d-flex align-items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--bb-border)' }}>
                    <div className="bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '22px', height: '22px' }}>
                      <User size={11} className="text-theme-muted" />
                    </div>
                    <span className="text-theme-title fw-bold" style={{ fontSize: '0.8rem' }}>{log.admin}</span>
                    <span className="text-theme-muted" style={{ fontSize: '0.75rem' }}>· {log.role}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
