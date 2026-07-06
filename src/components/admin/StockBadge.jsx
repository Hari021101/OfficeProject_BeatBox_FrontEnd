export default function StockBadge({ stock }) {
  const getBadgeClass = (count) => {
    if (count <= 0) return { label: 'Out of Stock', className: 'bb-badge-danger' }
    if (count <= 5) return { label: 'Low Stock', className: 'bb-badge-warning' }
    return { label: 'In Stock', className: 'bb-badge-success' }
  }

  const status = getBadgeClass(stock)

  return (
    <span className={status.className}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
      {status.label} ({stock})
    </span>
  )
}
