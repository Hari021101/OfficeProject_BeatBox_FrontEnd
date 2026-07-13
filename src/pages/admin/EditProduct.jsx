import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Edit2, Trash2, HelpCircle, LayoutGrid, Check, X, Star } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'
import VariantModal from '../../components/admin/VariantModal'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState(null)

  // Product info form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    brand: 'BeatBox',
    batteryLife: '',
    connectivity: '',
    isFeatured: false,
    faqs: []
  })

  // Variant modal state
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)

  const loadCategories = async () => {
    try {
      const data = await productService.fetchCategories()
      setCategories(data || [])
    } catch (err) {
      toast.error('Failed to load categories')
    }
  }

  const loadProduct = async () => {
    try {
      setIsLoading(true)
      const data = await productService.getProductById(id)
      if (data) {
        setProduct(data)
        setFormData({
          name: data.name || '',
          description: data.description || '',
          categoryId: data.categoryId || '',
          brand: data.brand || 'BeatBox',
          batteryLife: data.batteryLife || '',
          connectivity: data.connectivity || '',
          isFeatured: data.isFeatured || false,
          faqs: data.faqs || []
        })
      } else {
        toast.error('Product not found')
        navigate('/admin/products')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load product details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
    loadProduct()
  }, [id])

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...formData.faqs]
    newFaqs[index][field] = value
    setFormData(prev => ({ ...prev, faqs: newFaqs }))
  }

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }))
  }

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }))
  }

  const handleSaveProductInfo = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.categoryId) {
      toast.error('Please fill in Product Name and Category.')
      return
    }

    try {
      setIsLoading(true)
      await productService.updateProduct(id, formData)
      toast.success('Product information updated successfully!')
      loadProduct()
    } catch (err) {
      toast.error('Failed to update product details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVariant = () => {
    setSelectedVariant(null)
    setIsVariantModalOpen(true)
  }

  const handleEditVariant = (variant) => {
    setSelectedVariant(variant)
    setIsVariantModalOpen(true)
  }

  const handleDeleteVariant = async (variantId) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        setIsLoading(true)
        await productService.deleteVariant(variantId)
        toast.success('Variant deleted successfully!')
        loadProduct()
      } catch (err) {
        toast.error('Failed to delete variant.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading && !product) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="py-2 text-theme-title">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Link to="/admin/products" className="btn border-0 p-1 text-theme-muted hover-scale" style={{ background: 'transparent' }}>
              <ArrowLeft size={20} />
            </Link>
            <h2 className="fw-black text-theme-title mb-0">Edit Product</h2>
          </div>
          <p className="text-theme-muted mb-0">Consolidate specifications and manage product variants</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: Product Info Editor */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px', border: '1px solid var(--bb-border)' }}>
            <h4 className="fw-bold mb-4 text-theme-title d-flex align-items-center gap-2">
              <LayoutGrid size={20} className="text-info" /> Product Information
            </h4>

            <form onSubmit={handleSaveProductInfo} className="row g-3">
              <div className="col-md-8">
                <label className="form-label text-theme-muted small fw-bold">Product Name *</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleProductChange} required style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-md-4">
                <label className="form-label text-theme-muted small fw-bold">Brand</label>
                <input type="text" className="form-control" name="brand" value={formData.brand} onChange={handleProductChange} style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>

              <div className="col-md-12">
                <label className="form-label text-theme-muted small fw-bold">Category *</label>
                <select className="form-select" name="categoryId" value={formData.categoryId} onChange={handleProductChange} required style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }}>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-theme-muted small fw-bold">Battery Life (Specification)</label>
                <input type="text" className="form-control" name="batteryLife" value={formData.batteryLife} onChange={handleProductChange} placeholder="e.g. 40 Hours" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-theme-muted small fw-bold">Connectivity (Specification)</label>
                <input type="text" className="form-control" name="connectivity" value={formData.connectivity} onChange={handleProductChange} placeholder="e.g. Bluetooth v5.3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>

              <div className="col-12">
                <label className="form-label text-theme-muted small fw-bold">Description</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleProductChange} rows="4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }}></textarea>
              </div>

              {/* FAQs Section */}
              <div className="col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold text-theme-title d-flex align-items-center gap-2">
                    <HelpCircle size={18} className="text-warning" /> FAQs
                  </h5>
                  <button type="button" onClick={addFaq} className="btn btn-sm btn-glow d-flex align-items-center gap-1">
                    <Plus size={14} /> Add FAQ
                  </button>
                </div>

                {formData.faqs.length === 0 ? (
                  <div className="text-center p-3 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px dashed var(--bb-border)', color: 'var(--bb-muted)', fontSize: '0.9rem' }}>
                    No FAQs added for this product.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {formData.faqs.map((faq, index) => (
                      <div key={index} className="p-3 rounded-3 position-relative" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                        <button type="button" onClick={() => removeFaq(index)} className="btn btn-link text-danger position-absolute top-0 end-0 m-2 p-1" title="Remove FAQ" style={{ border: 'none', background: 'transparent' }}>
                          <Trash2 size={16} />
                        </button>
                        <div className="mb-2 pe-4">
                          <label className="form-label text-theme-muted small fw-bold">Question</label>
                          <input type="text" className="form-control form-control-sm" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
                        </div>
                        <div>
                          <label className="form-label text-theme-muted small fw-bold">Answer</label>
                          <textarea className="form-control form-control-sm" rows="2" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-12 mt-4">
                <div className="form-check form-switch d-flex align-items-center gap-2">
                  <input className="form-check-input" type="checkbox" role="switch" id="isFeaturedEdit" name="isFeatured" checked={formData.isFeatured} onChange={handleProductChange} style={{ width: '40px', height: '20px' }} />
                  <label className="form-check-label text-theme-title fw-bold" htmlFor="isFeaturedEdit">Featured Product</label>
                </div>
              </div>

              <div className="col-12 text-end mt-4">
                <button type="submit" className="btn btn-glow fw-bold px-4 py-2 d-flex align-items-center gap-2 ms-auto" style={{ borderRadius: '8px' }}>
                  <Save size={18} /> Save Product Details
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Variants List */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 p-4 h-100" style={{ background: 'var(--bb-surface)', borderRadius: '16px', border: '1px solid var(--bb-border)', minHeight: '400px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0 text-theme-title">Variants</h4>
              <button type="button" onClick={handleAddVariant} className="btn btn-glow d-flex align-items-center gap-1">
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {(!product?.variants || product.variants.length === 0) ? (
              <div className="text-center py-5 my-auto d-flex flex-column align-items-center justify-content-center" style={{ color: 'var(--bb-muted)' }}>
                <span style={{ fontSize: '3rem' }} className="mb-2">🎨</span>
                <h5 className="fw-bold text-theme-title">No Variants Found</h5>
                <p className="small mb-3">Add variants for colors, SKU, price, stock, and images.</p>
                <button type="button" onClick={handleAddVariant} className="btn btn-sm btn-glow px-4">Add Your First Variant</button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {product.variants.map((v) => (
                  <div key={v.id} className="p-3 rounded-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', transition: 'all 0.2s' }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: v.colorCode, border: '1px solid var(--bb-border)' }} />
                        <span className="fw-black text-theme-title">{v.color}</span>
                        {v.capacity && <span className="badge bg-secondary" style={{ fontSize: '0.75rem' }}>{v.capacity}</span>}
                      </div>

                      <div className="d-flex align-items-center gap-1">
                        <span className={`badge px-2 py-1 small fw-bold me-2`} style={{
                          background: v.isActive !== false ? 'var(--bb-success-bg)' : 'rgba(220,53,69,0.08)',
                          color: v.isActive !== false ? 'var(--bb-success-text)' : '#ef4444',
                          border: `1px solid ${v.isActive !== false ? 'var(--bb-success-border)' : 'rgba(220,53,69,0.2)'}`,
                          fontSize: '0.7rem'
                        }}>
                          {v.isActive !== false ? 'Active' : 'Inactive'}
                        </span>

                        <button type="button" onClick={() => handleEditVariant(v)} className="btn btn-sm btn-outline-secondary p-1" title="Edit Variant" style={{ border: 'none', background: 'transparent' }}>
                          <Edit2 size={15} />
                        </button>
                        <button type="button" onClick={() => handleDeleteVariant(v.id)} className="btn btn-sm btn-outline-danger p-1" title="Delete Variant" style={{ border: 'none', background: 'transparent' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="row g-2 mb-3 text-theme-muted" style={{ fontSize: '0.85rem' }}>
                      <div className="col-6">
                        <span className="small">SKU:</span> <span className="fw-bold text-theme-title">{v.sku}</span>
                      </div>
                      <div className="col-6">
                        <span className="small">Stock:</span> <span className="fw-bold text-theme-title">{v.stockQuantity}</span>
                      </div>
                      <div className="col-6">
                        <span className="small">Price:</span> <span className="fw-black text-theme-title">₹{v.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="col-6">
                        <span className="small">Sale Price:</span> <span className="fw-black text-theme-title">{v.discountPrice ? `₹${v.discountPrice.toLocaleString('en-IN')}` : 'N/A'}</span>
                      </div>
                    </div>

                    {/* Image thumbnails for this variant */}
                    {v.images && v.images.length > 0 ? (
                      <div className="d-flex gap-2 flex-wrap mt-2">
                        {v.images.map((img) => (
                          <div key={img.id} className="position-relative rounded-2 overflow-hidden" style={{ width: '45px', height: '45px', background: 'var(--bb-surface)', border: img.isPrimary ? '2px solid #ffc700' : '1px solid var(--bb-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={img.isPrimary ? 'Primary Image' : 'Gallery Image'}>
                            <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} />
                            {img.isPrimary && (
                              <div className="position-absolute top-0 end-0 bg-warning p-0.5 rounded-bottom-start" style={{ padding: '1px' }}>
                                <Star size={8} fill="#000" stroke="#000" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="small text-theme-muted mb-0 mt-2">No images uploaded for this variant.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant Modal */}
      <VariantModal isOpen={isVariantModalOpen} onClose={() => setIsVariantModalOpen(false)} productId={id} variant={selectedVariant} onSaved={loadProduct} />
    </div>
  )
}
