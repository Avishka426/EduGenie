// API Configuration for EduGenie Backend
// Automatically detects the best URL based on the platform

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Your computer's IP addresses
const COMPUTER_WIFI_IP = '192.168.43.66'; // Your current Wi-Fi IP
const BACKEND_PORT = '3000';

// Auto-detect the best API URL
const getApiBaseUrl = (): string => {
  console.log('🔍 Platform detection:', {
    OS: Platform.OS,
    appOwnership: Constants.appOwnership,
    isDev: __DEV__
  });

  // For development, you can manually override here:
  // return 'http://192.168.43.66:3000'; // Force mobile IP
  // return 'http://localhost:3000'; // Force localhost
  
  if (__DEV__) {
    // Check if running in Expo Go (mobile device)
    if (Constants.appOwnership === 'expo') {
      // Running on physical device via Expo Go
      console.log('📱 Using mobile IP for Expo Go');
      return `http://${COMPUTER_WIFI_IP}:${BACKEND_PORT}`;
    }
    
    // Check platform for simulators/emulators
    if (Platform.OS === 'android') {
      // Android Emulator
      console.log('🤖 Using Android Emulator IP');
      return `http://10.0.2.2:${BACKEND_PORT}`;
    } else if (Platform.OS === 'ios') {
      // iOS Simulator  
      console.log('🍎 Using iOS Simulator localhost');
      return `http://localhost:${BACKEND_PORT}`;
    } else if (Platform.OS === 'web') {
      // Web browser
      console.log('🌐 Using web browser localhost');
      return `http://localhost:${BACKEND_PORT}`;
    }
  }
  
  // Production fallback
  return 'https://your-backend-domain.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Manual override options - Try different URLs if having connection issues:
// Uncomment ONE of these lines based on your platform:
// export const API_BASE_URL_OVERRIDE = 'http://localhost:3000'; // For web/simulator
// export const API_BASE_URL_OVERRIDE = 'http://192.168.43.66:3000'; // For mobile device (Expo Go)
// export const API_BASE_URL_OVERRIDE = 'http://10.0.2.2:3000'; // For Android emulator
// export const API_BASE_URL_OVERRIDE = 'http://127.0.0.1:3000'; // Alternative localhost

// Dynamic override - automatically uses the right URL for each platform
export const API_BASE_URL_OVERRIDE = (() => {
  if (__DEV__) {
    // Check if running in Expo Go (mobile device)
    if (Constants.appOwnership === 'expo') {
      console.log('📱 Override: Using mobile IP for Expo Go');
      return `http://${COMPUTER_WIFI_IP}:${BACKEND_PORT}`;
    }
    
    // Check platform for simulators/emulators/web
    if (Platform.OS === 'android') {
      console.log('🤖 Override: Using Android Emulator IP');
      return `http://10.0.2.2:${BACKEND_PORT}`;
    } else if (Platform.OS === 'web') {
      console.log('🌐 Override: Using web localhost');
      return `http://localhost:${BACKEND_PORT}`;
    } else {
      console.log('🍎 Override: Using iOS/default localhost');
      return `http://localhost:${BACKEND_PORT}`;
    }
  }
  
  return null; // No override in production
})();

// Use the override for debugging
export const FINAL_API_BASE_URL = API_BASE_URL_OVERRIDE || API_BASE_URL;

console.log('🌐 Final API Base URL:', FINAL_API_BASE_URL);

export const API_ENDPOINTS = {
  // Authentication endpoints
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
  UPLOAD_PROFILE_PICTURE: '/api/auth/profile/picture',
  REMOVE_PROFILE_PICTURE: '/api/auth/profile/picture',
  
  // Course endpoints - Instructors
  CREATE_COURSE: '/api/courses',
  MY_COURSES: '/api/courses/instructor/my-courses',
  UPDATE_COURSE: '/api/courses', // + /{courseId}
  DELETE_COURSE: '/api/courses', // + /{courseId}
  COURSE_STUDENTS: '/api/courses', // + /{courseId}/students
  
  // Course endpoints - Students
  BROWSE_COURSES: '/api/courses',
  COURSE_DETAILS: '/api/courses', // + /{courseId}
  ENROLL_COURSE: '/api/courses', // + /{courseId}/enroll
  ENROLLED_COURSES: '/api/courses/student/enrolled',
  
  // Public endpoints
  COURSE_CATEGORIES: '/api/courses/categories',
  
  // GPT-3 AI Recommendation endpoints
  GPT_RECOMMENDATIONS: '/api/gpt/recommendations',
  GPT_POPULAR_COURSES: '/api/gpt/popular',
  GPT_USAGE_STATS: '/api/gpt/usage',
  
  // Utility endpoints
  HEALTH: '/health',
  API_INFO: '/api',
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// GPT API Configuration
export const GPT_CONFIG = {
  MAX_API_CALLS: 250, // Assessment limit
  MAX_PROMPT_LENGTH: 500,
  MIN_PROMPT_LENGTH: 10,
  SAMPLE_PROMPTS: [
    "I want to be a software engineer, what courses should I follow?",
    "I'm interested in machine learning and AI, recommend some courses",
    "What courses would help me become a web developer?",
    "I want to learn about cybersecurity, what do you suggest?",
    "Show me courses for mobile app development",
    "I need courses for data science and analytics",
    "Help me learn UI/UX design",
    "I want to start a tech career from scratch",
    "What courses are good for backend development?",
    "I'm interested in cloud computing and DevOps"
  ],
} as const;
