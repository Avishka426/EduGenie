// EMERGENCY API CONFIG - Use this if Expo Go still won't start
// This has ZERO platform detection and minimal dependencies

console.log('🚨 Using emergency API configuration');

// Simple hardcoded URLs - manually switch these as needed
const API_URLS = {
  WEB: 'http://localhost:3000',
  MOBILE: 'http://192.168.43.66:3000',
  EMULATOR: 'http://10.0.2.2:3000'
};

// MANUALLY CHOOSE THE RIGHT ONE:
export const EMERGENCY_API_BASE_URL = API_URLS.MOBILE; // <-- Change this line

console.log('🌐 Emergency API URL:', EMERGENCY_API_BASE_URL);

export const EMERGENCY_API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  COURSES: '/api/courses',
  GPT_RECOMMENDATIONS: '/api/gpt/recommendations'
} as const;

// Instructions:
// 1. For Expo Go: Use API_URLS.MOBILE
// 2. For Web: Use API_URLS.WEB  
// 3. For Android Emulator: Use API_URLS.EMULATOR

// To use this config, replace the import in services/api.ts:
// import { EMERGENCY_API_BASE_URL as FINAL_API_BASE_URL } from '@/config/emergency-api';
