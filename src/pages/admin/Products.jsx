import { useState, useEffect } from 'react'
import { Edit2, Trash2, MoreVertical } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'
import { IMAGE_MAP } from '../../data/products'
import DataTable from '../../components/admin/DataTable'
import StockBadge from '../../components/admin/StockBadge'
import AddProductModal from '../../components/admin/AddProductModal'

export default function Products() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const data = await productService.getAllProducts()
        setProducts(data || [])
      } catch (err) {
        toast.error('Failed to load products')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const mapImageKey = (url = '', name = '') => {
    const text = `${url} ${name}`.toLowerCase();
    if (text.includes('earbud') || text.includes('airdopes') || text.includes('tws') || text.includes('earphone')) return 'heroEarbuds';
    if (text.includes('speaker') || text.includes('stone') || text.includes('grenade') || text.includes('capsule sound')) return 'heroSpeaker';
    if (text.includes('gaming') || text.includes('immortal') || text.includes('headset')) return 'gamingHeadset';
    if (text.includes('neckband') || text.includes('collar') || text.includes('trip') || text.includes('rockerz club')) return 'wirelessNeckband';
    if (text.includes('smart') || text.includes('capsule') || text.includes('storm')) return 'smartEarbuds';
    if (text.includes('wired')) return 'heroWired';
    if (text.includes('watch')) return 'heroSmartwatch';
    return 'heroHeadphones';
  };

  const getProductImage = (prod) => {
    if (prod.imageUrl && prod.imageUrl.startsWith('http')) return prod.imageUrl;
    const key = mapImageKey(prod.imageUrl, prod.name);
    return IMAGE_MAP[key] || IMAGE_MAP.heroHeadphones;
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id)
        setProducts(products.filter(p => p.id !== id))
        toast.success('Product deleted successfully')
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const handleEdit = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setIsAddModalOpen(true);
    }
  }

  const columns = [
    { 
      key: 'name', 
      label: 'Product', 
      sortable: true,
      render: (row) => (
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden" 
            style={{ width: '48px', height: '48px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
          >
            <img src={getProductImage(row)} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p className="mb-0 fw-bold text-theme-title">{row.name}</p>
            <p className="mb-0 text-theme-muted" style={{ fontSize: '0.75rem' }}>ID: {row.id.toString().substring(0, 8)}...</p>
          </div>
        </div>
      )
    },
    { 
      key: 'categoryName', 
      label: 'Category', 
      sortable: true,
      render: (row) => <span className="text-theme-muted fw-medium" style={{ fontSize: '0.9rem' }}>{row.categoryName || 'Uncategorized'}</span>
    },
    { 
      key: 'price', 
      label: 'Price', 
      sortable: true,
      render: (row) => <span className="fw-black text-theme-title">₹{Number(row.discountPrice || row.price || 0).toLocaleString('en-IN')}</span>
    },
    { 
      key: 'stockQuantity', 
      label: 'Status', 
      sortable: true,
      render: (row) => <StockBadge stock={row.stockQuantity || 0} />
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (row) => (
        <div className="d-flex align-items-center justify-content-end">
          <button className="btn border-0 p-2 text-theme-muted hover-scale me-1" title="Edit" onClick={() => handleEdit(row.id)}>
            <Edit2 size={16} />
          </button>
          <button className="btn border-0 p-2 text-danger hover-scale me-1" title="Delete" onClick={() => handleDelete(row.id)}>
            <Trash2 size={16} />
          </button>
          <button className="btn border-0 p-2 text-theme-muted hover-scale" title="More">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="py-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Products Catalog</h2>
          <p className="text-theme-muted mb-0">Manage your store's inventory and product details</p>
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
          data={products}
          searchPlaceholder="Search products by name or category..."
          searchableFields={['name', 'categoryName']}
          onAdd={() => { setEditingProduct(null); setIsAddModalOpen(true); }}
          addLabel="Add New Product"
        />
      )}

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setEditingProduct(null); }} 
        editingProduct={editingProduct}
        onProductAdded={(newProd, isEdit) => {
          if (isEdit) {
            setProducts(prev => prev.map(p => p.id === newProd.id ? newProd : p));
          } else {
            setProducts(prev => [newProd, ...prev]);
          }
        }} 
      />
    </div>
  )
}
