# Role-Based Navigation Demo

## How to Test the Role-Based Authentication

### 1. Student Login
- **Email**: Use any email without "instructor", "teacher", or "admin"
- **Examples**: 
  - `student@example.com`
  - `john.doe@gmail.com` 
  - `learning.user@test.com`
- **Result**: Redirects to Student Dashboard with learning features

### 2. Instructor Login
- **Email**: Include "instructor", "teacher", or "admin" in the email
- **Examples**:
  - `instructor@example.com`
  - `teacher.smith@school.edu`
  - `admin@university.com`
- **Result**: Redirects to Instructor Dashboard with course management

### 3. Registration with Role Selection
- Choose "Student" or "Instructor" role during registration
- Automatically redirects to the appropriate dashboard based on selection

## Current Navigation Flow

```
Welcome Screen (/)
    ↓
Login/Register
    ↓
Role Detection/Selection
    ↓
Student Role → /(student)/dashboard (Learning Dashboard)
Instructor Role → /(instructor)/dashboard (Teaching Dashboard)
```

## Features Implemented

### Student Experience:
- Browse and search courses
- Enroll in courses
- Track learning progress
- View certificates
- AI-powered recommendations

### Instructor Experience:
- Course creation and management
- Student analytics
- Revenue tracking
- Performance metrics
- Course content management

## Next Steps for Backend Integration

1. Replace mock authentication with real JWT tokens
2. Connect to MongoDB for user data
3. Implement actual course CRUD operations
4. Add ChatGPT API integration
5. Create real-time enrollment tracking
