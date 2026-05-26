import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { X, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { removeFromCart, updateQuantity, selectCartItems, selectCartSubtotal, selectCartCount } from '../../redux/cartSlice'
import { IMAGE_MAP } from '../../data/products'
import logo from '../../assets/beatbox_logo.png'

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const count = useSelector(selectCartCount)

  const shipping = subtotal >= 999 ? 0 : 79
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + gst

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 19998,
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            id="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0,
              height: '100dvh', width: '100%', maxWidth: '440px',
              background: 'var(--bb-bg-navy)',
              borderLeft: '1px solid rgba(0,243,255,0.15)',
              zIndex: 19999,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Header */}
            <div
              className="d-flex align-items-center justify-content-between px-4 py-4"
              style={{ background: 'var(--bb-surface)', borderBottom: '1px solid var(--bb-border)', flexShrink: 0 }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, rgba(0,243,255,0.1), rgba(168,32,255,0.1))', border: '1px solid rgba(0,243,255,0.2)' }}>
                  <ShoppingBag size={20} style={{ color: 'var(--bb-accent)' }} />
                </div>
                <div>
                  <span className="fw-black fs-5 text-theme-title d-block" style={{ letterSpacing: '-0.5px' }}>Your Cart</span>
                  <span className="text-theme-muted" style={{ fontSize: '0.8rem' }}>{count} {count === 1 ? 'Item' : 'Items'}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn border-0 p-2 rounded-circle hover-scale text-theme-title"
                style={{ background: 'var(--bb-surface-2)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--bb-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bb-title-color)' }}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal > 0 && subtotal < 999 && (
              <div
                className="px-4 py-3 small fw-semibold text-center position-relative overflow-hidden"
                style={{ background: 'var(--bb-surface)', borderBottom: '1px solid rgba(0,243,255,0.15)', flexShrink: 0 }}
              >
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, rgba(0,243,255,0.05) 0%, transparent 100%)', zIndex: 0 }} />
                <span className="position-relative" style={{ zIndex: 1, color: 'var(--bb-title-color)' }}>
                  Add <strong style={{ color: 'var(--bb-accent)' }}>₹{(999 - subtotal).toLocaleString('en-IN')}</strong> more for FREE shipping!
                </span>
                <div className="rounded-pill overflow-hidden mt-2 mx-auto" style={{ height: 4, width: '80%', background: 'var(--bb-surface-2)' }}>
                  <div 
                    style={{ 
                      width: `${Math.min((subtotal / 999) * 100, 100)}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--bb-primary), var(--bb-accent))',
                      boxShadow: '0 0 10px var(--bb-accent-glow)',
                      transition: 'width 0.6s ease' 
                    }} 
                  />
                </div>
              </div>
            )}
            {subtotal >= 999 && (
              <div
                className="px-4 py-3 small fw-bold text-center"
                style={{ background: 'rgba(39,255,20,0.07)', borderBottom: '1px solid rgba(39,255,20,0.15)', color: '#39ff14', flexShrink: 0 }}
              >
                🎉 You unlocked Free Premium Shipping!
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-grow-1 overflow-auto px-4 py-4" style={{ overscrollBehavior: 'contain' }}>
              {items.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                    style={{ width: 100, height: 100, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}
                  >
                    <Package size={42} style={{ color: 'var(--bb-muted)' }} />
                  </div>
                  <div>
                    <h5 className="fw-black text-theme-title mb-2">Your cart is empty</h5>
                    <p className="text-theme-muted" style={{ fontSize: '0.95rem' }}>Add some premium gear to get started!</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="btn btn-glow px-5 py-3 fw-bold mt-2"
                    style={{ borderRadius: '12px' }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.cartKey}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.2 }}
                        className="d-flex gap-3 p-3 rounded-4 position-relative hover-lift"
                        style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                      >
                        {/* Premium Remove Button */}
                        <button
                          onClick={() => dispatch(removeFromCart(item.cartKey))}
                          className="btn position-absolute border-0 d-flex align-items-center justify-content-center p-0 rounded-circle text-theme-title"
                          style={{ 
                            top: '-8px', 
                            right: '-8px', 
                            width: '24px', 
                            height: '24px', 
                            background: 'var(--bb-surface-2)', 
                            border: '1px solid var(--bb-border)',
                            transition: 'all 0.2s ease',
                            zIndex: 10,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ff4d7d'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#ff4d7d' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bb-surface-2)'; e.currentTarget.style.color = 'var(--bb-title-color)'; e.currentTarget.style.borderColor = 'var(--bb-border)' }}
                          aria-label="Remove item"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>

                        {/* Product image */}
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 position-relative"
                          style={{ width: 80, height: 80, background: 'var(--bb-surface-2)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}
                        >
                          <div className="position-absolute w-100 h-100" style={{ background: item.selectedColorCode || 'var(--bb-accent)', opacity: 0.1, filter: 'blur(10px)' }} />
                          <img
                            src={IMAGE_MAP[item.imageKey]}
                            alt={item.name}
                            className="position-relative z-1"
                            style={{ width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))' }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-grow-1 min-width-0 d-flex flex-column justify-content-center">
                          <p className="fw-black text-theme-title mb-1 text-truncate" style={{ fontSize: '0.95rem' }}>
                            {item.name}
                          </p>

                          {item.selectedColor && (
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <div
                                style={{ width: 8, height: 8, borderRadius: '50%', background: item.selectedColorCode || '#888', border: '1px solid rgba(255,255,255,0.2)' }}
                              />
                              <span className="text-theme-muted fw-medium" style={{ fontSize: '0.75rem' }}>{item.selectedColor}</span>
                            </div>
                          )}

                          <div className="d-flex align-items-end justify-content-between mt-auto">
                            {/* Qty controls */}
                            <div
                              className="d-flex align-items-center rounded-pill overflow-hidden"
                              style={{ border: '1px solid var(--bb-border)', background: 'var(--bb-surface-2)' }}
                            >
                              <button
                                onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.cartKey))}
                                className="btn border-0 px-2 py-1 d-flex align-items-center justify-content-center transition-colors"
                                style={{ background: 'transparent', color: 'var(--bb-title-color)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <Minus size={12} strokeWidth={2.5} />
                              </button>
                              <span className="fw-black text-theme-title" style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity + 1 }))}
                                className="btn border-0 px-2 py-1 d-flex align-items-center justify-content-center transition-colors"
                                style={{ background: 'transparent', color: 'var(--bb-accent)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <Plus size={12} strokeWidth={2.5} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-end">
                              <span className="fw-black text-theme-title d-block" style={{ fontSize: '1.05rem', letterSpacing: '-0.5px' }}>
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* BeatBox branding */}
                  <div className="d-flex align-items-center justify-content-center gap-2 py-3 mt-2">
                    <img src={logo} alt="BeatBox" style={{ width: 14, height: 14 }} />
                    <span className="text-theme-muted fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>BEATBOX OFFICIAL STORE</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div
                className="glass-card"
                style={{ borderTop: '1px solid rgba(0,243,255,0.15)', flexShrink: 0, padding: '24px', background: 'var(--bb-surface)' }}
              >
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex justify-content-between align-items-center small text-theme-muted">
                    <span className="fw-medium">Subtotal</span>
                    <span className="fw-semibold text-theme-title">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small text-theme-muted">
                    <span className="fw-medium">Estimated GST (18%)</span>
                    <span className="fw-semibold text-theme-title">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small">
                    <span className="fw-medium text-theme-muted">Shipping</span>
                    <span className="fw-bold" style={{ color: shipping === 0 ? '#39ff14' : 'var(--bb-title-color)' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center mt-3 pt-3"
                    style={{ borderTop: '2px dashed var(--bb-border)' }}
                  >
                    <span className="text-theme-muted fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Total</span>
                    <span className="text-theme-title fw-black" style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="btn btn-glow w-100 py-3 fw-black d-flex align-items-center justify-content-center gap-2 hover-lift shadow-lg"
                  style={{ borderRadius: '12px', fontSize: '1.05rem', letterSpacing: '0.5px' }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
