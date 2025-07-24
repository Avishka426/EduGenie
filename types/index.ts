// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'instructor';
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  instructor: User;
  enrolledStudents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  content: string;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
}

// GPT Types
export interface GPTRequest {
  prompt: string;
  userContext?: {
    role: string;
    enrolledCourses?: string[];
  };
}

export interface CourseRecommendation {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reason: string;
  estimatedDuration: string;
}

export interface GPTResponse {
  recommendations: CourseRecommendation[];
  explanation: string;
  suggestedPath: string[];
}
