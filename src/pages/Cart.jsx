import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { cartService } from '../services/cartService'
import { toast } from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

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
      toast.error(error?.response?.data?.message || 'Unable to load cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const items = cart?.items || cart?.cartItems || []
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || item.price || 0)), 0)

  const handleQuantity = async (item, delta) => {
    const nextQuantity = item.quantity + delta
    if (nextQuantity < 1) return
    setSaving(true)
    try {
      await cartService.updateCartItem(item.cartItemId || item.id, nextQuantity)
      toast.success('Cart updated successfully.')
      await fetchCart()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update quantity.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (cartItem) => {
    setSaving(true)
    try {
      await cartService.removeFromCart(cartItem.cartItemId || cartItem.id)
      toast.success('Item removed from cart.')
      await fetchCart()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to remove item.')
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async () => {
    setSaving(true)
    try {
      await cartService.clearCart()
      toast.success('Cart cleared successfully.')
      await fetchCart()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to clear cart.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-lg-row align-items-start justify-content-between gap-4 mb-4">
        <div>
          <h1 className="fw-black text-theme-title mb-2">My Cart</h1>
          <p className="text-theme-muted mb-0">Review your selected items before checkout.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/" className="btn btn-outline-secondary hover-scale" style={{ borderRadius: '12px' }}>
            Continue Shopping
          </Link>
          <button
            className="btn btn-danger text-white hover-scale"
            disabled={!items.length || saving}
            onClick={handleClear}
            style={{ borderRadius: '12px', minWidth: '160px' }}
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card p-4">
            {loading ? (
              <div className="py-5 text-center text-theme-muted">Loading your cart...</div>
            ) : !items.length ? (
              <div className="py-5 text-center">
                <p className="text-theme-muted mb-3">Your cart is empty right now.</p>
                <Link to="/" className="btn btn-glow px-4 py-2">
                  <ShoppingBag size={18} /> Browse Products
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 text-theme-title">
                  <thead>
                    <tr className="text-theme-muted small text-uppercase">
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total</th>
                      <th scope="col" className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.cartItemId || item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.image || item.productImage || 'https://via.placeholder.com/70'}
                              alt={item.productName || item.name || 'Product'}
                              className="rounded-3"
                              style={{ width: '70px', height: '70px', objectFit: 'cover', border: '1px solid var(--bb-border)' }}
                            />
                            <div>
                              <h6 className="mb-1 text-theme-title">{item.productName || item.name || 'Product Name'}</h6>
                              <p className="small text-theme-muted mb-0">{item.variant || item.category || 'Electronics'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-theme-muted">₹{(item.unitPrice || item.price || 0).toFixed(2)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              type="button"
                              disabled={saving || item.quantity <= 1}
                              onClick={() => handleQuantity(item, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 py-2 rounded-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              type="button"
                              disabled={saving}
                              onClick={() => handleQuantity(item, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="text-theme-title">₹{((item.quantity || 0) * (item.unitPrice || item.price || 0)).toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-pill"
                            disabled={saving}
                            onClick={() => handleRemove(item)}
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-3">Cart Summary</h5>
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-theme-muted">
                <span>Estimated tax</span>
                <span>₹{(subtotal * 0.12).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-theme-muted">
                <span>Shipping fee</span>
                <span>₹99.00</span>
              </div>
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-black fs-5">₹{(subtotal + subtotal * 0.12 + 99).toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn btn-glow w-100 py-3 d-flex align-items-center justify-content-center gap-2"
              type="button"
              disabled={!items.length || loading}
              onClick={() => navigate('/checkout')}
              style={{ borderRadius: '14px' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
