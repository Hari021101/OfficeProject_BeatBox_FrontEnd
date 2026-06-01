import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const data = await productService.getAllProducts()
        setProducts(data || [])
      } catch (err) {
        toast.error('Failed to load inventory')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery)
    if (!matchesSearch) return false
    
    if (filter === 'low_stock') return (p.stockQuantity || 0) < 10 && (p.stockQuantity || 0) > 0
    if (filter === 'out_of_stock') return (p.stockQuantity || 0) === 0
    if (filter === 'in_stock') return (p.stockQuantity || 0) >= 10
    return true
  })

  // Quick stats
  const outOfStockCount = products.filter(p => (p.stockQuantity || 0) === 0).length
  const lowStockCount = products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10).length

  return (
    <div className="py-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Inventory Management</h2>
          <p className="text-theme-muted mb-0">Monitor stock levels and replenish inventory</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 p-4 h-100" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="fw-black text-theme-title mb-0">{outOfStockCount}</h3>
                <p className="text-theme-muted mb-0" style={{ fontSize: '0.85rem' }}>Out of Stock Items</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 p-4 h-100" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                <TrendingDown size={24} />
              </div>
              <div>
                <h3 className="fw-black text-theme-title mb-0">{lowStockCount}</h3>
                <p className="text-theme-muted mb-0" style={{ fontSize: '0.85rem' }}>Low Stock Items (&lt; 10)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 p-4 h-100" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle" style={{ background: 'rgba(57,255,20,0.1)', color: '#39ff14' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="fw-black text-theme-title mb-0">{products.length - outOfStockCount - lowStockCount}</h3>
                <p className="text-theme-muted mb-0" style={{ fontSize: '0.85rem' }}>Healthy Stock Items</p>
              </div>
            </div>
          </div>
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
              placeholder="Search by Product Name or ID..."
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
            <option value="all">All Inventory</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="in_stock">In Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card border-0 p-0 overflow-hidden" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0 text-theme-text">
            <thead style={{ borderBottom: '1px solid var(--bb-border)', background: 'rgba(0,0,0,0.2)' }}>
              <tr>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Product ID</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Product Name</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Category</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Stock Quantity</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                <th className="py-3 px-4 text-theme-muted fw-bold text-end" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Action</th>
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
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-theme-muted">No products match your inventory filter.</td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => {
                  const stock = product.stockQuantity || 0
                  const isOut = stock === 0
                  const isLow = stock > 0 && stock < 10
                  
                  return (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td className="py-3 px-4 fw-bold text-theme-title">#{product.id}</td>
                      <td className="py-3 px-4 fw-bold text-theme-title">{product.name}</td>
                      <td className="py-3 px-4 text-theme-muted" style={{ fontSize: '0.9rem' }}>{product.categoryName || 'Uncategorized'}</td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-2">
                          <input 
                            type="number" 
                            className="form-control form-control-sm premium-search-input text-center fw-bold" 
                            style={{ width: '80px', color: isOut ? '#ef4444' : isLow ? '#f59e0b' : 'var(--bb-text)' }}
                            defaultValue={stock}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className="badge rounded-pill px-3 py-1"
                          style={{ 
                            background: isOut ? 'rgba(239,68,68,0.1)' : isLow ? 'rgba(245,158,11,0.1)' : 'rgba(57,255,20,0.1)',
                            color: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#39ff14',
                            border: `1px solid currentColor`,
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <button className="btn btn-sm btn-glow fw-bold px-3">Update</button>
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
