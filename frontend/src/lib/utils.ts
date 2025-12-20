/**
 * Format số tiền VND
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format ngày tháng
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // Luôn hiển thị theo múi giờ Việt Nam
    timeZone: 'Asia/Ho_Chi_Minh',
  });
}

/**
 * Format ngày giờ
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    // Luôn hiển thị theo múi giờ Việt Nam
    timeZone: 'Asia/Ho_Chi_Minh',
  });
}

/**
 * Tính phần trăm giảm giá
 */
export function calculateDiscount(price: number, discountPrice: number | null): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get full image URL
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '/images/placeholder-book.jpg';
  if (url.startsWith('http')) return url;
  // Use relative URL to go through Next.js proxy
  // Backend returns URLs like /uploads/products/..., so we use /api/uploads/... route
  if (url.startsWith('/uploads/')) {
    return `/api${url}`;
  }
  return url.startsWith('/') ? url : `/${url}`;
}

/**
 * Class names helper (simple cn function)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

