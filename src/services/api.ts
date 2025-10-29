import axios from "axios";

// Use Vite proxy in development, configurable URL in production
const isProduction = import.meta.env.PROD;
const API_BASE_URL = isProduction
  ? import.meta.env.VITE_API_URL || "http://localhost:5000"
  : ""; // Empty string uses Vite proxy in development

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function to get full image URL
export const getImageUrl = (path: string): string => {
  if (!path) return "";
  // If path already includes http, return as is
  if (path.startsWith("http")) return path;
  // In development, use Vite proxy (relative path)
  // In production, use full URL
  return isProduction ? `${API_BASE_URL}${path}` : path; // Relative path uses Vite proxy
};

export { API_BASE_URL };
export default api;
