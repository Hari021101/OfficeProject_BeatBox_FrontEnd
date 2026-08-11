const PAYMENT_METHOD_LABELS = {
  NETBANKING: 'Net Banking',
  COD: 'Cash on Delivery'
};

export const getPaymentMethodLabel = (method) => {
  if (!method) return 'Unknown';

  const normalized = method
    .replace(/^--\s*/, '')
    .trim()
    .toUpperCase();

  return PAYMENT_METHOD_LABELS[normalized] || method.replace(/^--\s*/, '').trim();
};
