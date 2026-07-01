import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlistItem, clearWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../config/api';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(toggleWishlistItem(productId)).unwrap();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.productId,
      name: item.productName,
      price: item.productDiscountPrice || item.productPrice,
      image: getImageUrl(item.productImage) || '/placeholder-product.png',
      quantity: 1
    }));
    handleRemove(item.productId); // Optionally remove from wishlist after adding to cart
    toast.success('Moved to cart!');
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await dispatch(clearWishlist()).unwrap();
        toast.success('Wishlist cleared');
      } catch (err) {
        toast.error('Failed to clear wishlist');
      }
    }
  };

  if (loading && items.length === 0) {
    return <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: 'var(--bb-bg-navy)' }}><div className="spinner-border text-info" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-vh-100 pb-5 pt-4" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
        <div className="container-fluid px-3 px-lg-5 text-center mt-5 pt-5">
          <Heart size={64} className="text-theme-muted mb-4 opacity-50 mx-auto" />
          <h2 className="fw-black text-theme-title mb-2">Your Wishlist is Empty</h2>
          <p className="text-theme-muted mb-4">Save your favorite gear here to buy later.</p>
          <button onClick={() => navigate('/products')} className="btn btn-glow px-5 py-3 fw-bold" style={{ borderRadius: 12 }}>
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5 pt-4" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      <div className="container-fluid px-3 px-lg-5 max-w-6xl mx-auto">
        
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div>
            <h2 className="fw-black text-theme-title mb-1 d-flex align-items-center gap-2">
              <Heart size={28} className="text-danger" fill="currentColor" /> My Wishlist
            </h2>
            <p className="text-theme-muted mb-0">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          <button onClick={handleClear} className="btn btn-sm btn-outline-danger fw-bold d-flex align-items-center gap-2 rounded-pill px-3">
            <Trash2 size={16} /> Clear All
          </button>
        </div>

        <div className="row g-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div 
                key={item.productId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              >
                <div className="product-card h-100 d-flex flex-column overflow-hidden">
                  <div className="position-relative bg-white" style={{ paddingTop: '100%', borderRadius: '24px 24px 0 0' }}>
                    <Link to={`/products/${item.productId}`}>
                      <img 
                        src={getImageUrl(item.productImage) || '/placeholder-product.png'} 
                        alt={item.productName}
                        className="position-absolute top-0 start-0 w-100 h-100 object-fit-contain p-4 transition-transform hover-scale"
                      />
                    </Link>
                    <button 
                      onClick={() => handleRemove(item.productId)}
                      className="btn position-absolute top-0 end-0 m-3 p-2 rounded-circle bg-white shadow-sm border text-danger"
                      style={{ zIndex: 2 }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1" style={{ background: 'var(--bb-surface)' }}>
                    <Link to={`/products/${item.productId}`} className="text-decoration-none">
                      <h6 className="fw-bold text-theme-title mb-2 text-truncate">{item.productName}</h6>
                    </Link>
                    
                    <div className="mt-auto mb-3">
                      <span className="fw-black fs-5 text-theme-title">₹{Number(item.productDiscountPrice || item.productPrice).toLocaleString('en-IN')}</span>
                      {item.productDiscountPrice && (
                        <span className="text-decoration-line-through text-theme-muted ms-2 small">₹{Number(item.productPrice).toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <button onClick={() => handleAddToCart(item)} className="btn btn-glow w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                      <ShoppingBag size={18} /> Move to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
