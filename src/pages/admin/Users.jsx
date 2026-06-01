import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, MoreVertical, ShieldAlert } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Users() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // Mock data for Phase 9 UI since backend doesn't expose GetAllUsers yet
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setUsers([
        { id: 'usr_8f739a', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', status: 'Active', role: 'Customer', joinDate: '2026-01-15' },
        { id: 'usr_2b55c1', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 91234 56789', status: 'Active', role: 'Customer', joinDate: '2026-02-04' },
        { id: 'usr_9e11d4', name: 'Rahul Desai', email: 'rahul.desai@example.com', phone: '+91 99887 76655', status: 'Suspended', role: 'Customer', joinDate: '2026-03-22' },
        { id: 'usr_4a88b2', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 88776 65544', status: 'Active', role: 'Customer', joinDate: '2026-04-10' },
        { id: 'usr_7c33f9', name: 'Vikram Singh', email: 'vikram.admin@beatbox.com', phone: '+91 90000 11111', status: 'Active', role: 'Admin', joinDate: '2025-11-01' },
      ])
      setIsLoading(false)
    }, 800)
  }, [])

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    
    if (filter === 'active') return u.status === 'Active'
    if (filter === 'suspended') return u.status === 'Suspended'
    if (filter === 'admins') return u.role === 'Admin'
    return true
  })

  return (
    <div className="py-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">User Management</h2>
          <p className="text-theme-muted mb-0">View and manage registered customers and admins</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card border-0 mb-4 p-3" style={{ background: 'var(--bb-surface)', borderRadius: '12px' }}>
        <div className="d-flex flex-column flex-md-row gap-3">
          <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
            <Search size={18} className="position-absolute top-50 translate-middle-y ms-3 text-theme-muted" />
            <input 
              type="text" 
              className="form-control premium-search-input ps-5"
              placeholder="Search by Name, Email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="form-select premium-search-input" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended</option>
            <option value="admins">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 p-0 overflow-hidden" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0 text-theme-text">
            <thead style={{ borderBottom: '1px solid var(--bb-border)', background: 'rgba(0,0,0,0.2)' }}>
              <tr>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>User</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Contact Info</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Role</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Join Date</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                <th className="py-3 px-4 text-theme-muted fw-bold text-end" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-theme-muted">No users found matching your criteria.</td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const isActive = u.status === 'Active'
                  const isAdmin = u.role === 'Admin'
                  
                  return (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" 
                            style={{ 
                              width: '40px', height: '40px', 
                              background: isAdmin ? 'linear-gradient(135deg, #a820ff, #00f3ff)' : 'var(--bb-surface-2)',
                              border: '1px solid var(--bb-border)'
                            }}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="mb-0 fw-bold text-theme-title">{u.name}</p>
                            <p className="mb-0 text-theme-muted" style={{ fontSize: '0.75rem' }}>ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex flex-column gap-1">
                          <span className="text-theme-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                            <Mail size={12} /> {u.email}
                          </span>
                          <span className="text-theme-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                            <Phone size={12} /> {u.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className="badge rounded-pill px-3 py-1"
                          style={{ 
                            background: isAdmin ? 'rgba(168,32,255,0.1)' : 'rgba(255,255,255,0.05)',
                            color: isAdmin ? '#a820ff' : 'var(--bb-text)',
                            border: `1px solid ${isAdmin ? 'rgba(168,32,255,0.2)' : 'var(--bb-border)'}`,
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-theme-muted" style={{ fontSize: '0.9rem' }}>
                        {new Date(u.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className="d-inline-flex align-items-center gap-1 badge rounded-pill px-3 py-1"
                          style={{ 
                            background: isActive ? 'rgba(57,255,20,0.1)' : 'rgba(239,68,68,0.1)',
                            color: isActive ? '#39ff14' : '#ef4444',
                            border: `1px solid currentColor`,
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }}
                        >
                          {!isActive && <ShieldAlert size={12} />} {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <button className="btn border-0 p-2 text-theme-muted hover-scale" title="Actions" onClick={() => toast("User management actions")}>
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
