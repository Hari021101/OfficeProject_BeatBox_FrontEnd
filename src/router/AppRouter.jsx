import React, { Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import AdminLayout from '../components/layout/AdminLayout'

// Lazy Load Pages
const App = React.lazy(() => import('../App'))
const Login = React.lazy(() => import('../pages/Login'))
const Register = React.lazy(() => import('../pages/Register'))
const Home = React.lazy(() => import('../pages/Home'))
const ProductListing = React.lazy(() => import('../pages/ProductListing'))
const ProductDetail = React.lazy(() => import('../pages/ProductDetail'))
const Cart = React.lazy(() => import('../pages/Cart'))
const Checkout = React.lazy(() => import('../pages/Checkout'))
const Orders = React.lazy(() => import('../pages/Orders'))
const OrderDetail = React.lazy(() => import('../pages/OrderDetail'))
const Settings = React.lazy(() => import('../pages/Settings'))
const Wishlist = React.lazy(() => import('../pages/Wishlist'))
const Personalisation = React.lazy(() => import('../pages/Personalisation'))
const CorporateOrders = React.lazy(() => import('../pages/CorporateOrders'))
const ReferAndEarn = React.lazy(() => import('../pages/ReferAndEarn'))
const Gifting = React.lazy(() => import('../pages/Gifting'))
const Support = React.lazy(() => import('../pages/Support'))
const SoundMatch = React.lazy(() => import('../pages/SoundMatch'))
const BeatBoxStudio = React.lazy(() => import('../pages/BeatBoxStudio'))
const Compare = React.lazy(() => import('../pages/Compare'))
const DailyDeals = React.lazy(() => import('../pages/DailyDeals'))

// Lazy Load Admin Pages
const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard'))
const AdminProducts = React.lazy(() => import('../pages/admin/Products'))
const AdminEditProduct = React.lazy(() => import('../pages/admin/EditProduct'))
const AdminOrders = React.lazy(() => import('../pages/admin/Orders'))
const AdminInventory = React.lazy(() => import('../pages/admin/Inventory'))
const AdminUsers = React.lazy(() => import('../pages/admin/Users'))
const AdminReturns = React.lazy(() => import('../pages/admin/Returns'))
const AdminPromotions = React.lazy(() => import('../pages/admin/Promotions'))
const AdminAuditLogs = React.lazy(() => import('../pages/admin/AuditLogs'))
const AdminAccountManagement = React.lazy(() => import('../pages/admin/AccountManagement'))

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchCart } from '../redux/cartSlice'

import AdminRoute from './AdminRoute'
import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [dispatch, isAuthenticated])

  return (
    <HashRouter>
      <Toaster 
        position="top-right" 
        containerStyle={{ zIndex: 99999, top: '125px' }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0a0d14',
            color: '#fff',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            borderRadius: '10px',
            fontSize: '0.95rem'
          }
        }}
      />
      <Suspense fallback={
        <div style={{
          display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw',
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#060b19',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            {/* Pulsing neon outer ring */}
            <div style={{
              position: 'absolute', inset: 0, border: '3px solid transparent',
              borderTopColor: 'rgba(0, 243, 255, 0.7)', borderBottomColor: 'rgba(0, 243, 255, 0.7)',
              borderRadius: '50%', animation: 'loader-spin 1.2s linear infinite',
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
            }} />
            {/* Inner reverse spin ring */}
            <div style={{
              position: 'absolute', inset: '12px', border: '2px solid transparent',
              borderLeftColor: 'rgba(168, 32, 255, 0.7)', borderRightColor: 'rgba(168, 32, 255, 0.7)',
              borderRadius: '50%', animation: 'loader-spin-reverse 1s linear infinite',
              boxShadow: '0 0 10px rgba(168, 32, 255, 0.2)'
            }} />
            {/* Core glowing dot */}
            <div style={{
              position: 'absolute', inset: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #a820ff, #00f3ff)',
              boxShadow: '0 0 20px #00f3ff, 0 0 10px #a820ff'
            }} />
          </div>
          
          <style>{`
            @keyframes loader-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes loader-spin-reverse {
              0% { transform: rotate(360deg); }
              100% { transform: rotate(0deg); }
            }
          `}</style>
          
          <h4 style={{
            marginTop: '24px', fontWeight: 900, textTransform: 'uppercase',
            color: '#fff', fontSize: '0.8rem', letterSpacing: '3px',
            background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.45))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Loading BeatBox
          </h4>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/welcome" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Layout><ProductListing /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><Layout><OrderDetail /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Layout><Wishlist /></Layout></ProtectedRoute>} />
          <Route path="/personalisation" element={<Layout><Personalisation /></Layout>} />
          <Route path="/corporate" element={<Layout><CorporateOrders /></Layout>} />
          <Route path="/refer" element={<Layout><ReferAndEarn /></Layout>} />
          <Route path="/gifting" element={<Layout><Gifting /></Layout>} />
          <Route path="/support" element={<Layout><Support /></Layout>} />
          <Route path="/soundmatch" element={<Layout><SoundMatch /></Layout>} />
          <Route path="/studio" element={<Layout><BeatBoxStudio /></Layout>} />
          <Route path="/compare" element={<Layout><Compare /></Layout>} />
          <Route path="/daily-deals" element={<Layout><DailyDeals /></Layout>} />
          <Route path="/deals" element={<Layout><DailyDeals /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:id/edit" element={<AdminEditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="accounts" element={<AdminAccountManagement />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

