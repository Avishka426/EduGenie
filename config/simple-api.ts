// Simple API Configuration for Expo Go
// This version has minimal dependencies and better error handling

// Your network configuration
const LOCALHOST_URL = 'http://localhost:3000';
const NETWORK_IP_URL = 'http://192.168.43.66:3000';

// Simple platform detection without complex imports
const getSimpleApiUrl = () => {
  try {
    // For web browser, use localhost
    if (typeof window !== 'undefined') {
      console.log('🌐 Detected web platform, using localhost');
      return LOCALHOST_URL;
    }
    
    // For mobile (Expo Go), use network IP
    console.log('📱 Detected mobile platform, using network IP');
    return NETWORK_IP_URL;
  } catch (error) {
    console.error('❌ URL detection failed, using localhost fallback');
    return LOCALHOST_URL;
  }
};

export const SIMPLE_API_BASE_URL = getSimpleApiUrl();

console.log('🌐 Simple API Base URL:', SIMPLE_API_BASE_URL);

// You can manually switch between these:
// export const SIMPLE_API_BASE_URL = 'http://localhost:3000';      // For web
// export const SIMPLE_API_BASE_URL = 'http://192.168.43.66:3000'; // For Expo Go

export const SIMPLE_API_ENDPOINTS = {
  HEALTH: '/api/health',
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  GPT_RECOMMENDATIONS: '/api/gpt/recommendations',
  COURSES: '/api/courses',
} as const;
