// App Information
export const APP_NAME = 'EduGenie';
export const APP_VERSION = '1.0.0';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Colors - Modern Design System
export const COLORS = {
  // Primary Colors
  PRIMARY: '#4F46E5',           // Indigo 600 - Main brand color
  PRIMARY_HOVER: '#3730A3',     // 8% darker for hover states
  PRIMARY_ACTIVE: '#312E81',    // 12% darker for active states
  PRIMARY_LIGHT: '#A5B4FC',     // Indigo 300 for light backgrounds
  
  // Secondary Colors
  SECONDARY: '#06B6D4',         // Cyan 500
  SECONDARY_HOVER: '#0891B2',   // 8% darker
  SECONDARY_ACTIVE: '#0E7490',  // 12% darker
  SECONDARY_LIGHT: '#A5F3FC',   // Cyan 200
  
  // Accent & Status Colors
  ACCENT: '#F59E0B',            // Amber 500
  SUCCESS: '#10B981',           // Emerald 500
  WARNING: '#F97316',           // Orange 500  
  ERROR: '#EF4444',             // Red 500
  
  // Background Colors (Light Mode)
  BACKGROUND: '#F9FAFB',        // Gray 50 - Base background
  CARD_BACKGROUND: '#FFFFFF',   // White - Elevated surfaces
  
  // Text Colors
  TEXT_PRIMARY: '#111827',      // Gray 900 - Primary text
  TEXT_MUTED: '#6B7280',        // Gray 500 - Secondary text
  TEXT_DISABLED: '#9CA3AF',     // Gray 400 - Disabled text
  
  // Border & Divider Colors
  BORDER: '#E5E7EB',            // Gray 200
  BORDER_LIGHT: '#F3F4F6',      // Gray 100
  
  // Disabled States
  DISABLED_BG: '#D1D5DB',       // Gray 300
  DISABLED_TEXT: '#9CA3AF',     // Gray 400
  
  // Legacy Colors (for compatibility)
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_LIGHT: '#F3F4F6',        // Updated to Gray 100
  GRAY_MEDIUM: '#6B7280',       // Updated to Gray 500
  GRAY_DARK: '#111827',         // Updated to Gray 900
  SHADOW: 'rgba(0, 0, 0, 0.1)',
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
