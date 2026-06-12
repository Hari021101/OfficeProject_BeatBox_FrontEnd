import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowLeft, ShoppingCart, Scale, Battery, Bluetooth, Volume2, ShieldCheck, Gamepad2, Mic } from 'lucide-react'
import { selectCompareItems, removeFromCompare, clearCompare } from '../redux/compareSlice'
import { addToCart } from '../redux/cartSlice'
import { IMAGE_MAP } from '../data/products'

export default function Compare() {
  const items = useSelector(selectCompareItems)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="container-fluid min-vh-100 py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ background: 'var(--bb-bg-navy)' }}>
        <div className="p-4 rounded-circle mb-4" style={{ background: 'rgba(0, 243, 255, 0.05)', color: 'var(--bb-accent)' }}>
          <Scale size={64} />
        </div>
        <h2 className="fw-black text-theme-title mb-3">Compare Engine is Empty</h2>
        <p className="text-theme-muted mb-4">Add some products to compare their specs side-by-side.</p>
        <Link to="/products" className="btn btn-glow px-5 py-3 fw-bold rounded-pill">
          Browse Products
        </Link>
      </div>
    )
  }

  // Find the "winner" for certain specs to highlight
  const highestBattery = Math.max(...items.map(i => parseInt(i.batteryLife) || 0))
  const lowestPrice = Math.min(...items.map(i => i.price))
  const highestRating = Math.max(...items.map(i => i.rating || 0))

  return (
    <div className="container-fluid min-vh-100 py-5" style={{ background: 'var(--bb-bg-navy)' }}>
      {/* Background glow */}
      <div className="position-absolute top-0 start-50 translate-middle-x pointer-events-none" style={{ zIndex: 0, opacity: 0.5 }}>
        <div className="bg-glow-orb" style={{ width: 800, height: 400, background: 'var(--bb-primary-glow)', filter: 'blur(150px)' }} />
      </div>

      <div className="container position-relative" style={{ zIndex: 10 }}>
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-3">
          <div>
            <button onClick={() => navigate(-1)} className="btn btn-link text-theme-muted p-0 text-decoration-none d-flex align-items-center gap-2 mb-2 hover-text-accent">
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="display-5 fw-black text-theme-title mb-0" style={{ letterSpacing: '-1px' }}>
              Product <span className="gradient-text">Comparison</span>
            </h1>
          </div>
          <div>
            <button onClick={() => dispatch(clearCompare())} className="btn btn-outline-danger rounded-pill fw-bold px-4 py-2">
              Clear All
            </button>
          </div>
        </div>

        {/* Main Table Wrapper */}
        <div className="table-responsive rounded-4 overflow-hidden" style={{ border: '1px solid var(--bb-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <table className="table table-borderless mb-0 align-middle" style={{ background: 'var(--bb-surface)' }}>
            
            {/* Headers / Images */}
            <thead style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bb-surface-2)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--bb-border)' }}>
              <tr>
                <th className="p-4" style={{ width: '20%', minWidth: '150px', background: 'var(--bb-surface-2)' }}>
                  <h5 className="fw-bold text-theme-muted mb-0">Specs</h5>
                </th>
                {items.map(item => {
                  const img = (item.imageUrl && item.imageUrl.startsWith('http')) ? item.imageUrl : IMAGE_MAP[item.imageKey] || IMAGE_MAP['heroHeadphones']
                  return (
                    <th key={item.id} className="p-4 text-center position-relative" style={{ width: `${80/items.length}%`, minWidth: '250px', color: 'var(--bb-text)' }}>
                      <button 
                        onClick={() => dispatch(removeFromCompare(item.id))}
                        className="btn position-absolute top-0 end-0 m-2 p-1 rounded-circle bg-danger text-white border-0 hover-scale"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <X size={14} className="position-absolute top-50 start-50 translate-middle" />
                      </button>
                      
                      <div className="rounded-3 p-3 mb-3 d-flex align-items-center justify-content-center" style={{ height: '160px', border: '1px solid var(--bb-border)', background: 'var(--bb-surface)' }}>
                        <img src={img} alt={item.name} className="img-fluid" style={{ maxHeight: '130px', objectFit: 'contain' }} />
                      </div>
                      
                      <h5 className="fw-bold text-theme-title mb-2">{item.name}</h5>
                      <div className="d-flex align-items-baseline justify-content-center gap-2 mb-3">
                        <span className="fs-4 fw-black text-accent">₹{item.price.toLocaleString()}</span>
                        {item.oldPrice > item.price && (
                          <span className="text-decoration-line-through text-theme-muted small">₹{item.oldPrice.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => dispatch(addToCart({ ...item, quantity: 1, selectedColor: item.color || 'Black', selectedColorCode: '#000' }))}
                        className="btn btn-glow w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 text-white"
                        style={{ borderRadius: '10px' }}
                      >
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                    </th>
                  )
                })}
                
                {/* Empty columns if < 3 items */}
                {[...Array(3 - items.length)].map((_, i) => (
                  <th key={`empty-${i}`} className="p-4 text-center align-middle" style={{ width: `${80/items.length}%`, minWidth: '250px', borderLeft: '1px dashed var(--bb-border)', background: 'var(--bb-surface)' }}>
                    <div className="d-flex flex-column align-items-center opacity-50">
                      <Scale size={48} className="mb-3 text-theme-muted" />
                      <p className="fw-bold text-theme-muted">Add another product<br/>to compare</p>
                      <Link to="/products" className="btn btn-outline-secondary rounded-pill btn-sm px-3" style={{ color: 'var(--bb-text)', borderColor: 'var(--bb-border)' }}>Browse</Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price Row */}
              <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                <td className="p-4 fw-bold text-theme-muted" style={{ background: 'var(--bb-surface-2)' }}><ShoppingCart size={16} className="me-2 d-none d-md-inline"/> Price Value</td>
                {items.map(item => (
                  <td key={`price-${item.id}`} className="p-4 text-center" style={{ color: 'var(--bb-text)' }}>
                    <span className={`badge ${item.price === lowestPrice ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-25' : 'bg-transparent text-theme-title'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                      ₹{item.price.toLocaleString()}
                    </span>
                  </td>
                ))}
                {[...Array(3 - items.length)].map((_, i) => <td key={`emp-pr-${i}`}></td>)}
              </tr>

              {/* Battery Life Row */}
              <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                <td className="p-4 fw-bold text-theme-muted" style={{ background: 'var(--bb-surface-2)' }}><Battery size={16} className="me-2 d-none d-md-inline"/> Battery Life</td>
                {items.map(item => {
                  const val = parseInt(item.batteryLife) || 0;
                  const isWinner = val === highestBattery && val > 0;
                  return (
                    <td key={`batt-${item.id}`} className="p-4 text-center" style={{ color: 'var(--bb-text)' }}>
                      <span className={`fw-bold ${isWinner ? 'text-primary' : 'text-theme-title'}`}>
                        {item.batteryLife || 'N/A'}
                        {isWinner && <Check size={14} className="ms-2 text-primary" />}
                      </span>
                    </td>
                  )
                })}
                {[...Array(3 - items.length)].map((_, i) => <td key={`emp-bt-${i}`}></td>)}
              </tr>

              {/* Rating Row */}
              <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                <td className="p-4 fw-bold text-theme-muted" style={{ background: 'var(--bb-surface-2)' }}><ShieldCheck size={16} className="me-2 d-none d-md-inline"/> Rating</td>
                {items.map(item => {
                  const isWinner = item.rating === highestRating && item.rating > 0;
                  return (
                    <td key={`rat-${item.id}`} className="p-4 text-center" style={{ color: 'var(--bb-text)' }}>
                      <span className={`fw-bold ${isWinner ? 'text-warning' : 'text-theme-title'}`}>
                        ⭐ {item.rating || 'N/A'}
                      </span>
                    </td>
                  )
                })}
                {[...Array(3 - items.length)].map((_, i) => <td key={`emp-rt-${i}`}></td>)}
              </tr>

              {/* Connectivity Row */}
              <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                <td className="p-4 fw-bold text-theme-muted" style={{ background: 'var(--bb-surface-2)' }}><Bluetooth size={16} className="me-2 d-none d-md-inline"/> Connectivity</td>
                {items.map(item => {
                  let conn = item.connectivity;
                  if (!conn) {
                    const text = `${item.name} ${item.category}`.toLowerCase();
                    conn = (text.includes('wired') || text.includes('cable') || text.includes('usb')) 
                           ? 'Wired' 
                           : 'Wireless / Bluetooth';
                  }
                  return (
                    <td key={`conn-${item.id}`} className="p-4 text-center fw-bold text-theme-title">
                      {conn}
                    </td>
                  )
                })}
                {[...Array(3 - items.length)].map((_, i) => <td key={`emp-cn-${i}`}></td>)}
              </tr>

              {/* Category */}
              <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                <td className="p-4 fw-bold text-theme-muted" style={{ background: 'var(--bb-surface-2)' }}><Volume2 size={16} className="me-2 d-none d-md-inline"/> Category</td>
                {items.map(item => (
                  <td key={`cat-${item.id}`} className="p-4 text-center text-theme-muted">
                    {item.category || 'Audio Device'}
                  </td>
                ))}
                {[...Array(3 - items.length)].map((_, i) => <td key={`emp-ct-${i}`}></td>)}
              </tr>

              {/* Description */}
              <tr>
                <td className="p-4 fw-bold text-theme-muted" style={{ background: 'var(--bb-surface-2)' }}>Overview</td>
                {items.map(item => (
                  <td key={`desc-${item.id}`} className="p-4 text-center text-theme-muted small" style={{ lineHeight: '1.6' }}>
                    {item.description}
                  </td>
                ))}
                {[...Array(3 - items.length)].map((_, i) => <td key={`emp-ds-${i}`}></td>)}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
