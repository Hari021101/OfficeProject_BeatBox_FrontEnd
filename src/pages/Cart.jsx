import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Package, ChevronRight, Shield, Truck } from 'lucide-react'
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartSubtotal, selectCartCount } from '../redux/cartSlice'
import { IMAGE_MAP } from '../data/products'
import { toast } from 'react-hot-toast'
import logo from '../assets/beatbox_logo.png'

const COUPONS = {
  'BASS20': { discount: 0.20, label: '20% off your order' },
  'BEATBOX10': { discount: 0.10, label: '10% off your order' },
  'NEWBASS': { discount: 0.15, label: '15% off for new customers' },
}

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const count = useSelector(selectCartCount)

  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  const shipping = subtotal >= 999 ? 0 : 79
  const gst = Math.round(subtotal * 0.18)
  const couponDiscount = appliedCoupon ? Math.round(subtotal * COUPONS[appliedCoupon].discount) : 0
  const total = subtotal + shipping + gst - couponDiscount

  const handleApplyCoupon = () => {
    const code = couponInput.toUpperCase().trim()
    if (COUPONS[code]) {
      setAppliedCoupon(code)
      setCouponError('')
      setCouponInput('')
      toast.success(`🎉 Coupon "${code}" applied! ${COUPONS[code].label}`, {
        style: { background: '#060b19', color: '#39ff14', border: '1px solid rgba(39,255,20,0.3)', borderRadius: '10px' }
      })
    } else {
      setCouponError('Invalid coupon code. Try BASS20, BEATBOX10, or NEWBASS.')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    toast('Coupon removed.', { style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '10px' } })
  }

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {/* Ambient glows */}
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-primary-glow)', top: '5%', left: '-5%', filter: 'blur(130px)' }} />
      <div className="bg-glow-orb" style={{ width: 350, height: 350, background: 'var(--bb-accent-glow)', bottom: '10%', right: '-5%', filter: 'blur(130px)', animationDelay: '2s' }} />

      <div className="container-fluid px-3 px-lg-5 py-4">
        {/* Page header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-3 mb-1">
            <ShoppingBag size={28} style={{ color: 'var(--bb-accent)' }} />
            <h1 className="fw-black text-theme-title mb-0" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', letterSpacing: '-1.5px' }}>
              Shopping <span className="gradient-text">Cart</span>
            </h1>
            {count > 0 && (
              <span className="badge rounded-pill px-3" style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', fontSize: '0.85rem' }}>
                {count} item{count !== 1 && 's'}
              </span>
            )}
          </div>
          <p className="text-theme-muted small mb-0">
            <Link to="/" className="text-theme-muted text-decoration-none">Home</Link>
            <ChevronRight size={12} className="mx-1" />
            <Link to="/products" className="text-theme-muted text-decoration-none">Products</Link>
            <ChevronRight size={12} className="mx-1" />
            <span className="text-theme-title">Cart</span>
          </p>
        </div>

        {/* Free shipping banner */}
        {subtotal > 0 && subtotal < 999 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4"
            style={{ background: 'rgba(0,243,255,0.06)', border: '1px solid rgba(0,243,255,0.2)' }}
          >
            <Truck size={18} style={{ color: 'var(--bb-accent)', flexShrink: 0 }} />
            <div className="flex-grow-1">
              <span className="text-theme-title fw-semibold small">Add </span>
              <span className="fw-black" style={{ color: 'var(--bb-accent)' }}>₹{(999 - subtotal).toLocaleString('en-IN')}</span>
              <span className="text-theme-title fw-semibold small"> more for FREE shipping!</span>
            </div>
            <div className="rounded-pill overflow-hidden" style={{ width: 120, height: 6, background: 'var(--bb-surface-2)' }}>
              <div style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%`, height: '100%', background: 'var(--bb-accent)', transition: 'width 0.5s ease' }} />
            </div>
          </motion.div>
        )}
        {subtotal >= 999 && (
          <div className="d-flex align-items-center gap-2 p-3 rounded-3 mb-4" style={{ background: 'rgba(39,255,20,0.07)', border: '1px solid rgba(39,255,20,0.2)' }}>
            <Truck size={18} style={{ color: '#39ff14' }} />
            <span className="fw-bold" style={{ color: '#39ff14', fontSize: '0.9rem' }}>🎉 You've unlocked FREE shipping!</span>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="d-flex flex-column align-items-center justify-content-center text-center py-5 gap-4"
            style={{ minHeight: '50vh' }}
          >
            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 120, height: 120, background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <Package size={48} style={{ color: 'var(--bb-muted)' }} />
            </div>
            <div>
              <h3 className="fw-black text-theme-title mb-2">Your cart is empty</h3>
              <p className="text-theme-muted">Looks like you haven't added any awesome gear yet.</p>
            </div>
            <Link to="/products" className="btn btn-glow px-5 py-3 fw-bold d-flex align-items-center gap-2" style={{ borderRadius: 12 }}>
              Start Shopping <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="row g-4 align-items-start">
            {/* ── CART ITEMS ─────────────────────────────── */}
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-column gap-3">
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.cartKey}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="p-4 rounded-4"
                      style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
                    >
                      <div className="row g-3 align-items-center">
                        {/* Product image */}
                        <div className="col-3 col-sm-2">
                          <Link to={`/products/${item.id}`}>
                            <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', height: 80, overflow: 'hidden' }}>
                              <img src={IMAGE_MAP[item.imageKey]} alt={item.name} style={{ width: 60, height: 60, objectFit: 'contain' }} />
                            </div>
                          </Link>
                        </div>

                        {/* Info */}
                        <div className="col-9 col-sm-10">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <Link to={`/products/${item.id}`} className="text-decoration-none">
                                <h6 className="fw-bold text-theme-title mb-1" style={{ lineHeight: 1.3, fontSize: '0.95rem' }}>{item.name}</h6>
                              </Link>
                              {item.selectedColor && (
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.selectedColorCode || '#888', border: '1px solid rgba(255,255,255,0.2)' }} />
                                  <span className="text-theme-muted" style={{ fontSize: '0.75rem' }}>{item.selectedColor}</span>
                                </div>
                              )}
                              <span className="badge px-2 py-1" style={{ background: 'rgba(39,255,20,0.08)', color: '#39ff14', fontSize: '0.65rem', border: '1px solid rgba(39,255,20,0.15)' }}>In Stock</span>
                            </div>
                            <button
                              onClick={() => {
                                dispatch(removeFromCart(item.cartKey))
                                toast('Item removed from cart', { style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '10px' } })
                              }}
                              className="btn border-0 p-2 rounded-circle"
                              style={{ background: 'rgba(255,0,0,0.08)', color: '#ff4d7d', transition: 'all 0.2s' }}
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            {/* Qty controls */}
                            <div className="d-flex align-items-center rounded-3" style={{ border: '1px solid var(--bb-border)', background: 'var(--bb-surface-2)' }}>
                              <button
                                onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity - 1 }))}
                                className="btn border-0 px-3 py-2"
                                style={{ color: 'var(--bb-muted)', background: 'transparent' }}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="fw-black text-theme-title px-3" style={{ minWidth: 36, textAlign: 'center' }}>{item.quantity}</span>
                              <button
                                onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity + 1 }))}
                                className="btn border-0 px-3 py-2"
                                style={{ color: 'var(--bb-accent)', background: 'transparent' }}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-end">
                              <span className="fw-black text-theme-title" style={{ fontSize: '1.1rem' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              {item.quantity > 1 && (
                                <span className="d-block text-theme-muted" style={{ fontSize: '0.75rem' }}>₹{item.price.toLocaleString('en-IN')} each</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Actions row */}
                <div className="d-flex gap-3 justify-content-between flex-wrap">
                  <Link to="/products" className="btn fw-semibold d-flex align-items-center gap-2" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', borderRadius: 10, padding: '10px 20px' }}>
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={() => { dispatch(clearCart()); toast('Cart cleared', { style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '10px' } }) }}
                    className="btn fw-semibold d-flex align-items-center gap-2"
                    style={{ background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,77,125,0.2)', color: '#ff4d7d', borderRadius: 10, padding: '10px 20px' }}
                  >
                    <Trash2 size={14} /> Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* ── ORDER SUMMARY ────────────────────────── */}
            <div className="col-12 col-lg-4">
              <div className="rounded-4 p-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', position: 'sticky', top: 120 }}>
                {/* Header */}
                <div className="d-flex align-items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  <img src={logo} alt="BeatBox" style={{ width: 20, height: 20 }} />
                  <span className="fw-black text-theme-title">Order Summary</span>
                </div>

                {/* Price breakdown */}
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex justify-content-between text-theme-muted small">
                    <span>Subtotal ({count} item{count !== 1 && 's'})</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between text-theme-muted small">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-theme-muted">Shipping</span>
                    <span style={{ color: shipping === 0 ? '#39ff14' : 'var(--bb-muted)', fontWeight: 600 }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="d-flex justify-content-between small text-success fw-semibold">
                      <span className="d-flex align-items-center gap-1"><Tag size={12} /> {appliedCoupon}</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between fw-black mt-2 pt-2" style={{ borderTop: '1px solid var(--bb-border)' }}>
                    <span className="text-theme-title fs-5">Total</span>
                    <span className="text-theme-title fs-5">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mb-4">
                  <p className="text-theme-muted small fw-semibold mb-2 d-flex align-items-center gap-1"><Tag size={12} /> APPLY COUPON</p>
                  {appliedCoupon ? (
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: 'rgba(39,255,20,0.07)', border: '1px solid rgba(39,255,20,0.2)' }}>
                      <div>
                        <span className="fw-black" style={{ color: '#39ff14', fontSize: '0.9rem' }}>{appliedCoupon}</span>
                        <p className="mb-0 text-theme-muted" style={{ fontSize: '0.75rem' }}>{COUPONS[appliedCoupon].label}</p>
                      </div>
                      <button onClick={handleRemoveCoupon} className="btn border-0 p-1" style={{ color: 'var(--bb-muted)', background: 'transparent', fontSize: '0.75rem' }}>Remove</button>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                          onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Enter coupon code"
                          className="form-control"
                          style={{ background: 'var(--bb-surface-2)', border: `1px solid ${couponError ? 'rgba(220,53,69,0.5)' : 'var(--bb-border)'}`, color: 'var(--bb-text)', borderRadius: 8, fontSize: '0.85rem', height: 40 }}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim()}
                          className="btn btn-glow fw-bold px-3"
                          style={{ borderRadius: 8, height: 40, fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-danger small mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{couponError}</p>}
                      <p className="text-theme-muted mt-1 mb-0" style={{ fontSize: '0.7rem' }}>Try: BASS20 · BEATBOX10 · NEWBASS</p>
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-glow w-100 py-3 fw-black d-flex align-items-center justify-content-center gap-2 mb-3"
                  style={{ borderRadius: 12, fontSize: '1rem' }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                {/* Trust items */}
                <div className="d-flex flex-column gap-2">
                  {[
                    { icon: <Shield size={14} />, text: '100% Secure Checkout' },
                    { icon: <Truck size={14} />, text: 'Free Shipping on ₹999+' },
                    { icon: <Package size={14} />, text: '7-Day Easy Returns' },
                  ].map((t, i) => (
                    <div key={i} className="d-flex align-items-center gap-2">
                      <span style={{ color: 'var(--bb-accent)' }}>{t.icon}</span>
                      <span className="text-theme-muted" style={{ fontSize: '0.78rem' }}>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
