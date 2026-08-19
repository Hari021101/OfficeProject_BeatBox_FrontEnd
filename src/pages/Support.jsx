import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Mail, MessageCircle, FileText, ShieldCheck, RotateCcw, Truck, CreditCard } from 'lucide-react';

export default function Support() {
  return (
    <div className="container py-5" style={{ minHeight: '80vh', paddingTop: '100px !important' }}>
      <div className="text-center mb-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
          style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))', boxShadow: '0 10px 30px var(--bb-primary-glow)' }}
        >
          <Headphones size={40} color="#fff" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="display-4 fw-black text-theme-title mb-3"
        >
          BeatBox <span className="gradient-text">Support</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lead text-theme-muted mx-auto" 
          style={{ maxWidth: '600px' }}
        >
          How can we help you today? Our support team is available 24/7 to resolve any issues.
        </motion.p>
      </div>

      <div className="row g-4 mt-4">
        {/* Support Option 1 */}
        <div className="col-md-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center h-100 d-flex flex-column"
          >
            <div className="mb-4">
              <MessageCircle size={36} className="text-info" />
            </div>
            <h3 className="fw-bold text-theme-title mb-3">Live Chat</h3>
            <p className="text-theme-muted mb-4 flex-grow-1">Chat instantly with our audio experts to find the right gear or troubleshoot your current device.</p>
            <button className="btn btn-glow w-100 py-2 fw-semibold">Start Chat</button>
          </motion.div>
        </div>

        {/* Support Option 2 */}
        <div className="col-md-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 text-center h-100 d-flex flex-column"
          >
            <div className="mb-4">
              <FileText size={36} className="text-warning" />
            </div>
            <h3 className="fw-bold text-theme-title mb-3">FAQs & Manuals</h3>
            <p className="text-theme-muted mb-4 flex-grow-1">Find quick answers to common questions, warranty details, and downloadable user manuals.</p>
            <button className="btn w-100 py-2 fw-semibold" style={{ background: 'transparent', color: 'var(--bb-title-color)', border: '1px solid var(--bb-warning)' }}>Browse FAQs</button>
          </motion.div>
        </div>

        {/* Support Option 3 */}
        <div className="col-md-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 text-center h-100 d-flex flex-column"
          >
            <div className="mb-4">
              <Mail size={36} className="text-primary" />
            </div>
            <h3 className="fw-bold text-theme-title mb-3">Email Support</h3>
            <p className="text-theme-muted mb-4 flex-grow-1">Submit a ticket for warranty claims, returns, or technical issues. We typically respond within 12 hours.</p>
            <button className="btn w-100 py-2 fw-semibold" style={{ background: 'transparent', color: 'var(--bb-title-color)', border: '1px solid var(--bb-primary-light)' }}>Submit Ticket</button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Benefit Highlights */}
      <div className="row g-4 mt-5 pt-4 border-top" style={{ borderColor: 'var(--bb-border)' }}>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle" style={{ background: 'var(--bb-info-bg)', color: 'var(--bb-accent)' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-theme-title">1 Year Warranty</h6>
              <p className="small mb-0 text-theme-muted">100% Genuine product warranty support.</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle" style={{ background: 'rgba(168, 32, 255, 0.1)', color: 'var(--bb-primary-light)' }}>
              <RotateCcw size={26} />
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-theme-title">7 Days Return</h6>
              <p className="small mb-0 text-theme-muted">No questions asked return policy.</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle" style={{ background: 'var(--bb-info-bg)', color: 'var(--bb-accent)' }}>
              <Truck size={26} />
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-theme-title">Express Delivery</h6>
              <p className="small mb-0 text-theme-muted">Super fast delivery to your doorstep.</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle" style={{ background: 'rgba(168, 32, 255, 0.1)', color: 'var(--bb-primary-light)' }}>
              <CreditCard size={26} />
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-theme-title">Secure Payment</h6>
              <p className="small mb-0 text-theme-muted">Fully encrypted transactions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
