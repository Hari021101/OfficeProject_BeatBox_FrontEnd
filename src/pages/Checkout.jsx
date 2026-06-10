import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Lock, Truck, Package } from 'lucide-react'
import { clearCart, selectCartItems, selectCartSubtotal, selectCartCount, selectAppliedPromo } from '../redux/cartSlice'
import { orderService } from '../services/orderService'
import { toast } from 'react-hot-toast'
import { fetchAddresses } from '../redux/profileSlice'
import { useEffect } from 'react'
import { IMAGE_MAP } from '../data/products'
import logo from '../assets/beatbox_logo.png'
import { paymentService } from '../services/paymentService'

const STEPS = [
  { id: 1, label: 'Delivery', icon: <MapPin size={16} /> },
  { id: 2, label: 'Payment', icon: <CreditCard size={16} /> },
  { id: 3, label: 'Confirm', icon: <CheckCircle size={16} /> },
]

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const count = useSelector(selectCartCount)
  const appliedPromo = useSelector(selectAppliedPromo)

  const { addresses } = useSelector(state => state.profile)

  const [step, setStep] = useState(1)
  const [addressData, setAddressData] = useState(null)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [ordered, setOrdered] = useState(false)
  const [orderId] = useState(`BB${Date.now().toString().slice(-8)}`)
  const [createdOrderId, setCreatedOrderId] = useState(null)

  const shipping = appliedPromo?.isFreeShipping ? 0 : (subtotal >= 999 ? 0 : 79)
  const gst = Math.round(subtotal * 0.18)
  const couponDiscount = appliedPromo?.discountPercentage ? Math.round(subtotal * (appliedPromo.discountPercentage / 100)) : 0
  const total = subtotal + shipping + gst - couponDiscount

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.userAddressId);
    } else {
      setShowNewAddressForm(true);
    }
  }, [addresses])

  if (items.length === 0 && !ordered) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-4 text-center px-4" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
        <Package size={56} style={{ color: 'var(--bb-muted)' }} />
        <h3 className="text-theme-title fw-black">Your cart is empty</h3>
        <p className="text-theme-muted">Add some products before checking out.</p>
        <button onClick={() => navigate('/products')} className="btn btn-glow px-5 py-3 fw-bold" style={{ borderRadius: 12 }}>
          Shop Now
        </button>
      </div>
    )
  }

  const onAddressSubmit = (data) => {
    setAddressData({
      fullName: data.fullName,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      phone: data.phone
    })
    setStep(2)
  }

  const handleSavedAddressSubmit = () => {
    if (!selectedAddressId) return;
    const selected = addresses.find(a => a.userAddressId === selectedAddressId);
    if (selected) {
      setAddressData({
        fullName: selected.fullName,
        address1: selected.addressLine1,
        address2: selected.addressLine2,
        city: selected.city,
        state: selected.state,
        pincode: selected.postalCode,
        phone: selected.phone
      });
      setStep(2);
    }
  }
const onPlaceOrder = async () => {
  try {

    // ==========================
    // CASH ON DELIVERY
    // ==========================
    if (paymentMethod === "cod") {

      const orderData = {
        shippingAddress: {
          fullName: addressData.fullName,
          addressLine1: addressData.address1,
          addressLine2: addressData.address2 || "",
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.pincode,
          country: "India",
          phone: addressData.phone
        },

        paymentMethod: "COD",

        paymentDetails: {
          transactionReference: `COD-${Date.now()}`
        }
      }

      const result = await orderService.checkout(orderData)

      setCreatedOrderId(result.orderId)

      setOrdered(true)
      setStep(3)

      dispatch(clearCart())

      toast.success("Order placed successfully!")

      return
    }

    // ==========================
    // RAZORPAY METHODS
    // UPI / CARD / NETBANKING
    // ==========================

    const razorpayOrder =
      await paymentService.createRazorpayOrder(
        Date.now(),
        total
      )

    const options = {
      key: "rzp_test_SzoeIy8fRZ4hB9",

      amount: razorpayOrder.data.amount,

      currency: "INR",

      order_id: razorpayOrder.data.razorpayOrderId,

      name: "BeatBox",

      description: "Premium Audio Store",

      handler: async function (response) {

        const orderData = {
          shippingAddress: {
            fullName: addressData.fullName,
            addressLine1: addressData.address1,
            addressLine2: addressData.address2 || "",
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.pincode,
            country: "India",
            phone: addressData.phone
          },

          paymentMethod: paymentMethod,

        paymentDetails: {
  razorpayOrderId: response.razorpay_order_id,
  razorpayPaymentId: response.razorpay_payment_id,
  razorpaySignature: response.razorpay_signature
}
        }

        const result =
          await orderService.checkout(orderData)

        const backendOrderId = result.orderId

        setCreatedOrderId(backendOrderId)

        await paymentService.processPayment({
          orderId: backendOrderId,
          amount: total,
          method: paymentMethod.toUpperCase(),
          transactionId:
            response.razorpay_payment_id
        })

        setStep(3)
        setOrdered(true)

        dispatch(clearCart())

        toast.success("Payment Successful!")
      },

      prefill: {
        name: addressData.fullName,
        contact: addressData.phone
      },

      theme: {
        color: "#00f3ff"
      }
    }

    const razorpay = new window.Razorpay(options)

    razorpay.open()

  } catch (err) {
    console.log(err)
    toast.error("Payment failed")
  }
}
  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      <div className="bg-glow-orb" style={{ width: 400, height: 400, background: 'var(--bb-primary-glow)', top: '5%', left: '-5%', filter: 'blur(130px)' }} />
      <div className="bg-glow-orb" style={{ width: 350, height: 350, background: 'var(--bb-accent-glow)', bottom: '10%', right: '-5%', filter: 'blur(130px)', animationDelay: '2s' }} />

      <div className="container-fluid px-3 px-lg-5 py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <img src={logo} alt="BeatBox" style={{ width: 28, height: 28 }} />
            <h1 className="fw-black text-theme-title mb-0" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', letterSpacing: '-1px' }}>
              Secure <span className="gradient-text">Checkout</span>
            </h1>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-1 text-theme-muted small">
            <Lock size={12} /> SSL Encrypted · 100% Safe & Secure
          </div>
        </div>

        {/* Step progress */}
        {!ordered && (
          <div className="d-flex align-items-center justify-content-center mb-5">
            {STEPS.map((s, i) => (
              <div key={s.id} className="d-flex align-items-center">
                <div className="d-flex flex-column align-items-center" style={{ minWidth: 80 }}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-1 fw-bold"
                    style={{
                      width: 40, height: 40,
                      background: step >= s.id ? 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))' : 'var(--bb-surface)',
                      border: step >= s.id ? 'none' : '1px solid var(--bb-border)',
                      color: step >= s.id ? '#fff' : 'var(--bb-muted)',
                      transition: 'all 0.3s ease',
                      boxShadow: step === s.id ? '0 0 20px var(--bb-accent-glow)' : 'none'
                    }}
                  >
                    {step > s.id ? <CheckCircle size={18} /> : s.icon}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: step >= s.id ? 'var(--bb-accent)' : 'var(--bb-muted)' }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 60, height: 2, background: step > s.id ? 'var(--bb-accent)' : 'var(--bb-border)', margin: '0 4px 18px', transition: 'background 0.3s ease' }} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="row g-4 justify-content-center">
          {/* Main area */}
          <div className="col-12 col-lg-7">
            <AnimatePresence mode="wait">
              {/* STEP 1: Address */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                  <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <h5 className="fw-black text-theme-title mb-4 d-flex align-items-center gap-2">
                      <MapPin size={18} style={{ color: 'var(--bb-accent)' }} /> Delivery Address
                    </h5>
                    
                    {addresses && addresses.length > 0 && !showNewAddressForm && (
                      <div className="mb-4">
                        <p className="text-theme-muted small fw-semibold mb-3">Select a saved address</p>
                        <div className="row g-3">
                          {addresses.map(addr => (
                            <div key={addr.userAddressId} className="col-12 col-md-6">
                              <div 
                                className="p-3 rounded-3 position-relative cursor-pointer h-100" 
                                style={{ 
                                  background: selectedAddressId === addr.userAddressId ? 'rgba(0, 243, 255, 0.05)' : 'var(--bb-surface-2)', 
                                  border: `1px solid ${selectedAddressId === addr.userAddressId ? 'var(--bb-accent)' : 'var(--bb-border)'}`,
                                  cursor: 'pointer'
                                }}
                                onClick={() => setSelectedAddressId(addr.userAddressId)}
                              >
                                {addr.isDefault && (
                                  <span className="badge bg-glow-subtle position-absolute top-0 end-0 m-2 px-2 py-1" style={{ color: 'var(--bb-accent)', fontSize: '0.65rem' }}>
                                    Default
                                  </span>
                                )}
                                <h6 className="fw-bold text-theme-title mb-1 small">{addr.fullName}</h6>
                                <p className="text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>{addr.phone}</p>
                                <p className="text-theme-title mb-0 mt-2" style={{ fontSize: '0.75rem' }}>
                                  {addr.addressLine1}, {addr.city}<br/>{addr.state} - {addr.postalCode}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                          <button onClick={() => setShowNewAddressForm(true)} className="btn btn-outline-secondary px-4 py-2 small fw-bold" style={{ borderRadius: 10 }}>
                            Add New Address
                          </button>
                          <button onClick={handleSavedAddressSubmit} className="btn btn-glow px-4 py-2 fw-bold d-flex align-items-center gap-2" style={{ borderRadius: 10 }}>
                            Continue <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {showNewAddressForm && (
                      <form onSubmit={handleSubmit(onAddressSubmit)}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold text-theme-title mb-0">Add New Address</h6>
                          {addresses && addresses.length > 0 && (
                            <button type="button" onClick={() => setShowNewAddressForm(false)} className="btn btn-link text-info p-0 small text-decoration-none">Cancel</button>
                          )}
                        </div>
                        <div className="row g-3">
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-theme-muted small fw-semibold">Full Name *</label>
                            <input {...register('fullName', { required: 'Full name is required' })} className="form-control checkout-input" placeholder="Arjun Sharma" />
                            {errors.fullName && <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{errors.fullName.message}</p>}
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-theme-muted small fw-semibold">Phone Number *</label>
                            <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })} className="form-control checkout-input" placeholder="9876543210" maxLength={10} />
                            {errors.phone && <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{errors.phone.message}</p>}
                          </div>
                          <div className="col-12">
                            <label className="form-label text-theme-muted small fw-semibold">Address Line 1 *</label>
                            <input {...register('address1', { required: 'Address is required' })} className="form-control checkout-input" placeholder="Flat / House No., Building Name" />
                            {errors.address1 && <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{errors.address1.message}</p>}
                          </div>
                          <div className="col-12">
                            <label className="form-label text-theme-muted small fw-semibold">Address Line 2</label>
                            <input {...register('address2')} className="form-control checkout-input" placeholder="Street / Area / Locality" />
                          </div>
                          <div className="col-12 col-sm-4">
                            <label className="form-label text-theme-muted small fw-semibold">City *</label>
                            <input {...register('city', { required: 'City is required' })} className="form-control checkout-input" placeholder="Mumbai" />
                            {errors.city && <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{errors.city.message}</p>}
                          </div>
                          <div className="col-12 col-sm-4">
                            <label className="form-label text-theme-muted small fw-semibold">State *</label>
                            <select {...register('state', { required: 'State is required' })} className="form-select checkout-input" style={{ color: 'var(--bb-text)' }}>
                              <option value="">Select State</option>
                              {['Maharashtra','Tamil Nadu','Karnataka','Delhi','Gujarat','Rajasthan','Uttar Pradesh','West Bengal','Kerala','Telangana'].map(s => (
                                <option key={s} value={s} style={{ background: 'var(--bb-surface)' }}>{s}</option>
                              ))}
                            </select>
                            {errors.state && <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{errors.state.message}</p>}
                          </div>
                          <div className="col-12 col-sm-4">
                            <label className="form-label text-theme-muted small fw-semibold">PIN Code *</label>
                            <input {...register('pincode', { required: 'PIN code is required', pattern: { value: /^\d{6}$/, message: '6-digit PIN required' } })} className="form-control checkout-input" placeholder="400001" maxLength={6} />
                            {errors.pincode && <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.75rem' }}>{errors.pincode.message}</p>}
                          </div>
                        </div>
                        <button type="submit" className="btn btn-glow w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-4" style={{ borderRadius: 12 }}>
                          Continue to Payment <ArrowRight size={18} />
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Payment */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                  <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <h5 className="fw-black text-theme-title mb-4 d-flex align-items-center gap-2">
                      <CreditCard size={18} style={{ color: 'var(--bb-accent)' }} /> Payment Method
                    </h5>

                    {/* Delivery summary */}
                    <div className="p-3 rounded-3 mb-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Truck size={14} style={{ color: 'var(--bb-accent)' }} />
                        <span className="text-theme-title fw-bold small">Delivering to:</span>
                      </div>
                      <p className="text-theme-muted mb-0 small">{addressData?.fullName} · {addressData?.phone}</p>
                      <p className="text-theme-muted mb-0 small">{addressData?.address1}{addressData?.address2 ? `, ${addressData.address2}` : ''}</p>
                      <p className="text-theme-muted mb-0 small">{addressData?.city}, {addressData?.state} - {addressData?.pincode}</p>
                      <button onClick={() => setStep(1)} className="btn border-0 p-0 mt-1 small fw-semibold" style={{ color: 'var(--bb-primary-light)', background: 'transparent', fontSize: '0.8rem' }}>Change</button>
                    </div>

                    {/* Payment options */}
                    <div className="d-flex flex-column gap-3">
                      {[
                        { id: 'card', label: 'Credit / Debit Card', emoji: '💳', desc: 'Visa, Mastercard, RuPay' },
                        { id: 'netbanking', label: 'Net Banking', emoji: '🏦', desc: 'All major Indian banks' },
                        { id: 'cod', label: 'Cash on Delivery', emoji: '💵', desc: 'Pay when you receive' },
                      ].map(method => (
                        <label
                          key={method.id}
                          className="p-3 rounded-3 d-flex align-items-center gap-3"
                          style={{ cursor: 'pointer', border: `1px solid ${paymentMethod === method.id ? 'var(--bb-accent)' : 'var(--bb-border)'}`, background: paymentMethod === method.id ? 'rgba(0,243,255,0.05)' : 'var(--bb-surface-2)', transition: 'all 0.2s' }}
                        >
                          <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ accentColor: 'var(--bb-accent)' }} />
                          <span style={{ fontSize: '1.4rem' }}>{method.emoji}</span>
                          <div>
                            <p className="fw-bold text-theme-title mb-0 small">{method.label}</p>
                            <p className="text-theme-muted mb-0" style={{ fontSize: '0.75rem' }}>{method.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>


                    <div className="d-flex gap-3 mt-4">
                      <button onClick={() => setStep(1)} className="btn fw-bold d-flex align-items-center gap-2 px-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', borderRadius: 12 }}>
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button onClick={onPlaceOrder} className="btn btn-glow flex-grow-1 py-3 fw-black d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: 12 }}>
                        <Lock size={16} /> Place Order · ₹{total.toLocaleString('en-IN')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Success */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div className="p-5 rounded-4 text-center" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
                      style={{ width: 100, height: 100, background: 'linear-gradient(135deg,rgba(39,255,20,0.15),rgba(0,243,255,0.1))', border: '2px solid rgba(39,255,20,0.4)' }}
                    >
                      <CheckCircle size={48} style={{ color: '#39ff14' }} />
                    </motion.div>
                    <h2 className="fw-black text-theme-title mb-2" style={{ letterSpacing: '-1px' }}>Order Placed! 🎉</h2>
                    <p className="text-theme-muted mb-1">Thank you for your purchase.</p>
                    <div className="my-3 px-4 py-2 rounded-2 d-inline-block" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                      <span className="text-theme-muted small">Order ID: </span>
                      <span className="fw-black" style={{ color: 'var(--bb-accent)', fontSize: '0.9rem', fontFamily: 'monospace' }}>#{createdOrderId || orderId}</span>
                    </div>
                    <p className="text-theme-muted small mb-4">Your order will be delivered within <strong className="text-theme-title">3–5 business days</strong>. A confirmation has been sent to your email.</p>

                    <div className="d-flex gap-2 flex-column flex-sm-row justify-content-center">
                      <button onClick={() => navigate('/orders')} className="btn btn-glow px-4 py-2 fw-bold" style={{ borderRadius: 10 }}>
                        My Orders
                      </button>
                      <button onClick={() => navigate('/products')} className="btn fw-bold px-4 py-2" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-muted)', borderRadius: 10 }}>
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          {!ordered && (
            <div className="col-12 col-lg-4">
              <div className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', position: 'sticky', top: 120 }}>
                <div className="d-flex align-items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  <img src={logo} alt="BeatBox" style={{ width: 18 }} />
                  <span className="fw-black text-theme-title small">Order Summary</span>
                  <span className="badge ms-auto rounded-pill" style={{ background: 'linear-gradient(135deg,var(--bb-primary),var(--bb-accent))', fontSize: '0.65rem' }}>{count} item{count !== 1 && 's'}</span>
                </div>
                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {items.map(item => (
                    <div key={item.cartKey} className="d-flex align-items-center gap-2">
                      <div className="rounded-2 flex-shrink-0" style={{ width: 40, height: 40, background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={IMAGE_MAP[item.imageKey]} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <p className="text-theme-title fw-semibold mb-0 text-truncate" style={{ fontSize: '0.8rem' }}>{item.name}</p>
                        <p className="text-theme-muted mb-0" style={{ fontSize: '0.7rem' }}>Qty: {item.quantity}</p>
                      </div>
                      <span className="text-theme-title fw-bold" style={{ fontSize: '0.85rem', flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="d-flex flex-column gap-1 pt-3" style={{ borderTop: '1px solid var(--bb-border)' }}>
                  <div className="d-flex justify-content-between text-theme-muted small"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="d-flex justify-content-between text-theme-muted small"><span>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-theme-muted">Shipping</span>
                    <span style={{ color: shipping === 0 ? '#39ff14' : 'var(--bb-muted)', fontWeight: 600 }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  {appliedPromo && couponDiscount > 0 && (
                    <div className="d-flex justify-content-between small text-success">
                      <span className="fw-bold">Discount ({appliedPromo.code})</span>
                      <span className="fw-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {appliedPromo && appliedPromo.isFreeShipping && (
                    <div className="d-flex justify-content-between small text-success">
                      <span className="fw-bold">Promo ({appliedPromo.code})</span>
                      <span className="fw-bold">Free Shipping</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between fw-black mt-2 pt-2" style={{ borderTop: '1px solid var(--bb-border)' }}>
                    <span className="text-theme-title">Total</span>
                    <span className="text-theme-title" style={{ color: 'var(--bb-accent)' }}>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
