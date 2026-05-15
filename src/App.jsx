import './index.css'
import logo from './assets/Logo.png'

function App() {
  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="glass-card p-5 text-center shadow-lg" style={{ maxWidth: '500px' }}>
        <img src={logo} alt="BeatBox Logo" className="img-fluid rounded-4 mb-4" style={{ width: '220px' }} />
        <h1 className="gradient-text fw-black mb-3">BeatBox</h1>
        <p className="text-muted mb-4">Phase 1 Complete: Global Theme, Bootstrap & Redux are active.</p>
        <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold" style={{ backgroundColor: 'var(--bb-primary)', border: 'none' }}>
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
