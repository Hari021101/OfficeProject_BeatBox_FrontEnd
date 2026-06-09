import api from './authService';

const getLocalCart = () => {
  const local = localStorage.getItem('bb_guest_cart');
  if (local) return JSON.parse(local);
  return { cartId: 'local', items: [], totalAmount: 0 };
};

const saveLocalCart = (cart) => {
  localStorage.setItem('bb_guest_cart', JSON.stringify(cart));
};

export const cartService = {
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      const apiCart = response.data || { items: [], totalAmount: 0 };
      const localCart = getLocalCart();
      
      // Merge local cart items (mock products) with API cart items
      const mergedItems = [...(apiCart.items || [])];
      for (const localItem of localCart.items || []) {
        if (!mergedItems.find(i => i.productId === localItem.productId)) {
          mergedItems.push(localItem);
        }
      }
      
      return {
        cartId: apiCart.cartId || localCart.cartId || 'merged',
        items: mergedItems,
        totalAmount: mergedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      };
    } catch (err) {
      return getLocalCart();
    }
  },

  addToCart: async (productId, quantity, fullProductDetails = null) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data;
    } catch (err) {
      const cart = getLocalCart();
      const existing = cart.items.find(i => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ 
          cartItemId: Date.now() + Math.floor(Math.random()*1000), 
          productId, 
          quantity, 
          unitPrice: fullProductDetails?.price || 999,
          productName: fullProductDetails?.name || 'Unknown'
        });
      }
      cart.totalAmount = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      saveLocalCart(cart);
      return { Message: "Added locally" };
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      const response = await api.put('/cart/update', { cartItemId, quantity });
      return response.data;
    } catch (err) {
      const cart = getLocalCart();
      const existing = cart.items.find(i => i.cartItemId === cartItemId);
      if (existing) {
        existing.quantity = quantity;
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        saveLocalCart(cart);
      }
      return { Message: "Updated locally" };
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`/cart/remove/${cartItemId}`);
      return response.data;
    } catch (err) {
      const cart = getLocalCart();
      cart.items = cart.items.filter(i => i.cartItemId !== cartItemId);
      cart.totalAmount = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      saveLocalCart(cart);
      return { Message: "Removed locally" };
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (err) {
      saveLocalCart({ cartId: 'local', items: [], totalAmount: 0 });
      return { Message: "Cleared locally" };
    }
  }
};
