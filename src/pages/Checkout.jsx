import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, CreditCard, ShieldCheck, Truck, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { cartService } from '../services/cartService'
import { checkoutService } from '../services/checkoutService'
import { toast } from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [shipping, setShipping] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    transactionReference: '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const data = await cartService.getCart()
      setCart(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load cart for checkout.')
    } finally {
      setLoading(false)
    }
  }

  const items = cart?.items || cart?.cartItems || []
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || item.price || 0)), 0)
  const tax = +(subtotal * 0.12).toFixed(2)
  const shippingFee = items.length ? 99 : 0
  const total = +(subtotal + tax + shippingFee).toFixed(2)

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value })
  }

  const handlePaymentChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const required = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phone']
    const missing = required.filter((field) => !shipping[field].trim())
    if (missing.length) {
      toast.error('Please complete all shipping fields.')
      return false
    }

    if (paymentMethod === 'Credit Card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
        toast.error('Please enter valid card details for payment.')
        return false
      }
    }

    if (!items.length) {
      toast.error('Your cart is empty. Add product to continue.')
      return false
    }

    return true
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const payload = {
        shippingAddress: shipping,
        paymentMethod,
        paymentDetails,
      }

      const result = await checkoutService.checkout(payload)
      const createdOrderId = result?.orderId || result?.id || result?.order?.orderId
      toast.success('Checkout completed. Redirecting to order details...')
      setTimeout(() => {
        if (createdOrderId) {
          navigate(`/orders/${createdOrderId}`)
        } else {
          navigate('/orders')
        }
      }, 600)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Checkout failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card p-4 mb-4">
            <h2 className="fw-black mb-3 text-theme-title">Checkout</h2>
            <p className="text-theme-muted mb-4">Confirm your shipping details and payment information.</p>

            <form onSubmit={handleCheckout}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-theme-muted">Full Name</label>
                  <input
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-theme-muted">Phone Number</label>
                  <input
                    name="phone"
                    value={shipping.phone}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-theme-muted">Address Line 1</label>
                  <input
                    name="addressLine1"
                    value={shipping.addressLine1}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="House number, street"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-theme-muted">Address Line 2</label>
                  <input
                    name="addressLine2"
                    value={shipping.addressLine2}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="Apartment, suite, unit (optional)"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-theme-muted">City</label>
                  <input
                    name="city"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="Mumbai"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-theme-muted">State</label>
                  <input
                    name="state"
                    value={shipping.state}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="Maharashtra"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-theme-muted">Postal Code</label>
                  <input
                    name="postalCode"
                    value={shipping.postalCode}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="400001"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-theme-muted">Country</label>
                  <input
                    name="country"
                    value={shipping.country}
                    onChange={handleShippingChange}
                    className="form-control bb-input"
                    placeholder="India"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-accent" />
                  <h5 className="mb-0 text-theme-title">Payment Method</h5>
                </div>

                <div className="d-flex flex-column gap-3">
                  {['Credit Card', 'UPI', 'Net Banking'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      className={`btn text-start p-3 rounded-4 ${paymentMethod === method ? 'btn-glow' : 'btn-outline-secondary'}`}
                      style={{ minHeight: '72px' }}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-bold text-theme-title">{method}</h6>
                          <p className="small mb-0 text-theme-muted">Secure payment with smart validation.</p>
                        </div>
                        <span className="badge bg-secondary bg-opacity-15 text-theme-muted px-3 py-2 rounded-pill">Select</span>
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'Credit Card' && (
                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label text-theme-muted">Card Number</label>
                      <input
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                        className="form-control bb-input"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-theme-muted">Expiry</label>
                      <input
                        name="expiry"
                        value={paymentDetails.expiry}
                        onChange={handlePaymentChange}
                        className="form-control bb-input"
                        placeholder="12/28"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-theme-muted">CVV</label>
                      <input
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                        className="form-control bb-input"
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="form-label text-theme-muted">Transaction Reference</label>
                  <input
                    name="transactionReference"
                    value={paymentDetails.transactionReference}
                    onChange={handlePaymentChange}
                    className="form-control bb-input"
                    placeholder="TXN1234ABCDE"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-glow w-100 py-3 mt-5 d-flex align-items-center justify-content-center gap-2"
                disabled={submitting || loading}
                style={{ borderRadius: '14px' }}
              >
                {submitting ? 'Processing Order...' : 'Place Order Now'} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="rounded-4 p-3" style={{ background: 'rgba(0, 243, 255, 0.08)' }}>
                <CreditCard size={24} className="text-accent" />
              </div>
              <div>
                <h5 className="fw-bold mb-1 text-theme-title">Order Summary</h5>
                <p className="small text-theme-muted mb-0">Verify totals before you checkout.</p>
              </div>
            </div>

            <div className="mb-3">
              {items.map((item) => (
                <div key={item.cartItemId || item.id} className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1 text-theme-title fw-semibold">{item.productName || item.name || 'Product'}</p>
                    <p className="small text-theme-muted mb-0">Qty {item.quantity}</p>
                  </div>
                  <p className="mb-0 text-theme-title">₹{((item.quantity || 0) * (item.unitPrice || item.price || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-top border-secondary pt-3">
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Shipping</span>
                <span>₹{shippingFee.toFixed(2)}</span>
              </div>
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total</span>
                <span className="fs-5 fw-black">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-4 p-3" style={{ background: 'rgba(168, 32, 255, 0.1)' }}>
                <Truck size={24} className="text-primary" />
              </div>
              <div>
                <h6 className="fw-bold text-theme-title mb-1">Fast Shipping</h6>
                <p className="small text-theme-muted mb-0">Orders are verified and prepared for dispatch immediately.</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-4 p-3" style={{ background: 'rgba(0, 243, 255, 0.08)' }}>
                <CheckCircle size={24} className="text-info" />
              </div>
              <div>
                <h6 className="fw-bold text-theme-title mb-1">Secure Payment</h6>
                <p className="small text-theme-muted mb-0">A trusted mock payment gateway for instant success/failure response.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
