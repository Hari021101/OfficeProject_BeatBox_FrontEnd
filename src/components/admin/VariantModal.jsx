import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Save, ArrowLeft, ArrowRight, Star, Trash2 } from 'lucide-react'
import { productService } from '../../services/productService'
import { toast } from 'react-hot-toast'

export default function VariantModal({ isOpen, onClose, productId, variant, onSaved }) {
  const [isLoading, setIsLoading] = useState(false)
  const [color, setColor] = useState('')
  const [colorCode, setColorCode] = useState('#000000')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('0')
  const [capacity, setCapacity] = useState('')
  const [isActive, setIsActive] = useState(true)

  // Combined array of existing and new images
  // For existing: { id: "guid", imageUrl: "url", isPrimary: bool, displayOrder: int }
  // For new: { id: "temp-xxx", file: File, imageUrl: "blob-url", isPrimary: bool, displayOrder: int }
  const [images, setImages] = useState([])
  const [newFiles, setNewFiles] = useState([])

  useEffect(() => {
    if (isOpen) {
      if (variant) {
        setColor(variant.color || '')
        setColorCode(variant.colorCode || '#000000')
        setSku(variant.sku || '')
        setPrice(variant.price || '')
        setDiscountPrice(variant.discountPrice || '')
        setStockQuantity(variant.stockQuantity?.toString() || '0')
        setCapacity(variant.capacity || '')
        setIsActive(variant.isActive !== false) // default to true

        // Map existing variant images
        const existingImages = (variant.images || []).map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder || 0
        })).sort((a, b) => a.displayOrder - b.displayOrder)

        setImages(existingImages)
      } else {
        // Reset to default
        setColor('')
        setColorCode('#000000')
        setSku('')
        setPrice('')
        setDiscountPrice('')
        setStockQuantity('0')
        setCapacity('')
        setIsActive(true)
        setImages([])
      }
      setNewFiles([])
    }
  }, [isOpen, variant])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp']
    const validFiles = []

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB limit.`)
        continue
      }
      const ext = file.name.split('.').pop().toLowerCase()
      if (!allowedExtensions.includes(ext)) {
        toast.error(`File ${file.name} has unsupported format.`)
        continue
      }
      validFiles.push(file)
    }

    if (!validFiles.length) return

    // Create preview items
    const newItems = validFiles.map((file, idx) => {
      const tempId = `temp-${Date.now()}-${idx}`
      const previewUrl = URL.createObjectURL(file)
      return {
        id: tempId,
        file,
        imageUrl: previewUrl,
        isPrimary: images.length === 0 && idx === 0, // primary if list is empty
        displayOrder: images.length + idx + 1
      }
    })

    setImages(prev => [...prev, ...newItems])
    setNewFiles(prev => [...prev, ...validFiles])
  }

  const handleDeleteImage = async (imgId) => {
    if (imgId.startsWith('temp-')) {
      // Just remove local file preview
      setImages(prev => prev.filter(img => img.id !== imgId))
    } else {
      // Call API to delete existing image
      if (window.confirm('Delete this image permanently from database?')) {
        try {
          setIsLoading(true)
          await productService.deleteImage(imgId)
          setImages(prev => prev.filter(img => img.id !== imgId))
          toast.success('Image deleted from database.')
        } catch (error) {
          toast.error('Failed to delete image.')
        } finally {
          setIsLoading(false)
        }
      }
    }
  }

  const handleSetPrimary = async (imgId) => {
    // Optimistically update local state first
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === imgId
    })))

    if (!imgId.startsWith('temp-')) {
      try {
        await productService.setPrimaryImage(imgId)
      } catch (error) {
        toast.error('Failed to set primary image on database.')
      }
    }
  }

  const moveImage = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= images.length) return

    const updated = [...images]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Update display orders
    const final = updated.map((img, idx) => ({
      ...img,
      displayOrder: idx + 1
    }))

    setImages(final)
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!color || !price) {
      toast.error('Please enter Color and Price.')
      return
    }

    try {
      setIsLoading(true)
      const payload = {
        color,
        colorCode,
        sku,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stockQuantity: parseInt(stockQuantity) || 0,
        capacity: capacity || null,
        isActive
      }

      let savedVariant
      if (variant) {
        // Update variant details
        savedVariant = await productService.updateVariant(variant.id, payload)
      } else {
        // Create new variant
        savedVariant = await productService.addVariant(productId, payload)
      }

      const activeVariantId = variant?.id || savedVariant.id

      // 1. Upload new files if any
      const filesToUpload = images.filter(img => img.id.startsWith('temp-')).map(img => img.file)
      if (filesToUpload.length > 0) {
        await productService.uploadVariantImages(activeVariantId, filesToUpload)
      }

      // 2. Update display orders & primary flag for remaining/updated images
      // Fetch latest images lists to handle correct UUID matching
      const freshVariant = await productService.getProductById(productId)
      const freshVariantDetails = freshVariant.variants.find(v => v.id === activeVariantId)
      
      if (freshVariantDetails && freshVariantDetails.images && freshVariantDetails.images.length > 0) {
        // Map local sorting orders back to DB images (matching by matching image names or paths if possible)
        const reorderPayload = []
        let primaryImageId = null

        // Find primary image ID
        const localPrimary = images.find(img => img.isPrimary)
        
        freshVariantDetails.images.forEach((dbImg) => {
          // Find matching local image by matching filename or image URL suffix
          const localMatch = images.find(li => li.imageUrl.endsWith(dbImg.imageUrl.split('/').pop()))
          const displayOrder = localMatch ? localMatch.displayOrder : dbImg.displayOrder

          reorderPayload.push({
            imageId: dbImg.id,
            displayOrder: displayOrder
          })

          if (localMatch?.isPrimary || (localPrimary && dbImg.imageUrl.endsWith(localPrimary.imageUrl.split('/').pop()))) {
            primaryImageId = dbImg.id
          }
        })

        // Reorder call
        if (reorderPayload.length > 0) {
          await productService.reorderImages(reorderPayload)
        }

        // Primary call
        if (primaryImageId) {
          await productService.setPrimaryImage(primaryImageId)
        }
      }

      toast.success('Variant saved successfully!')
      onSaved()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save variant.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060, backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="modal-content overflow-hidden text-theme-title"
          style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', borderRadius: '16px', width: '100%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        >
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--bb-border)' }}>
            <h5 className="mb-0 fw-bold text-theme-title d-flex align-items-center gap-2">
              <Star size={20} className="text-warning" fill="#ffc700" /> {variant ? 'Edit Variant' : 'Add New Variant'}
            </h5>
            <button onClick={onClose} className="btn border-0 p-1 text-theme-muted hover-scale" style={{ background: 'transparent' }}>
              <X size={24} />
            </button>
          </div>

          <div className="p-4 overflow-auto custom-scrollbar" style={{ flex: 1 }}>
            <form id="variantForm" onSubmit={handleSave} className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-theme-muted small fw-bold">Color Name *</label>
                <input type="text" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} required placeholder="e.g. Active Black" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-theme-muted small fw-bold">Color Code (Hex/Picker) *</label>
                <div className="d-flex gap-2 align-items-center">
                  <input type="color" className="form-control form-control-color" value={colorCode} onChange={(e) => setColorCode(e.target.value)} style={{ width: '50px', padding: '0', height: '38px', background: 'transparent', border: 'none' }} />
                  <input type="text" className="form-control" value={colorCode} onChange={(e) => setColorCode(e.target.value)} placeholder="#000000" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-theme-muted small fw-bold">SKU *</label>
                <input type="text" className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} required placeholder="e.g. BTBOX-R550-BLK" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-theme-muted small fw-bold">Capacity (Optional)</label>
                <input type="text" className="form-control" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 128GB, 10000mAh" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>

              <div className="col-md-4">
                <label className="form-label text-theme-muted small fw-bold">Price (₹) *</label>
                <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-md-4">
                <label className="form-label text-theme-muted small fw-bold">Sale Price (₹)</label>
                <input type="number" step="0.01" className="form-control" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="e.g. Lower than price" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>
              <div className="col-md-4">
                <label className="form-label text-theme-muted small fw-bold">Stock Quantity *</label>
                <input type="number" className="form-control" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-title-color)' }} />
              </div>

              <div className="col-12 my-3">
                <div className="form-check form-switch d-flex align-items-center gap-2">
                  <input className="form-check-input" type="checkbox" role="switch" id="vIsActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: '40px', height: '20px' }} />
                  <label className="form-check-label text-theme-title fw-bold" htmlFor="vIsActive">Active status (Visible in store)</label>
                </div>
              </div>

              {/* Variant Images Upload */}
              <div className="col-12 mt-3">
                <label className="form-label text-theme-muted small fw-bold d-block">Variant Images (Multiple Upload)</label>
                <div
                  className="d-flex flex-column align-items-center justify-content-center p-3 rounded-4 mb-3"
                  style={{
                    border: '2px dashed var(--bb-border)',
                    background: 'var(--bb-surface-2)',
                    cursor: 'pointer',
                    minHeight: '120px'
                  }}
                  onClick={() => document.getElementById('variantMediaUpload').click()}
                >
                  <input type="file" id="variantMediaUpload" className="d-none" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} />
                  <Upload size={24} className="mb-1 text-theme-muted" />
                  <p className="fw-bold mb-1 text-theme-title" style={{ fontSize: '0.85rem' }}>Click to Upload Multiple Images</p>
                  <p className="small text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>Supports JPG, PNG, WEBP (Max 5MB per file)</p>
                </div>

                {/* Previews List */}
                {images.length > 0 && (
                  <div className="d-flex flex-column gap-2">
                    <label className="text-theme-muted small fw-bold">Image Gallery & Order</label>
                    <div className="d-flex flex-column gap-2">
                      {images.map((img, index) => (
                        <div key={img.id} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                              <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                              <span className="badge bg-secondary me-2">Order {index + 1}</span>
                              {img.isPrimary && <span className="badge bg-warning text-dark fw-bold"><Star size={10} fill="currentColor" className="me-1" />Primary</span>}
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-1">
                            {/* Reordering Controls */}
                            <button type="button" disabled={index === 0} onClick={() => moveImage(index, -1)} className="btn btn-sm btn-outline-secondary p-1" title="Move Up/Left" style={{ border: 'none', background: 'transparent' }}>
                              <ArrowLeft size={16} />
                            </button>
                            <button type="button" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} className="btn btn-sm btn-outline-secondary p-1" title="Move Down/Right" style={{ border: 'none', background: 'transparent' }}>
                              <ArrowRight size={16} />
                            </button>

                            {/* Set Primary Button */}
                            <button type="button" onClick={() => handleSetPrimary(img.id)} className={`btn btn-sm ${img.isPrimary ? 'btn-warning text-dark' : 'btn-outline-warning'} px-2 py-1 ms-2`} style={{ fontSize: '0.75rem', borderRadius: '6px' }}>
                              Set Primary
                            </button>

                            {/* Delete Image */}
                            <button type="button" onClick={() => handleDeleteImage(img.id)} className="btn btn-sm btn-outline-danger p-1 ms-2" title="Delete Image" style={{ border: 'none', background: 'transparent' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="p-4 border-top d-flex justify-content-end gap-3" style={{ borderColor: 'var(--bb-border)', background: 'var(--bb-surface-2)' }}>
            <button type="button" onClick={onClose} className="btn fw-bold text-theme-muted px-4" style={{ background: 'transparent', border: '1px solid var(--bb-border)' }}>Cancel</button>
            <button type="submit" form="variantForm" disabled={isLoading} className="btn btn-glow fw-bold px-4 d-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
              {isLoading ? <span className="spinner-border spinner-border-sm"></span> : <Save size={18} />}
              {isLoading ? 'Saving...' : 'Save Variant'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
