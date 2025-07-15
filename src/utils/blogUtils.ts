// Utility functions for blog operations

/**
 * Format date to Vietnamese locale
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get valid image URL with fallback
 */
export const getValidImageUrl = (imageUrl: string, fallbackId: string): string => {
  if (!imageUrl || imageUrl.includes('example.com')) {
    return `https://picsum.photos/800/400?random=${fallbackId}`;
  }
  return imageUrl;
};

/**
 * Strip HTML tags from content
 */
export const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
