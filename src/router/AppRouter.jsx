import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from '../App'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Layout from '../components/layout/Layout'
import Settings from '../pages/Settings'

export default function AppRouter() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 99999,
          top: '125px'
        }}
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
        {/* Main E-Commerce Premium Home Route with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />

        {/* Splash Welcome intro route */}
        <Route path="/welcome" element={<App />} />

        {/* If the URL is "/login" show the Login component */}
        <Route path="/login" element={<Login />} />

        {/* If the URL is "/register" show the Register component */}
        <Route path="/register" element={<Register />} />

        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  )
}

