import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react'
import { productService } from '../../services/productService'
import adminService from '../../services/adminService'
import { toast } from 'react-hot-toast'
import DataTable from '../../components/admin/DataTable'
import StockBadge from '../../components/admin/StockBadge'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Quick stats
  const outOfStockCount = products.filter(p => (p.stockQuantity || 0) === 0).length
  const lowStockCount = products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10).length
  const healthyStockCount = products.length - outOfStockCount - lowStockCount

  const handleStockChange = (id, newStock) => {
    setProducts(products.map(p => p.id === id ? { ...p, stockQuantity: parseInt(newStock) || 0 } : p))
  }

  const handleUpdate = async (id) => {
    const product = products.find(p => p.id === id)
    try {
      await adminService.updateStock(id, product.stockQuantity, 'restock', 'Admin manual update')
      toast.success(`Inventory updated for Product ID: ${id.toString().substring(0, 8)}...`)
    } catch (error) {
      toast.error('Failed to update stock')
    }
  }

  const columns = [
    { key: 'id', label: 'Product ID', sortable: true, render: (row) => <span className="fw-bold text-theme-title">#{row.id.toString().substring(0, 8)}...</span> },
    { key: 'name', label: 'Product Name', sortable: true, render: (row) => <span className="fw-bold text-theme-title">{row.name}</span> },
    { key: 'categoryName', label: 'Category', sortable: true, render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.9rem' }}>{row.categoryName || 'Uncategorized'}</span> },
    { 
      key: 'stockQuantity', 
      label: 'Stock Quantity', 
      sortable: true,
      render: (row) => {
        const stock = row.stockQuantity ?? 0;
        const isOut = stock === 0;
        const isLow = stock > 0 && stock < 10;
        return (
          <div className="d-flex align-items-center gap-2">
            <input 
              type="number" 
              className="form-control form-control-sm premium-search-input text-center fw-bold" 
              style={{ width: '80px', color: isOut ? '#ef4444' : isLow ? '#f59e0b' : 'var(--bb-text)' }}
              value={stock}
              onChange={(e) => handleStockChange(row.id, e.target.value)}
            />
          </div>
        )
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: false,
      render: (row) => <StockBadge stock={row.stockQuantity ?? 0} />
    },
    { 
      key: 'actions', 
      label: 'Action', 
      render: (row) => (
        <div className="text-end">
          <button className="btn btn-sm btn-glow fw-bold px-3" onClick={() => handleUpdate(row.id)}>Update</button>
        </div>
      )
    }
  ]

  return (
    <div className="py-2">
      <div className="mb-4">
        <h2 className="fw-black text-theme-title mb-1" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.7rem)' }}>Inventory Management</h2>
        <p className="text-theme-muted mb-0" style={{ fontSize: '0.875rem' }}>Monitor stock levels and replenish inventory</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Out of Stock', count: outOfStockCount, icon: AlertTriangle, iconColor: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Low Stock (< 10)', count: lowStockCount, icon: TrendingDown, iconColor: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Healthy Stock', count: healthyStockCount, icon: CheckCircle2, iconColor: '#39ff14', bg: 'rgba(57,255,20,0.1)' },
        ].map(({ label, count, icon: Icon, iconColor, bg }) => (
          <div className="col-12 col-md-4" key={label}>
            <div className="card border-0 h-100" style={{ background: 'var(--bb-surface)', borderRadius: '16px', padding: 'clamp(12px, 3vw, 20px)' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ width: 'clamp(40px, 7vw, 52px)', height: 'clamp(40px, 7vw, 52px)', background: bg, color: iconColor }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="fw-black text-theme-title mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.75rem)' }}>{count}</h3>
                  <p className="text-theme-muted mb-0" style={{ fontSize: 'clamp(0.72rem, 1.5vw, 0.85rem)' }}>{label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
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
          data={products}
          searchPlaceholder="Search by Product Name or ID..."
          searchableFields={['name', 'id']}
        />
      )}
    </div>
  )
}
