import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatWidget({ title, value, trend, isPositive, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card border-0 h-100 p-4"
      style={{
        background: 'var(--bb-surface)',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <p className="text-theme-muted fw-bold mb-1" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </p>
          <h3 className="fw-black text-theme-title mb-0">{value}</h3>
        </div>
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{ width: '48px', height: '48px', background: 'rgba(0, 243, 255, 0.1)', color: 'var(--bb-accent)' }}
        >
          <Icon size={24} />
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 mt-auto pt-3 border-top border-secondary border-opacity-25">
        {trend !== null ? (
          <>
            <span
              className={`d-flex align-items-center fw-bold ${isPositive ? 'text-success' : 'text-danger'
                }`}
              style={{ fontSize: '0.85rem' }}
            >
              {isPositive ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {trend}
            </span>

            <span
              className="text-theme-muted"
              style={{ fontSize: '0.8rem' }}
            >
              vs last month
            </span>
          </>
        ) : (
          <span
            className="text-theme-muted"
            style={{ fontSize: '0.8rem' }}
          >
            Trend data unavailable
          </span>
        )}
      </div>
    </motion.div>
  )
}
