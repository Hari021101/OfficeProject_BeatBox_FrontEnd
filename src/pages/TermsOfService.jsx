import React from 'react';
import { FileText, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-glow-subtle text-accent mb-3">
            <Scale size={36} />
          </div>
          <h1 className="display-5 fw-black text-theme-title mb-3">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-theme-muted small">Effective Date: January 1, 2026 • BeatBox Lifestyle Electronics</p>
        </div>

        {/* CONTENT CARD */}
        <div className="p-4 p-md-5 rounded-4 text-theme-muted lh-lg" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
          
          <h4 className="fw-bold text-theme-title mb-3">1. Agreement to Terms</h4>
          <p className="mb-4">
            By accessing or using the BeatBox website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h4 className="fw-bold text-theme-title mb-3">2. Product Pricing & Availability</h4>
          <p className="mb-4">
            All prices listed on BeatBox are in Indian Rupees (INR) and inclusive of applicable taxes. We reserve the right to update prices, cancel orders due to stock unavailability, or correct typographical pricing errors at any time.
          </p>

          <h4 className="fw-bold text-theme-title mb-3">3. User Accounts & Security</h4>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and password. Any actions performed under your registered account remain your sole responsibility.
          </p>

          <h4 className="fw-bold text-theme-title mb-3">4. Intellectual Property</h4>
          <p className="mb-4">
            All logos, designs, audio technology descriptions, images, graphics, and source code are the exclusive property of BeatBox Lifestyle Electronics and protected by copyright laws.
          </p>

          <h4 className="fw-bold text-theme-title mb-3">5. Governing Law</h4>
          <p className="mb-0">
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in India.
          </p>

        </div>

      </div>
    </div>
  );
}
