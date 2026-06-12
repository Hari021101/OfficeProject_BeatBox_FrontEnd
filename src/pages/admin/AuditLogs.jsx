import React, { useState } from 'react'
import { ShieldAlert, User, Edit, Trash2, PlusCircle, Search } from 'lucide-react'

const MOCK_LOGS = [
  { id: 1, admin: 'Sarah Jenkins', role: 'Super Admin', action: 'UPDATED', target: 'Product: BeatBox Soundbar Pro 5.1', details: 'Changed price from ₹7999 to ₹6999', timestamp: '2 mins ago', icon: Edit, color: 'text-info', bg: 'bg-info' },
  { id: 2, admin: 'John Doe', role: 'Store Manager', action: 'DELETED', target: 'Product: Old Stock Earbuds', details: 'Removed item from catalog', timestamp: '1 hour ago', icon: Trash2, color: 'text-danger', bg: 'bg-danger' },
  { id: 3, admin: 'System', role: 'Automated', action: 'ALERT', target: 'Inventory', details: 'Stock for "TWS Sport Pro" dropped below critical threshold (5 units)', timestamp: '3 hours ago', icon: ShieldAlert, color: 'text-warning', bg: 'bg-warning' },
  { id: 4, admin: 'Sarah Jenkins', role: 'Super Admin', action: 'CREATED', target: 'Coupon: SUMMER50', details: 'Created 50% discount code valid until Aug 31', timestamp: 'Yesterday', icon: PlusCircle, color: 'text-success', bg: 'bg-success' },
  { id: 5, admin: 'Mike Ross', role: 'Support Agent', action: 'REFUNDED', target: 'Order #ORD-8821', details: 'Issued full refund of ₹2499 to customer wallet', timestamp: 'Yesterday', icon: User, color: 'text-primary', bg: 'bg-primary' },
]

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = MOCK_LOGS.filter(log => 
    log.admin.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="py-2 animate__animated animate__fadeIn">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Audit Logs</h2>
          <p className="text-theme-muted mb-0">Track administrative activity, security events, and system alerts.</p>
        </div>
        <div className="position-relative w-100" style={{ maxWidth: '300px' }}>
          <Search className="position-absolute top-50 translate-middle-y text-theme-muted" style={{ left: '15px' }} size={18} />
          <input
            type="text"
            className="form-control text-theme-title fw-bold pe-4"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '45px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: '12px' }}
          />
        </div>
      </div>

      <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div className="position-relative">
          {/* Vertical Line */}
          <div className="position-absolute h-100" style={{ left: '24px', top: '0', width: '2px', background: 'var(--bb-border)', zIndex: 0 }}></div>
          
          <div className="d-flex flex-column gap-4 position-relative" style={{ zIndex: 1 }}>
            {filteredLogs.length === 0 ? (
              <p className="text-theme-muted text-center py-4">No logs found matching your search.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="d-flex gap-4">
                  {/* Icon Circle */}
                  <div className={`flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center ${log.bg} bg-opacity-10`} style={{ width: '50px', height: '50px', border: `1px solid var(--bb-border)` }}>
                    <log.icon size={20} className={log.color} />
                  </div>
                  
                  {/* Log Content */}
                  <div className="flex-grow-1 card border-0 p-3" style={{ background: 'var(--bb-surface-2)', borderRadius: '12px' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold text-theme-title mb-1">
                          <span className={`${log.color} me-2`}>[{log.action}]</span>
                          {log.target}
                        </h6>
                        <p className="text-theme-muted small mb-0">{log.details}</p>
                      </div>
                      <span className="badge bg-secondary bg-opacity-25 text-theme-muted">{log.timestamp}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                      <div className="bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                        <User size={12} className="text-theme-muted" />
                      </div>
                      <span className="text-theme-title fw-bold" style={{ fontSize: '0.85rem' }}>{log.admin}</span>
                      <span className="text-theme-muted" style={{ fontSize: '0.8rem' }}>• {log.role}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
