import { useState, useEffect } from 'react'
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Activity
} from 'lucide-react'
import { orderService } from '../../services/orderService'
import adminService from '../../services/adminService'
import StatWidget from '../../components/admin/StatWidget'
import ChartCard from '../../components/admin/ChartCard'
import DataTable from '../../components/admin/DataTable'

export default function Dashboard() {
  const [recentOrders, setRecentOrders] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0, revenueTrend: 0,
    totalOrders: 0, ordersTrend: 0,
    activeUsers: 0, usersTrend: 0,
    conversionRate: 0, conversionTrend: 0
  })
  const [revenueData, setRevenueData] = useState([])
  const [salesData, setSalesData] = useState([])
  const [productData, setProductData] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load Analytics

        const analytics = await adminService.getDashboardAnalytics();

        setStats({
          totalRevenue: analytics.totalRevenue || 0,
          revenueTrend: null,

          totalOrders: analytics.totalOrders || 0,
          ordersTrend: null,

          activeUsers: analytics.totalCustomers || 0,
          usersTrend: null,

          conversionRate: 0,
          conversionTrend: null
        });

        const revenue = await adminService.getRevenueChart();

        setRevenueData(
          revenue.map(r => ({
            name: new Date(2026, r.month - 1)
              .toLocaleString('default', { month: 'short' }),
            value: r.revenue
          }))
        );

        const sales = await adminService.getSalesChart();

        setSalesData(
          sales.map(s => ({
            name: new Date(s.date)
              .toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
              }),
            value: s.revenue
          }))
        );

        const products = await adminService.getProductAnalytics();

        setProductData(
          products.topProducts.map(p => ({
            name:
              p.productName.length > 15
                ? p.productName.substring(0, 15) + "..."
                : p.productName,
            value: p.unitsSold
          }))
        );

        // Load Orders
        const orders = await orderService.getAllOrders()
        if (orders && orders.length > 0) {
          const sorted = [...orders].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 5)
          setRecentOrders(sorted)
        }
      } catch (e) {
        console.error("Failed to load recent orders", e)
      }
    }
    loadDashboardData()
  }, [])

  const orderColumns = [
    { key: 'orderId', label: 'Order ID', render: (row) => <span className="fw-bold text-theme-title">#{row.orderId.toString().slice(-6)}</span> },
    { key: 'userId', label: 'Customer', render: (row) => <span className="d-inline-block text-truncate text-theme-muted" style={{ maxWidth: '120px', fontSize: '0.9rem' }}>{row.userId}</span> },
    { key: 'createdDate', label: 'Date', render: (row) => <span className="text-theme-muted" style={{ fontSize: '0.9rem' }}>{new Date(row.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span> },
    { key: 'totalAmount', label: 'Amount', render: (row) => <span className="fw-black text-theme-title">₹{Number(row.totalAmount).toLocaleString('en-IN')}</span> },
    {
      key: 'status', label: 'Status', render: (row) => (
        <span className="badge rounded-pill px-3 py-2" style={{
          background: row.status === 'Pending' ? 'rgba(245,158,11,0.1)' :
            row.status === 'Processing' ? 'rgba(168,32,255,0.1)' :
              row.status === 'Shipped' ? 'rgba(0,243,255,0.1)' :
                row.status === 'Delivered' ? 'rgba(57,255,20,0.1)' : 'rgba(239,68,68,0.1)',
          color: row.status === 'Pending' ? '#f59e0b' :
            row.status === 'Processing' ? '#a820ff' :
              row.status === 'Shipped' ? '#00f3ff' :
                row.status === 'Delivered' ? '#39ff14' : '#ef4444',
          border: `1px solid currentColor`,
          fontWeight: 'bold'
        }}>{row.status}</span>
      )
    }
  ]

  return (
    <div className="py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Dashboard Overview</h2>
          <p className="text-theme-muted mb-0">Welcome back, Admin. Here's what's happening today.</p>
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

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <ChartCard title="Revenue Overview (This Year)" data={revenueData} type="line" dataKey="value" colors={['#00f3ff']} />
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
