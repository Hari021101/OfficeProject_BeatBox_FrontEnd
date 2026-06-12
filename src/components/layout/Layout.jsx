import Header from './Header'
import Footer from './Footer'
import CompareDock from '../ui/CompareDock'

export default function Layout({ children }) {
  return (
    <div 
      className="d-flex flex-column min-vh-100" 
      style={{ 
        backgroundColor: 'var(--bb-bg-navy)',
        color: 'var(--bb-text)',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      {/* Premium Sticky Header */}
      <Header />

      {/* Main Content Area: Offset paddingTop for sticky Header & announcement bar (approx 110px) */}
      <main className="flex-grow-1" style={{ paddingTop: '104px' }}>
        {children}
      </main>

      {/* Premium Footer */}
      <Footer />

      {/* Global Compare Dock */}
      <CompareDock />
    </div>
  )
}
