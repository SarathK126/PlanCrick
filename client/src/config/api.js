// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get the full API URL
 * In development: uses proxy (empty string)
 * In production: uses environment variable
 */
export const getApiUrl = (path) => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

export default {
    getApiUrl,
    baseUrl: API_BASE_URL
};
