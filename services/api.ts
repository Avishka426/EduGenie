import { API_ENDPOINTS, FINAL_API_BASE_URL } from '@/config/api';
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
    this.baseURL = FINAL_API_BASE_URL;
    console.log('🌐 API Service initialized with base URL:', this.baseURL);
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

      console.log('🔄 API Request:', url, { 
        method: config.method, 
        hasToken: !!token,
        body: config.body 
      });

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', response.status, errorText);
        
        // Handle authentication errors
        if (response.status === 401) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        return {
          success: false,
          error: errorData.message || errorData.error || `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      console.log('📡 API Response:', response.status, data);

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

  // Connection test method
  async testConnection(): Promise<{
    success: boolean;
    url: string;
    error?: string;
    details?: any;
  }> {
    const testUrl = `${this.baseURL}/api/health`;
    
    try {
      console.log('🧪 Testing connection to:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const isSuccess = response.ok;
      const data = await response.text();

      return {
        success: isSuccess,
        url: testUrl,
        details: {
          status: response.status,
          statusText: response.statusText,
          data: data,
        }
      };
    } catch (error) {
      console.error('🧪 Connection test failed:', error);
      
      return {
        success: false,
        url: testUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          errorType: error?.constructor?.name,
          message: error instanceof Error ? error.message : String(error),
        }
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

  async uploadProfilePicture(imageUri: string) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const token = await AsyncStorage.getItem('authToken');
      
      console.log('🔄 Uploading profile picture:', imageUri);
      console.log('🔄 Upload URL:', `${this.baseURL}${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}`);
      console.log('🔄 Upload headers:', { Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'No token' });
      
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - let React Native set it automatically with boundary
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      console.log('📡 Upload response:', response.status, data);

      if (!response.ok) {
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
      console.error('❌ Profile picture upload error:', error);
      return {
        success: false,
        error: 'Failed to upload profile picture',
      };
    }
  }

  async removeProfilePicture() {
    return this.request(API_ENDPOINTS.REMOVE_PROFILE_PICTURE, {
      method: 'DELETE',
    });
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
    return this.request(`/api/courses/${courseId}/students`);
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

  // GPT-3 Course Recommendation methods
  async getCourseRecommendations(prompt: string) {
    return this.request('/api/gpt/recommendations', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async getPopularCourses() {
    // Fallback to regular courses endpoint until GPT popular endpoint is implemented
    try {
      const response = await this.request('/api/gpt/popular');
      return response;
    } catch {
      // Fallback to regular courses and format as popular courses
      console.log('GPT popular endpoint not available, using regular courses');
      const coursesResponse = await this.request('/courses');
      
      if (coursesResponse.success && coursesResponse.data && coursesResponse.data.courses) {
        // Transform regular courses to popular courses format
        const popularCourses = coursesResponse.data.courses
          .sort((a: any, b: any) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
          .slice(0, 6) // Get top 6 most enrolled courses
          .map((course: any) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            instructorName: course.instructorName,
            duration: course.duration,
            price: course.price,
            enrollmentCount: course.enrollmentCount || 0,
            popularity: course.enrollmentCount > 2 ? "Most Enrolled" : 
                       course.enrollmentCount > 1 ? "Popular" : "New"
          }));

        return {
          success: true,
          data: {
            message: "Popular courses retrieved successfully",
            courses: popularCourses,
            metadata: {
              totalCourses: popularCourses.length,
              sortedBy: "enrollment_count"
            }
          }
        };
      }
      
      return coursesResponse;
    }
  }

  async getGPTUsage() {
    return this.request('/api/gpt/usage');
  }
}

export default new ApiService();
