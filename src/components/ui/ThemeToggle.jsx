import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bb_theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('bb_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="btn d-flex align-items-center justify-content-center theme-toggle-btn"
      style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        zIndex: 100,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        transition: 'border 0.3s ease, background 0.3s ease'
      }}
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', color: 'var(--bb-accent)' }}
          >
            <Sun size={22} className="sun-icon" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', color: '#8c00ff' }}
          >
            <Moon size={22} className="moon-icon" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
