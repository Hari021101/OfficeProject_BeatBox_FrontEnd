import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Zap, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Careers() {
  const jobs = [
    { title: 'Senior Acoustic Engineer', dept: 'Hardware R&D', location: 'Bengaluru / Hybrid', type: 'Full-time' },
    { title: 'Frontend Developer (React/Vite)', dept: 'Engineering', location: 'Remote / Hybrid', type: 'Full-time' },
    { title: 'Product UI/UX Designer', dept: 'Design', location: 'Bengaluru / Hybrid', type: 'Full-time' },
    { title: 'Performance Marketing Manager', dept: 'Growth', location: 'Mumbai / Remote', type: 'Full-time' },
  ];

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-5xl mx-auto">
        
        {/* HERO */}
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-glow-subtle text-accent mb-3">
            <Briefcase size={36} />
          </div>
          <h1 className="display-5 fw-black text-theme-title mb-3">
            Build the Future of <span className="gradient-text">Sound</span>
          </h1>
          <p className="lead text-theme-muted max-w-xl mx-auto mb-4">
            We are looking for passionate innovators, engineers, and creators to shape the next generation of lifestyle audio products.
          </p>
        </div>

        {/* OPEN POSITIONS */}
        <div className="p-4 p-md-5 rounded-4 mb-5" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
          <h3 className="fw-black text-theme-title mb-4">Open Positions</h3>

          <div className="d-flex flex-column gap-3">
            {jobs.map((job, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"
                style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
              >
                <div>
                  <h5 className="fw-bold text-theme-title mb-1">{job.title}</h5>
                  <div className="d-flex flex-wrap gap-2 text-theme-muted small">
                    <span>🏢 {job.dept}</span>
                    <span>•</span>
                    <span>📍 {job.location}</span>
                    <span>•</span>
                    <span className="text-info">{job.type}</span>
                  </div>
                </div>

                <a 
                  href="mailto:careers@beatbox.com?subject=Application%20for%20" 
                  className="btn btn-outline-info rounded-pill px-4 py-2 fw-bold text-nowrap align-self-start align-self-md-center"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT HR */}
        <div className="text-center p-4 rounded-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
          <h5 className="fw-bold text-theme-title mb-2">Don't see your role?</h5>
          <p className="text-theme-muted small mb-3">We are always eager to meet talented individuals. Send your resume to careers@beatbox.com</p>
          <a href="mailto:careers@beatbox.com" className="btn btn-glow rounded-pill px-4 fw-bold">
            Send Open Application
          </a>
        </div>

      </div>
    </div>
  );
}
