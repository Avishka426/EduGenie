// App Information
export const APP_NAME = 'EduGenie';
export const APP_VERSION = '1.0.0';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Colors
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6', 
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_LIGHT: '#F2F2F7',
  GRAY_MEDIUM: '#8E8E93',
  GRAY_DARK: '#1C1C1E',
  BACKGROUND: '#F8F9FA',
} as const;

// Screen Names for Navigation
export const SCREENS = {
  WELCOME: 'index',
  LOGIN: 'login',
  REGISTER: 'register',
  TABS: '(tabs)',
  HOME: '(tabs)/index',
  EXPLORE: '(tabs)/explore',
} as const;
