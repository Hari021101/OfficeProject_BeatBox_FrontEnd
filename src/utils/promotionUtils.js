/**
 * Utility helper to format customer-facing promotion/coupon headlines cleanly.
 *
 * Rules:
 * - Free Shipping: 'FREE SHIPPING' (never 'EXTRA ₹0 OFF')
 * - Percentage: 'EXTRA X% OFF'
 * - Fixed: 'EXTRA ₹X OFF'
 * - Free Gift: 'FREE GIFT'
 */
export const getPromotionHeadline = (coupon) => {
  if (!coupon) return '';

  const type = (coupon.discountType || '').toString().toLowerCase();
  const code = (coupon.code || '').toString().toUpperCase();

  // Free Shipping cases
  if (
    type === 'shipping' ||
    type === 'freeshipping' ||
    type === 'free shipping' ||
    coupon.isFreeShipping === true ||
    code === 'FREESHIP'
  ) {
    return 'FREE SHIPPING';
  }

  // Free Gift cases
  if (type === 'freegift' || type === 'gift' || type === 'free gift') {
    return 'FREE GIFT';
  }

  // Percentage discount
  if (type === 'percentage' || (coupon.discountPercentage && Number(coupon.discountPercentage) > 0)) {
    return `EXTRA ${coupon.discountPercentage}% OFF`;
  }

  // Fixed amount discount
  if (
    type === 'fixed' ||
    type === 'amount' ||
    (coupon.discountAmount !== undefined && coupon.discountAmount !== null && Number(coupon.discountAmount) > 0)
  ) {
    return `EXTRA ₹${Number(coupon.discountAmount).toLocaleString('en-IN')} OFF`;
  }

  // Fallback for custom title / description or safe label
  if (coupon.title) return coupon.title;
  if (coupon.description) return coupon.description;

  return 'SPECIAL OFFER';
};
