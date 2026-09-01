import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { X, Plus, Minus, ShoppingBag, ArrowRight, Tag, Package, ChevronRight, Shield, Truck, Sparkles } from 'lucide-react'
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartSubtotal, selectCartCount, selectAppliedPromo, applyPromo, removePromo } from '../redux/cartSlice'
import { selectIsAuthenticated } from '../redux/authSlice'
import { fetchMyOrders, selectAllOrders } from '../redux/orderSlice'
import { IMAGE_MAP } from '../data/products'
import { toast } from 'react-hot-toast'
import logo from '../assets/beatbox_logo.png'

import { validatePromoCode } from '../services/promoService'
import { getImageUrl } from '../config/api'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const count = useSelector(selectCartCount)
  const appliedPromo = useSelector(selectAppliedPromo)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const myOrders = useSelector(selectAllOrders)

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders())
    }
  }, [dispatch, isAuthenticated])

  const hasPreviousValidOrder = useMemo(() => {
    if (!isAuthenticated || !myOrders || myOrders.length === 0) return false
    return myOrders.some(o => o.status !== 'Cancelled' && o.status !== 'Failed')
  }, [isAuthenticated, myOrders])

  const isFirstOrderEligible = isAuthenticated && !hasPreviousValidOrder

  const shipping = (appliedPromo?.code === 'FREESHIP' && (appliedPromo?.isFreeShipping || appliedPromo?.discountType === 'Shipping')) ? 0 : 49
  const couponDiscount = appliedPromo?.discountAmount != null ? Number(appliedPromo.discountAmount) : (appliedPromo?.discountPercentage ? Math.round(subtotal * (appliedPromo.discountPercentage / 100)) : 0)
  const total = Math.max(0, subtotal + shipping - couponDiscount)

  const handleApplyCoupon = async () => {
    const code = couponInput.toUpperCase().trim()
    if (!code) return;

    setIsValidatingPromo(true);
    setCouponError('');
    try {
      const result = await validatePromoCode(code, subtotal);
      if (!result || result.isValid === false) {
        throw new Error(result?.message || result?.Message || 'Invalid coupon code');
      }
      dispatch(applyPromo(result));
      setCouponInput('');
      toast.success(`🎉 ${result.message}`, {
        style: { background: '#060b19', color: '#39ff14', border: '1px solid rgba(39,255,20,0.3)', borderRadius: '10px' }
      })
    } catch (error) {
      dispatch(removePromo());
      const errorMsg = error.message || 'Invalid coupon code.';
      setCouponError(errorMsg);
      toast.error(errorMsg, {
        style: { background: '#060b19', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px' }
      })
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
            <div>
              <h1 className="fw-black mb-0 text-theme-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-1px' }}>
                Shopping <span className="gradient-text">Cart</span>
              </h1>
              <p className="text-theme-muted mb-0" style={{ fontSize: '0.95rem' }}>
                Review your high-performance audio items before checkout
              </p>
            </div>
          </div>
        </div>

        {/* ── Dynamic BeatBox Benefits Banner ── */}
        {isAuthenticated && isFirstOrderEligible && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-5 position-relative overflow-hidden flex-wrap" 
            style={{ background: 'linear-gradient(90deg, rgba(168,32,255,0.12), rgba(0,243,255,0.08))', border: '1px solid rgba(0,243,255,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
          >
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: 'rgba(0,243,255,0.15)', flexShrink: 0 }}>
              <Truck size={22} style={{ color: 'var(--bb-accent)' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="fw-black mb-1 text-theme-title d-flex align-items-center gap-2" style={{ fontSize: '1rem', letterSpacing: '-0.3px' }}>
                🚚 FREE SHIPPING ON YOUR FIRST ORDER
              </h5>
              <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>
                New here? Use code <span className="fw-bold text-accent" style={{ fontFamily: 'monospace' }}>FREESHIP</span> at checkout and enjoy free delivery.
              </span>
            </div>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText('FREESHIP');
                setCouponInput('FREESHIP');
                toast.success('Code FREESHIP copied & set!');
              }}
              className="btn btn-sm fw-bold px-3 py-2 ms-auto text-nowrap"
              style={{ background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))', color: '#000', borderRadius: 10, fontSize: '0.8rem' }}
            >
              COPY CODE
            </button>
          </motion.div>
        )}

        {isAuthenticated && !isFirstOrderEligible && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-5 position-relative overflow-hidden flex-wrap" 
            style={{ background: 'linear-gradient(90deg, rgba(0,243,255,0.08), rgba(57,255,20,0.06))', border: '1px solid rgba(0,243,255,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
          >
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: 'rgba(0,243,255,0.12)', flexShrink: 0 }}>
              <Sparkles size={22} style={{ color: 'var(--bb-accent)' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="fw-black mb-1 text-theme-title d-flex align-items-center gap-2" style={{ fontSize: '1rem', letterSpacing: '-0.3px' }}>
                ⚡ TODAY'S BEST DEALS
              </h5>
              <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>
                Discover exclusive discounts, new arrivals & 1-Year warranty on all gear.
              </span>
            </div>
            <button
              onClick={() => navigate('/daily-deals')}
              className="btn btn-sm fw-bold px-3 py-2 ms-auto text-nowrap"
              style={{ background: 'rgba(0,243,255,0.12)', color: 'var(--bb-accent)', border: '1px solid rgba(0,243,255,0.3)', borderRadius: 10, fontSize: '0.8rem' }}
            >
              SHOP DEALS
            </button>
          </motion.div>
        )}

        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-5 position-relative overflow-hidden flex-wrap" 
            style={{ background: 'linear-gradient(90deg, rgba(168,32,255,0.12), rgba(0,243,255,0.08))', border: '1px solid rgba(168,32,255,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
          >
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: 'rgba(168,32,255,0.15)', flexShrink: 0 }}>
              <Shield size={22} style={{ color: '#d161ff' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="fw-black mb-1 text-theme-title" style={{ fontSize: '1rem', letterSpacing: '-0.3px' }}>
                🎧 NEW TO BEATBOX?
              </h5>
              <span className="text-theme-muted" style={{ fontSize: '0.85rem' }}>
                Get <span className="fw-bold text-accent">FREE SHIPPING</span> on your first order with code <span className="fw-bold text-accent" style={{ fontFamily: 'monospace' }}>FREESHIP</span> when you sign in.
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-sm fw-bold px-3 py-2 ms-auto text-nowrap"
              style={{ background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))', color: '#000', borderRadius: 10, fontSize: '0.8rem' }}
            >
              SIGN IN & SHOP
            </button>
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
                                   src={getImageUrl(item.imageUrl)}
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
                                    <div style={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: '50%',
                                      background: item.selectedColorCode || '#888',
                                      border: (item.selectedColorCode === '#000' || item.selectedColorCode === '#000000' || item.selectedColor?.toLowerCase() === 'black')
                                        ? '1px solid #64748b'
                                        : (item.selectedColorCode === '#fff' || item.selectedColorCode === '#ffffff' || item.selectedColor?.toLowerCase() === 'white')
                                          ? '1px solid #94a3b8'
                                          : '1px solid rgba(255,255,255,0.2)'
                                    }} />
                                    <span
                                      className="fw-semibold text-theme-title"
                                      style={{ fontSize: '0.75rem' }}
                                    >
                                      {item.selectedColor}
                                    </span>
                                  </div>
                                )}
                                {item.isPersonalised && (
                                  <div 
                                    className="d-flex flex-column gap-1 p-2 px-3 mt-2 rounded-3 w-100"
                                    style={{ 
                                      background: 'rgba(0, 243, 255, 0.04)', 
                                      border: '1px dashed rgba(0, 243, 255, 0.25)' 
                                    }}
                                  >
                                    <div className="d-flex align-items-center gap-2 fw-bold text-info" style={{ fontSize: '0.75rem' }}>
                                      <span>✨ Custom Engraving</span>
                                      <span className="ms-auto font-mono">₹{item.engravingPrice || 99}</span>
                                    </div>
                                    <div className="row g-2 small" style={{ fontSize: '0.8rem' }}>
                                      <div className="col-6">
                                        <span className="text-theme-muted d-block" style={{ fontSize: '0.7rem' }}>NAME</span>
                                        <span className="fw-bold text-white text-uppercase">{item.engravingName}</span>
                                      </div>
                                      {item.engravingDate && (
                                        <div className="col-6">
                                          <span className="text-theme-muted d-block" style={{ fontSize: '0.7rem' }}>DATE</span>
                                          <span className="fw-bold text-white">{item.engravingDate}</span>
                                        </div>
                                      )}
                                      {item.engravingMessage && (
                                        <div className="col-12">
                                          <span className="text-theme-muted d-block" style={{ fontSize: '0.7rem' }}>MESSAGE</span>
                                          <span className="fw-bold text-white text-uppercase">{item.engravingMessage}</span>
                                        </div>
                                      )}
                                    </div>
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
                                  ₹{((item.price + (item.isPersonalised ? (item.engravingPrice || 0) : 0)) * item.quantity).toLocaleString('en-IN')}
                                </span>
                                {(item.quantity > 1 || item.isPersonalised) && (
                                  <span className="d-block text-theme-muted" style={{ fontSize: '0.75rem', marginTop: '-2px' }}>
                                    ₹{(item.price + (item.isPersonalised ? (item.engravingPrice || 0) : 0)).toLocaleString('en-IN')} / ea
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
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-medium text-theme-muted">Shipping</span>
                    <span className="fw-bold" style={{ color: shipping === 0 ? '#39ff14' : 'var(--bb-title-color)' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  
                  {appliedPromo && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="d-flex justify-content-between align-items-center text-success mt-2">
                      <span className="fw-bold d-flex align-items-center gap-1"><Tag size={14} /> Coupon ({appliedPromo.code})</span>
                      <span className="fw-black">
                        {appliedPromo.isFreeShipping || appliedPromo.discountType === 'Shipping' || appliedPromo.code === 'FREESHIP'
                          ? 'Free Shipping'
                          : `-₹${couponDiscount.toLocaleString('en-IN')}`}
                      </span>
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
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: 'var(--bb-success-bg)', border: '1px dashed var(--bb-success-border)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: 'var(--bb-success-bg)', border: '1px solid var(--bb-success-border)' }}>
                          <Tag size={14} style={{ color: 'var(--bb-success-text)' }} />
                        </div>
                        <div>
                          <span className="fw-black d-block" style={{ color: 'var(--bb-success-text)', fontSize: '0.9rem', letterSpacing: '1px' }}>{appliedPromo.code}</span>
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
