import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Tag, ChevronRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS, IMAGE_MAP } from '../data/products';

import giftingHero from '../assets/gifting_hero_banner.png';
import giftingOccasion from '../assets/gifting_occasion_banner.png';

export default function Gifting() {
  const [activeCategory, setActiveCategory] = useState('Gifting Deals');

  const categories = [
    'Gifting Deals',
    'All Deals',
    'True Wireless Earbuds',
    'Smartwatches',
    'Speakers And Soundbars',
    'Neckbands And Headphones'
  ];

  // Dummy filter just to show some products for the design
  const displayedProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="pb-5" style={{ paddingTop: '80px', backgroundColor: 'var(--bb-bg-navy)' }}>
      
      {/* 1. Hero Banner Section */}
      <section className="position-relative mb-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background Image */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
          <img 
            src={giftingHero} 
            alt="Premium Tech Gifts" 
            className="w-100 h-100" 
            style={{ objectFit: 'cover', objectPosition: 'center right' }} 
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, var(--bb-bg-navy) 0%, rgba(1,3,8,0.7) 40%, transparent 100%)' }}></div>
        </div>

        {/* Hero Content */}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="display-3 fw-black text-white mb-3" style={{ lineHeight: '1.1' }}>
                  Don't Wait! <br />
                  <span className="gradient-text">Pick a Gift</span> Before <br />
                  they Start Complaining.
                </h1>
                <p className="lead text-white-50 mb-4">
                  Surprise them with studio-grade audio and premium smart wearables wrapped in luxury.
                </p>
                <button className="btn btn-glow px-5 py-3 rounded-pill fw-bold fs-5">
                  Shop Gifts Now <ChevronRight size={20} className="ms-1" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Offers Section */}
      <section className="container mb-5 pb-4">
        <h2 className="text-center fw-bold text-theme-title mb-4 d-flex align-items-center justify-content-center gap-2">
          <Tag className="text-accent" /> Choose Your Offer
        </h2>
        <div className="row g-4 justify-content-center">
          {[
            { discount: '₹400', code: 'GRAB400', color: 'var(--bb-primary)' },
            { discount: '₹300', code: 'GRAB300', color: 'var(--bb-accent)' },
            { discount: '₹100', code: 'GRAB100', color: '#ff2a6d' }
          ].map((offer, idx) => (
            <div className="col-12 col-md-4" key={idx}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-4 text-center rounded-4 position-relative overflow-hidden"
                style={{ border: `1px solid ${offer.color}40` }}
              >
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: `radial-gradient(circle at top right, ${offer.color}20, transparent 70%)` }}></div>
                <h3 className="fw-black mb-2" style={{ color: offer.color }}>Extra {offer.discount} Off</h3>
                <p className="text-theme-muted mb-0 fw-semibold">Using Code: <span className="text-white px-2 py-1 rounded bg-theme-surface border border-secondary border-opacity-25 ms-1">{offer.code}</span></p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Occasion Banner Section */}
      <section className="container mb-5">
        <div className="position-relative rounded-4 overflow-hidden shadow-lg" style={{ minHeight: '350px' }}>
          <img 
            src={giftingOccasion} 
            alt="Thoughtful Gifts For Every Occasion" 
            className="position-absolute top-0 start-0 w-100 h-100" 
            style={{ objectFit: 'cover' }} 
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}></div>
          
          <div className="position-relative h-100 d-flex align-items-center p-4 p-md-5" style={{ zIndex: 2, minHeight: '350px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-md"
            >
              <h2 className="display-4 fw-black text-white mb-2" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                Thoughtful Gifts
              </h2>
              <h3 className="h2 fw-bold text-white mb-0" style={{ color: '#ffccd5' }}>
                For Every Occasion
              </h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Category Filters */}
      <section className="container mb-4">
        <div className="d-flex overflow-auto pb-3 hide-scrollbar gap-3 justify-content-lg-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`btn rounded-pill px-4 py-2 fw-semibold text-nowrap transition-all ${activeCategory === cat ? 'btn-glow' : 'glass-card text-theme-muted hover-text-white'}`}
              style={{ border: activeCategory !== cat ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Product Grid */}
      <section className="container mb-5 pb-5">
        <div className="row g-4">
          {displayedProducts.map((product) => (
            <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
              <div className="glass-card bestseller-card h-100 d-flex flex-column border-0">
                <div className="position-absolute top-0 start-0 m-3 z-3">
                  <span className="badge badge-left">GIFT READY</span>
                </div>
                
                <Link to={`/products/${product.id}`} className="product-frame text-decoration-none p-4 d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
                  <img 
                    src={IMAGE_MAP[product.imageKey]} 
                    alt={product.name} 
                    className="product-img img-fluid"
                    style={{ maxHeight: '160px', objectFit: 'contain' }}
                  />
                </Link>
                
                <div className="card-body p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Link to={`/products/${product.id}`} className="text-decoration-none">
                      <h5 className="card-title text-theme-title fw-bold mb-0 text-truncate" style={{ maxWidth: '160px' }}>
                        {product.name}
                      </h5>
                    </Link>
                    <div className="rating-pill">
                      <span className="text-warning">★</span> {product.rating}
                    </div>
                  </div>
                  
                  <p className="text-theme-muted small mb-3 flex-grow-1 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <span className="fs-5 fw-black text-theme-title">₹{product.price.toLocaleString()}</span>
                      <span className="text-decoration-line-through text-theme-muted ms-2 small">₹{Math.floor(product.price * 1.5).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button className="btn btn-add-to-cart w-100 d-flex align-items-center justify-content-center gap-2">
                    <Gift size={18} /> Gift Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
