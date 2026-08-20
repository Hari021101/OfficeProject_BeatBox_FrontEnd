import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-glow-subtle text-info mb-3">
            <Shield size={36} />
          </div>
          <h1 className="display-5 fw-black text-theme-title mb-3">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-theme-muted small">Effective Date: January 1, 2026 • BeatBox Lifestyle Electronics</p>
        </div>

        {/* CONTENT CARD */}
        <div className="p-4 p-md-5 rounded-4 text-theme-muted lh-lg" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
          
          <h4 className="fw-bold text-theme-title mb-3">1. Information We Collect</h4>
          <p className="mb-4">
            At BeatBox, we respect your personal privacy. We collect information necessary to fulfill your orders, process payments, and improve your shopping experience. This includes your name, shipping address, billing address, phone number, email address, and order transaction history.
          </p>

          <h4 className="fw-bold text-theme-title mb-3">2. How We Use Your Data</h4>
          <ul className="mb-4 ps-4">
            <li>To process and deliver your orders accurately.</li>
            <li>To send order status notifications, shipping updates, and invoice details.</li>
            <li>To manage account authentication and saved address preferences.</li>
            <li>To prevent fraudulent transactions and maintain platform security.</li>
          </ul>

          <h4 className="fw-bold text-theme-title mb-3">3. Data Security & Encryption</h4>
          <p className="mb-4">
            All credit card, debit card, UPI, and bank transactions are encrypted using industry-standard SSL encryption technology. We do not store sensitive payment credentials directly on our servers.
          </p>

          <h4 className="fw-bold text-theme-title mb-3">4. Cookies & Analytics</h4>
          <p className="mb-4">
            BeatBox uses session cookies to keep track of your shopping cart items, user preferences, and theme choices (Light/Dark mode). You can disable cookies in your browser settings, though some website features may not function optimally.
          </p>

          <h4 className="fw-bold text-theme-title mb-3">5. Contact Us</h4>
          <p className="mb-0">
            If you have questions regarding our Privacy Policy or data handling practices, please email our Privacy Officer at <strong>beatbox80555@gmail.com</strong>.
          </p>

        </div>

      </div>
    </div>
  );
}
