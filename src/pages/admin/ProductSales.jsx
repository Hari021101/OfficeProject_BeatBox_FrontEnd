import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, ShoppingBag, ArrowLeft, RefreshCw, IndianRupee } from 'lucide-react'
import adminService from '../../services/adminService'
import DataTable from '../../components/admin/DataTable'
import StatWidget from '../../components/admin/StatWidget'
import { toast } from 'react-hot-toast'
import { IMAGE_MAP } from '../../data/products'
import { getImageUrl } from '../../config/api'

// Derive a local image key fallback when database URL is absent or invalid
const mapImageKey = (url = '', name = '') => {
  const text = `${url} ${name}`.toLowerCase()
  if (text.includes('party boom 1500')) return 'partyBoom1500'
  if (text.includes('party lite wireless')) return 'partyLiteWireless'
  if (text.includes('party blast tower') || text.includes('party blast')) return 'partyBlastTower'
  if (text.includes('soundbar mini 2.1')) return 'soundbarMini21'
  if (text.includes('soundbar elite s9')) return 'soundbarEliteS9'
  if (text.includes('cinema pro')) return 'cinemaProSoundbar'
  if (text.includes('gaming soundbar x')) return 'gamingSoundbarX'
  if (text.includes('soundbar pro 5.1')) return 'soundbarPro51'
  if (text.includes('soundbar 2.1')) return 'soundbar21'
  if (text.includes('quantum 100')) return 'heroHeadphones'
  if (text.includes('airdopes 131') || text.includes('airdopes')) return 'heroEarbuds'
  if (text.includes('bassheads 225') || text.includes('bassheads')) return 'heroEarbuds'
  if (text.includes('rockerz 550') || text.includes('rockerz')) return 'heroHeadphones'
  if (text.includes('earbud') || text.includes('tws') || text.includes('earphone')) return 'heroEarbuds'
  if (text.includes('speaker') || text.includes('stone') || text.includes('grenade') || text.includes('capsule sound')) return 'heroSpeaker'
  if (text.includes('gaming') || text.includes('immortal') || text.includes('headset')) return 'gamingHeadset'
  if (text.includes('neckband') || text.includes('collar') || text.includes('trip') || text.includes('rockerz club')) return 'wirelessNeckband'
  if (text.includes('smart') || text.includes('capsule') || text.includes('storm')) return 'smartEarbuds'
  return 'heroHeadphones'
}

const resolveProductImage = (imageUrl, name) => {
  if (imageUrl) {
    return getImageUrl(imageUrl)
  }
  const key = mapImageKey('', name)
  return IMAGE_MAP[key] || IMAGE_MAP.heroHeadphones
}

export default function ProductSales() {
  const navigate = useNavigate()
  const [salesReport, setSalesReport] = useState([])
  const [metrics, setMetrics] = useState({
    currentMonthRevenue: 0,
    previousMonthRevenue: 0,
    revenueChangePercent: 0,
    currentMonthUnitsSold: 0,
    previousMonthUnitsSold: 0,
    unitsChangePercent: 0,
    currentMonthOrders: 0,
    previousMonthOrders: 0,
    ordersChangePercent: 0,
    currentMonthActiveProducts: 0,
    previousMonthActiveProducts: 0,
    activeProductsChangePercent: 0,
    totalProductsCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchSalesReport = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getProductSalesReport()
      if (data) {
        setSalesReport(data.products || [])
        if (data.metrics) {
          setMetrics(data.metrics)
        }
      }
    } catch (err) {
      console.error('Failed to load product sales report:', err)
      toast.error('Failed to load product sales report')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesReport()
  }, [])

  // Overall calculations across all time
  const totalUnits = salesReport.reduce((acc, item) => acc + (item.unitsSold || 0), 0)
  const totalRevenue = salesReport.reduce((acc, item) => acc + (item.revenue || 0), 0)
  const totalOrders = salesReport.reduce((acc, item) => acc + (item.orderCount || 0), 0)
  const activeProducts = salesReport.filter(item => (item.unitsSold || 0) > 0).length

  // Return formatted percentage without appending "vs last month" because StatWidget already appends it
  const formatTrendLabel = (current, previous, percent) => {
    if (previous === 0) {
      if (current > 0) return 'New this month'
      return '0%'
    }
    const val = Number(percent || 0)
    return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`
  }

  const columns = [
    {
      key: 'productName',
      label: 'Product',
      sortable: true,
      render: (row) => (
        <div className="d-flex align-items-center gap-3">
          <img
            src={resolveProductImage(row.imageUrl, row.productName)}
            alt={row.productName}
            className="rounded-3 flex-shrink-0"
            style={{ width: '40px', height: '40px', objectFit: 'cover', background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
            onError={(e) => {
              const fallbackKey = mapImageKey('', row.productName)
              e.currentTarget.src = IMAGE_MAP[fallbackKey] || IMAGE_MAP.heroHeadphones
            }}
          />
          <div>
            <div className="fw-bold text-theme-title" style={{ fontSize: '0.9rem' }}>
              {row.productName}
            </div>
            <div className="text-theme-muted" style={{ fontSize: '0.78rem' }}>
              {row.categoryName || 'Uncategorized'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'categoryName',
      label: 'Category',
      sortable: true,
      render: (row) => (
        <span className="badge px-2.5 py-1 rounded-2" style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-muted)', border: '1px solid var(--bb-border)', fontSize: '0.78rem' }}>
          {row.categoryName || 'General'}
        </span>
      )
    },
    {
      key: 'unitsSold',
      label: 'Units Sold',
      sortable: true,
      render: (row) => (
        <span className="fw-black text-theme-title" style={{ fontSize: '0.95rem' }}>
          {Number(row.unitsSold || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'orderCount',
      label: 'Orders Count',
      sortable: true,
      render: (row) => (
        <span className="fw-bold text-theme-muted" style={{ fontSize: '0.9rem' }}>
          {Number(row.orderCount || 0).toLocaleString('en-IN')} orders
        </span>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (row) => (
        <span className="fw-black" style={{ color: 'var(--bb-accent)', fontSize: '0.95rem' }}>
          ₹{Number(row.revenue || 0).toLocaleString('en-IN')}
        </span>
      )
    }
  ]

  return (
    <div className="py-2">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <button
              className="btn btn-sm p-1 text-theme-muted hover-opacity border-0"
              style={{ background: 'transparent' }}
              onClick={() => navigate('/admin/dashboard')}
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="fw-black text-theme-title mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.7rem)' }}>
              Product Sales
            </h2>
          </div>
          <p className="text-theme-muted mb-0 ms-4 ps-2" style={{ fontSize: '0.875rem' }}>
            Sales performance across all products
          </p>
        </div>
        <button
          className="btn btn-sm text-theme-muted d-flex align-items-center gap-2 px-3 py-2 fw-bold rounded-3"
          style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
          onClick={fetchSalesReport}
          disabled={isLoading}
        >
          <RefreshCw size={15} className={isLoading ? 'spin-anim' : ''} /> Refresh Data
        </button>
      </div>

      {/* Metric Cards with Real MoM Analytics */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatWidget
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString('en-IN')}`}
            trend={formatTrendLabel(metrics.currentMonthRevenue, metrics.previousMonthRevenue, metrics.revenueChangePercent)}
            isPositive={Number(metrics.revenueChangePercent) >= 0}
            icon={IndianRupee}
            delay={0.1}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatWidget
            title="Units Sold"
            value={totalUnits.toLocaleString('en-IN')}
            trend={formatTrendLabel(metrics.currentMonthUnitsSold, metrics.previousMonthUnitsSold, metrics.unitsChangePercent)}
            isPositive={Number(metrics.unitsChangePercent) >= 0}
            icon={ShoppingBag}
            delay={0.2}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatWidget
            title="Total Orders"
            value={totalOrders.toLocaleString('en-IN')}
            trend={formatTrendLabel(metrics.currentMonthOrders, metrics.previousMonthOrders, metrics.ordersChangePercent)}
            isPositive={Number(metrics.ordersChangePercent) >= 0}
            icon={TrendingUp}
            delay={0.3}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatWidget
            title="Products with Sales"
            value={`${activeProducts} / ${salesReport.length}`}
            trend={formatTrendLabel(metrics.currentMonthActiveProducts, metrics.previousMonthActiveProducts, metrics.activeProductsChangePercent)}
            isPositive={Number(metrics.activeProductsChangePercent) >= 0}
            icon={ShoppingBag}
            delay={0.4}
          />
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={salesReport}
        searchPlaceholder="Search by product name or category..."
        searchableFields={['productName', 'categoryName']}
        loading={isLoading}
      />
    </div>
  )
}
