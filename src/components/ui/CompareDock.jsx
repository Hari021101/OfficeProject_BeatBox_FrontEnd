import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { X, Scale } from 'lucide-react'
import { selectCompareItems, removeFromCompare, clearCompare } from '../../redux/compareSlice'
import { IMAGE_MAP } from '../../data/products'

export default function CompareDock() {
  const items = useSelector(selectCompareItems)
  const dispatch = useDispatch()
  const location = useLocation()

  // Hide the dock if we are currently on the compare page
  if (location.pathname === '/compare') return null
  if (items.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="position-fixed bottom-0 start-50 translate-middle-x mb-4 z-3"
        style={{ width: '90%', maxWidth: '800px', zIndex: 1050 }}
      >
        <div 
          className="glass-card p-3 rounded-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 shadow-lg"
          style={{ 
            background: 'rgba(10, 13, 20, 0.95)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
            <div className="p-2 rounded-circle" style={{ background: 'rgba(0, 243, 255, 0.1)', color: 'var(--bb-accent)' }}>
              <Scale size={20} />
            </div>
            <div>
              <h6 className="fw-bold text-white mb-0" style={{ fontSize: '0.9rem' }}>Compare Products</h6>
              <span className="small text-muted">{items.length}/3 Selected</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {items.map((item, idx) => {
              const img = (item.imageUrl && item.imageUrl.startsWith('http')) ? item.imageUrl : IMAGE_MAP[item.imageKey] || IMAGE_MAP['heroHeadphones']
              return (
                <div key={item.id} className="position-relative bg-dark rounded-3 overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={img} alt={item.name} className="img-fluid" style={{ maxHeight: '40px', objectFit: 'contain' }} />
                  <button 
                    onClick={() => dispatch(removeFromCompare(item.id))}
                    className="position-absolute top-0 end-0 btn p-0 border-0 d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: '16px', height: '16px', background: 'rgba(255,0,0,0.8)', color: '#fff', transform: 'translate(25%, -25%)' }}
                  >
                    <X size={10} />
                  </button>
                </div>
              )
            })}
            
            {/* Empty slots placeholders */}
            {[...Array(3 - items.length)].map((_, i) => (
              <div key={`empty-${i}`} className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-muted small fw-bold">+</span>
              </div>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0 w-100 w-md-auto">
            <button 
              onClick={() => dispatch(clearCompare())} 
              className="btn btn-sm btn-outline-light flex-grow-1 flex-md-grow-0 fw-bold"
              style={{ borderRadius: '8px' }}
            >
              Clear
            </button>
            <Link 
              to="/compare" 
              className={`btn btn-sm btn-glow flex-grow-1 flex-md-grow-0 fw-bold px-4 ${items.length < 2 ? 'disabled' : ''}`}
              style={{ borderRadius: '8px' }}
            >
              Compare {items.length > 1 ? 'Now' : '(Need 2+)'}
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
