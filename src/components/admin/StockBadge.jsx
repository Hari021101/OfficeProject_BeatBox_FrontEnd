export default function StockBadge({ stock }) {
  const getStatus = (count) => {
    if (count <= 0) return { label: 'Out of Stock', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' }
    if (count <= 5) return { label: 'Low Stock', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
    return { label: 'In Stock', color: '#39ff14', bg: 'rgba(57,255,20,0.1)' }
  }

  const status = getStatus(stock)

  return (
    <span 
      className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2"
      style={{ 
        background: status.bg, 
        color: status.color, 
        border: `1px solid currentColor`,
        fontWeight: 'bold',
        fontSize: '0.75rem'
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
      {status.label} ({stock})
    </span>
  )
}
