import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Save, AlertCircle } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'

export default function AddProductModal({ isOpen, onClose, onProductAdded, editingProduct }) {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const defaultForm = {
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
    brand: 'BeatBox',
    batteryLife: '',
    color: '',
    connectivity: '',
    isFeatured: false
  }
  const [formData, setFormData] = useState(defaultForm)

  useEffect(() => {
    if (isOpen) {
      loadCategories()
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || '',
          description: editingProduct.description || '',
          price: editingProduct.oldPrice || editingProduct.price || '',
          discountPrice: editingProduct.discountPrice || '',
          stockQuantity: editingProduct.stockQuantity || '',
          imageUrl: editingProduct.imageUrl || '',
          categoryId: editingProduct.categoryId || '', // Ideally maps to id
          brand: editingProduct.brand || 'BeatBox',
          batteryLife: editingProduct.batteryLife || '',
          color: editingProduct.color || '',
          connectivity: editingProduct.connectivity || '',
          isFeatured: editingProduct.isFeatured || false
        })
      } else {
        setFormData(defaultForm)
      }
    }
  }, [isOpen, editingProduct])

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      toast.error('Invalid file format. Supported formats: JPG, PNG, WEBP.');
      return;
    }

    try {
      setIsLoading(true);
      const loadingToast = toast.loading('Uploading product image...');
      
      const response = await productService.uploadProductImage(file);
      
      toast.dismiss(loadingToast);
      if (response && response.success) {
        setFormData(prev => ({ ...prev, imageUrl: response.data }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(response?.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred during image upload');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.categoryId || !formData.price) {
      toast.error('Please fill required fields (Name, Category, Price)')
      return
    }

    try {
      setIsLoading(true)
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        imageUrl: formData.imageUrl || 'hero_headphones.png',
        categoryId: formData.categoryId,
        brand: formData.brand,
        batteryLife: formData.batteryLife,
        color: formData.color,
        connectivity: formData.connectivity,
        isFeatured: formData.isFeatured
      }

      let resultProduct;
      if (editingProduct) {
        resultProduct = await productService.updateProduct(editingProduct.id, payload)
        toast.success('Product updated successfully!')
      } else {
        resultProduct = await productService.createProduct(payload)
        toast.success('Product created successfully!')
      }
      
      onProductAdded(resultProduct, !!editingProduct)
      onClose()
      
      // Reset form
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
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 mt-3">
                <label className="form-label text-theme-muted small fw-bold">Product Media (Image / Video)</label>
                <div 
                  className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4" 
                  style={{ 
                    border: '2px dashed var(--bb-border)', 
                    background: 'var(--bb-surface-2)', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    minHeight: '180px',
                    overflow: 'hidden'
                  }}
                  onClick={() => document.getElementById('mediaUpload').click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--bb-accent)'; }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--bb-border)'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'var(--bb-border)';
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <input 
                    type="file" 
                    id="mediaUpload" 
                    className="d-none" 
                    accept="image/*,video/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }} 
                  />
                  
                  {formData.imageUrl && formData.imageUrl.startsWith('data:') ? (
                    formData.imageUrl.includes('video') ? (
                      <video src={formData.imageUrl} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                    ) : (
                      <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
                    )
                  ) : formData.imageUrl ? (
                    <div className="text-center">
                       <img src={formData.imageUrl} alt="Static Asset" style={{ height: '120px', objectFit: 'contain', opacity: 0.6 }} onError={(e) => e.target.style.display='none'} />
                       <p className="mt-2 mb-0 fw-bold" style={{ color: 'var(--bb-accent)' }}>Using asset: {formData.imageUrl}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="mb-2 text-theme-muted" />
                      <p className="fw-bold mb-1 text-theme-title">Click or Drag to Upload Media</p>
                      <p className="small text-theme-muted mb-0">Supports JPG, PNG, WEBP, MP4 (Max 15MB)</p>
                    </div>
                  )}
                </div>
                {formData.imageUrl && (
                  <div className="text-end mt-2">
                    <button type="button" onClick={() => setFormData(p => ({ ...p, imageUrl: '' }))} className="btn btn-sm btn-outline-danger" style={{ fontSize: '0.75rem', borderRadius: '8px' }}>Remove Media</button>
                  </div>
                )}
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
