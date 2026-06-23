import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Tag, ChevronRight, ShoppingCart, Star,
  Headphones, Volume2, Watch, Radio, Layers, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllProducts, selectProductStatus, fetchProducts } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { toast } from 'react-hot-toast';
import { IMAGE_MAP } from '../data/products';

import giftingHero from '../assets/gifting_hero_banner.png';
import giftingOccasion from '../assets/gifting_occasion_banner.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5089';

const getVariantPricing = (product) => {
  const variants = product.variants || [];
  if (!variants.length) return { price: product.price || 0, discountPrice: null };
  const sorted = [...variants].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  return { price: sorted[0].price, discountPrice: sorted[0].discountPrice };
};

const getDiscountPct = (product) => {
  const { price, discountPrice } = getVariantPricing(product);
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

const CATEGORIES = [
  { label: 'Gifting Deals',          value: 'Gifting Deals',           icon: <Gift size={15} /> },
  { label: 'All Deals',              value: 'All Deals',               icon: <Tag size={15} /> },
  { label: 'True Wireless Earbuds',  value: 'True Wireless Earbuds',   icon: <Headphones size={15} /> },
  { label: 'Smartwatches',           value: 'Smartwatches',            icon: <Watch size={15} /> },
  { label: 'Speakers & Soundbars',   value: 'Speakers And Soundbars',  icon: <Volume2 size={15} /> },
  { label: 'Neckbands & Headphones', value: 'Neckbands And Headphones', icon: <Radio size={15} /> },
];

const OFFERS = [
  { discount: '₹400 Off', code: 'GRAB400', sub: 'Min. order ₹2,999', color: 'var(--bb-primary)', glow: 'rgba(168,32,255,0.18)' },
  { discount: '₹300 Off', code: 'GRAB300', sub: 'Min. order ₹1,999', color: 'var(--bb-accent)',   glow: 'rgba(0,243,255,0.15)'  },
  { discount: '₹100 Off', code: 'GRAB100', sub: 'No minimum order',  color: '#ff2a6d',            glow: 'rgba(255,42,109,0.15)' },
];

const OCCASIONS = [
  { emoji: '🎂', label: 'Birthday'     },
  { emoji: '💍', label: 'Anniversary'  },
  { emoji: '🏢', label: 'Corporate'    },
  { emoji: '🎓', label: 'Graduation'   },
  { emoji: '🎄', label: 'Festive'      },
  { emoji: '💝', label: 'Just Because' },
];

export default function Gifting() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('Gifting Deals');
  const [wishlist, setWishlist] = useState(new Set());

  const allProducts = useSelector(selectAllProducts);
  const productStatus = useSelector(selectProductStatus);

  useEffect(() => {
    if (productStatus === 'idle') dispatch(fetchProducts());
  }, [productStatus, dispatch]);

  const displayedProducts = useMemo(() => {
    let list = [...allProducts];
    if (activeCategory === 'Gifting Deals') {
      list = list.filter(p => p.isFeatured || getDiscountPct(p) >= 15);
    } else if (activeCategory === 'All Deals') {
      list = list.filter(p => getDiscountPct(p) > 0);
    } else if (activeCategory === 'True Wireless Earbuds') {
      list = list.filter(p => p.categoryName?.toLowerCase().includes('tws') || p.categoryName?.toLowerCase().includes('wireless earbud'));
    } else if (activeCategory === 'Smartwatches') {
      list = list.filter(p => p.categoryName?.toLowerCase().includes('watch'));
    } else if (activeCategory === 'Speakers And Soundbars') {
      list = list.filter(p => p.categoryName?.toLowerCase().includes('speaker') || p.categoryName?.toLowerCase().includes('soundbar'));
    } else if (activeCategory === 'Neckbands And Headphones') {
      list = list.filter(p => p.categoryName?.toLowerCase().includes('neckband') || p.categoryName?.toLowerCase().includes('headphone'));
    }
    return list;
  }, [allProducts, activeCategory]);

  const toggleWishlist = (id, e) => {
    e?.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGiftNow = (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const variants = product.variants || [];
    const best = variants.length
      ? [...variants].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))[0]
      : null;
    const rawImg = product.images?.[0]?.imageUrl || product.variants?.[0]?.images?.[0]?.imageUrl || product.imageUrl;
    const img = rawImg?.startsWith('/images/') ? `${API_BASE}${rawImg}` : rawImg?.startsWith('http') ? rawImg : IMAGE_MAP[product.imageKey] || rawImg;
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: best?.discountPrice || best?.price || 0,
      originalPrice: best?.price || 0,
      variantId: best?.id,
      selectedColor: best?.color || 'Default',
      selectedColorCode: best?.colorCode || '#111111',
      category: product.categoryName,
      imageUrl: img,
    }));
    toast.success(`🎁 Wrapped! ${product.name} is gift-ready in your cart!`, {
      style: { background: '#060b19', color: '#fff', border: '1px solid var(--bb-primary)', borderRadius: '10px' }
    });
  };

  return (
    <div className="pb-5" style={{ paddingTop: '80px', backgroundColor: 'var(--bb-bg-navy)' }}>

      {/* ═══════════════════════════════════════
          1. HERO BANNER
      ═══════════════════════════════════════ */}
      <section className="position-relative mb-5" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
          <img
            src={giftingHero}
            alt="Premium Tech Gifts for Every Occasion"
            className="w-100 h-100"
            style={{ objectFit: 'cover', objectPosition: 'center right' }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, var(--bb-bg-navy) 0%, rgba(1,3,8,0.72) 45%, transparent 100%)' }} />
        </div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block fw-bold"
                  style={{ background: 'rgba(168,32,255,0.15)', color: '#d161ff', border: '1px solid rgba(168,32,255,0.3)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                  🎁 GIFT STORE
                </span>

                <h1 className="display-3 fw-black text-white mb-3" style={{ lineHeight: '1.1' }}>
                  Don't Wait! <br />
                  <span className="gradient-text">Pick a Gift</span> Before <br />
                  they Start Complaining.
                </h1>
                <p className="lead text-white-50 mb-4" style={{ maxWidth: '440px' }}>
                  Surprise them with studio-grade audio and premium smart wearables wrapped in luxury.
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <button
                    className="btn btn-glow px-5 py-3 rounded-pill fw-bold fs-5 d-flex align-items-center gap-2"
                    onClick={() => document.getElementById('gift-deals-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Shop Gifts Now <ChevronRight size={20} />
                  </button>
                  <button
                    className="btn rounded-pill px-4 py-3 fw-semibold d-flex align-items-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                    onClick={() => document.getElementById('gift-occasions')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Shop by Occasion
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. COUPON OFFERS
      ═══════════════════════════════════════ */}
      <section className="container mb-5 pb-2">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Tag className="text-accent" size={20} />
          <h2 className="fw-bold text-theme-title mb-0 fs-4">Choose Your Offer</h2>
        </div>
        <div className="row g-3">
          {OFFERS.map((offer, idx) => (
            <div className="col-12 col-md-4" key={idx}>
              <motion.div
                whileHover={{ y: -5, scale: 1.01 }}
                className="glass-card p-4 rounded-4 position-relative overflow-hidden h-100"
                style={{ border: `1px solid ${offer.color}35`, cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => {
                  navigator.clipboard.writeText(offer.code);
                  toast.success(`Coupon "${offer.code}" copied!`, {
                    style: { background: '#0a0d14', color: '#fff', border: `1px solid ${offer.color}` }
                  });
                }}
              >
                {/* Gradient orb top-right */}
                <div className="position-absolute" style={{ top: 0, right: 0, width: '140px', height: '140px', background: `radial-gradient(circle at top right, ${offer.glow}, transparent 65%)`, pointerEvents: 'none' }} />

                <div className="d-flex justify-content-between align-items-start mb-2 position-relative">
                  <h3 className="fw-black mb-0" style={{ color: offer.color, fontSize: '1.6rem' }}>{offer.discount}</h3>
                  <span className="badge rounded-2 px-2 py-1 fw-bold small" style={{ background: `${offer.color}18`, color: offer.color, border: `1px solid ${offer.color}35` }}>TAP TO COPY</span>
                </div>
                <p className="text-theme-muted small mb-2">{offer.sub}</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold text-theme-muted small">Code:</span>
                  <span className="px-3 py-1 rounded-2 fw-black" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '2px', fontSize: '0.9rem', color: offer.color }}>
                    {offer.code}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. OCCASION BANNER
      ═══════════════════════════════════════ */}
      <section id="gift-occasions" className="container mb-5">
        <div className="position-relative rounded-4 overflow-hidden shadow-lg" style={{ minHeight: '380px' }}>
          <img
            src={giftingOccasion}
            alt="Thoughtful Gifts For Every Occasion"
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 100%)' }} />

          <div className="position-relative h-100 d-flex align-items-center p-4 p-md-5" style={{ zIndex: 2, minHeight: '380px' }}>
            <div className="w-100">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="display-4 fw-black text-white mb-1" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                  Thoughtful Gifts
                </h2>
                <h3 className="h2 fw-bold text-white mb-4 opacity-75">For Every Occasion</h3>

                {/* Occasion pills */}
                <div className="d-flex flex-wrap gap-2">
                  {OCCASIONS.map((occ, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      className="btn btn-sm rounded-pill px-3 py-2 fw-semibold"
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', fontSize: '0.85rem' }}
                      onClick={() => document.getElementById('gift-deals-grid')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {occ.emoji} {occ.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. CATEGORY FILTER TABS
      ═══════════════════════════════════════ */}
      <section id="gift-deals-grid" className="container mb-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Layers size={20} className="text-accent" />
          <h2 className="fw-bold text-theme-title mb-0 fs-4">Browse by Category</h2>
        </div>
        <div className="d-flex overflow-auto pb-2 gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.no-sb::-webkit-scrollbar { display: none; }`}</style>
          <div className="d-flex gap-2 no-sb">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={idx}
                onClick={() => setActiveCategory(cat.value)}
                whileHover={{ y: -2 }}
                className={`btn rounded-pill px-4 py-2 fw-semibold text-nowrap d-flex align-items-center gap-2 transition-all ${activeCategory === cat.value ? 'btn-glow' : 'glass-card text-theme-muted'}`}
                style={{ border: activeCategory !== cat.value ? '1px solid rgba(255,255,255,0.1)' : 'none', fontSize: '0.85rem' }}
              >
                {cat.icon} {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. PRODUCT GRID
      ═══════════════════════════════════════ */}
      <section className="container mb-5 pb-5">
        <AnimatePresence mode="wait">
          {productStatus === 'loading' ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="row g-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div className="col-12 col-sm-6 col-lg-3" key={i}>
                    <div className="rounded-4 overflow-hidden skeleton-pulse" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', height: 360 }} />
                  </div>
                ))}
              </div>
            </motion.div>

          ) : displayedProducts.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-5 glass-card p-5" style={{ borderRadius: '20px', border: '1px solid var(--bb-border)' }}>
              <div className="mb-3" style={{ fontSize: '3.5rem' }}>🎁</div>
              <h4 className="text-theme-title fw-bold mb-2">No deals in this category</h4>
              <p className="text-theme-muted small mb-4">Check other categories or explore our full catalog.</p>
              <Link to="/products" className="btn btn-glow rounded-pill px-4 py-2 fw-bold">Browse All Products</Link>
            </motion.div>

          ) : (
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              {/* Summary bar */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <p className="text-theme-muted small mb-0">
                  Showing <strong className="text-theme-title">{displayedProducts.length}</strong> gift-ready products
                </p>
              </div>

              <div className="row g-4">
                {displayedProducts.map((product, idx) => {
                  const { price, discountPrice } = getVariantPricing(product);
                  const discPct = getDiscountPct(product);
                  const rawImg = product.images?.[0]?.imageUrl || product.variants?.[0]?.images?.[0]?.imageUrl || product.imageUrl;
                  const src = rawImg?.startsWith('/images/')
                    ? `${API_BASE}${rawImg}`
                    : rawImg?.startsWith('http')
                      ? rawImg
                      : IMAGE_MAP[product.imageKey] || rawImg;
                  const isWishlisted = wishlist.has(product.id);

                  return (
                    <motion.div
                      key={product.id}
                      className="col-12 col-sm-6 col-lg-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx % 8) * 0.05 }}
                    >
                      <div className="glass-card bestseller-card h-100 d-flex flex-column position-relative overflow-hidden">

                        {/* TOP BADGES ROW */}
                        <div className="position-absolute top-0 start-0 m-3 z-3">
                          <span className="badge badge-left">GIFT READY</span>
                        </div>
                        {discPct >= 15 && (
                          <div className="position-absolute top-0 end-0 m-3 z-3">
                            <span className="badge rounded-pill fw-bold" style={{ background: 'linear-gradient(135deg, #ff2a6d, #9100ff)', fontSize: '0.65rem' }}>
                              {discPct}% OFF
                            </span>
                          </div>
                        )}

                        {/* WISHLIST HEART */}
                        <button
                          className="position-absolute z-3"
                          style={{ bottom: 136, right: 12, background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}
                          onClick={e => toggleWishlist(product.id, e)}
                          aria-label="Toggle wishlist"
                        >
                          <Heart
                            size={18}
                            fill={isWishlisted ? '#ff2a6d' : 'none'}
                            stroke={isWishlisted ? '#ff2a6d' : 'rgba(255,255,255,0.4)'}
                          />
                        </button>

                        {/* PRODUCT IMAGE */}
                        <Link
                          to={`/products/${product.id}`}
                          className="product-frame text-decoration-none p-4 d-flex align-items-center justify-content-center"
                          style={{ height: '220px' }}
                        >
                          <img
                            src={src}
                            alt={product.name}
                            className="product-img img-fluid"
                            style={{ maxHeight: '165px', objectFit: 'contain' }}
                            onError={e => { e.target.src = IMAGE_MAP.heroHeadphones; }}
                          />
                        </Link>

                        {/* CARD BODY */}
                        <div className="card-body p-4 d-flex flex-column flex-grow-1">

                          {/* Title + Rating */}
                          <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                            <Link to={`/products/${product.id}`} className="text-decoration-none flex-grow-1 overflow-hidden">
                              <h5 className="card-title text-theme-title fw-bold mb-0 text-truncate" style={{ fontSize: '0.95rem' }}>
                                {product.name}
                              </h5>
                              {product.brand && (
                                <p className="text-theme-muted mb-0" style={{ fontSize: '0.72rem' }}>{product.brand}</p>
                              )}
                            </Link>
                            <div className="rating-pill flex-shrink-0">
                              <Star size={10} fill="currentColor" className="text-warning" />
                              {' '}{Number(product.rating || 0).toFixed(1)}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-theme-muted mb-3 flex-grow-1" style={{ fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.description}
                          </p>

                          {/* Pricing */}
                          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                            <span className="fs-5 fw-black text-theme-title">
                              ₹{(discountPrice || price || 0).toLocaleString('en-IN')}
                            </span>
                            {discountPrice && discountPrice < price && (
                              <>
                                <span className="text-decoration-line-through text-theme-muted small">
                                  ₹{price.toLocaleString('en-IN')}
                                </span>
                                {discPct > 0 && (
                                  <span className="badge rounded-2" style={{ background: 'rgba(0,243,255,0.12)', color: 'var(--bb-accent)', fontSize: '0.65rem', border: '1px solid rgba(0,243,255,0.2)' }}>
                                    Save {discPct}%
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {/* CTA */}
                          <button
                            onClick={e => handleGiftNow(product, e)}
                            className="btn btn-add-to-cart w-100 d-flex align-items-center justify-content-center gap-2"
                            style={{ fontSize: '0.87rem' }}
                          >
                            <Gift size={16} /> Gift Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════
          6. BOTTOM STRIP CTA
      ═══════════════════════════════════════ */}
      <section className="container mb-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-4 p-4 p-md-5 text-center position-relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(168,32,255,0.18) 0%, rgba(0,243,255,0.12) 100%)', border: '1px solid rgba(168,32,255,0.2)' }}
        >
          <div className="position-absolute" style={{ top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(0,243,255,0.06)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <Gift size={36} style={{ color: 'var(--bb-accent)' }} className="mb-3" />
          <h3 className="fw-black text-theme-title mb-2">Can't Decide? Let Them Choose!</h3>
          <p className="text-theme-muted mb-4">Buy a BeatBox Gift Card and let your loved ones pick their perfect audio companion.</p>
          <button className="btn btn-glow rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2">
            <ShoppingCart size={18} /> Get a Gift Card
          </button>
        </motion.div>
      </section>
    </div>
  );
}
