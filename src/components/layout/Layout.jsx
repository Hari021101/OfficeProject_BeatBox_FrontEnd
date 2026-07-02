import Header from './Header'
import Footer from './Footer'
import CompareDock from '../ui/CompareDock'
import ChatBot from '../ui/ChatBot'

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

      {/* Main Content Area — responsive paddingTop to clear fixed header.
          Mobile: ~86px (26px banner + ~60px navbar)
          Desktop: ~104px (34px banner + ~70px navbar)
      */}
      <main className="flex-grow-1 layout-main-offset">
        {children}
      </main>

      {/* Premium Footer */}
      <Footer />

      {/* Global Compare Dock */}
      <CompareDock />

      {/* BeatBot — AI Shopping Assistant */}
      <ChatBot />
    </div>
  )
}
