import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingDown,
  User,
  Plus,
  ArrowRight,
  Download,
  Calendar,
  FileText,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react'
import { orderService } from '../../services/orderService'
import adminService from '../../services/adminService'
import { productService } from '../../services/productService'
import StatWidget from '../../components/admin/StatWidget'
import ChartCard from '../../components/admin/ChartCard'
import DataTable from '../../components/admin/DataTable'
import { useSignalR } from '../../hooks/useSignalR'
import { toast } from 'react-hot-toast'

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Dashboard Analytics States
  const [stats, setStats] = useState({
    totalRevenue: 0, revenueTrend: 0,
    totalOrders: 0, ordersTrend: 0,
    activeUsers: 0, usersTrend: 0,
    conversionRate: 0, conversionTrend: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalInventoryItems: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    lowStockProducts: 0
  })
  
  const [revenueData, setRevenueData] = useState([])
  const [salesData, setSalesData] = useState([])
  const [productData, setProductData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [activities, setActivities] = useState([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(true)

  // Report Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportType, setReportType] = useState('Sales')
  const [dateRange, setDateRange] = useState('This Month')
  const [exportFormat, setExportFormat] = useState('CSV')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [generating, setGenerating] = useState(false)

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load summary metrics
      const analytics = await adminService.getDashboardAnalytics()
      setStats({
        totalRevenue: analytics.totalRevenue || 0,
        revenueTrend: analytics.revenueGrowthPercentage || 0,
        totalOrders: analytics.totalOrders || 0,
        ordersTrend: analytics.ordersGrowthPercentage || 0,
        activeUsers: analytics.totalCustomers || 0,
        usersTrend: analytics.customerGrowthPercentage || 0,
        conversionRate: analytics.conversionRate || 0,
        conversionTrend: null,
        totalProducts: analytics.totalProducts || 0,
        totalCategories: analytics.totalCategories || 0,
        totalInventoryItems: analytics.totalInventoryItems || 0,
        pendingOrders: analytics.pendingOrders || 0,
        processingOrders: analytics.processingOrders || 0,
        shippedOrders: analytics.shippedOrders || 0,
        deliveredOrders: analytics.deliveredOrders || 0,
        cancelledOrders: analytics.cancelledOrders || 0,
        lowStockProducts: analytics.lowStockProducts || 0
      })

      // Load revenue chart data
      const revenue = await adminService.getRevenueChart()
      setRevenueData(
        revenue.map(r => ({
          name: new Date(2026, r.month - 1).toLocaleString('default', { month: 'short' }),
          value: r.revenue
        }))
      )

      // Load sales chart data
      const sales = await adminService.getSalesChart()
      setSalesData(
        sales.map(s => ({
          name: new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          value: s.revenue
        }))
      )

      // Load top products
      const products = await adminService.getProductAnalytics()
      setProductData(
        products.topProducts.map(p => ({
          name: p.productName.length > 12 ? p.productName.substring(0, 12) + "..." : p.productName,
          value: p.unitsSold
        }))
      )

      // Load recent orders
      const orders = await orderService.getAllOrders()
      if (orders && orders.length > 0) {
        const sorted = [...orders].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 5)
        setRecentOrders(sorted)
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e)
      toast.error("Error loading dashboard metrics")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true)
      const logs = await adminService.getAuditLogs({ page: 1, pageSize: 5 })
      setActivities(logs || [])
    } catch (err) {
      console.error("Failed to load audit logs", err)
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
    fetchActivities()
  }, [])

  // Listen for real-time backend updates
  useSignalR('DashboardUpdated', (analytics) => {
    setStats(prev => ({
      ...prev,
      totalRevenue: analytics.totalRevenue || prev.totalRevenue,
      totalOrders: analytics.totalOrders || prev.totalOrders,
      activeUsers: analytics.totalCustomers || prev.activeUsers
    }))
    toast.success('Dashboard metrics updated in real-time! 🚀', {
      id: 'dashboard-live-update',
      style: { background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)', color: 'var(--bb-text)' }
    })
    fetchActivities() // Refresh timeline
  })

  // Date Range Filtering helper
  const filterByDateRange = (data, dateKey = 'createdDate') => {
    const now = new Date()
    const dateLimit = new Date()
    
    switch (dateRange) {
      case 'Today':
        dateLimit.setHours(0,0,0,0)
        break
      case 'Yesterday':
        dateLimit.setDate(now.getDate() - 1)
        dateLimit.setHours(0,0,0,0)
        const yesterdayEnd = new Date(dateLimit)
        yesterdayEnd.setHours(23,59,59,999)
        return data.filter(d => {
          const itemDate = new Date(d[dateKey])
          return itemDate >= dateLimit && itemDate <= yesterdayEnd
        })
      case 'Last 7 Days':
        dateLimit.setDate(now.getDate() - 7)
        break
      case 'Last 30 Days':
        dateLimit.setDate(now.getDate() - 30)
        break
      case 'This Month':
        dateLimit.setDate(1)
        dateLimit.setHours(0,0,0,0)
        break
      case 'Last Month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
        return data.filter(d => {
          const itemDate = new Date(d[dateKey])
          return itemDate >= lastMonth && itemDate <= lastMonthEnd
        })
      case 'This Year':
        dateLimit.setMonth(0, 1)
        dateLimit.setHours(0,0,0,0)
        break
      case 'Custom Range':
        const start = customStartDate ? new Date(customStartDate) : new Date(0)
        const end = customEndDate ? new Date(customEndDate) : new Date()
        end.setHours(23, 59, 59, 999)
        return data.filter(d => {
          const itemDate = new Date(d[dateKey])
          return itemDate >= start && itemDate <= end
        })
    }
    return data.filter(d => new Date(d[dateKey]) >= dateLimit)
  }

  // Report Generator Handler
  const handleDownloadReport = async (e) => {
    e.preventDefault()
    setGenerating(true)
    try {
      let reportData = []
      let headers = []
      let filename = `beatbox_report_${reportType.toLowerCase().replace(/ /g, '_')}_${dateRange.toLowerCase().replace(/ /g, '_')}`

      if (reportType === 'Sales' || reportType === 'Orders') {
        const ordersList = await orderService.getAllOrders()
        const filtered = filterByDateRange(ordersList, 'createdDate')
        reportData = filtered.map(o => ({
          'Order ID': o.orderId,
          'Customer': o.userId,
          'Total Amount': `₹${Number(o.totalAmount).toFixed(2)}`,
          'Status': o.status,
          'Date': new Date(o.createdDate).toLocaleDateString('en-IN')
        }))
        headers = ['Order ID', 'Customer', 'Total Amount', 'Status', 'Date']
      }
      else if (reportType === 'Revenue') {
        const revenue = await adminService.getRevenueChart()
        reportData = revenue.map(r => ({
          'Month': new Date(2026, r.month - 1).toLocaleString('default', { month: 'long' }),
          'Revenue': `₹${Number(r.revenue).toFixed(2)}`
        }))
        headers = ['Month', 'Revenue']
      }
      else if (reportType === 'Inventory') {
        const productsList = await productService.getAllProducts()
        reportData = productsList.map(p => ({
          'Product ID': p.id,
          'Product Name': p.name,
          'Category': p.categoryName || 'Uncategorized',
          'Stock Level': p.stockQuantity,
          'Price': `₹${Number(p.discountPrice || p.price).toFixed(2)}`
        }))
        headers = ['Product ID', 'Product Name', 'Category', 'Stock Level', 'Price']
      }
      else if (reportType === 'Customer') {
        const usersList = await adminService.getAllUsers()
        reportData = usersList.map(u => ({
          'Customer ID': u.id,
          'Name': u.name,
          'Email': u.email,
          'Role': u.role,
          'Join Date': new Date(u.joinDate).toLocaleDateString('en-IN')
        }))
        headers = ['Customer ID', 'Name', 'Email', 'Role', 'Join Date']
      }
      else if (reportType === 'Product Performance') {
        const productsAnalytics = await adminService.getProductAnalytics()
        reportData = productsAnalytics.topProducts.map(p => ({
          'Product ID': p.productId,
          'Product Name': p.productName,
          'Units Sold': p.unitsSold,
          'Revenue Generated': `₹${Number(p.revenue).toFixed(2)}`
        }))
        headers = ['Product ID', 'Product Name', 'Units Sold', 'Revenue Generated']
      }
      else if (reportType === 'Returns') {
        const returnsList = await adminService.getAllReturns()
        const filtered = filterByDateRange(returnsList, 'requestDate')
        reportData = filtered.map(r => ({
          'RMA ID': r.id,
          'Order ID': r.orderId,
          'Customer': r.customerName,
          'Product': r.productName,
          'Reason': r.reason,
          'Status': r.status,
          'Request Date': new Date(r.requestDate).toLocaleDateString('en-IN')
        }))
        headers = ['RMA ID', 'Order ID', 'Customer', 'Product', 'Reason', 'Status', 'Request Date']
      }
      else if (reportType === 'Coupon Usage') {
        const coupons = await productService.getActiveCoupons()
        reportData = coupons.map(c => ({
          'Coupon ID': c.id,
          'Code': c.code,
          'Discount Percent': `${c.discountPercent}%`,
          'Status': c.isActive ? 'Active' : 'Expired',
          'Expiry Date': new Date(c.expiryDate).toLocaleDateString('en-IN')
        }))
        headers = ['Coupon ID', 'Code', 'Discount Percent', 'Status', 'Expiry Date']
      }
      else if (reportType === 'Audit Log') {
        const logs = await adminService.getAuditLogs({ pageSize: 100 })
        const filtered = filterByDateRange(logs, 'timestamp')
        reportData = filtered.map(l => ({
          'Action': l.action,
          'Target': l.target,
          'Admin Name': l.adminName,
          'Details': l.details,
          'Date/Time': new Date(l.timestamp).toLocaleString('en-IN')
        }))
        headers = ['Action', 'Target', 'Admin Name', 'Details', 'Date/Time']
      }

      if (reportData.length === 0) {
        toast.error('No data found for the selected parameters.')
        setGenerating(false)
        return
      }

      if (exportFormat === 'CSV') {
        const csvRows = [
          headers.join(','),
          ...reportData.map(row => 
            headers.map(f => `"${('' + (row[f] ?? '')).replace(/"/g, '""')}"`).join(',')
          )
        ]
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${filename}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('CSV Report downloaded! 📊')
      }
      else if (exportFormat === 'Excel') {
        const tsvRows = [
          headers.join('\t'),
          ...reportData.map(row => 
            headers.map(f => ('' + (row[f] ?? '')).replace(/\t/g, ' ')).join('\t')
          )
        ]
        const blob = new Blob([tsvRows.join('\n')], { type: 'application/vnd.ms-excel;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${filename}.xls`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Excel Report downloaded! 📈')
      }
      else if (exportFormat === 'PDF') {
        const printWindow = window.open('', '_blank')
        if (!printWindow) {
          toast.error('Please allow popups to generate PDF reports')
          setGenerating(false)
          return
        }

        const htmlContent = `
          <html>
            <head>
              <title>${reportType} Report</title>
              <style>
                body { font-family: system-ui, sans-serif; color: #0b0f19; padding: 40px; }
                .header { border-bottom: 2px solid #820df2; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 22px; font-weight: 900; color: #060b19; }
                .logo span { color: #820df2; }
                .title { font-size: 26px; font-weight: 800; margin: 10px 0; }
                .meta { font-size: 13px; color: #5e6b7e; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #f1f5f9; color: #0b0f19; font-weight: bold; text-align: left; padding: 10px; font-size: 12px; border-bottom: 2px solid #e2e8f0; }
                td { padding: 10px; font-size: 12px; border-bottom: 1px solid #e2e8f0; }
                tr:nth-child(even) { background: #f8fafc; }
                .footer { margin-top: 40px; font-size: 11px; color: #5e6b7e; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">BEAT<span>BOX</span> PARTNER PORTAL</div>
                <div class="title">${reportType} Business Report</div>
                <div class="meta">Generated: ${new Date().toLocaleString('en-IN')} | Filter Scope: ${dateRange}</div>
              </div>
              <table>
                <thead>
                  <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${reportData.map(row => `
                    <tr>
                      ${headers.map(h => `<td>${row[h] ?? '-'}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="footer">
                Confidential Document — BeatBox Lifestyle Internal Systems.
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                }
              </script>
            </body>
          </html>
        `
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        toast.success('PDF Report generated! 📄')
      }
      setIsReportModalOpen(false)
    } catch (err) {
      console.error(err)
      toast.error('Failed to compile report data.')
    } finally {
      setGenerating(false)
    }
  }

  const orderColumns = [
    { key: 'orderId', label: 'Order ID', render: (row) => <span className="fw-bold text-theme-title">#{row.orderId.toString().substring(0, 8)}...</span> },
    { key: 'userId', label: 'Customer', render: (row) => <span className="d-inline-block text-truncate text-theme-muted" style={{ maxWidth: '120px', fontSize: '0.9rem' }}>{row.userId}</span> },
    { key: 'createdDate', label: 'Date', render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.9rem' }}>{new Date(row.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span> },
    { key: 'totalAmount', label: 'Amount', render: (row) => <span className="fw-black text-theme-title">₹{Number(row.totalAmount).toLocaleString('en-IN')}</span> },
    {
      key: 'status', label: 'Status', render: (row) => {
        let className = 'bb-badge-warning';
        if (row.status === 'Processing') className = 'bb-badge-info';
        if (row.status === 'Shipped') className = 'bb-badge-info';
        if (row.status === 'Delivered') className = 'bb-badge-success';
        if (row.status === 'Cancelled') className = 'bb-badge-danger';
        
        return (
          <span className={className}>
            {row.status}
          </span>
        )
      }
    }
  ]

  return (
    <div className="py-2">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.7rem)' }}>Dashboard Overview</h2>
          <p className="text-theme-muted mb-0" style={{ fontSize: '0.875rem' }}>Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <button className="btn btn-glow d-flex align-items-center gap-2 px-4 py-2 fw-bold" style={{ borderRadius: '10px' }}>
          <Activity size={18} /> Generate Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <StatWidget title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} trend={`${stats.revenueTrend >= 0 ? '+' : ''}${stats.revenueTrend}%`} isPositive={stats.revenueTrend >= 0} icon={IndianRupee} delay={0.1} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatWidget title="Total Orders" value={stats.totalOrders.toLocaleString('en-IN')} trend={`${stats.ordersTrend >= 0 ? '+' : ''}${stats.ordersTrend}%`} isPositive={stats.ordersTrend >= 0} icon={ShoppingCart} delay={0.2} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatWidget title="Active Users" value={stats.activeUsers.toLocaleString('en-IN')} trend={`${stats.usersTrend >= 0 ? '+' : ''}${stats.usersTrend}%`} isPositive={stats.usersTrend >= 0} icon={Users} delay={0.3} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatWidget title="Conversion Rate" value={`${stats.conversionRate}%`} trend={`${stats.conversionTrend >= 0 ? '+' : ''}${stats.conversionTrend}%`} isPositive={stats.conversionTrend >= 0} icon={TrendingUp} delay={0.4} />
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-8">
          <ChartCard title="Revenue Overview (This Year)" data={revenueData} type="line" dataKey="value" colors={['#00f3ff']} height={260} />
        </div>
        <div className="col-12 col-xl-4">
          <ChartCard title="Product Distribution" data={productData} type="pie" dataKey="value" colors={[
            '#00f3ff',
            '#a820ff',
            '#0025fa',
            '#f59e0b',
            '#0dd406',
            '#ac90ec4f',
            '#ec4899',
            '#b8142a'
          ]} />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-4">
          <ChartCard title="Weekly Sales" data={salesData} type="bar" dataKey="value" colors={['#a820ff']} />
        </div>
        <div className="col-12 col-xl-8">
          <div className="mb-3 d-flex align-items-center justify-content-between px-2">
            <h5 className="fw-bold text-theme-title mb-0">Recent Orders</h5>
          </div>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            searchPlaceholder="Search order ID or customer..."
            searchableFields={['orderId', 'userId', 'status']}
          />
        </div>
      </div>

    </div>
  )
}
