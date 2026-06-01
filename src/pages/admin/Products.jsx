import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, MoreVertical, Image as ImageIcon } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'
import { IMAGE_MAP } from '../../data/products'

export default function Products() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  return (
    <div className="py-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Products Catalog</h2>
          <p className="text-theme-muted mb-0">Manage your store's inventory and product details</p>
        </div>
        <button 
          className="btn btn-glow d-flex align-items-center gap-2 px-4 py-2 fw-bold" 
          style={{ borderRadius: '10px' }}
          onClick={() => toast("Add Product modal would open here!")}
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="card border-0 mb-4 p-3" style={{ background: 'var(--bb-surface)', borderRadius: '12px' }}>
        <div className="d-flex flex-column flex-md-row gap-3">
          <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
            <Search size={18} className="position-absolute top-50 translate-middle-y ms-3 text-theme-muted" />
            <input 
              type="text" 
              className="form-control premium-search-input ps-5"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select className="form-select premium-search-input" style={{ width: 'auto', minWidth: '150px' }}>
            <option value="all">All Categories</option>
            <option value="earbuds">Wireless Earbuds</option>
            <option value="headphones">Headphones</option>
            <option value="speakers">Speakers</option>
          </select>
          
          <select className="form-select premium-search-input" style={{ width: 'auto', minWidth: '150px' }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 p-0 overflow-hidden" style={{ background: 'var(--bb-surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0 text-theme-text">
            <thead style={{ borderBottom: '1px solid var(--bb-border)', background: 'rgba(0,0,0,0.2)' }}>
              <tr>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Product</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Category</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Price</th>
                <th className="py-3 px-4 text-theme-muted fw-bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Stock</th>
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
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-theme-muted">No products found matching your search.</td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden" 
                          style={{ width: '48px', height: '48px', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
                        >
                          <img src={getProductImage(product)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <p className="mb-0 fw-bold text-theme-title">{product.name}</p>
                          <p className="mb-0 text-theme-muted" style={{ fontSize: '0.75rem' }}>ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-theme-muted fw-medium" style={{ fontSize: '0.9rem' }}>{product.categoryName || 'Uncategorized'}</span>
                    </td>
                    <td className="py-3 px-4 fw-black text-theme-title">
                      ₹{Number(product.discountPrice || product.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="fw-bold" style={{ color: (product.stockQuantity || 0) < 10 ? '#ef4444' : 'var(--bb-text)', fontSize: '0.9rem' }}>
                        {product.stockQuantity || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className="badge rounded-pill px-3 py-1"
                        style={{ 
                          background: (product.stockQuantity || 0) > 0 ? 'rgba(57,255,20,0.1)' : 'rgba(239,68,68,0.1)',
                          color: (product.stockQuantity || 0) > 0 ? '#39ff14' : '#ef4444',
                          border: `1px solid currentColor`,
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}
                      >
                        {(product.stockQuantity || 0) > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <button className="btn border-0 p-2 text-theme-muted hover-scale me-1" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn border-0 p-2 text-danger hover-scale me-1" title="Delete">
                        <Trash2 size={16} />
                      </button>
                      <button className="btn border-0 p-2 text-theme-muted hover-scale" title="More">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="d-flex align-items-center justify-content-between p-3" style={{ borderTop: '1px solid var(--bb-border)' }}>
          <span className="text-theme-muted small">Showing {filteredProducts.length} entries</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm text-theme-muted border-secondary border-opacity-25" disabled>Previous</button>
            <button className="btn btn-sm btn-glow">1</button>
            <button className="btn btn-sm text-theme-muted border-secondary border-opacity-25">2</button>
            <button className="btn btn-sm text-theme-muted border-secondary border-opacity-25">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
