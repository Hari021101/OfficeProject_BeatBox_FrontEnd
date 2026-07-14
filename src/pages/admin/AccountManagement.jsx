import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserCheck, UserX, ShieldCheck, Mail, Phone,
  Calendar, Search, X, ChevronRight, RefreshCw,
  Crown, Ban, CheckCircle, Eye, TrendingUp, Lock
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import adminService from '../../services/adminService'
import StatWidget from '../../components/admin/StatWidget'
import api from '../../services/authService'

// ─── helpers ──────────────────────────────────────────────
const avatar = (name, isAdmin) => (
  <div
    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-black flex-shrink-0"
    style={{
      width: 40, height: 40, fontSize: '1rem',
      background: isAdmin
        ? 'linear-gradient(135deg, #a820ff, #00f3ff)'
        : 'linear-gradient(135deg, #1e3c72, #2a5298)',
      border: '2px solid var(--bb-border)'
    }}
  >
    {(name || '?').charAt(0).toUpperCase()}
  </div>
)

const StatusBadge = ({ active }) => (
  <span className={`admin-status-pill ${active ? 'status-active' : 'status-suspended'}`}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
    {active ? 'Active' : 'Suspended'}
  </span>
)

const RoleBadge = ({ role }) => (
  <span className={`admin-role-pill ${role === 'Admin' ? 'role-admin' : 'role-customer'}`}>
    {role === 'Admin' && <Crown size={10} />}{role}
  </span>
)

// ─── Detail Drawer ────────────────────────────────────────
function UserDetailDrawer({ user, onClose, onToggleStatus, onToggleRole, actionLoading }) {
  if (!user) return null
  const isAdmin = user.role === 'Admin'
  const isActive = user.status === 'Active'

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1040 }}
      />
      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420,
          background: 'var(--bb-surface)', borderLeft: '1px solid var(--bb-border)',
          zIndex: 1050, overflowY: 'auto', display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="p-4 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: 'var(--bb-border) !important' }}>
          <h5 className="fw-black text-theme-title mb-0">Account Details</h5>
          <button onClick={onClose} className="btn p-2 rounded-3 border-0" style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="p-4 border-bottom" style={{ borderColor: 'var(--bb-border)' }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-black"
              style={{
                width: 64, height: 64, fontSize: '1.6rem',
                background: isAdmin ? 'linear-gradient(135deg, #a820ff, #00f3ff)' : 'linear-gradient(135deg, #1e3c72, #2a5298)',
                border: '3px solid var(--bb-border)', boxShadow: isAdmin ? '0 0 20px rgba(168,32,255,0.3)' : 'none'
              }}>
              {(user.name || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="fw-black text-theme-title mb-1">{user.name}</h4>
              <div className="d-flex align-items-center gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge active={isActive} />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="d-flex flex-column gap-3">
            {[
              { icon: <Mail size={15} />, label: 'Email', value: user.email },
              { icon: <Phone size={15} />, label: 'Phone', value: user.phone || 'Not provided' },
              { icon: <Calendar size={15} />, label: 'Joined', value: new Date(user.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            ].map((item, i) => (
              <div key={i} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: 32, height: 32, background: 'rgba(0,243,255,0.08)', color: 'var(--bb-accent)', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="text-theme-muted mb-0" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                  <p className="text-theme-title fw-semibold mb-0 text-truncate" style={{ fontSize: '0.88rem' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 d-flex flex-column gap-3">
          <p className="text-theme-muted mb-1 fw-bold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Account Actions</p>

          {/* Toggle Status */}
          <button
            disabled={actionLoading}
            onClick={() => onToggleStatus(user)}
            className="btn w-100 d-flex align-items-center gap-3 p-3 rounded-3 fw-bold"
            style={{
              background: isActive ? 'rgba(239,68,68,0.08)' : 'rgba(57,255,20,0.08)',
              color: isActive ? '#ef4444' : '#39ff14',
              border: `1px solid ${isActive ? 'rgba(239,68,68,0.25)' : 'rgba(57,255,20,0.25)'}`,
              textAlign: 'left'
            }}
          >
            {isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
            <div>
              <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{isActive ? 'Suspend Account' : 'Reactivate Account'}</p>
              <p className="mb-0 opacity-75" style={{ fontSize: '0.75rem' }}>{isActive ? 'Revoke login access' : 'Restore login access'}</p>
            </div>
          </button>

          {/* Toggle Role */}
          <button
            disabled={actionLoading}
            onClick={() => onToggleRole(user)}
            className="btn w-100 d-flex align-items-center gap-3 p-3 rounded-3 fw-bold"
            style={{
              background: isAdmin ? 'rgba(245,158,11,0.08)' : 'rgba(168,32,255,0.08)',
              color: isAdmin ? '#f59e0b' : '#d161ff',
              border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.25)' : 'rgba(168,32,255,0.25)'}`,
              textAlign: 'left'
            }}
          >
            {isAdmin ? <Lock size={18} /> : <Crown size={18} />}
            <div>
              <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{isAdmin ? 'Demote to Customer' : 'Promote to Admin'}</p>
              <p className="mb-0 opacity-75" style={{ fontSize: '0.75rem' }}>{isAdmin ? 'Remove admin privileges' : 'Grant admin access'}</p>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div className="p-4 mt-auto">
          <p className="text-theme-muted mb-0 text-center" style={{ fontSize: '0.75rem' }}>
            User ID: <span className="text-theme-title fw-bold">{user.id}</span>
          </p>
        </div>
      </motion.div>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────
export default function AccountManagement() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortBy, setSortBy] = useState('joinDate')
  const [sortDir, setSortDir] = useState('desc')

  const load = async () => {
    setIsLoading(true)
    try {
      const data = await adminService.getAllUsers()
      setUsers(data.map(u => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        phone: u.phoneNumber,
        status: u.isActive ? 'Active' : 'Suspended',
        role: u.roles?.includes('Admin') ? 'Admin' : 'Customer',
        joinDate: u.joinDate,
      })))
    } catch {
      toast.error('Failed to load accounts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Stats
  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'Admin').length,
    active: users.filter(u => u.status === 'Active').length,
    suspended: users.filter(u => u.status === 'Suspended').length,
  }), [users])

  // Filtered + sorted list
  const displayedUsers = useMemo(() => {
    let list = [...users]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id?.toString().includes(q)
      )
    }
    if (filterRole !== 'All') list = list.filter(u => u.role === filterRole)
    if (filterStatus !== 'All') list = list.filter(u => u.status === filterStatus)
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy]
      if (sortBy === 'joinDate') { va = new Date(va); vb = new Date(vb) }
      else { va = (va || '').toString().toLowerCase(); vb = (vb || '').toString().toLowerCase() }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [users, search, filterRole, filterStatus, sortBy, sortDir])

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const handleToggleStatus = async (user) => {
    setActionLoading(true)
    const wasActive = user.status === 'Active'
    try {
      await api.put(`/account/${user.id}/toggle-status`)
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, status: wasActive ? 'Suspended' : 'Active' } : u
      ))
      setSelectedUser(prev => prev ? { ...prev, status: wasActive ? 'Suspended' : 'Active' } : prev)
      toast.success(`${user.name} has been ${wasActive ? 'suspended' : 'reactivated'}.`)
    } catch {
      toast.error('Action failed. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleRole = async (user) => {
    setActionLoading(true)
    const wasAdmin = user.role === 'Admin'
    try {
      await api.put(`/account/${user.id}/toggle-role`)
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, role: wasAdmin ? 'Customer' : 'Admin' } : u
      ))
      setSelectedUser(prev => prev ? { ...prev, role: wasAdmin ? 'Customer' : 'Admin' } : prev)
      toast.success(`${user.name} is now a ${wasAdmin ? 'Customer' : 'Admin'}.`)
    } catch {
      toast.error('Role update failed. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span style={{ opacity: 0.3, fontSize: '0.7rem' }}>↕</span>
    return <span style={{ color: 'var(--bb-accent)', fontSize: '0.7rem' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="py-2">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Account Management</h2>
          <p className="text-theme-muted mb-0 small">Manage user accounts, roles and access control</p>
        </div>
        <button
          onClick={load}
          disabled={isLoading}
          className="btn d-flex align-items-center gap-2 px-3 py-2 fw-bold rounded-3"
          style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', fontSize: '0.875rem' }}
        >
          <RefreshCw size={15} className={isLoading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stat Widgets */}
      <div className="row g-3 mb-4">
        {[
          { title: 'Total Accounts', value: stats.total, icon: Users, delay: 0.05 },
          { title: 'Active Accounts', value: stats.active, icon: UserCheck, delay: 0.1 },
          { title: 'Suspended',       value: stats.suspended, icon: UserX, delay: 0.15 },
          { title: 'Admins',          value: stats.admins, icon: ShieldCheck, delay: 0.2 },
        ].map((s, i) => (
          <div key={i} className="col-6 col-xl-3">
            <StatWidget title={s.title} value={s.value} trend={null} isPositive icon={s.icon} delay={s.delay} />
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="glass-card p-3 mb-4 rounded-4">
        <div className="row g-3 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <Search size={15} className="position-absolute text-theme-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="bb-input w-100"
                placeholder="Search by name, email or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '40px !important' }}
              />
            </div>
          </div>

          {/* Role filter */}
          <div className="col-6 col-md-3">
            <select
              className="bb-input w-100"
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              style={{ paddingLeft: '14px !important', cursor: 'pointer' }}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="col-6 col-md-3">
            <select
              className="bb-input w-100"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ paddingLeft: '14px !important', cursor: 'pointer' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Count */}
          <div className="col-12 col-md-1 text-md-end">
            <span className="text-theme-muted small">{displayedUsers.length} users</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-4 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: 'var(--bb-accent)' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-theme-muted mt-3 small">Fetching accounts...</p>
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="text-center py-5 p-4">
            <Users size={40} className="text-theme-muted mb-3" />
            <h5 className="text-theme-title fw-bold">No accounts found</h5>
            <p className="text-theme-muted small">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table mb-0" style={{ '--bs-table-bg': 'transparent' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  {[
                    { label: 'User', field: 'name' },
                    { label: 'Contact', field: 'email' },
                    { label: 'Role', field: 'role' },
                    { label: 'Joined', field: 'joinDate' },
                    { label: 'Status', field: 'status' },
                    { label: '', field: null },
                  ].map((col, i) => (
                    <th key={i}
                      onClick={() => col.field && toggleSort(col.field)}
                      className="py-3 px-4 fw-bold text-theme-muted"
                      style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: col.field ? 'pointer' : 'default', background: 'var(--bb-surface-2)', whiteSpace: 'nowrap', userSelect: 'none' }}
                    >
                      {col.label} {col.field && <SortIcon field={col.field} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {displayedUsers.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{ borderBottom: '1px solid var(--bb-border)', cursor: 'pointer' }}
                      onClick={() => setSelectedUser(user)}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,243,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* User */}
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          {avatar(user.name, user.role === 'Admin')}
                          <div style={{ minWidth: 0 }}>
                            <p className="mb-0 fw-bold text-theme-title text-truncate" style={{ fontSize: '0.9rem', maxWidth: 160 }}>{user.name}</p>
                            <p className="mb-0 text-theme-muted" style={{ fontSize: '0.72rem' }}>ID: {user.id?.toString().slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="d-flex flex-column gap-1">
                          <span className="text-theme-muted d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
                            <Mail size={11} /> {user.email}
                          </span>
                          <span className="text-theme-muted d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
                            <Phone size={11} /> {user.phone || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4"><RoleBadge role={user.role} /></td>

                      {/* Joined */}
                      <td className="py-3 px-4">
                        <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>
                          {new Date(user.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4"><StatusBadge active={user.status === 'Active'} /></td>

                      {/* Action */}
                      <td className="py-3 px-4 text-end">
                        <button
                          className="btn p-2 rounded-3 d-flex align-items-center gap-1 fw-semibold"
                          style={{ background: 'rgba(0,243,255,0.06)', border: '1px solid rgba(0,243,255,0.15)', color: 'var(--bb-accent)', fontSize: '0.78rem' }}
                          onClick={e => { e.stopPropagation(); setSelectedUser(user) }}
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetailDrawer
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onToggleStatus={handleToggleStatus}
            onToggleRole={handleToggleRole}
            actionLoading={actionLoading}
          />
        )}
      </AnimatePresence>

      {/* Spinner animation */}
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
