export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function createStarString(rating) {
  const rounded = Math.round(rating);
  return '★★★★★'.slice(0, rounded).padEnd(5, '☆');
}