import { useState, useEffect } from 'react'
import { Mail, Phone, MoreVertical, ShieldAlert } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DataTable from '../../components/admin/DataTable'
import adminService from '../../services/adminService'

export default function Users() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const data = await adminService.getAllUsers()
        
        // Map the backend DTO to match the UI expectations
        const mappedUsers = data.map(u => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          phone: u.phoneNumber,
          status: u.isActive ? 'Active' : 'Suspended',
          role: u.roles.includes('Admin') ? 'Admin' : 'Customer',
          joinDate: new Date(u.joinDate).toISOString().split('T')[0]
        }))

        setUsers(mappedUsers)
      } catch (error) {
        toast.error("Failed to load users")
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleToggleRole = async (userRow) => {
    try {
      const newRole = userRow.role === 'Admin' ? 'Customer' : 'Admin';
      await adminService.updateUserRole(userRow.id, newRole);
      setUsers(prev => prev.map(u => u.id === userRow.id ? { ...u, role: newRole } : u));
      toast.success(`Role updated successfully to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role");
    }
  }

  const handleToggleLock = async (userRow) => {
    try {
      const shouldLock = userRow.status === 'Active';
      await adminService.lockUser(userRow.id, shouldLock);
      const newStatus = shouldLock ? 'Suspended' : 'Active';
      setUsers(prev => prev.map(u => u.id === userRow.id ? { ...u, status: newStatus } : u));
      toast.success(shouldLock ? "User account suspended" : "User account reactivated");
    } catch (error) {
      toast.error("Failed to update account status");
    }
  }

  const columns = [
    { key: 'name', label: 'User', sortable: true, render: (row) => {
      const isAdmin = row.role === 'Admin'
      return (
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" 
            style={{ 
              width: '40px', height: '40px', 
              background: isAdmin ? 'linear-gradient(135deg, #a820ff, #00f3ff)' : 'var(--bb-surface-2)',
              border: '1px solid var(--bb-border)'
            }}
          >
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="mb-0 fw-bold text-theme-title">{row.name}</p>
            <p className="mb-0 text-theme-muted" style={{ fontSize: '0.75rem' }}>ID: {row.id}</p>
          </div>
        </div>
      )
    }},
    { key: 'email', label: 'Contact Info', sortable: true, render: (row) => (
      <div className="d-flex flex-column gap-1">
        <span className="text-theme-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
          <Mail size={12} /> {row.email}
        </span>
        <span className="text-theme-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
          <Phone size={12} /> {row.phone}
        </span>
      </div>
    )},
    { key: 'role', label: 'Role', sortable: true, render: (row) => {
      const isAdmin = row.role === 'Admin'
      return (
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
          {row.role}
        </span>
      )
    }},
    { key: 'joinDate', label: 'Join Date', sortable: true, render: (row) => (
      <span className="text-theme-muted" style={{ fontSize: '0.9rem' }}>
        {new Date(row.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (row) => {
      const isActive = row.status === 'Active'
      return (
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
          {!isActive && <ShieldAlert size={12} />} {row.status}
        </span>
      )
    }},
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="dropdown text-end">
        <button 
          className="btn border-0 p-2 text-theme-muted hover-scale" 
          type="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
          title="Actions"
        >
          <MoreVertical size={16} />
        </button>
        <ul 
          className="dropdown-menu dropdown-menu-end p-2" 
          style={{ 
            background: 'var(--bb-surface-2)', 
            border: '1px solid var(--bb-border)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 1050
          }}
        >
          <li>
            <button 
              className="dropdown-item text-theme-title py-2 px-3 rounded text-start" 
              style={{ fontSize: '0.85rem', background: 'transparent', border: 0 }}
              onClick={() => handleToggleRole(row)}
            >
              Make {row.role === 'Admin' ? 'Customer' : 'Admin'}
            </button>
          </li>
          <li>
            <button 
              className="dropdown-item text-theme-title py-2 px-3 rounded text-start" 
              style={{ fontSize: '0.85rem', background: 'transparent', border: 0 }}
              onClick={() => handleToggleLock(row)}
            >
              {row.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
            </button>
          </li>
        </ul>
      </div>
    )}
  ]

  return (
    <div className="py-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">User Management</h2>
          <p className="text-theme-muted mb-0">View and manage registered customers and admins</p>
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
          data={users}
          searchPlaceholder="Search by Name, Email, or ID..."
          searchableFields={['name', 'email', 'id', 'role', 'status']}
        />
      )}
    </div>
  )
}
