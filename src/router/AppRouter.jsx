import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../App'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* If the URL is exactly "/" show the App component */}
        <Route path="/" element={<App />} />
        
        {/* If the URL is "/login" show the Login component */}
        <Route path="/login" element={<Login />} />
        
        {/* If the URL is "/register" show the Register component */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
