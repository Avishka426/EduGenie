// MINIMAL API CONFIG - USE THIS IF EXPO GO WON'T START
// Replace the content of config/api.ts with this if you're having startup issues

// Simple, direct configuration
export const API_BASE_URL_OVERRIDE = 'http://192.168.43.66:3000'; // For Expo Go
// export const API_BASE_URL_OVERRIDE = 'http://localhost:3000'; // For web browser

export const FINAL_API_BASE_URL = API_BASE_URL_OVERRIDE;

console.log('🌐 API URL:', FINAL_API_BASE_URL);

export const API_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
  BROWSE_COURSES: '/api/courses',
  GPT_RECOMMENDATIONS: '/api/gpt/recommendations',
  HEALTH: '/api/health',
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;
