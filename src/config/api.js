export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5089';
export const SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL || 'http://localhost:5089';

/**
 * Helper to build backend API URLs.
 * @param {string} path - The sub-path of the API endpoint.
 * @returns {string} The fully qualified API URL.
 */
export const getApiUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Helper to build Image URLs. Handles absolute URLs, data URLs, and relative paths.
 * @param {string} path - The image source path or absolute URL.
 * @returns {string} The fully qualified image URL or placeholder.
 */
export const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Helper to build SignalR Connection URLs.
 * @param {string} hubPath - The SignalR hub connection path.
 * @returns {string} The fully qualified hub URL.
 */
export const getSignalRUrl = (hubPath = '') => {
  const cleanHubPath = hubPath.startsWith('/') ? hubPath : `/${hubPath}`;
  return `${SIGNALR_URL}${cleanHubPath}`;
};
