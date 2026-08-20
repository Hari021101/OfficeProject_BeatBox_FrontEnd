import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, PackageCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Returns() {
  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-glow-subtle text-warning mb-3">
            <RotateCcw size={36} />
          </div>
          <h1 className="display-5 fw-black text-theme-title mb-3">
            Return & <span className="gradient-text">Exchange Policy</span>
          </h1>
          <p className="lead text-theme-muted max-w-xl mx-auto">
            Hassle-free 7-day replacement policy for damaged, defective, or incorrect items.
          </p>
        </div>

        {/* POLICY HIGHLIGHT CARDS */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="p-4 rounded-4 text-center h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <div className="p-3 rounded-circle d-inline-flex mb-3 text-info" style={{ background: 'rgba(0,243,255,0.1)' }}>
                <RotateCcw size={28} />
              </div>
              <h5 className="fw-bold text-theme-title mb-2">7 Days Replacement</h5>
              <p className="text-theme-muted small mb-0">Free replacement for defective or damaged products within 7 days of delivery.</p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-4 rounded-4 text-center h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <div className="p-3 rounded-circle d-inline-flex mb-3 text-success" style={{ background: 'rgba(57,255,20,0.1)' }}>
                <PackageCheck size={28} />
              </div>
              <h5 className="fw-bold text-theme-title mb-2">Doorstep Door Pick-up</h5>
              <p className="text-theme-muted small mb-0">Our courier partners will pick up the return item directly from your location.</p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-4 rounded-4 text-center h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <div className="p-3 rounded-circle d-inline-flex mb-3 text-warning" style={{ background: 'rgba(255,159,28,0.1)' }}>
                <ShieldCheck size={28} />
              </div>
              <h5 className="fw-bold text-theme-title mb-2">100% Refund / Exchange</h5>
              <p className="text-theme-muted small mb-0">Full store credit or bank refund if a replacement is out of stock.</p>
            </div>
          </div>
        </div>

        {/* STEPS TO INITIATE RETURN */}
        <div className="p-4 p-md-5 rounded-4 mb-5" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
          <h3 className="fw-black text-theme-title mb-4">How to Request a Replacement</h3>

          <div className="d-flex flex-column gap-4">
            {[
              { step: '1', title: 'Go to Your Orders', desc: 'Log in to your BeatBox account and navigate to My Orders section.' },
              { step: '2', title: 'Select Order & Product', desc: 'Choose the order containing the item you wish to replace.' },
              { step: '3', title: 'Provide Reason & Photos', desc: 'Select replacement reason (Defective/Damaged) and attach product photos.' },
              { step: '4', title: 'Courier Pick-up & Dispatch', desc: 'Our courier partner will inspect and pick up the item. Your replacement will be dispatched within 48 hours.' },
            ].map((s, idx) => (
              <div key={idx} className="d-flex gap-3 align-items-start">
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-black text-white flex-shrink-0" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))' }}>
                  {s.step}
                </div>
                <div>
                  <h6 className="fw-bold text-theme-title mb-1">{s.title}</h6>
                  <p className="text-theme-muted small mb-0">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA TO ORDERS */}
        <div className="p-4 rounded-4 text-center" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
          <h5 className="fw-bold text-theme-title mb-2">Need to replace a recent purchase?</h5>
          <p className="text-theme-muted small mb-4">You can manage all your orders directly from your account dashboard.</p>
          <Link to="/orders" className="btn btn-glow rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2">
            View My Orders <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
