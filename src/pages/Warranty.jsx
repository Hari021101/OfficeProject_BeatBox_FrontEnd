import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Warranty() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    orderId: '',
    productName: '',
    serialNumber: '',
    issueDescription: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Warranty claim submitted! Claim Reference ID: WARR-' + Math.floor(100000 + Math.random() * 900000));
  };

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-glow-subtle text-accent mb-3">
            <ShieldCheck size={36} />
          </div>
          <h1 className="display-5 fw-black text-theme-title mb-3">
            Warranty Claim <span className="gradient-text">& Support</span>
          </h1>
          <p className="lead text-theme-muted max-w-xl mx-auto">
            All BeatBox audio gear comes with 1-Year Comprehensive Brand Warranty against manufacturing defects.
          </p>
        </div>

        {/* WARRANTY COVERAGE OVERVIEW */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                <CheckCircle size={20} /> Covered Under Warranty
              </h5>
              <ul className="list-unstyled text-theme-muted small d-flex flex-column gap-2 mb-0">
                <li>• Driver imbalance, distortion, or zero audio output</li>
                <li>• Bluetooth connection dropouts or failure to pair</li>
                <li>• Battery charging failure or excessive battery drain</li>
                <li>• Microphone dysfunction during voice calls</li>
                <li>• Touch sensor and control response faults</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <h5 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                <AlertCircle size={20} /> Not Covered Under Warranty
              </h5>
              <ul className="list-unstyled text-theme-muted small d-flex flex-column gap-2 mb-0">
                <li>• Physical damage, cracked body, or broken cables</li>
                <li>• Water immersion beyond rated IPX resistance rating</li>
                <li>• Normal wear and tear or cosmetic scratches</li>
                <li>• Unauthorized repairs or modifications</li>
                <li>• Missing original purchase invoice copy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CLAIM FORM */}
        <div className="p-4 p-md-5 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
          <h3 className="fw-black text-theme-title mb-4">Submit a Warranty Claim</h3>

          {submitted ? (
            <div className="text-center py-5">
              <CheckCircle size={48} className="text-success mb-3" />
              <h4 className="fw-bold text-theme-title mb-2">Claim Request Received!</h4>
              <p className="text-theme-muted max-w-md mx-auto mb-4">
                Our support technical team will review your invoice and issue details. You will receive an update at <strong>{form.email}</strong> within 12-24 hours.
              </p>
              <button 
                onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', orderId: '', productName: '', serialNumber: '', issueDescription: '' }); }}
                className="btn btn-outline-info rounded-pill px-4 fw-bold"
              >
                Submit Another Claim
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label text-theme-muted small fw-semibold">Full Name *</label>
                  <input 
                    required 
                    type="text" 
                    className="form-control checkout-input" 
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-theme-muted small fw-semibold">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    className="form-control checkout-input" 
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-theme-muted small fw-semibold">Phone Number *</label>
                  <input 
                    required 
                    type="tel" 
                    className="form-control checkout-input" 
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-theme-muted small fw-semibold">Order ID / Invoice No. *</label>
                  <input 
                    required 
                    type="text" 
                    className="form-control checkout-input" 
                    placeholder="ORD-94821"
                    value={form.orderId}
                    onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-theme-muted small fw-semibold">Product Name *</label>
                  <input 
                    required 
                    type="text" 
                    className="form-control checkout-input" 
                    placeholder="BeatBox Pro ANC Earbuds"
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-theme-muted small fw-semibold">Serial Number (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control checkout-input" 
                    placeholder="BB-2026-X891"
                    value={form.serialNumber}
                    onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-theme-muted small fw-semibold">Description of the Issue *</label>
                  <textarea 
                    required 
                    rows={4} 
                    className="form-control checkout-input" 
                    placeholder="Describe the issue in detail (e.g. Left earbud stopped charging, no sound in right ear, etc.)"
                    value={form.issueDescription}
                    onChange={(e) => setForm({ ...form, issueDescription: e.target.value })}
                  />
                </div>

                <div className="col-12 mt-4 text-end">
                  <button type="submit" className="btn btn-glow rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2">
                    <Send size={18} /> Submit Warranty Claim
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
