import { motion } from 'framer-motion'
import {
  ShoppingBag,
  CreditCard,
  Settings2,
  Truck,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react'

// ─── Order status → step progress mapping ───────────────────────────────────
const STATUS_STEP_MAP = {
  Pending: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: -1,
}

const STEPS = [
  {
    id: 1,
    label: 'Order Placed',
    sublabel: 'Confirmed',
    Icon: ShoppingBag,
    color: '#00f3ff',
  },
  {
    id: 2,
    label: 'Processing',
    sublabel: 'Being Prepared',
    Icon: Settings2,
    color: '#a820ff',
  },
  {
    id: 3,
    label: 'Shipped',
    sublabel: 'On the Way',
    Icon: Truck,
    color: '#00f3ff',
  },
  {
    id: 4,
    label: 'Delivered',
    sublabel: 'Complete',
    Icon: PackageCheck,
    color: '#39ff14',
  },
]

// Derive date labels from order — show actual dates for completed steps
function getStepDate(stepId, currentStep, orderDate) {
  if (currentStep === -1) return null // cancelled
  if (stepId > currentStep) return null
  if (!orderDate) return null
  const base = new Date(orderDate)
  const offsets = { 1: 0, 2: 1, 3: 2, 4: 5 } // days after order placed
  const d = new Date(base)
  d.setDate(d.getDate() + (offsets[stepId] || 0))
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function OrderTimeline({ status = 'Pending', orderDate }) {
  const currentStep = STATUS_STEP_MAP[status] ?? 1
  const isCancelled = status === 'Cancelled'

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18 } },
  }

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  }

  const lineVariants = {
    hidden: { scaleX: 0, originX: 0 },
    show: { scaleX: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const lineVariantsV = {
    hidden: { scaleY: 0, originY: 0 },
    show: { scaleY: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  // ── Cancelled banner ──────────────────────────────────────────────────────
  if (isCancelled) {
    return (
      <div
        className="p-4 rounded-4 text-center"
        style={{
          background: 'rgba(255,50,50,0.06)',
          border: '1px solid rgba(255,50,50,0.25)',
        }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: 64,
            height: 64,
            background: 'rgba(255,50,50,0.15)',
            border: '2px solid rgba(255,50,50,0.4)',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>✕</span>
        </div>
        <h6 className="fw-black text-danger mb-1">Order Cancelled</h6>
        <p className="text-theme-muted small mb-0">
          This order has been cancelled. If you were charged, a refund will be processed within 5–7 business days.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ── DESKTOP: Horizontal timeline (≥992px) ───────────────────────── */}
      <div className="d-none d-lg-block">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="d-flex align-items-flex-start justify-content-between position-relative"
          style={{ paddingTop: 8 }}
        >
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            const isPending = currentStep < step.id
            const stepDate = getStepDate(step.id, currentStep, orderDate)
            const isLast = idx === STEPS.length - 1

            return (
              <div key={step.id} className="d-flex align-items-flex-start flex-grow-1 position-relative">
                {/* Step node + label */}
                <div className="d-flex flex-column align-items-center" style={{ minWidth: 90, position: 'relative', zIndex: 2 }}>
                  <motion.div variants={nodeVariants}>
                    {/* Circle */}
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-2 position-relative"
                      style={{
                        width: 52,
                        height: 52,
                        background: isCompleted
                          ? 'linear-gradient(135deg, #a820ff, #00f3ff)'
                          : isActive
                          ? `radial-gradient(circle, ${step.color}33, ${step.color}11)`
                          : 'var(--bb-surface-2)',
                        border: isCompleted
                          ? 'none'
                          : isActive
                          ? `2px solid ${step.color}`
                          : '2px solid var(--bb-border)',
                        boxShadow: isActive
                          ? `0 0 20px ${step.color}60, 0 0 40px ${step.color}30`
                          : isCompleted
                          ? '0 0 15px rgba(168,32,255,0.4)'
                          : 'none',
                        transition: 'all 0.4s ease',
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={22} color="#fff" />
                      ) : (
                        <step.Icon
                          size={20}
                          color={isActive ? step.color : 'var(--bb-muted)'}
                        />
                      )}
                      {/* Active pulse ring */}
                      {isActive && (
                        <span
                          className="position-absolute rounded-circle"
                          style={{
                            inset: -6,
                            border: `1.5px solid ${step.color}`,
                            animation: 'orderPulse 2s ease-in-out infinite',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </div>
                    {/* Label */}
                    <p
                      className="fw-bold mb-0 text-center"
                      style={{
                        fontSize: '0.78rem',
                        color: isCompleted || isActive ? 'var(--bb-title-color)' : 'var(--bb-muted)',
                      }}
                    >
                      {step.label}
                    </p>
                    <p
                      className="mb-0 text-center"
                      style={{
                        fontSize: '0.68rem',
                        color: isActive ? step.color : 'var(--bb-muted)',
                        fontWeight: isActive ? 700 : 400,
                        minHeight: 16,
                      }}
                    >
                      {stepDate || step.sublabel}
                    </p>
                  </motion.div>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    className="flex-grow-1 position-relative"
                    style={{ marginTop: 25, height: 2, background: 'var(--bb-border)', zIndex: 1 }}
                  >
                    {isCompleted && (
                      <motion.div
                        variants={lineVariants}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, #a820ff, #00f3ff)',
                          boxShadow: '0 0 8px rgba(0,243,255,0.4)',
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* ── MOBILE: Vertical timeline (<992px) ──────────────────────────── */}
      <div className="d-lg-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="d-flex flex-column gap-0"
        >
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            const stepDate = getStepDate(step.id, currentStep, orderDate)
            const isLast = idx === STEPS.length - 1

            return (
              <motion.div key={step.id} variants={nodeVariants} className="d-flex gap-3">
                {/* Left: node + vertical line */}
                <div className="d-flex flex-column align-items-center" style={{ width: 44 }}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 position-relative"
                    style={{
                      width: 44,
                      height: 44,
                      background: isCompleted
                        ? 'linear-gradient(135deg, #a820ff, #00f3ff)'
                        : isActive
                        ? `radial-gradient(circle, ${step.color}33, ${step.color}11)`
                        : 'var(--bb-surface-2)',
                      border: isCompleted
                        ? 'none'
                        : isActive
                        ? `2px solid ${step.color}`
                        : '2px solid var(--bb-border)',
                      boxShadow: isActive ? `0 0 16px ${step.color}60` : 'none',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="#fff" />
                    ) : (
                      <step.Icon size={16} color={isActive ? step.color : 'var(--bb-muted)'} />
                    )}
                    {isActive && (
                      <span
                        className="position-absolute rounded-circle"
                        style={{
                          inset: -5,
                          border: `1.5px solid ${step.color}`,
                          animation: 'orderPulse 2s ease-in-out infinite',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </div>
                  {/* Vertical connector */}
                  {!isLast && (
                    <div
                      style={{
                        width: 2,
                        flexGrow: 1,
                        minHeight: 32,
                        background: 'var(--bb-border)',
                        position: 'relative',
                        margin: '4px 0',
                      }}
                    >
                      {isCompleted && (
                        <motion.div
                          variants={lineVariantsV}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, #a820ff, #00f3ff)',
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Right: text */}
                <div className="pb-4 pt-1">
                  <p
                    className="fw-bold mb-0"
                    style={{
                      fontSize: '0.88rem',
                      color: isCompleted || isActive ? 'var(--bb-title-color)' : 'var(--bb-muted)',
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="mb-0"
                    style={{
                      fontSize: '0.75rem',
                      color: isActive ? step.color : 'var(--bb-muted)',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {stepDate || step.sublabel}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </>
  )
}
