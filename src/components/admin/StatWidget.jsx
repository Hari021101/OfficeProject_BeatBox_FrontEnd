import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatWidget({ title, value, trend, isPositive, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card border-0 h-100"
      style={{
        background: 'var(--bb-surface)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        padding: 'clamp(12px, 2.5vw, 20px)'
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2 mb-md-3">
        <div style={{ minWidth: 0 }}>
          <p className="text-theme-muted fw-bold mb-1 text-truncate" style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {title}
          </p>
          <h3 className="fw-black text-theme-title mb-0 text-truncate" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.5rem)' }}>
            {value}
          </h3>
        </div>
        <div
          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 ms-2"
          style={{ width: 'clamp(36px, 6vw, 48px)', height: 'clamp(36px, 6vw, 48px)', background: 'rgba(0, 243, 255, 0.1)', color: 'var(--bb-accent)' }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 pt-2 border-top border-secondary border-opacity-25">
        {trend !== null ? (
          <>
            <span
              className={`d-flex align-items-center fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}
              style={{ fontSize: 'clamp(0.72rem, 1.5vw, 0.85rem)' }}
            >
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trend}
            </span>
            <span className="text-theme-muted d-none d-md-inline" style={{ fontSize: '0.78rem' }}>
              vs last month
            </span>
          </>
        ) : (
          <span className="text-theme-muted" style={{ fontSize: '0.75rem' }}>
            No trend data
          </span>
        )}
      </div>
    </motion.div>
  )
}
