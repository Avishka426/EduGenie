import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Get auth token if available
      const token = await AsyncStorage.getItem('authToken');
      
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      console.log('🔄 API Request:', url, { method: config.method, hasToken: !!token });

      const response = await fetch(url, config);
      const data = await response.json();

      console.log('📡 API Response:', response.status, data);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }

        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      
      let errorMessage = 'Network error. Please check your connection.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Cannot connect to server. Make sure the backend is running on http://localhost:3000';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout. Server might be slow.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      // Store token and user data
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Login successful, token stored');
    }

    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    const response = await this.request(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      // Store token and user data
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Registration successful, token stored');
    }

    return response;
  }

  async getProfile() {
    return this.request(API_ENDPOINTS.PROFILE);
  }

  async logout() {
    try {
      // Call backend logout endpoint to invalidate token
      const response = await this.request(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
      
      if (response.success) {
        console.log('✅ Backend logout successful:', response.data?.message);
      } else {
        console.log('⚠️ Backend logout failed, but continuing with local cleanup:', response.error);
      }
    } catch (error) {
      console.log('⚠️ Backend logout error, but continuing with local cleanup:', error);
    } finally {
      // Always clear local storage regardless of backend response
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      console.log('🚪 User logged out, tokens cleared locally');
    }
  }

  // Utility methods
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }

  async getCurrentUser() {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Health check
  async healthCheck() {
    return this.request(API_ENDPOINTS.HEALTH);
  }

  // Get API info
  async getApiInfo() {
    return this.request(API_ENDPOINTS.API_INFO);
  }

  // Course methods for Instructors
  async createCourse(courseData: {
    title: string;
    description: string;
    content: string;
    category: string;
    price: number;
    duration: number; // hours
    level: string;
    thumbnail?: string;
    tags?: string[];
    maxStudents?: number;
    prerequisites?: string;
    whatYouWillLearn?: string;
  }) {
    const response = await this.request(API_ENDPOINTS.CREATE_COURSE, {
      method: 'POST',
      body: JSON.stringify(courseData),
    });

    if (response.success) {
      console.log('✅ Course created successfully:', response.data);
    }

    return response;
  }

  async getInstructorCourses() {
    console.log('🔄 ApiService.getInstructorCourses() called');
    console.log('🔗 Making request to:', API_ENDPOINTS.MY_COURSES);
    
    const response = await this.request(API_ENDPOINTS.MY_COURSES);
    
    console.log('📡 getInstructorCourses response:', {
      success: response.success,
      dataType: typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : 'not array',
      rawData: response.data,
      error: response.error
    });
    
    return response;
  }

  async updateCourse(courseId: string, courseData: any) {
    return this.request(`${API_ENDPOINTS.UPDATE_COURSE}/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(courseId: string) {
    return this.request(`${API_ENDPOINTS.DELETE_COURSE}/${courseId}`, {
      method: 'DELETE',
    });
  }

  async getCourseStudents(courseId: string) {
    return this.request(`${API_ENDPOINTS.COURSE_STUDENTS}/${courseId}/students`);
  }

  // Course methods for Students
  async browseCourses(filters?: {
    category?: string;
    level?: string;
    priceMin?: number;
    priceMax?: number;
    search?: string;
  }) {
    let url = API_ENDPOINTS.BROWSE_COURSES;
    
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.request(url);
  }

  async getCourseDetails(courseId: string) {
    return this.request(`${API_ENDPOINTS.COURSE_DETAILS}/${courseId}`);
  }

  async enrollInCourse(courseId: string) {
    const response = await this.request(`${API_ENDPOINTS.ENROLL_COURSE}/${courseId}/enroll`, {
      method: 'POST',
    });

    if (response.success) {
      console.log('✅ Successfully enrolled in course:', courseId);
    }

    return response;
  }

  async getEnrolledCourses() {
    return this.request(API_ENDPOINTS.ENROLLED_COURSES);
  }

  // Public course methods
  async getCourseCategories() {
    return this.request(API_ENDPOINTS.COURSE_CATEGORIES);
  }

  // Legacy methods (for backward compatibility)
  async getCourses() {
    return this.browseCourses();
  }

  async getCourse(courseId: string) {
    return this.getCourseDetails(courseId);
  }
}

export default new ApiService();
