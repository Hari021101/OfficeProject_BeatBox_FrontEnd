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
import AdminOrders from '../pages/admin/AdminOrders'

import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchCart } from '../redux/cartSlice'

export default function AppRouter() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

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
        <Route path="/admin/orders" element={<Layout><AdminOrders /></Layout>} />
      </Routes>
    </HashRouter>
  )
}

