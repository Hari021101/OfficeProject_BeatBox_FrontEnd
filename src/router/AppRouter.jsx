import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from '../App'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import ProductListing from '../pages/ProductListing'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Orders from '../pages/Orders'
import OrderDetail from '../pages/OrderDetail'
import Layout from '../components/layout/Layout'
import Settings from '../pages/Settings'
import Wishlist from '../pages/Wishlist'
import Personalisation from '../pages/Personalisation'
import CorporateOrders from '../pages/CorporateOrders'
import ReferAndEarn from '../pages/ReferAndEarn'
import Gifting from '../pages/Gifting'
import Support from '../pages/Support'
import SoundMatch from '../pages/SoundMatch'

// Admin Pages
import AdminLayout from '../components/layout/AdminLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminProducts from '../pages/admin/Products'
import AdminOrders from '../pages/admin/Orders'
import AdminInventory from '../pages/admin/Inventory'
import AdminUsers from '../pages/admin/Users'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchCart } from '../redux/cartSlice'

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
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/welcome" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Layout><ProductListing /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/orders/:id" element={<Layout><OrderDetail /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/personalisation" element={<Layout><Personalisation /></Layout>} />
        <Route path="/corporate" element={<Layout><CorporateOrders /></Layout>} />
        <Route path="/refer" element={<Layout><ReferAndEarn /></Layout>} />
        <Route path="/gifting" element={<Layout><Gifting /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/soundmatch" element={<Layout><SoundMatch /></Layout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

