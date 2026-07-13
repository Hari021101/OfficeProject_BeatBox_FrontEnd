import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, AlertCircle, Plus, Trash2, Upload } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'

export default function AddProductModal({ isOpen, onClose, onProductAdded, editingProduct }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const defaultForm = {
    name: '',
    description: '',
    categoryId: '',
    brand: 'BeatBox',
    batteryLife: '',
    connectivity: '',
    isFeatured: false,
    faqs: []
  }
  const [formData, setFormData] = useState(defaultForm)

  const loadCategories = async () => {
    try {
      const data = await productService.fetchCategories()
      setCategories(data || [])
      if (data && data.length > 0) {
        if (!editingProduct && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }))
        } else if (editingProduct && editingProduct.categoryName) {
          const match = data.find(c => c.name.toLowerCase() === editingProduct.categoryName.toLowerCase());
          if (match) setFormData(prev => ({ ...prev, categoryId: match.id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load categories')
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadCategories()
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || '',
          description: editingProduct.description || '',
          categoryId: editingProduct.categoryId || '',
          brand: editingProduct.brand || 'BeatBox',
          batteryLife: editingProduct.batteryLife || '',
          connectivity: editingProduct.connectivity || '',
          isFeatured: editingProduct.isFeatured || false,
          faqs: editingProduct.faqs || []
        })
      } else {
        setFormData(defaultForm)
      }
    }
  }, [isOpen, editingProduct])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: newFaqs }));
  }

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  }

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.categoryId) {
      toast.error('Please fill required fields (Name, Category)')
      return
    }

    try {
      setIsLoading(true)
      
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        brand: formData.brand,
        batteryLife: formData.batteryLife,
        connectivity: formData.connectivity,
        isFeatured: formData.isFeatured,
        faqs: formData.faqs
      }

      let resultProduct;
      if (editingProduct) {
        resultProduct = await productService.updateProduct(editingProduct.id, payload)
        toast.success('Product updated successfully!')
        onProductAdded(resultProduct, true)
      } else {
        resultProduct = await productService.createProduct(payload)
        toast.success('Product created successfully!')
        onProductAdded(resultProduct, false)
        navigate(`/admin/products/${resultProduct.id}/edit`)
      }
      
      onClose()
      setFormData(defaultForm)
      
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="modal-backdrop"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 1050,
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'flex-end',       // sheet from bottom on mobile
          justifyContent: 'center'
        }}
      >
        <style>{`
          @media (min-width: 640px) {
            .product-modal-sheet {
              align-self: center !important;
              border-radius: 16px !important;
              max-width: 820px !important;
              max-height: 90vh !important;
            }
          }
        `}</style>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="product-modal-sheet"
          style={{
            background: 'var(--bb-surface)',
            border: '1px solid var(--bb-border)',
            borderRadius: '20px 20px 0 0',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '95dvh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div className="p-3 p-md-4 border-bottom d-flex justify-content-between align-items-center flex-shrink-0" style={{ borderColor: 'var(--bb-border)' }}>
            {/* Drag indicator on mobile */}
            <div className="d-sm-none position-absolute start-50 top-0 translate-middle-x" style={{ marginTop: '6px', width: '36px', height: '4px', background: 'var(--bb-border)', borderRadius: '4px' }} />
            <h5 className="mb-0 fw-bold text-theme-title d-flex align-items-center gap-2" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)' }}>
              <Upload size={18} className="text-info flex-shrink-0" /> {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h5>
            <button onClick={onClose} className="btn border-0 p-1 text-theme-muted hover-scale flex-shrink-0">
              <X size={22} />
            </button>
          </div>

          <div className="overflow-auto custom-scrollbar flex-grow-1" style={{ padding: 'clamp(12px, 3vw, 24px)' }}>
            <form id="addProductForm" onSubmit={handleSubmit} className="row g-3">
              <div className="col-12 col-md-8">
                <label className="form-label text-theme-muted small fw-bold">Product Name *</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} placeholder="e.g. Rockerz 550" />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label text-theme-muted small fw-bold">Brand</label>
                <input type="text" className="form-control" name="brand" value={formData.brand} onChange={handleChange} style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-theme-muted small fw-bold">Category *</label>
                <select className="form-select" name="categoryId" value={formData.categoryId} onChange={handleChange} required style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }}>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-4">
                <label className="form-label text-theme-muted small fw-bold">Price (₹) *</label>
                <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} required style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-12 col-sm-4">
                <label className="form-label text-theme-muted small fw-bold">Sale Price (₹)</label>
                <input type="number" step="0.01" className="form-control" name="discountPrice" value={formData.discountPrice} onChange={handleChange} style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-12 col-sm-4">
                <label className="form-label text-theme-muted small fw-bold">Initial Stock</label>
                <input type="number" className="form-control" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>

              <div className="col-12 col-sm-4">
                <label className="form-label text-theme-muted small fw-bold">Color</label>
               <select
  className="form-select"
  name="color"
  value={formData.color}
  onChange={handleChange}
>
  <option value="">Select Color</option>
  <option value="Black">Black</option>
  <option value="White">White</option>
  <option value="Blue">Blue</option>
  <option value="Red">Red</option>
  <option value="Green">Green</option>
</select>
              </div>
              <div className="col-12 col-sm-4">
                <label className="form-label text-theme-muted small fw-bold">Battery Life</label>
                <input type="text" className="form-control" name="batteryLife" value={formData.batteryLife} onChange={handleChange} placeholder="e.g. 40 Hours" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-12 col-sm-4">
                <label className="form-label text-theme-muted small fw-bold">Connectivity</label>
                <input type="text" className="form-control" name="connectivity" value={formData.connectivity} onChange={handleChange} placeholder="e.g. Bluetooth v5.3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>

              <div className="col-12">
                <label className="form-label text-theme-muted small fw-bold">Description</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }}></textarea>
              </div>

              {/* FAQs Section */}
              <div className="col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-bold text-theme-title">Product FAQs</h6>
                  <button type="button" onClick={addFaq} className="btn btn-sm btn-glow d-flex align-items-center gap-1">
                    <Plus size={14} /> Add FAQ
                  </button>
                </div>
                {formData.faqs.length === 0 ? (
                  <div className="text-center p-3 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px dashed var(--bb-border)', color: 'var(--bb-muted)' }}>
                    No FAQs added yet.
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
                          <input type="text" className="form-control form-control-sm" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} placeholder="e.g. Is it water resistant?" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
                        </div>
                        <div>
                          <label className="form-label text-theme-muted small fw-bold">Answer</label>
                          <textarea className="form-control form-control-sm" rows="2" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} placeholder="e.g. Yes, it has IPX5 rating." style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-12 mt-4">
                <div className="form-check form-switch d-flex align-items-center gap-2">
                  <input className="form-check-input" type="checkbox" role="switch" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} style={{ width: '40px', height: '20px' }} />
                  <label className="form-check-label text-theme-title fw-bold" htmlFor="isFeatured">Featured Product</label>
                </div>
                <small className="text-theme-muted">Featured products show up on the main home page carousel.</small>
              </div>
            </form>
          </div>

          <div className="flex-shrink-0 d-flex justify-content-end gap-2 p-3 p-md-4"
               style={{ borderTop: '1px solid var(--bb-border)', background: 'var(--bb-surface-2)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
            <button type="button" onClick={onClose} className="btn fw-bold text-theme-muted px-4"
              style={{ background: 'transparent', border: '1px solid var(--bb-border)', borderRadius: '10px', fontSize: '0.875rem' }}>
              Cancel
            </button>
            <button type="submit" form="addProductForm" disabled={isLoading}
              className="btn btn-glow fw-bold px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: '10px', fontSize: '0.875rem' }}>
              {isLoading ? <span className="spinner-border spinner-border-sm" /> : <Save size={16} />}
              {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
