import { useState, useRef } from 'react'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, LayoutList, Table2, Inbox, Info } from 'lucide-react'

export default function DataTable({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchableFields = ['name'],
  onAdd,
  addLabel = "Add New",
  filterSlot,
  selectable = false,
  onSelectionChange,
  bulkActions = [],
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [viewMode, setViewMode] = useState('table') // 'table' | 'card'
  const itemsPerPage = 8

  // Filtering
  const filteredData = data.filter(item => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return searchableFields.some(field => {
      const val = item[field]
      return val && val.toString().toLowerCase().includes(term)
    })
  })

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  const handleToggleRow = (id) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(id)) newSelection.delete(id)
    else newSelection.add(id)
    setSelectedRows(newSelection)
    if (onSelectionChange) onSelectionChange(Array.from(newSelection))
  }

  const handleToggleAll = () => {
    if (selectedRows.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedRows(new Set())
      if (onSelectionChange) onSelectionChange([])
    } else {
      const allIds = new Set(paginatedData.map(r => r.id))
      setSelectedRows(allIds)
      if (onSelectionChange) onSelectionChange(Array.from(allIds))
    }
  }

  // Visible page numbers (mobile: 3 max, desktop: 5 max)
  const getPageNumbers = () => {
    const range = []
    const maxVisible = window.innerWidth < 576 ? 3 : 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
    for (let i = start; i <= end; i++) range.push(i)
    return range
  }

  // Separate action column from data columns
  const actionCol = columns.find(c => c.key === 'actions')
  const dataCols = columns.filter(c => c.key !== 'actions')

  return (
    <div className="card border-0" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px var(--bb-shadow)', overflow: 'hidden' }}>

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="p-3 p-md-4" style={{ borderBottom: '1px solid var(--bb-border)' }}>
        <div className="d-flex flex-wrap gap-2 align-items-center">

          {/* Search */}
          <div className="position-relative flex-grow-1" style={{ minWidth: '180px', maxWidth: '420px' }}>
            <Search className="position-absolute top-50 translate-middle-y text-theme-muted" style={{ left: '14px', pointerEvents: 'none' }} size={16} />
            <input
              type="text"
              className="form-control text-theme-title fw-bold"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
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

          {/* Filter slot */}
          {filterSlot && (
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
              {filterSlot}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow-1 d-none d-md-block" />

          {/* View toggle — only show on sm+ */}
          <div className="d-none d-sm-flex gap-1 p-1 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
            <button
              className="btn p-1 px-2 d-flex align-items-center"
              title="Table view"
              onClick={() => setViewMode('table')}
              style={{ background: viewMode === 'table' ? 'var(--bb-accent)' : 'transparent', color: viewMode === 'table' ? '#000' : 'var(--bb-muted)', borderRadius: '8px', border: 'none', transition: 'all 0.2s' }}
            >
              <Table2 size={16} />
            </button>
            <button
              className="btn p-1 px-2 d-flex align-items-center"
              title="Card view"
              onClick={() => setViewMode('card')}
              style={{ background: viewMode === 'card' ? 'var(--bb-accent)' : 'transparent', color: viewMode === 'card' ? '#000' : 'var(--bb-muted)', borderRadius: '8px', border: 'none', transition: 'all 0.2s' }}
            >
              <LayoutList size={16} />
            </button>
          </div>

          {/* Add button */}
          {onAdd && (
            <button
              className="btn btn-glow fw-bold d-flex align-items-center gap-2"
              onClick={onAdd}
              style={{ borderRadius: '12px', height: '40px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
              <span className="d-none d-sm-inline">{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Bulk Action Banner ─────────────────────────────── */}
      {selectable && selectedRows.size > 0 && bulkActions.length > 0 && (
        <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 px-3 px-md-4 py-2 animate__animated animate__fadeIn"
          style={{ background: 'var(--bb-accent-glow)', borderBottom: '1px solid rgba(0, 243, 255, 0.2)' }}>
          <span className="text-theme-title fw-bold" style={{ fontSize: '0.875rem' }}>{selectedRows.size} Selected</span>
          <div className="d-flex flex-wrap gap-2 ms-auto">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                className={`btn btn-sm fw-bold d-flex align-items-center gap-1 ${action.danger ? 'btn-outline-danger' : 'btn-outline-info'}`}
                onClick={() => action.onClick(Array.from(selectedRows))}
                style={{ fontSize: '0.8rem' }}
              >
                {action.icon && <action.icon size={13} />}
                <span className="d-none d-sm-inline">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── CARD VIEW (xs default, toggle on sm+) ─────────── */}
      {(viewMode === 'card') && (
        <div className="p-3 d-flex flex-column gap-3">
          {loading ? (
            [...Array(3)].map((_, rIdx) => (
              <div key={rIdx} className="p-3 rounded-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                <div className="d-flex flex-column gap-2">
                  {dataCols.slice(0, 3).map((_, cIdx) => (
                    <div key={cIdx} className="d-flex align-items-center gap-2">
                      <div className="skeleton-pulse rounded" style={{ width: '80px', height: '14px' }} />
                      <div className="skeleton-pulse rounded" style={{ width: cIdx === 0 ? '140px' : '100px', height: '14px' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center gap-2 py-4">
                <Inbox size={48} className="text-theme-muted mb-2 opacity-50" />
                <h6 className="fw-bold text-theme-title mb-0">No Records Found</h6>
                <p className="text-theme-muted small mb-0">There are no records matches in this criteria.</p>
              </div>
            </div>
          ) : (
            paginatedData.map((row, rowIdx) => (
              <div
                key={row.id || rowIdx}
                className="p-3 rounded-4"
                style={{
                  background: selectedRows.has(row.id) ? 'rgba(0,243,255,0.05)' : 'var(--bb-surface-2)',
                  border: `1px solid ${selectedRows.has(row.id) ? 'rgba(0,243,255,0.3)' : 'var(--bb-border)'}`,
                  transition: 'border-color 0.2s'
                }}
              >
                {selectable && (
                  <div className="mb-2">
                    <input type="checkbox" className="form-check-input me-2" checked={selectedRows.has(row.id)} onChange={() => handleToggleRow(row.id)} style={{ cursor: 'pointer' }} />
                  </div>
                )}
                <div className="d-flex flex-column gap-2">
                  {dataCols.map((col, colIdx) => (
                    <div key={colIdx} className="d-flex align-items-start gap-2">
                      <span className="text-theme-muted fw-bold flex-shrink-0" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: '80px', paddingTop: '2px' }}>{col.label}</span>
                      <span style={{ fontSize: '0.875rem' }}>{col.render ? col.render(row) : row[col.key]}</span>
                    </div>
                  ))}
                  {actionCol && (
                    <div className="d-flex justify-content-end pt-2 mt-1" style={{ borderTop: '1px solid var(--bb-border)' }}>
                      {actionCol.render(row)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TABLE VIEW ─────────────────────────────────────── */}
      {viewMode === 'table' && (
        <div className="table-responsive" style={{ maxHeight: '550px', overflowX: 'auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table table-borderless align-middle mb-0 text-theme-text" style={{ minWidth: '540px' }}>
            <thead style={{ borderBottom: '1px solid var(--bb-border)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--bb-surface-2)' }}>
              <tr>
                {selectable && (
                  <th style={{ width: '44px', paddingLeft: '16px', paddingRight: '8px' }} className="py-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                      onChange={handleToggleAll}
                      style={{ cursor: 'pointer', background: 'var(--bb-surface-2)', borderColor: 'var(--bb-border)' }}
                    />
                  </th>
                )}
                {dataCols.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3 text-theme-muted fw-bold ${col.sortable ? 'user-select-none' : ''}`}
                    style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap', paddingLeft: idx === 0 && !selectable ? '16px' : undefined }}
                    onClick={() => col.sortable && requestSort(col.key)}
                  >
                    <div className="d-flex align-items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <ArrowUpDown size={12} style={{ opacity: sortConfig.key === col.key ? 1 : 0.3, flexShrink: 0, transition: 'opacity 0.2s' }} />
                      )}
                    </div>
                  </th>
                ))}
                {actionCol && (
                  <th className="py-3 text-theme-muted fw-bold text-end pe-4" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'sticky', right: 0, background: 'var(--bb-surface-2)', zIndex: 2 }}>
                    {actionCol.label}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--bb-border-light)' }}>
                    {selectable && <td className="py-3" style={{ paddingLeft: '16px', paddingRight: '8px' }}><div className="skeleton-pulse rounded" style={{ width: '18px', height: '18px' }} /></td>}
                    {dataCols.map((col, cIdx) => (
                      <td key={cIdx} className="py-3">
                        <div className="skeleton-pulse rounded" style={{ width: cIdx === 0 ? '120px' : '80px', height: '16px' }} />
                      </td>
                    ))}
                    {actionCol && (
                      <td className="py-3 pe-3" style={{ position: 'sticky', right: 0, background: 'var(--bb-surface)', zIndex: 1 }}>
                        <div className="skeleton-pulse rounded" style={{ width: '60px', height: '16px', marginLeft: 'auto' }} />
                      </td>
                    )}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={selectable ? dataCols.length + (actionCol ? 2 : 1) : dataCols.length + (actionCol ? 1 : 0)} className="text-center py-5">
                    <div className="d-flex flex-column align-items-center gap-2 py-4">
                      <Inbox size={48} className="text-theme-muted mb-2 opacity-50" />
                      <h6 className="fw-bold text-theme-title mb-0">No Records Found</h6>
                      <p className="text-theme-muted small mb-0">There are no records matches in this criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={row.id || rowIdx}
                    className="table-row-hover"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: selectedRows.has(row.id) ? 'rgba(0, 243, 255, 0.03)' : 'transparent',
                      transition: 'background-color 0.25s'
                    }}
                  >
                    {selectable && (
                      <td className="py-3" style={{ paddingLeft: '16px', paddingRight: '8px' }}>
                        <input type="checkbox" className="form-check-input" checked={selectedRows.has(row.id)} onChange={() => handleToggleRow(row.id)} style={{ cursor: 'pointer', background: 'var(--bb-surface-2)', borderColor: 'var(--bb-border)' }} />
                      </td>
                    )}
                    {dataCols.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className="py-3"
                        style={{ paddingLeft: colIdx === 0 && !selectable ? '16px' : undefined }}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    {actionCol && (
                      <td
                        className="py-3 pe-3"
                        style={{
                          position: 'sticky',
                          right: 0,
                          background: selectedRows.has(row.id) ? 'rgba(0,243,255,0.03)' : 'var(--bb-surface)',
                          zIndex: 1,
                          boxShadow: '-6px 0 16px rgba(0,0,0,0.15)'
                        }}
                      >
                        {actionCol.render(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 px-md-4 py-3"
          style={{ borderTop: '1px solid var(--bb-border)' }}>
          <span className="text-theme-muted fw-bold" style={{ fontSize: '0.8rem' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="d-flex align-items-center gap-1">
            <button
              className="btn btn-sm d-flex align-items-center justify-content-center text-theme-title"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ width: '34px', height: '34px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: '8px', padding: 0 }}
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map(n => (
              <button
                key={n}
                className="btn btn-sm fw-bold"
                onClick={() => setCurrentPage(n)}
                style={{
                  width: '34px', height: '34px', padding: 0,
                  borderRadius: '8px', fontSize: '0.85rem',
                  background: currentPage === n ? 'var(--bb-accent)' : 'var(--bb-surface-2)',
                  color: currentPage === n ? '#000' : 'var(--bb-title-color)',
                  border: currentPage === n ? 'none' : '1px solid var(--bb-border)',
                  transition: 'all 0.15s'
                }}
              >
                {n}
              </button>
            ))}

            <button
              className="btn btn-sm d-flex align-items-center justify-content-center text-theme-title"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ width: '34px', height: '34px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: '8px', padding: 0 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
