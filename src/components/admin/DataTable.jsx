import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

export default function DataTable({ 
  columns, 
  data, 
  searchPlaceholder = "Search...", 
  searchableFields = ['name'],
  onAdd,
  addLabel = "Add New"
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Filtering
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return searchableFields.some(field => {
      const val = item[field];
      return val && val.toString().toLowerCase().includes(term);
    });
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
      {/* Toolbar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
        <div className="position-relative w-100" style={{ maxWidth: '400px' }}>
          <Search className="position-absolute top-50 translate-middle-y text-theme-muted" style={{ left: '15px' }} size={18} />
          <input
            type="text"
            className="form-control text-theme-title fw-bold pe-4"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ 
              paddingLeft: '45px', 
              background: 'var(--bb-surface-2)',
              border: '1px solid var(--bb-border)',
              borderRadius: '12px'
            }}
          />
        </div>
        
        {onAdd && (
          <button className="btn btn-glow fw-bold w-100 w-md-auto" onClick={onAdd} style={{ borderRadius: '12px' }}>
            + {addLabel}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-borderless align-middle mb-0 text-theme-text">
          <thead style={{ borderBottom: '1px solid var(--bb-border)' }}>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`py-3 text-theme-muted fw-bold ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                  style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}
                  onClick={() => col.sortable && requestSort(col.key)}
                >
                  <div className="d-flex align-items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown size={14} style={{ opacity: sortConfig.key === col.key ? 1 : 0.3 }} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-5 text-theme-muted">No data found.</td></tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary border-opacity-25">
          <span className="text-theme-muted fw-bold" style={{ fontSize: '0.85rem' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm text-theme-title p-2" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: '8px' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="btn btn-sm text-theme-title p-2" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', borderRadius: '8px' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
