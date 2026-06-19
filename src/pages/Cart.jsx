import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { X, Plus, Minus, ShoppingBag, ArrowRight, Tag, Package, ChevronRight, Shield, Truck } from 'lucide-react'
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartSubtotal, selectCartCount, selectAppliedPromo, applyPromo, removePromo } from '../redux/cartSlice'
import { IMAGE_MAP } from '../data/products'
import { toast } from 'react-hot-toast'
import logo from '../assets/beatbox_logo.png'

import { validatePromoCode } from '../services/promoService'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const count = useSelector(selectCartCount)
  const appliedPromo = useSelector(selectAppliedPromo)
  const API_BASE =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5089';
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)

  const shipping = appliedPromo?.isFreeShipping ? 0 : (subtotal >= 999 ? 0 : 79)
  const gst = Math.round(subtotal * 0.18)
  const couponDiscount = appliedPromo?.discountPercentage ? Math.round(subtotal * (appliedPromo.discountPercentage / 100)) : 0
  const total = subtotal + shipping + gst - couponDiscount

  const handleApplyCoupon = async () => {
    const code = couponInput.toUpperCase().trim()
    if (!code) return;

    setIsValidatingPromo(true);
    setCouponError('');
    try {
      const result = await validatePromoCode(code);
      dispatch(applyPromo(result));
      setCouponInput('');
      toast.success(`🎉 ${result.message}`, {
        style: { background: '#060b19', color: '#39ff14', border: '1px solid rgba(39,255,20,0.3)', borderRadius: '10px' }
      })
    } catch (error) {
      setCouponError(error.message || 'Invalid coupon code.');
    } finally {
      setIsValidatingPromo(false);
    }
  }

  const handleRemoveCoupon = () => {
    dispatch(removePromo())
    toast('Coupon removed.', { style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '10px' } })
  }

  return (
    <div className="min-vh-100 pb-5 position-relative" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      {/* Ambient glows */}
      <div className="bg-glow-orb" style={{ width: 500, height: 500, background: 'var(--bb-primary-glow)', top: '-5%', left: '-5%', filter: 'blur(150px)', opacity: 0.7 }} />
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-accent-glow)', bottom: '5%', right: '-5%', filter: 'blur(150px)', animationDelay: '2s', opacity: 0.6 }} />

      <div className="container-fluid px-3 px-lg-5 py-5 position-relative" style={{ zIndex: 5 }}>
        {/* Page header */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 48, height: 48, background: 'linear-gradient(135deg, rgba(0,243,255,0.1), rgba(168,32,255,0.1))', border: '1px solid rgba(0,243,255,0.2)' }}>
              <ShoppingBag size={24} style={{ color: 'var(--bb-accent)' }} />
            </div>
            <h1 className="fw-black text-theme-title mb-0" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', letterSpacing: '-1.5px' }}>
              Your <span className="gradient-text">Cart</span>
            </h1>
            {count > 0 && (
              <span className="badge rounded-pill px-3 py-2 ms-2 fw-bold shadow-sm" style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                {count} {count === 1 ? 'Item' : 'Items'}
              </span>
            )}
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item"><Link to="/" className="text-theme-muted text-decoration-none transition-colors hover-text-accent">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products" className="text-theme-muted text-decoration-none transition-colors hover-text-accent">Products</Link></li>
              <li className="breadcrumb-item active text-theme-title fw-semibold" aria-current="page">Cart</li>
            </ol>
          </nav>
        </div>

        {/* Free shipping banner */}
        {subtotal > 0 && subtotal < 999 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="d-flex align-items-center gap-3 gap-md-4 p-3 p-md-4 rounded-4 mb-5 position-relative overflow-hidden"
            style={{ background: 'var(--bb-surface)', border: '1px solid rgba(0,243,255,0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
          >
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, rgba(0,243,255,0.05) 0%, transparent 100%)', zIndex: 0 }} />
            
            <div className="rounded-circle d-flex align-items-center justify-content-center position-relative" style={{ width: 44, height: 44, background: 'rgba(0,243,255,0.1)', zIndex: 1 }}>
              <Truck size={22} style={{ color: 'var(--bb-accent)' }} />
            </div>
            
            <div className="flex-grow-1 position-relative" style={{ zIndex: 1 }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-theme-title fw-semibold" style={{ fontSize: '0.95rem' }}>
                  Add <span className="fw-black" style={{ color: 'var(--bb-accent)' }}>₹{(999 - subtotal).toLocaleString('en-IN')}</span> more for FREE shipping!
                </span>
                <span className="text-theme-muted small fw-bold">₹999 Goal</span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: 8, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                <div 
                  className="progress-glow" 
                  style={{ 
                    width: `${Math.min((subtotal / 999) * 100, 100)}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--bb-primary), var(--bb-accent))',
                    boxShadow: '0 0 10px var(--bb-accent-glow)',
                    transition: 'width 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' 
                  }} 
                />
              </div>
            </div>
          </motion.div>
        )}
        
        {subtotal >= 999 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-5" 
            style={{ background: 'linear-gradient(90deg, rgba(57,255,20,0.08), transparent)', border: '1px solid rgba(57,255,20,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          >
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: 'rgba(57,255,20,0.15)' }}>
              <Truck size={20} style={{ color: '#39ff14' }} />
            </div>
            <div>
              <h5 className="fw-black mb-1" style={{ color: '#39ff14', letterSpacing: '-0.5px' }}>Free Shipping Unlocked!</h5>
              <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>Your order qualifies for complimentary premium delivery.</span>
            </div>
          </motion.div>
        )}

        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="d-flex flex-column align-items-center justify-content-center text-center py-5 gap-4 rounded-4 glass-card"
            style={{ minHeight: '50vh', border: '1px dashed rgba(0,243,255,0.2)' }}
          >
            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 140, height: 140, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)' }}>
              <Package size={64} strokeWidth={1} style={{ color: 'var(--bb-muted)', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }} />
            </div>
            <div className="max-w-md">
              <h2 className="fw-black text-theme-title mb-3" style={{ letterSpacing: '-1px' }}>Your cart is empty</h2>
              <p className="text-theme-muted" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Looks like you haven't added any awesome gear yet. Explore our premium collection and find your perfect sound.</p>
            </div>
            <Link to="/products" className="btn btn-glow px-5 py-3 fw-bold d-flex align-items-center gap-2 mt-2" style={{ borderRadius: 12, fontSize: '1.05rem' }}>
              Start Shopping <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="row g-5 align-items-start">
            {/* ── CART ITEMS ─────────────────────────────── */}
            <div className="col-12 col-lg-7 col-xl-8">
              <div className="d-flex flex-column gap-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.cartKey}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.3 }}
                      className="p-3 p-md-4 rounded-4 position-relative hover-lift"
                      style={{ 
                        background: 'var(--bb-surface)', 
                        border: '1px solid var(--bb-border)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                      }}
                    >
                      {/* Premium Remove Button */}
                      <button
                        onClick={() => {
                          dispatch(removeFromCart(item.cartKey))
                          toast('Item removed', { style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '10px' } })
                        }}
                        className="btn position-absolute border-0 d-flex align-items-center justify-content-center p-0 rounded-circle"
                        style={{ 
                          top: '16px', 
                          right: '16px', 
                          width: '32px', 
                          height: '32px', 
                          background: 'var(--bb-surface-2)', 
                          color: 'var(--bb-muted)', 
                          transition: 'all 0.2s ease',
                          zIndex: 10
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,0,0,0.1)'; e.currentTarget.style.color = '#ff4d7d' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bb-surface-2)'; e.currentTarget.style.color = 'var(--bb-muted)' }}
                        aria-label="Remove item"
                        title="Remove from Cart"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>

                      <div className="row g-4 align-items-center">
                        {/* Product Image Stage */}
                        <div className="col-4 col-sm-3 col-md-2">
                          
                          <Link to={`/products/${item.id}`} className="d-block text-decoration-none">
                            <div 
                              className="rounded-3 d-flex align-items-center justify-content-center position-relative" 
                              style={{ 
                                background: 'var(--bb-surface-2)', 
                                border: '1px solid rgba(255,255,255,0.05)', 
                                padding: '15px',
                                aspectRatio: '1/1', 
                                overflow: 'hidden' 
                              }}
                            >
                              
                              {/* Soft backdrop glow based on item color or default */}
                              <div className="position-absolute w-100 h-100" style={{ background: item.selectedColorCode || 'var(--bb-accent)', opacity: 0.1, filter: 'blur(20px)' }} />
                              {item.imageUrl && item.imageUrl.includes('video') ? (
                                <video 
                                  src={item.imageUrl} 
                                  autoPlay loop muted 
                                  className="img-fluid position-relative z-1" 
                                  style={{ objectFit: 'contain', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.4))' }} 
                                />
                              ) : (
                                
                                <img 
                                   src={
    item.imageUrl?.startsWith('http')
      ? item.imageUrl
      : `${API_BASE}${item.imageUrl}`
  }
  alt={item.name} 
                                  className="img-fluid position-relative z-1" 
                                  style={{ objectFit: 'contain', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.4))' }} 
                                />
                              )}
                            </div>
                          </Link>
                        </div>

                        {/* Product Info & Controls */}
                        <div className="col-8 col-sm-9 col-md-10">
                          <div className="d-flex flex-column h-100 justify-content-center">
                            
                            <div className="mb-3 pe-4">
                              <Link to={`/products/${item.id}`} className="text-decoration-none">
                                <h5 className="fw-black text-theme-title mb-1 text-truncate hover-text-accent transition-colors" style={{ letterSpacing: '-0.5px' }}>
                                  {item.name}
                                </h5>
                              </Link>
                              
                              <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                                {item.selectedColor && (
                                  <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.selectedColorCode || '#888', border: '1px solid rgba(255,255,255,0.2)' }} />
                                    <span
  className="fw-semibold"
  style={{
    fontSize: '0.75rem',
    color: item.selectedColorCode || 'var(--bb-title-color)'
  }}
>
  {item.selectedColor}
</span>
                                  </div>
                                )}
                                <span className="d-flex align-items-center gap-1 text-success fw-bold" style={{ fontSize: '0.75rem' }}>
                                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#39ff14', boxShadow: '0 0 5px #39ff14' }} /> In Stock
                                </span>
                              </div>
                            </div>

                            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-end justify-content-between gap-3 mt-auto">
                              {/* Quantity Selector */}
                              <div>
                                <span className="d-block text-theme-muted mb-1 fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>QUANTITY</span>
                                <div className="d-flex align-items-center rounded-pill overflow-hidden" style={{ border: '1px solid var(--bb-border)', background: 'var(--bb-surface)' }}>
                                  <button
                                    onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.cartKey))}
                                    className="btn border-0 py-1 px-3 transition-colors"
                                    style={{ color: 'var(--bb-title-color)', background: 'transparent' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bb-surface-2)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                  >
                                    <Minus size={14} strokeWidth={2.5} />
                                  </button>
                                  <span className="fw-black text-theme-title px-2 text-center" style={{ minWidth: '40px', fontSize: '0.95rem' }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity + 1 }))}
                                    className="btn border-0 py-1 px-3 transition-colors"
                                    style={{ color: 'var(--bb-accent)', background: 'transparent' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bb-surface-2)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                  >
                                    <Plus size={14} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>

                              {/* Price Display */}
                              <div className="text-start text-sm-end mt-2 mt-sm-0">
                                <span className="d-block text-theme-muted mb-1 fw-semibold text-uppercase d-none d-sm-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Price</span>
                                <span className="fw-black text-theme-title" style={{ fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="d-block text-theme-muted" style={{ fontSize: '0.75rem', marginTop: '-2px' }}>
                                    ₹{item.price.toLocaleString('en-IN')} / ea
                                  </span>
                                )}
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Actions row */}
                <div className="d-flex align-items-center justify-content-between mt-2 flex-wrap gap-3">
                  <Link to="/products" className="btn fw-bold d-flex align-items-center gap-2 hover-text-accent transition-colors" style={{ color: 'var(--bb-muted)', padding: '10px 0' }}>
                    <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Continue Shopping
                  </Link>
                  <button
                    onClick={() => { 
                      if(window.confirm('Are you sure you want to clear your entire cart?')) {
                        dispatch(clearCart()); 
                        toast('Cart cleared', { style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-border)', borderRadius: '10px' } }) 
                      }
                    }}
                    className="btn fw-semibold d-flex align-items-center gap-2 hover-scale"
                    style={{ background: 'transparent', border: '1px solid rgba(255,77,125,0.4)', color: '#ff4d7d', borderRadius: '50px', padding: '8px 20px', fontSize: '0.85rem' }}
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            </div>

            {/* ── ORDER SUMMARY STICKY PANEL ────────────────────────── */}
            <div className="col-12 col-lg-5 col-xl-4">
              <div 
                className="rounded-4 p-4 p-xl-5 glass-card position-sticky" 
                style={{ 
                  top: '100px', 
                  border: '1px solid rgba(0,243,255,0.15)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                }}
              >
                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 40, height: 40, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                    <img src={logo} alt="BeatBox" style={{ width: 16, height: 16 }} />
                  </div>
                  <h4 className="fw-black text-theme-title mb-0" style={{ letterSpacing: '-0.5px' }}>Summary</h4>
                </div>

                {/* Price breakdown */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center text-theme-muted">
                    <span className="fw-medium">Subtotal <span className="small">({count} items)</span></span>
                    <span className="fw-semibold text-theme-title">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center text-theme-muted">
                    <span className="fw-medium">Estimated GST <span className="small">(18%)</span></span>
                    <span className="fw-semibold text-theme-title">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-medium text-theme-muted">Shipping</span>
                    <span className="fw-bold" style={{ color: shipping === 0 ? '#39ff14' : 'var(--bb-title-color)' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  
                  {appliedPromo && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="d-flex justify-content-between align-items-center text-success mt-2">
                      <span className="fw-bold d-flex align-items-center gap-1"><Tag size={14} /> Discount ({appliedPromo.code})</span>
                      <span className="fw-black">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </motion.div>
                  )}
                  
                  <div className="mt-3 pt-4" style={{ borderTop: '2px dashed var(--bb-border)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-theme-muted fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>Total Amount</span>
                      <span className="text-theme-title fw-black" style={{ fontSize: '1.8rem', letterSpacing: '-1px' }}>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  <label className="text-theme-title fw-bold small mb-3 d-block text-uppercase" style={{ letterSpacing: '0.5px' }}>Promo Code</label>
                  {appliedPromo ? (
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: 'rgba(39,255,20,0.08)', border: '1px dashed rgba(39,255,20,0.3)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: 'rgba(39,255,20,0.2)' }}>
                          <Tag size={14} style={{ color: '#39ff14' }} />
                        </div>
                        <div>
                          <span className="fw-black d-block" style={{ color: '#39ff14', fontSize: '0.9rem', letterSpacing: '1px' }}>{appliedPromo.code}</span>
                          <span className="text-theme-muted fw-medium" style={{ fontSize: '0.75rem' }}>{appliedPromo.message}</span>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="btn border-0 p-2 hover-scale" style={{ color: 'var(--bb-muted)' }} title="Remove Coupon">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="position-relative">
                        <Tag size={16} className="position-absolute" style={{ top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--bb-muted)' }} />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                          onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Enter code"
                          className="form-control fw-semibold"
                          style={{ 
                            background: 'var(--bb-surface-2)', 
                            border: `1px solid ${couponError ? 'rgba(220,53,69,0.5)' : 'var(--bb-border)'}`, 
                            color: 'var(--bb-title-color)', 
                            borderRadius: '12px', 
                            padding: '12px 100px 12px 42px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim() || isValidatingPromo}
                          className="btn btn-glow position-absolute fw-bold d-flex align-items-center justify-content-center"
                          style={{ 
                            top: '4px', right: '4px', bottom: '4px',
                            borderRadius: '8px', 
                            padding: '0 20px',
                            fontSize: '0.85rem' 
                          }}
                        >
                          {isValidatingPromo ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-danger small mt-2 mb-0 fw-medium" style={{ fontSize: '0.8rem' }}>{couponError}</p>}
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-glow w-100 py-3 fw-black d-flex align-items-center justify-content-center gap-2 mb-4 hover-lift shadow-lg"
                  style={{ borderRadius: '14px', fontSize: '1.1rem', letterSpacing: '0.5px' }}
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>

                {/* Trust Badges */}
                <div className="d-flex justify-content-center gap-4 mt-2">
                  <div className="text-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: 40, height: 40, background: 'var(--bb-surface-2)' }}>
                      <Shield size={18} style={{ color: 'var(--bb-accent)' }} />
                    </div>
                    <span className="d-block text-theme-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>SECURE</span>
                  </div>
                  <div className="text-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: 40, height: 40, background: 'var(--bb-surface-2)' }}>
                      <Truck size={18} style={{ color: 'var(--bb-accent)' }} />
                    </div>
                    <span className="d-block text-theme-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>FAST SHIP</span>
                  </div>
                  <div className="text-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: 40, height: 40, background: 'var(--bb-surface-2)' }}>
                      <Package size={18} style={{ color: 'var(--bb-accent)' }} />
                    </div>
                    <span className="d-block text-theme-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>RETURNS</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
