import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingBag, Heart, Zap, Eye, Scale } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/cartSlice'
import { toggleWishlistItem, selectIsInWishlist } from '../../redux/wishlistSlice'
import { addToCompare } from '../../redux/compareSlice'
import { IMAGE_MAP } from '../../data/products'
import { toast } from 'react-hot-toast'
import logo from '../../assets/beatbox_logo.png'

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const isWishlisted = useSelector(state => selectIsInWishlist(state, product.id))
const [selectedColor, setSelectedColor] =
  useState(product.colors?.[0] || null)
  const [adding, setAdding] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageKey: product.imageKey,
      selectedColor: selectedColor?.name || product.color,
      selectedColorCode: selectedColor?.code || '#111111',
      category: product.category,
      imageUrl: selectedColor?.imageUrl || product.imageUrl,
    }))
    toast.success(`🎸 ${product.name} added to cart!`, {
      style: { background: '#060b19', color: '#fff', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '10px' }
    })
    setTimeout(() => setAdding(false), 600)
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast.error('Please log in to save to wishlist');
      return;
    }

    try {
      await dispatch(toggleWishlistItem(product.id)).unwrap();
      toast.success(isWishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist!', {
        style: { background: '#060b19', color: '#fff', border: '1px solid rgba(168,32,255,0.3)', borderRadius: '10px' }
      });
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  }

  const handleCompare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCompare(product))
  }

  const img = selectedColor?.imageUrl || product.imageUrl || IMAGE_MAP[product.imageKey] || IMAGE_MAP['heroHeadphones']
  const discountedSavings = product.oldPrice - product.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-100"
    >
      <Link
        to={`/products/${product.id}`}
        className="text-decoration-none d-block h-100"
      >
        <div className="product-card h-100">
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div
              className="position-absolute inset-0 d-flex align-items-center justify-content-center rounded-4"
              style={{ background: 'rgba(0,0,0,0.55)', zIndex: 20, inset: 0, borderRadius: 24 }}
            >
              <span
                className="fw-black px-4 py-2 rounded-3 text-white"
                style={{ background: 'rgba(255,0,0,0.4)', border: '1px solid rgba(255,0,0,0.6)', letterSpacing: '2px', fontSize: '0.8rem' }}
              >
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Top row: badge + wishlist & compare */}
          <div className="position-absolute top-0 start-0 end-0 d-flex justify-content-between p-3" style={{ zIndex: 10 }}>
            <span className="product-card-badge">{product.tag}</span>
            <div className="d-flex gap-2">
              <button
                onClick={handleCompare}
                className="btn p-0 border-0 d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 32, height: 32, background: 'var(--bb-surface)', backdropFilter: 'blur(8px)', border: '1px solid var(--bb-border)', color: 'var(--bb-accent)', transition: 'all 0.25s' }}
                aria-label="Add to compare"
              >
                <Scale size={14} />
              </button>
              <button
                onClick={handleWishlist}
                className="btn p-0 border-0 d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 32, height: 32, background: 'var(--bb-surface)', backdropFilter: 'blur(8px)', border: '1px solid var(--bb-border)', color: isWishlisted ? '#ff4d7d' : 'var(--bb-muted)', transition: 'all 0.25s' }}
                aria-label="Toggle wishlist"
              >
                <Heart size={14} fill={isWishlisted ? '#ff4d7d' : 'none'} stroke={isWishlisted ? '#ff4d7d' : 'currentColor'} />
              </button>
            </div>
          </div>

          {/* Product image frame */}
          <div className="product-card-frame">
            {img && img.includes('video') ? (
              <video src={img} autoPlay loop muted className="product-card-img" style={{ objectFit: 'contain' }} />
            ) : (
              <img src={img} alt={product.name} className="product-card-img"  onError={(e) => {
    e.target.src =
      IMAGE_MAP[product.imageKey] ||
      IMAGE_MAP.heroHeadphones;
  }} />
            )}
            {/* Hover overlay: quick view hint */}
            <div className="product-card-hover-overlay">
              <div className="d-flex align-items-center gap-1" style={{ color: 'var(--bb-accent)' }}>
                <Eye size={14} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>View Details</span>
              </div>
            </div>
            {/* Brand seal */}
            <div
              className="position-absolute bottom-0 start-0 m-2 d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
              style={{ background: 'var(--bb-surface)', backdropFilter: 'blur(8px)', border: '1px solid var(--bb-border)', zIndex: 5 }}
            >
              <img src={logo} alt="BeatBox" style={{ width: 10, height: 10, objectFit: 'contain' }} />
              <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>BEATBOX</span>
            </div>
          </div>

          {/* Gold USP ribbon */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-1"
            style={{ background: 'linear-gradient(90deg,#ffc700,#ffb800)', color: '#000', fontSize: '0.7rem', fontWeight: 700 }}
          >
            <span className="text-uppercase" style={{ letterSpacing: '0.3px' }}>{product.usp}</span>
            <span className="d-flex align-items-center gap-1 bg-white px-2 rounded-pill" style={{ fontSize: '0.65rem', color: '#000', fontWeight: 800, padding: '2px 8px' }}>
              <Star size={9} fill="#000" /> {product.averageRating || product.rating || 0}
            </span>
          </div>

          {/* Card body */}
          <div className="product-card-body">
            {/* Color swatches */}
            <div className="d-flex gap-2 mb-2">
              {(product.colors || []).map((clr, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(clr) }}
                  className="btn p-0 rounded-circle border-0"
                  style={{
                    width: 16, height: 16,
                    background: clr.code,
                    outline: selectedColor?.name === clr.name ? `2px solid white` : 'none',
                    outlineOffset: 2,
                    boxShadow: selectedColor?.name === clr.name ? `0 0 6px ${clr.code}` : 'none',
                    transition: 'all 0.2s'
                  }}
                  title={clr.name}
                  aria-label={`Select ${clr.name}`}
                />
              ))}
            </div>

            {/* Name & reviews */}
            <h5 className="product-card-name text-theme-title">{product.name}</h5>
            <span className="text-theme-muted d-block mb-2" style={{ fontSize: '0.75rem' }}>
              ⭐ {Number(product.averageRating || product.rating || 0).toFixed(1)} · {product.reviewCount?.toLocaleString('en-IN') || 0} reviews
            </span>

            {/* Price row */}
            <div className="d-flex align-items-baseline justify-content-between mb-3">
              <div>
                <span className="fw-black fs-5 text-theme-title">
  ₹{(product.discountPrice ?? product.price).toLocaleString('en-IN')}
</span>

<span className="text-decoration-line-through text-theme-muted small ms-2">
  ₹{(product.oldPrice ?? product.price).toLocaleString('en-IN')}
</span>              </div>
              <span className="text-success small fw-bold">{Math.max(product.discount, 0)}% OFF</span>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || adding}
              className="btn product-card-cta w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
            >
              {adding ? (
                <><span className="spinner-border spinner-border-sm" />Adding...</>
              ) : (
                <><ShoppingBag size={15} /> Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
