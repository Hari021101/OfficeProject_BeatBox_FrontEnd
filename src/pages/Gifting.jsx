import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Tag, ChevronRight, ShoppingCart, Info, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllProducts, selectProductStatus, fetchProducts } from '../redux/productSlice';
import { useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';

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

  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const productStatus = useSelector(selectProductStatus);

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  const getDisplayedProducts = () => {
    if (!allProducts || allProducts.length === 0) return [];
    
    let filtered = allProducts;
    if (activeCategory === 'True Wireless Earbuds') {
      filtered = allProducts.filter(p => p.category?.toLowerCase().includes('tws') || p.category?.toLowerCase().includes('earbud'));
    } else if (activeCategory === 'Smartwatches') {
      filtered = allProducts.filter(p => p.category?.toLowerCase().includes('watch'));
    } else if (activeCategory === 'Speakers And Soundbars') {
      filtered = allProducts.filter(p => p.category?.toLowerCase().includes('speaker') || p.category?.toLowerCase().includes('soundbar'));
    } else if (activeCategory === 'Neckbands And Headphones') {
      filtered = allProducts.filter(p => p.category?.toLowerCase().includes('neckband') || p.category?.toLowerCase().includes('headphone'));
    }
    
    return filtered.slice(0, 8);
  };

  const displayedProducts = getDisplayedProducts();

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
                <button
                  onClick={() => {
                    document.getElementById('gifting-categories')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-glow px-5 py-3 rounded-pill fw-bold fs-5 d-inline-flex align-items-center gap-2"
                >
                  Shop Gifts Now <ChevronRight size={20} />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Gifting Experience Section (Replaces static promotional offer cards) */}
      <section className="container mb-5 pb-2" id="gifting-experience-section">
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="px-3 py-1 rounded-pill fw-bold text-uppercase mb-2 d-inline-flex align-items-center gap-2"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '1px',
                background: 'rgba(0,243,255,0.08)',
                color: 'var(--bb-accent)',
                border: '1px solid rgba(0,243,255,0.2)'
              }}
            >
              <Gift size={14} /> Premium Gifting
            </span>
            <h2 className="display-6 fw-black text-theme-title mb-2 mt-2">
              Gift Something They’ll Love
            </h2>
            <p className="text-theme-muted mx-auto" style={{ maxWidth: '600px', fontSize: '0.95rem' }}>
              Find the perfect audio gift for birthdays, celebrations, and special occasions.
            </p>
          </motion.div>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-4 rounded-4 text-center h-100 d-flex flex-column align-items-center justify-content-between"
              style={{
                background: 'var(--bb-surface)',
                border: '1px solid var(--bb-border)',
                boxShadow: '0 8px 24px var(--bb-shadow)'
              }}
            >
              <div className="mb-3 p-3 rounded-circle" style={{ background: 'rgba(168,32,255,0.1)', color: 'var(--bb-primary)' }}>
                <Gift size={28} />
              </div>
              <div>
                <h4 className="fw-bold text-theme-title mb-2" style={{ fontSize: '1.1rem' }}>Browse Gift Picks</h4>
                <p className="text-theme-muted small mb-4">
                  Explore handpicked audio bestsellers curated specifically for gifting.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveCategory('Gifting Deals');
                  document.getElementById('gifting-categories')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-sm w-100 py-2 rounded-pill fw-bold d-inline-flex align-items-center justify-content-center gap-1"
                style={{
                  background: 'rgba(168,32,255,0.12)',
                  color: 'var(--bb-primary-light)',
                  border: '1px solid rgba(168,32,255,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                View Picks <ChevronRight size={16} />
              </button>
            </motion.div>
          </div>

          <div className="col-12 col-md-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-4 rounded-4 text-center h-100 d-flex flex-column align-items-center justify-content-between"
              style={{
                background: 'var(--bb-surface)',
                border: '1px solid var(--bb-border)',
                boxShadow: '0 8px 24px var(--bb-shadow)'
              }}
            >
              <div className="mb-3 p-3 rounded-circle" style={{ background: 'rgba(0,243,255,0.1)', color: 'var(--bb-accent)' }}>
                <Tag size={28} />
              </div>
              <div>
                <h4 className="fw-bold text-theme-title mb-2" style={{ fontSize: '1.1rem' }}>Gift by Category</h4>
                <p className="text-theme-muted small mb-4">
                  Find earbuds, headphones, smartwatches or speakers for every recipient.
                </p>
              </div>
              <button
                onClick={() => {
                  document.getElementById('gifting-categories')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-sm w-100 py-2 rounded-pill fw-bold d-inline-flex align-items-center justify-content-center gap-1"
                style={{
                  background: 'rgba(0,243,255,0.12)',
                  color: 'var(--bb-accent)',
                  border: '1px solid rgba(0,243,255,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                Browse Categories <ChevronRight size={16} />
              </button>
            </motion.div>
          </div>

          <div className="col-12 col-md-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-4 rounded-4 text-center h-100 d-flex flex-column align-items-center justify-content-between"
              style={{
                background: 'var(--bb-surface)',
                border: '1px solid var(--bb-border)',
                boxShadow: '0 8px 24px var(--bb-shadow)'
              }}
            >
              <div className="mb-3 p-3 rounded-circle" style={{ background: 'rgba(255,42,109,0.1)', color: '#ff2a6d' }}>
                <Sparkles size={28} />
              </div>
              <div>
                <h4 className="fw-bold text-theme-title mb-2" style={{ fontSize: '1.1rem' }}>Personalised Audio</h4>
                <p className="text-theme-muted small mb-4">
                  Add custom laser-engraved names or messages to create unforgettable gifts.
                </p>
              </div>
              <Link
                to="/personalisation"
                className="btn btn-sm w-100 py-2 rounded-pill fw-bold d-inline-flex align-items-center justify-content-center gap-1 text-decoration-none"
                style={{
                  background: 'rgba(255,42,109,0.12)',
                  color: '#ff2a6d',
                  border: '1px solid rgba(255,42,109,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                Personalise Gifts <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
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
      <section className="container mb-4" id="gifting-categories">
        <div
          className="d-flex overflow-x-auto pb-3 hide-scrollbar gap-2 gap-md-3 align-items-center w-100"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
          }}
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${
                  isActive ? 'btn-glow text-white' : 'text-theme-muted'
                }`}
                style={{
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  background: isActive ? undefined : 'var(--bb-surface)',
                  border: isActive ? 'none' : '1px solid var(--bb-border)',
                  color: isActive ? '#ffffff' : 'var(--bb-text-muted)',
                  fontSize: '0.88rem',
                  boxShadow: isActive ? '0 0 20px var(--bb-primary-glow)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Collection Grid */}
        {productStatus === 'loading' ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-5 glass-card rounded-4 border border-secondary border-opacity-10">
            <Info className="text-theme-muted mb-2" size={32} />
            <p className="text-theme-muted mb-0">No items available in this handpicked category at the moment.</p>
          </div>
        ) : (
          <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {displayedProducts.map((product, idx) => (
              <div className="col" key={`col-prod-${product.id}`}>
                <ProductCard
                  product={product}
                  index={idx}
                  hideProductTag={true}
                  giftBadge={
                    <span
                      className="d-flex align-items-center gap-1 fw-bold text-white rounded-pill px-2 py-1 shadow"
                      style={{
                        fontSize: '0.6rem',
                        background: 'linear-gradient(135deg, #ef4444, #e11d48)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                      }}
                    >
                      <Gift size={10} /> GIFT READY
                    </span>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
