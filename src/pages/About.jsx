import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, Headphones, ShieldCheck, Heart, Sparkles, Volume2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-6xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="text-center mb-5 py-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
            style={{ background: 'rgba(0, 243, 255, 0.1)', border: '1px solid var(--bb-accent)', color: 'var(--bb-accent)' }}
          >
            <Sparkles size={16} />
            <span className="fw-bold small text-uppercase" style={{ letterSpacing: '1.5px' }}>THE BEATBOX STORY</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="display-4 fw-black text-theme-title mb-4"
          >
            Engineered for <span className="gradient-text">Pure Acoustic Supremacy</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lead text-theme-muted max-w-3xl mx-auto mb-5"
          >
            BeatBox was born from a simple belief: high-fidelity, deep-bass audio shouldn't be a luxury reserved for the few. We craft precision-tuned gear for audio lovers who demand uncompromising quality.
          </motion.p>
        </div>

        {/* STATS ROW */}
        <div className="row g-4 mb-5">
          {[
            { number: '1M+', label: 'Satisfied Bassheads', icon: <Headphones size={24} className="text-info" /> },
            { number: '4.8★', label: 'Average User Rating', icon: <Award size={24} className="text-warning" /> },
            { number: '100%', label: 'Quality Tested', icon: <ShieldCheck size={24} className="text-success" /> },
            { number: '24/7', label: 'Dedicated Support', icon: <Zap size={24} className="text-accent" /> },
          ].map((stat, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-4 rounded-4 text-center h-100"
                style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
              >
                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'var(--bb-surface)' }}>
                  {stat.icon}
                </div>
                <h2 className="fw-black text-theme-title mb-1">{stat.number}</h2>
                <p className="text-theme-muted small mb-0 fw-semibold">{stat.label}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* MISSION & VISION */}
        <div className="row g-4 mb-5 align-items-center">
          <div className="col-12 col-lg-6">
            <div className="p-4 p-md-5 rounded-4 h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-circle bg-glow-subtle text-info">
                  <Volume2 size={24} />
                </div>
                <h3 className="fw-black text-theme-title mb-0">Our Mission</h3>
              </div>
              <p className="text-theme-muted lh-lg mb-0">
                To revolutionize portable audio by combining state-of-the-art acoustic drivers, ergonomic designs, and custom dynamic sound EQ tailored for music enthusiasts worldwide.
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="p-4 p-md-5 rounded-4 h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-circle bg-glow-subtle text-accent">
                  <Globe size={24} />
                </div>
                <h3 className="fw-black text-theme-title mb-0">Our Vision</h3>
              </div>
              <p className="text-theme-muted lh-lg mb-0">
                To become the premier lifestyle audio ecosystem, delivering immersive, zero-latency sound solutions for gaming, music production, workouts, and daily entertainment.
              </p>
            </div>
          </div>
        </div>

        {/* CTA BOTTOM */}
        <div className="p-5 rounded-4 text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(168, 32, 255, 0.15), rgba(0, 243, 255, 0.15))', border: '1px solid var(--bb-accent)' }}>
          <h2 className="fw-black text-theme-title mb-3">Ready to Feel the Bass?</h2>
          <p className="text-theme-muted mb-4 max-w-xl mx-auto">Explore our range of wireless earbuds, noise-canceling headphones, and party speakers.</p>
          <Link to="/products" className="btn btn-glow rounded-pill px-5 py-3 fw-bold">
            Explore All Products
          </Link>
        </div>

      </div>
    </div>
  );
}
