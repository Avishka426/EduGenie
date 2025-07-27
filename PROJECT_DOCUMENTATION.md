# EduGenie - Mobile Learning Platform
## Comprehensive Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Architecture Overview](#architecture-overview)
5. [Database Design](#database-design)
6. [API Documentation](#api-documentation)
7. [Frontend Components](#frontend-components)
8. [Authentication & Authorization](#authentication--authorization)
9. [Features Implementation](#features-implementation)
10. [Development Guidelines](#development-guidelines)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

**EduGenie** is a comprehensive mobile learning platform built with React Native and Expo. The platform serves both students and instructors, providing a complete ecosystem for course creation, enrollment, and learning management.

### Key Features
- 🎓 **Dual Role System**: Separate interfaces for students and instructors
- 📚 **Course Management**: Create, edit, publish, and archive courses
- 🎯 **Enrollment System**: Browse courses, enroll, and track progress
- 🤖 **AI-Powered Recommendations**: GPT-based course suggestions with usage tracking
- 💳 **Pricing Support**: Flexible pricing models for courses
- 🎨 **Modern UI**: Custom design system with consistent theming
- 📱 **Mobile-First**: Optimized for mobile devices with responsive design
- 📊 **Analytics & Monitoring**: Real-time usage statistics and API monitoring

### Target Users
- **Students**: Browse courses, enroll, track learning progress
- **Instructors**: Create courses, manage content, track student enrollment

---

## Technology Stack

### Frontend
- **React Native**: Mobile app framework
- **Expo**: Development platform and toolchain
- **TypeScript**: Type-safe JavaScript development
- **Expo Router**: File-based routing system

### Backend (Assumed)
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **JWT**: Authentication tokens

### Development Tools
- **VS Code**: Recommended IDE
- **Expo CLI**: Command-line interface
- **Git**: Version control

---

## Project Setup

### Prerequisites
```bash
# Required software
Node.js >= 18.0.0
npm >= 8.0.0
Expo CLI
Git
```

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Avishka426/EduGenie.git
   cd EduGenie
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file (if needed)
   cp .env.example .env
   
   # Update API base URL in services/api.ts
   BASE_URL=http://your-server-ip:3000/api
   ```

4. **Start Development Server**
   ```bash
   npx expo start
   ```

5. **Run on Device**
   - **iOS**: Scan QR code with Camera app
   - **Android**: Scan QR code with Expo Go app
   - **Simulator**: Press 'i' for iOS or 'a' for Android

### Project Structure
```
EduGenie/
├── app/                          # App screens and routing
│   ├── (instructor)/            # Instructor-specific screens
│   │   ├── _layout.tsx          # Instructor tab navigation
│   │   ├── dashboard.tsx        # Instructor dashboard
│   │   ├── courses.tsx          # Course management
│   │   ├── create.tsx           # Create new course
│   │   ├── edit-course.tsx      # Edit existing course
│   │   ├── students.tsx         # Student management
│   │   ├── gpt-usage.tsx        # GPT API usage statistics
│   │   └── profile.tsx          # Instructor profile
│   ├── (student)/               # Student-specific screens
│   │   ├── _layout.tsx          # Student tab navigation
│   │   ├── dashboard.tsx        # Student dashboard
│   │   ├── courses.tsx          # Browse courses
│   │   ├── enrolled.tsx         # Enrolled courses
│   │   ├── ai-recommendations.tsx # AI course recommendations
│   │   └── profile.tsx          # Student profile
│   ├── (shared)/                # Shared screens
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Landing page
│   ├── login.tsx                # Login screen
│   └── register.tsx             # Registration screen
├── components/                   # Reusable UI components
│   ├── ui/                      # Core UI components
│   │   ├── Button.tsx           # Custom button component
│   │   ├── Card.tsx             # Card container component
│   │   └── Input.tsx            # Input field component
│   └── layout/                  # Layout components
├── services/                    # API services
│   ├── api.ts                   # Main API service
│   └── gptService.ts            # GPT API integration service
├── constants/                   # App constants
│   ├── Colors.ts                # Color palette
│   ├── roles.ts                 # User roles
│   └── index.ts                 # Exported constants
├── context/                     # React context providers
│   └── AuthContext.tsx          # Authentication context
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── types/                       # TypeScript type definitions
├── assets/                      # Static assets
├── test-gpt-api.js             # GPT API testing script
├── package.json                 # Dependencies and scripts
└── README.md                    # Project README
```

---

## Architecture Overview

### Application Architecture
```
┌─────────────────┐
│   Mobile App    │
│  (React Native) │
└─────────┬───────┘
          │ HTTP/REST
          ▼
┌─────────────────┐
│   Backend API   │
│   (Node.js)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   Database      │
│   (MongoDB)     │
└─────────────────┘
```

### Navigation Structure
```
Root
├── Landing Page (/)
├── Login (/login)
├── Register (/register)
├── Student App (/(student)/)
│   ├── Dashboard
│   ├── Browse Courses
│   ├── Enrolled Courses
│   └── Profile
└── Instructor App (/(instructor)/)
    ├── Dashboard
    ├── My Courses
    ├── Create Course
    ├── Students
    └── Profile
```

---

## Database Design

### User Collection
```javascript
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "role": "student" | "instructor",
  "profile": {
    "avatar": "string (URL)",
    "bio": "string",
    "skills": ["string"],
    "experience": "string"
  },
  "enrolledCourses": ["ObjectId"], // For students
  "createdCourses": ["ObjectId"],  // For instructors
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Course Collection
```javascript
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "content": "string",
  "category": "string",
  "level": "Beginner" | "Intermediate" | "Advanced",
  "price": "number",
  "duration": "number", // in hours
  "status": "Draft" | "Published" | "Archived",
  "instructor": "ObjectId (User)",
  "instructorName": "string",
  "enrolledStudents": ["ObjectId"],
  "enrollmentCount": "number",
  "maxStudents": "number | null",
  "tags": ["string"],
  "thumbnail": "string (URL)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Enrollment Collection (Optional)
```javascript
{
  "_id": "ObjectId",
  "student": "ObjectId (User)",
  "course": "ObjectId (Course)",
  "enrolledAt": "Date",
  "progress": "number", // 0-100
  "completed": "boolean",
  "completedAt": "Date"
}
```

### GPT Usage Collection
```javascript
{
  "_id": "ObjectId",
  "date": "Date", // Daily counter date (YYYY-MM-DD)
  "requestCount": "number", // Number of API calls made
  "dailyLimit": "number", // Maximum allowed calls (default: 250)
  "requests": [
    {
      "timestamp": "Date",
      "userId": "ObjectId (User)",
      "type": "recommendation" | "health" | "usage",
      "status": "success" | "error" | "limit_exceeded",
      "prompt": "string", // Sanitized request data
      "response": "string", // GPT response summary
      "tokensUsed": "number",
      "responseTime": "number" // in milliseconds
    }
  ],
  "lastReset": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### AI Recommendations Collection
```javascript
{
  "_id": "ObjectId",
  "userId": "ObjectId (User)",
  "requestId": "string", // Unique request identifier
  "userPreferences": {
    "interests": ["string"],
    "level": "string",
    "budget": "number",
    "timeAvailable": "number"
  },
  "enrolledCourses": ["ObjectId"],
  "recommendations": [
    {
      "courseId": "ObjectId (Course)",
      "title": "string",
      "reasoning": "string", // AI explanation
      "matchScore": "number", // 0-100
      "confidence": "number" // 0-1
    }
  ],
  "gptResponse": "string", // Full GPT response
  "processingTime": "number", // milliseconds
  "createdAt": "Date"
}
```

---

## API Documentation

### Base Configuration
```
Base URL: http://localhost:3000/api
Content-Type: application/json
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Course Endpoints

#### Get All Courses
```http
GET /courses
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "course_id",
      "title": "Course Title",
      "description": "Course description",
      // ... other course fields
    }
  ]
}
```

#### Get Course Details
```http
GET /courses/:courseId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "course_id",
    "title": "Course Title",
    // ... complete course data
  }
}
```

#### Create Course (Instructor Only)
```http
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Course",
  "description": "Course description",
  "category": "Programming",
  "level": "Beginner",
  "price": 99.99,
  "duration": 40,
  "content": "Course curriculum",
  "status": "Draft"
}

Response:
{
  "success": true,
  "data": {
    "id": "new_course_id",
    // ... created course data
  }
}
```

#### Update Course (Instructor Only)
```http
PUT /courses/:courseId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Course Title",
  "description": "Updated description",
  // ... other fields to update
}

Response:
{
  "success": true,
  "data": {
    // ... updated course data
  }
}
```

#### Delete Course (Instructor Only)
```http
DELETE /courses/:courseId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### Enrollment Endpoints

#### Enroll in Course
```http
POST /courses/:courseId/enroll
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Successfully enrolled in course"
}
```

#### Get Enrolled Courses
```http
GET /users/:userId/enrolled-courses
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "course_id",
      "title": "Course Title",
      // ... course data
    }
  ]
}
```

### GPT AI Integration Endpoints

#### Get AI Course Recommendations
```http
POST /api/gpt/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "userPreferences": {
    "interests": ["programming", "web development"],
    "level": "intermediate",
    "budget": 100
  },
  "enrolledCourses": ["course_id_1", "course_id_2"]
}

Response:
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "title": "Advanced React Development",
        "reasoning": "Based on your web development interest...",
        "matchScore": 95
      }
    ],
    "usage": {
      "remainingRequests": 245,
      "totalRequests": 250
    }
  }
}
```

#### Get GPT API Usage Statistics
```http
GET /api/gpt/usage
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalRequests": 5,
    "remainingRequests": 245,
    "dailyLimit": 250,
    "lastReset": "2025-07-27T00:00:00Z",
    "requestHistory": [
      {
        "timestamp": "2025-07-27T10:30:00Z",
        "type": "recommendation",
        "status": "success"
      }
    ]
  }
}
```

#### GPT Service Health Check
```http
GET /api/gpt/health
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "status": "healthy",
    "apiConnected": true,
    "lastCheck": "2025-07-27T10:30:00Z"
  }
}
```

#### Reset GPT Counter (Admin Only)
```http
POST /api/gpt/reset-counter
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Counter reset successfully",
  "data": {
    "newCount": 0,
    "resetTimestamp": "2025-07-27T10:30:00Z"
  }
}
```

---

## Frontend Components

### Core UI Components

#### Button Component
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}
```

#### Input Component
```typescript
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}
```

#### Card Component
```typescript
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}
```

### Color System
```typescript
export const COLORS = {
  PRIMARY: '#4F46E5',        // Indigo
  SECONDARY: '#06B6D4',      // Cyan
  SUCCESS: '#10B981',        // Green
  WARNING: '#F59E0B',        // Amber
  DANGER: '#EF4444',         // Red
  
  BACKGROUND: '#F8FAFC',     // Light gray
  WHITE: '#FFFFFF',
  
  GRAY_LIGHT: '#E2E8F0',
  GRAY_MEDIUM: '#64748B',
  GRAY_DARK: '#1E293B',
  
  TEXT_PRIMARY: '#1E293B',
  TEXT_MUTED: '#64748B',
};
```

---

## Authentication & Authorization

### Authentication Flow
1. User registers/logs in with credentials
2. Server validates and returns JWT token
3. Token stored in secure storage (AsyncStorage)
4. Token included in API request headers
5. Server validates token for protected routes

### Role-Based Access
```typescript
// User roles
export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
} as const;

// Role-based navigation
if (user.role === ROLES.INSTRUCTOR) {
  // Redirect to instructor dashboard
} else {
  // Redirect to student dashboard
}
```

### Protected Routes
- All app screens require authentication
- Role-specific screens check user role
- API endpoints validate user permissions

---

## Features Implementation

### GPT AI Integration System

#### Overview
The EduGenie platform includes a sophisticated AI-powered recommendation system using OpenAI's GPT API. This system provides personalized course recommendations while maintaining strict usage limits and comprehensive monitoring.

#### Key Components

**1. Request Limiting System**
- Daily limit of 250 API calls to prevent quota exceeded
- Real-time counter tracking with automatic reset
- Graceful degradation when limits are reached

**2. Usage Analytics Dashboard**
- Real-time statistics for instructors and admins
- Request history with timestamps and status
- Visual charts showing API usage patterns
- Health monitoring with connection status

**3. Intelligent Recommendations**
- Personalized suggestions based on user preferences
- Analysis of enrolled courses to avoid duplicates
- Reasoning explanations for each recommendation
- Match scoring system (0-100) for relevance

**4. Error Handling & Fallbacks**
- Comprehensive error catching and logging
- Fallback recommendations when API unavailable
- User-friendly error messages
- Automatic retry mechanisms

#### Implementation Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │───▶│  Backend API    │───▶│   OpenAI GPT    │
│  (React Native) │    │   (Node.js)     │    │      API        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   Usage DB      │
                       │  (MongoDB)      │
                       └─────────────────┘
```

#### Security Features
- JWT-based authentication for all endpoints
- Admin-only access for counter reset functionality
- Request validation and sanitization
- Rate limiting per user to prevent abuse

#### Frontend Integration
- **Student Dashboard**: AI recommendations widget
- **Instructor Panel**: Usage statistics and monitoring
- **Admin Console**: Counter management and health checks
- **Real-time Updates**: Live usage tracking

### Course Management (Instructors)
- **Create Course**: Form with validation for all course fields
- **Edit Course**: Pre-populated form with change tracking
- **Publish/Archive**: Status management with visual indicators
- **Student Analytics**: View enrolled students and statistics

### Course Discovery (Students)
- **Browse Courses**: Filter by category, level, price
- **Search Functionality**: Search by title, description, instructor
- **Course Details**: Comprehensive course information
- **Enrollment**: One-click enrollment with confirmation

### User Interface Features
- **Focus States**: Visual feedback for interactive elements
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Optimized for various screen sizes

---

## Development Guidelines

### Code Organization
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error boundaries
- Use consistent naming conventions

### Styling Guidelines
```typescript
// Use StyleSheet.create for performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

// Use color constants
color: COLORS.PRIMARY,
```

### API Integration
```typescript
// Use try-catch for error handling
try {
  const response = await ApiService.getCourses();
  if (response.success) {
    setCourses(response.data);
  }
} catch (error) {
  console.error('Failed to load courses:', error);
}
```

---

## Troubleshooting

### Common Issues

#### 1. API Connection Issues
**Problem**: Cannot connect to backend API
**Solution**:
- Check API base URL in `services/api.ts`
- Ensure backend server is running
- Verify network connectivity

#### 2. Authentication Errors
**Problem**: User cannot login/register
**Solution**:
- Check token storage implementation
- Verify API endpoint URLs
- Clear app data/cache

#### 3. Course Status Issues
**Problem**: Course status not updating correctly
**Solution**:
- Ensure status values match backend expectations
- Check case sensitivity ("Published" vs "published")
- Verify API request format

#### 4. Navigation Issues
**Problem**: Screens not displaying correctly
**Solution**:
- Check route configuration in `_layout.tsx`
- Verify screen names match file names
- Clear Expo cache: `expo start -c`

#### 5. GPT API Integration Issues
**Problem**: AI recommendations not working
**Solution**:
- Check OpenAI API key configuration
- Verify API request limit hasn't been exceeded
- Check GPT service health endpoint
- Review error logs in `gptService.ts`

**Problem**: Usage counter not updating
**Solution**:
- Verify database connection for usage collection
- Check if counter reset functionality is working
- Ensure proper date formatting for daily limits

**Problem**: Recommendations are irrelevant
**Solution**:
- Review user preferences data being sent
- Check GPT prompt engineering in backend
- Verify course data quality and completeness
- Adjust match scoring algorithm

### Development Tips
- Use Expo DevTools for debugging
- Check console logs for API responses
- Test on both iOS and Android
- Use TypeScript strict mode for better error catching

---

## Conclusion

EduGenie is a comprehensive mobile learning platform that demonstrates modern React Native development practices with cutting-edge AI integration. The project showcases:

- **Clean Architecture**: Well-organized code structure with service separation
- **Type Safety**: Full TypeScript implementation across all components
- **AI Integration**: Advanced GPT-powered recommendation system with usage monitoring
- **User Experience**: Intuitive interface design with vector icons and modern UI
- **Scalability**: Modular component architecture with microservices approach
- **Best Practices**: Following React Native and API development conventions
- **Security**: JWT-based authentication with role-based access control
- **Monitoring**: Comprehensive logging and usage analytics
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### Technical Achievements
- ✅ **Full-Stack Integration**: Seamless frontend-backend communication
- ✅ **AI-Powered Features**: GPT-based recommendations with intelligent filtering
- ✅ **Usage Analytics**: Real-time monitoring and request limiting
- ✅ **Mobile Optimization**: Native mobile app with proper navigation
- ✅ **Database Design**: Efficient schema for complex relationships
- ✅ **API Documentation**: Complete REST API with proper status codes
- ✅ **Icon Integration**: Professional vector icons replacing emojis
- ✅ **Role-Based Security**: Separate access levels for different user types

This documentation serves as a complete reference for understanding, developing, and maintaining the EduGenie platform with its advanced AI integration capabilities.

---

**Project Information**
- **Developer**: [Your Name]
- **Organization**: [Your Company/University]
- **Date**: July 26, 2025
- **Version**: 1.0.0
- **Repository**: https://github.com/Avishka426/EduGenie

---

*This documentation was created as part of an internship project to demonstrate mobile app development skills and best practices.*
