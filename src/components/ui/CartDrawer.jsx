import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react'
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
              height: '100dvh', width: '100%', maxWidth: '420px',
              background: 'var(--bb-surface)',
              borderLeft: '1px solid var(--bb-border)',
              zIndex: 19999,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div
              className="d-flex align-items-center justify-content-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--bb-border)', flexShrink: 0 }}
            >
              <div className="d-flex align-items-center gap-2">
                <ShoppingBag size={20} style={{ color: 'var(--bb-accent)' }} />
                <span className="fw-black fs-5 text-theme-title">My Cart</span>
                {count > 0 && (
                  <span
                    className="badge rounded-pill px-2"
                    style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', fontSize: '0.7rem' }}
                  >
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="btn border-0 p-2 rounded-circle"
                style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-muted)' }}
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal > 0 && subtotal < 999 && (
              <div
                className="px-4 py-2 small fw-semibold text-center"
                style={{ background: 'rgba(0,243,255,0.06)', borderBottom: '1px solid var(--bb-border)', color: 'var(--bb-accent)', flexShrink: 0 }}
              >
                Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for <strong>FREE shipping!</strong>
              </div>
            )}
            {subtotal >= 999 && (
              <div
                className="px-4 py-2 small fw-semibold text-center"
                style={{ background: 'rgba(39,255,20,0.07)', borderBottom: '1px solid rgba(39,255,20,0.15)', color: '#39ff14', flexShrink: 0 }}
              >
                🎉 You unlocked <strong>Free Shipping!</strong>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-grow-1 overflow-auto px-4 py-3" style={{ overscrollBehavior: 'contain' }}>
              {items.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center gap-3 py-5">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                    style={{ width: 90, height: 90, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
                  >
                    <Package size={36} style={{ color: 'var(--bb-muted)' }} />
                  </div>
                  <div>
                    <p className="fw-bold text-theme-title mb-1">Your cart is empty</p>
                    <p className="small text-theme-muted">Add some premium gear to get started!</p>
                  </div>
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="btn btn-glow px-4 py-2 fw-bold mt-2"
                    style={{ borderRadius: '10px' }}
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.cartKey}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="d-flex gap-3 p-3 rounded-3"
                        style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
                      >
                        {/* Product image */}
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 72, height: 72, background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
                        >
                          <img
                            src={IMAGE_MAP[item.imageKey]}
                            alt={item.name}
                            style={{ width: 54, height: 54, objectFit: 'contain' }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-grow-1 min-width-0">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <p className="fw-bold text-theme-title mb-0 small" style={{ lineHeight: 1.3 }}>
                              {item.name}
                            </p>
                            <button
                              onClick={() => dispatch(removeFromCart(item.cartKey))}
                              className="btn border-0 p-0 ms-2 flex-shrink-0"
                              style={{ background: 'transparent', color: 'var(--bb-muted)' }}
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {item.selectedColor && (
                            <div className="d-flex align-items-center gap-1 mb-2">
                              <div
                                style={{ width: 10, height: 10, borderRadius: '50%', background: item.selectedColorCode || '#888', border: '1px solid rgba(255,255,255,0.2)' }}
                              />
                              <span className="text-theme-muted" style={{ fontSize: '0.7rem' }}>{item.selectedColor}</span>
                            </div>
                          )}

                          <div className="d-flex align-items-center justify-content-between mt-1">
                            {/* Qty controls */}
                            <div
                              className="d-flex align-items-center gap-1 rounded-2"
                              style={{ border: '1px solid var(--bb-border)', background: 'var(--bb-surface)' }}
                            >
                              <button
                                onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity - 1 }))}
                                className="btn border-0 p-0 d-flex align-items-center justify-content-center"
                                style={{ width: 28, height: 28, background: 'transparent', color: 'var(--bb-muted)' }}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="fw-bold text-theme-title" style={{ minWidth: 20, textAlign: 'center', fontSize: '0.85rem' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity + 1 }))}
                                className="btn border-0 p-0 d-flex align-items-center justify-content-center"
                                style={{ width: 28, height: 28, background: 'transparent', color: 'var(--bb-accent)' }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="fw-black text-theme-title" style={{ fontSize: '0.95rem' }}>
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* BeatBox branding */}
                  <div className="d-flex align-items-center justify-content-center gap-2 py-2">
                    <img src={logo} alt="BeatBox" style={{ width: 14, height: 14 }} />
                    <span className="text-theme-muted" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>BEATBOX OFFICIAL STORE</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div
                style={{ borderTop: '1px solid var(--bb-border)', flexShrink: 0, padding: '16px 24px 24px' }}
              >
                <div className="d-flex flex-column gap-1 mb-3">
                  <div className="d-flex justify-content-between small text-theme-muted">
                    <span>Subtotal ({count} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-theme-muted">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-theme-muted">Shipping</span>
                    <span style={{ color: shipping === 0 ? '#39ff14' : 'var(--bb-muted)' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between fw-black mt-2 pt-2"
                    style={{ borderTop: '1px solid var(--bb-border)' }}
                  >
                    <span className="text-theme-title fs-6">Total</span>
                    <span className="text-theme-title fs-6">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="btn btn-glow w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: '12px' }}
                  >
                    Checkout <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="btn w-100 py-2 fw-semibold small"
                    style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', borderRadius: '10px' }}
                  >
                    View Full Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
