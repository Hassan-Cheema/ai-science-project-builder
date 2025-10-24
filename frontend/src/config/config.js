/**
 * Frontend configuration
 * Centralized configuration management with environment variables
 */

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
  retries: 3
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Supabase Configuration (optional)
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};

// App Configuration
export const APP_CONFIG = {
  name: 'AI Science Builder',
  version: '2.0.0',
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

// Feature Flags
export const FEATURES = {
  enableAuth: Boolean(FIREBASE_CONFIG.apiKey),
  enableDatabase: Boolean(SUPABASE_CONFIG.url),
  enablePDFDownload: true,
  enableProjectSaving: Boolean(SUPABASE_CONFIG.url),
  enableAnalytics: false // Set to true when ready
};

// Validation Config
export const VALIDATION = {
  topicMaxLength: 200,
  topicMinLength: 2,
  titleMaxLength: 200,
  titleMinLength: 3
};

// Cache Configuration
export const CACHE_CONFIG = {
  enableCache: true,
  cacheDuration: 3600000, // 1 hour in milliseconds
  cachePrefix: 'ai-science-builder'
};

// Log environment in development
if (APP_CONFIG.isDevelopment) {
  console.log('🔧 App Configuration:', {
    environment: APP_CONFIG.environment,
    apiURL: API_CONFIG.baseURL,
    features: FEATURES
  });
}

