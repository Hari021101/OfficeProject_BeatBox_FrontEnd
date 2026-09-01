import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Edit2, Trash2, MoreVertical, Star } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'
import { IMAGE_MAP } from '../../data/products'
import DataTable from '../../components/admin/DataTable'
import StockBadge from '../../components/admin/StockBadge'
import AddProductModal from '../../components/admin/AddProductModal'
import Select from '../../components/ui/Select'

function ActionDropdownMenu({ row, handleDelete }) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  const updatePosition = () => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuWidth = 160
    const menuHeight = 150

    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    const isUpward = spaceBelow < menuHeight + 20 && spaceAbove > spaceBelow

    const left = Math.max(10, rect.right - menuWidth)
    const top = isUpward
      ? Math.max(10, rect.top - menuHeight - 6)
      : rect.bottom + 6

    setCoords({ top, left })
  }

  const toggleDropdown = (e) => {
    e.stopPropagation()
    if (!isOpen) {
      updatePosition()
    }
    setIsOpen(prev => !prev)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleScrollOrResize = () => {
      updatePosition()
    }

    const handleClickOutside = (event) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="d-inline-block">
      <button
        ref={buttonRef}
        className="btn border-0 p-2 text-theme-muted hover-scale"
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        title="More Options"
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && createPortal(
        <ul
          ref={menuRef}
          className="dropdown-menu show shadow-sm"
          style={{
            display: 'block',
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            background: 'var(--bb-surface)',
            border: '1px solid var(--bb-border)',
            zIndex: 99999,
            minWidth: '160px',
            margin: 0
          }}
        >
          <li>
            <a
              className="dropdown-item text-theme-title d-flex align-items-center gap-2"
              href={`/#/products/${row.id}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
            >
              View in Store
            </a>
          </li>
          <li>
            <button
              className="dropdown-item text-theme-title d-flex align-items-center gap-2"
              onClick={() => {
                toast.success('Duplicate feature coming soon!')
                setIsOpen(false)
              }}
            >
              Duplicate Product
            </button>
          </li>
          <li><hr className="dropdown-divider" style={{ borderColor: 'var(--bb-border)' }} /></li>
          <li>
            <button
              className="dropdown-item text-danger d-flex align-items-center gap-2"
              onClick={() => {
                handleDelete(row.id)
                setIsOpen(false)
              }}
            >
              Delete
            </button>
          </li>
        </ul>,
        document.body
      )}
    </div>
  )
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

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

  useEffect(() => {
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
    navigate(`/admin/products/${id}/edit`)
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
      key: 'brand', 
      label: 'Brand', 
      sortable: true,
      render: (row) => <span className="text-theme-muted fw-medium" style={{ fontSize: '0.9rem' }}>{row.brand || 'BeatBox'}</span>
    },
    { 
      key: 'variantsCount', 
      label: 'Variants', 
      sortable: false,
      render: (row) => {
        const variantList = row.variants?.map(v => v.color).filter(Boolean) || [];
        const count = variantList.length;
        return (
          <div>
            <span className="bb-badge-info" style={{ fontSize: '0.7rem' }}>{count} {count === 1 ? 'Variant' : 'Variants'}</span>
            {count > 0 && (
              <p className="mb-0 text-theme-muted mt-1" style={{ fontSize: '0.7rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={variantList.join(', ')}>
                {variantList.join(', ')}
              </p>
            )}
          </div>
        );
      }
    },
    { 
      key: 'totalStock', 
      label: 'Total Stock', 
      sortable: true,
      render: (row) => {
        const totalStock = row.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) ?? 0;
        return <span className="fw-bold text-theme-title">{totalStock}</span>;
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: false,
      render: (row) => {
        const totalStock = row.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) ?? 0;
        return <StockBadge stock={totalStock} />;
      }
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
          <ActionDropdownMenu row={row} handleDelete={handleDelete} />
        </div>
      )
    }
  ]

  const categories = ['All', ...new Set(products.map(p => p.categoryName || 'Uncategorized').filter(Boolean))].sort()

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.categoryName || 'Uncategorized') === selectedCategory)

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
          data={filteredProducts} 
          searchPlaceholder="Search products by name or category..."
          searchableFields={['name', 'categoryName', 'brand']}
          onAdd={() => { setEditingProduct(null); setIsAddModalOpen(true); }}
          addLabel="Add New Product"
          selectable={true}
          onSelectionChange={(selectedIds) => {
            console.log("Selected Product IDs:", selectedIds);
          }}
          bulkActions={[
            {
              label: 'Delete Selected',
              icon: Trash2,
              danger: true,
              onClick: async (selectedIds) => {
                if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
                  try {
                    await productService.bulkDeleteProducts(selectedIds);
                    toast.success(`Deleted ${selectedIds.length} products!`);
                    fetchProducts();
                  } catch (err) {
                    toast.error('Failed to delete products.');
                  }
                }
              }
            },
            {
              label: 'Mark as Featured',
              icon: Star,
              danger: false,
              onClick: async (selectedIds) => {
                try {
                  await productService.bulkUpdateFeatured(selectedIds, true);
                  toast.success(`Marked ${selectedIds.length} products as Featured!`);
                  fetchProducts();
                } catch (err) {
                  toast.error('Failed to update products.');
                }
              }
            }
          ]}
          filterSlot={
            <div className="d-flex align-items-center gap-2" style={{ minWidth: 160 }}>
              <span className="text-theme-muted fw-bold d-none d-sm-inline" style={{ fontSize: '0.85rem' }}>Category:</span>
              <Select
                size="sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories.map(cat => ({ value: cat, label: cat }))}
                aria-label="Filter by category"
              />
            </div>
          }
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
