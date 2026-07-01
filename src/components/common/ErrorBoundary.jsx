import React from 'react';
import { RefreshCw, ShieldAlert, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="d-flex flex-column align-items-center justify-content-center min-vh-100 px-4 text-center text-white position-relative overflow-hidden" 
          style={{ 
            backgroundColor: '#060b19', 
            fontFamily: 'Outfit, sans-serif' 
          }}
        >
          {/* Neon Background Orbs */}
          <div 
            className="position-absolute rounded-circle" 
            style={{ 
              width: 350, 
              height: 350, 
              background: 'rgba(0, 243, 255, 0.15)', 
              top: '10%', 
              left: '-5%', 
              filter: 'blur(100px)' 
            }} 
          />
          <div 
            className="position-absolute rounded-circle" 
            style={{ 
              width: 350, 
              height: 350, 
              background: 'rgba(168, 32, 255, 0.15)', 
              bottom: '10%', 
              right: '-5%', 
              filter: 'blur(100px)' 
            }} 
          />

          <div 
            className="p-5 rounded-4 position-relative border border-secondary"
            style={{ 
              background: 'rgba(10, 13, 20, 0.8)', 
              backdropFilter: 'blur(20px)',
              maxWidth: '550px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              borderColor: 'rgba(0, 243, 255, 0.25) !important'
            }}
          >
            {/* Pulsing warning icon */}
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4 border"
              style={{ 
                width: 80, 
                height: 80, 
                background: 'rgba(255, 70, 70, 0.1)',
                borderColor: 'rgba(255, 70, 70, 0.3)',
                boxShadow: '0 0 20px rgba(255, 70, 70, 0.1)'
              }}
            >
              <ShieldAlert size={40} className="text-danger" />
            </div>

            <h2 className="fw-black mb-3 text-uppercase tracking-wider">
              System <span style={{ color: '#00f3ff' }}>Anomaly</span> Detected
            </h2>
            <p className="text-muted mb-4 small" style={{ lineHeight: '1.6' }}>
              The application encountered an unexpected runtime state. Don't worry, your cart items and settings are safe.
            </p>

            {this.state.error && (
              <div 
                className="p-3 rounded-3 mb-4 text-start font-monospace text-danger small"
                style={{ 
                  background: '#0a0d14', 
                  border: '1px solid rgba(255, 70, 70, 0.2)',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              >
                {this.state.error.toString()}
              </div>
            )}

            <div className="d-flex gap-3 justify-content-center">
              <button 
                onClick={this.handleReset}
                className="btn btn-glow d-flex align-items-center gap-2 px-4 py-2 fw-bold"
                style={{ 
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00f3ff, #a820ff)',
                  border: 'none',
                  color: '#fff'
                }}
              >
                <RefreshCw size={16} /> Recover App
              </button>
              <a 
                href="#/" 
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn d-flex align-items-center gap-2 px-4 py-2 fw-bold"
                style={{ 
                  background: '#0e1322', 
                  border: '1px solid var(--bb-border)', 
                  color: '#fff',
                  borderRadius: '10px'
                }}
              >
                <Home size={16} /> Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
