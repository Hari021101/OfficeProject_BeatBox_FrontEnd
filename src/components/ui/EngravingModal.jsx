import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ShoppingCart } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/cartSlice'
import { toast } from 'react-hot-toast'
import engravingBanner from '../../assets/banner/Encraving_banner.png'

export default function EngravingModal({ isOpen, onClose, product, selectedVariant, selectedColor, selectedCapacity, quantity }) {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const engravingPrice = product.engravingPrice || 99
  const basePrice = selectedVariant?.discountPrice || selectedVariant?.price || 0
  const totalPrice = (basePrice + engravingPrice) * quantity

  const handleNameChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 12)
    setName(val)
  }

  const handleMessageChange = (e) => {
    const val = e.target.value.slice(0, 40)
    setMessage(val)
  }

  const handleAddPersonalised = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for the engraving.')
      return
    }

    try {
      setIsSubmitting(true)
      
      const payload = {
        id: product.id,
        name: product.name,
        price: basePrice,
        variantId: selectedVariant?.id,
        imageKey: product.imageKey,
        quantity: quantity,
        selectedColor: selectedColor?.name,
        selectedColorCode: selectedColor?.code,
        selectedCapacity: selectedCapacity,
        category: product.category,
        imageUrl: selectedVariant?.images?.find(x => x.isPrimary)?.imageUrl || selectedVariant?.images?.[0]?.imageUrl,
        isPersonalised: true,
        engravingName: name.toUpperCase(),
        engravingDate: date,
        engravingMessage: message.toUpperCase(),
        engravingPrice: engravingPrice
      }

      await dispatch(addToCart(payload)).unwrap()
      
      toast.success(`🎸 Personalised ${product.name} added to cart!`, {
        style: { background: '#060b19', color: '#fff', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '10px' }
      })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to add to cart')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div
        className="modal-backdrop"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(3, 5, 12, 0.85)',
          zIndex: 1050,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="container-fluid p-0"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.95), rgba(5, 7, 15, 0.98))',
            border: '1px solid rgba(0, 243, 255, 0.18)',
            borderRadius: '24px',
            maxWidth: '1050px',
            maxHeight: '92vh',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 243, 255, 0.12), 0 0 2px rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-3 px-md-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h5 className="mb-0 fw-black text-white d-flex align-items-center gap-2" style={{ letterSpacing: '0.5px' }}>
              <Sparkles className="text-info animate-pulse" size={20} /> Personalise Your Product
            </h5>
            <button onClick={onClose} className="btn border-0 p-1 text-secondary hover-scale" style={{ background: 'transparent' }}>
              <X size={22} className="text-muted hover:text-white" />
            </button>
          </div>

          <div className="row g-0 overflow-auto" style={{ maxHeight: 'calc(92vh - 70px)' }}>
            {/* Left: Input Panel */}
            <div className="col-12 col-md-6 p-3 p-md-4 d-flex flex-column justify-content-between" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="text-secondary small mb-4">Make it uniquely yours. Enter your name, date, or a custom message to be custom laser engraved.</p>

                {/* Form Fields */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div>
                    <label className="form-label text-white small fw-bold d-flex justify-content-between">
                      <span>Name (Required) *</span>
                      <span className="text-secondary small">{name.length}/12</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="e.g. VIKRAM"
                      className="form-control premium-search-input py-2"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderRadius: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="form-label text-white small fw-bold">Date (Optional)</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value.slice(0, 12))}
                      placeholder="e.g. 14.07.2026"
                      className="form-control premium-search-input py-2"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderRadius: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="form-label text-white small fw-bold d-flex justify-content-between">
                      <span>Short Message (Optional)</span>
                      <span className="text-secondary small">{message.length}/40</span>
                    </label>
                    <input
                      type="text"
                      value={message}
                      onChange={handleMessageChange}
                      placeholder="e.g. NEVER GIVE UP"
                      className="form-control premium-search-input py-2"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Base Price ({quantity}x)</span>
                    <span>₹{(basePrice * quantity).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Laser Engraving Fee</span>
                    <span className="text-info fw-bold">+ ₹{engravingPrice}</span>
                  </div>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <div className="d-flex justify-content-between fw-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-accent">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAddPersonalised}
                disabled={isSubmitting || !name.trim()}
                className="btn btn-glow w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: '12px', height: '54px' }}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add Personalised Product
                  </>
                )}
              </button>
            </div>

            {/* Right: Immersive Live Preview */}
            <div className="col-12 col-md-6 p-3 p-md-4 d-flex align-items-center justify-content-center bg-black position-relative" style={{ minHeight: '340px' }}>
              <div
                className="position-relative w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden"
                style={{
                  containerType: 'inline-size',
                  borderRadius: '18px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
                }}
              >
                <img
                  src={engravingBanner}
                  alt="Custom Engraved Product Live Preview"
                  className="img-fluid w-100 h-auto d-block"
                  style={{
                    borderRadius: '18px',
                    objectFit: 'cover'
                  }}
                />

                {/* Live Custom Engraving Overlays */}
                {/* 1. Name overlay (centered on metallic strip) */}
                {name && (
                  <motion.div
                    key={`modal-name-${name}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="position-absolute d-flex align-items-center justify-content-center text-center pointer-events-none"
                    style={{
                      left: '59.3%',
                      top: '53.3%',
                      width: '23%',
                      height: '4.5%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <span
                      style={{
                        fontSize: name.length > 8 ? '2.0cqw' : '2.4cqw',
                        fontWeight: 900,
                        letterSpacing: '1.5px',
                        color: '#d4d8db',
                        textShadow: '0 0 10px rgba(0, 243, 255, 0.45), 0 0 2px rgba(255,255,255,0.7)',
                        opacity: 0.9,
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        lineHeight: 1
                      }}
                    >
                      {name}
                    </span>
                  </motion.div>
                )}

                {/* 2. Date overlay (centered below metallic strip) */}
                {date && (
                  <motion.div
                    key={`modal-date-${date}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="position-absolute d-flex align-items-center justify-content-center text-center pointer-events-none"
                    style={{
                      left: '59.3%',
                      top: '56.5%',
                      width: '23%',
                      height: '3.5%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.7cqw',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: '#b0b5b9',
                        textShadow: '0 0 5px rgba(0, 243, 255, 0.3)',
                        opacity: 0.8,
                        whiteSpace: 'nowrap',
                        lineHeight: 1
                      }}
                    >
                      {date}
                    </span>
                  </motion.div>
                )}

                {/* 3. Message overlay (centered lower) */}
                {message && (
                  <motion.div
                    key={`modal-msg-${message}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="position-absolute d-flex align-items-center justify-content-center text-center pointer-events-none"
                    style={{
                      left: '59.3%',
                      top: '59.5%',
                      width: '23%',
                      height: '6.5%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <span
                      style={{
                        fontSize: message.length > 20 ? '1.3cqw' : '1.5cqw',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        color: '#a0a5a9',
                        textShadow: '0 0 5px rgba(0, 243, 255, 0.25)',
                        opacity: 0.75,
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.2'
                      }}
                    >
                      {message}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
