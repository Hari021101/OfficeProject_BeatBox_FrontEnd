import React, { useState, useEffect } from 'react'
import { ShieldAlert, User, Edit, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import adminService from '../../services/adminService'
import { toast } from 'react-hot-toast'

const ICONS = {
  ShieldAlert, User, Edit, Trash2, PlusCircle,
  XCircle: ShieldAlert, LogIn: User, Shield: User,
  PlusCircle, Trash2, Key: Edit, UserPlus: User,
  Upload: Edit, Star: Edit, Truck: Edit, ShoppingBag: Edit,
  Info: Edit
}

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true)
        const params = {
          searchTerm: searchTerm || undefined,
          page,
          pageSize: 20
        }
        const data = await adminService.getAuditLogs(params)
        setLogs(data)
        setHasMore(data.length === 20)
      } catch (error) {
        toast.error("Failed to load audit logs")
      } finally {
        setIsLoading(false)
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchLogs()
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, page])

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1)
  }

  const handleNextPage = () => {
    if (hasMore) setPage(p => p + 1)
  }

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
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            style={{ paddingLeft: '45px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: '12px' }}
          />
        </div>
      </div>

      <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="position-relative">
            {/* Vertical Line */}
            {logs.length > 0 && (
              <div className="position-absolute h-100" style={{ left: '24px', top: '0', width: '2px', background: 'var(--bb-border)', zIndex: 0 }}></div>
            )}
            
            <div className="d-flex flex-column gap-4 position-relative" style={{ zIndex: 1 }}>
              {logs.length === 0 ? (
                <p className="text-theme-muted text-center py-4">No logs found matching your search.</p>
              ) : (
                logs.map((log) => {
                  const IconComponent = ICONS[log.icon] || Edit;
                  return (
                    <div key={log.id} className="d-flex gap-4">
                      {/* Icon Circle */}
                      <div className={`flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center ${log.bgClass || 'bg-info'} bg-opacity-10`} style={{ width: '50px', height: '50px', border: `1px solid var(--bb-border)` }}>
                        <IconComponent size={20} className={log.colorClass || 'text-info'} />
                      </div>
                      
                      {/* Log Content */}
                      <div className="flex-grow-1 card border-0 p-3" style={{ background: 'var(--bb-surface-2)', borderRadius: '12px' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold text-theme-title mb-1">
                              <span className={`${log.colorClass || 'text-info'} me-2`}>[{log.action}]</span>
                              {log.target}
                            </h6>
                            <p className="text-theme-muted small mb-0">{log.details}</p>
                          </div>
                          <div className="d-flex flex-column align-items-end gap-1">
                            <span className="badge bg-secondary bg-opacity-25 text-theme-muted" style={{ fontSize: '0.75rem' }}>
                              {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {log.ipAddress && (
                              <span className="text-theme-muted" style={{ fontSize: '0.7rem' }}>IP: {log.ipAddress}</span>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                          <div className="bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                            <User size={12} className="text-theme-muted" />
                          </div>
                          <span className="text-theme-title fw-bold" style={{ fontSize: '0.85rem' }}>{log.adminName}</span>
                          <span className="text-theme-muted" style={{ fontSize: '0.8rem' }}>• {log.role}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Pagination Controls */}
            {logs.length > 0 && (
              <div className="d-flex justify-content-center gap-3 mt-4 pt-3 border-top border-secondary border-opacity-10">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-1 border-0"
                  disabled={page === 1}
                  onClick={handlePrevPage}
                  style={{ borderRadius: '10px' }}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className="d-flex align-items-center text-theme-title fw-bold">Page {page}</span>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-1 border-0"
                  disabled={!hasMore}
                  onClick={handleNextPage}
                  style={{ borderRadius: '10px' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
