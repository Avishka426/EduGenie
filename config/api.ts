// API Configuration for EduGenie Backend
// Automatically detects the best URL based on the platform

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Your computer's IP addresses
const COMPUTER_WIFI_IP = '192.168.43.66'; // Your current Wi-Fi IP
const BACKEND_PORT = '3000';

// Auto-detect the best API URL
const getApiBaseUrl = (): string => {
  // For development, you can manually override here:
  // return 'http://192.168.43.66:3000'; // Force mobile IP
  // return 'http://localhost:3000'; // Force localhost
  
  if (__DEV__) {
    // Check if running in Expo Go (mobile device)
    if (Constants.appOwnership === 'expo') {
      // Running on physical device via Expo Go
      return `http://${COMPUTER_WIFI_IP}:${BACKEND_PORT}`;
    }
    
    // Check platform for simulators/emulators
    if (Platform.OS === 'android') {
      // Android Emulator
      return `http://10.0.2.2:${BACKEND_PORT}`;
    } else if (Platform.OS === 'ios') {
      // iOS Simulator
      return `http://localhost:${BACKEND_PORT}`;
    } else if (Platform.OS === 'web') {
      // Web browser
      return `http://localhost:${BACKEND_PORT}`;
    }
  }
  
  // Production fallback
  return 'https://your-backend-domain.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Manual override options (uncomment to force specific URL):
// export const API_BASE_URL = 'http://localhost:3000'; // For web/simulator
// export const API_BASE_URL = 'http://192.168.43.66:3000'; // For mobile device
// export const API_BASE_URL = 'http://10.0.2.2:3000'; // For Android emulator

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
  
  // Utility endpoints
  HEALTH: '/health',
  API_INFO: '/api',
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;
