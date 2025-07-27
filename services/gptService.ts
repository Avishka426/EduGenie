import ApiService from './api';

export interface CourseRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructorName: string;
  duration: number;
  price: number;
  recommendationReason: string;
}

export interface GPTRecommendationResponse {
  message: string;
  prompt: string;
  recommendations: CourseRecommendation[];
  aiResponse: string;
  metadata: {
    totalAvailableCourses: number;
    recommendationsCount: number;
    apiCallsUsed: number;
    remainingApiCalls: number;
  };
}

export interface GPTUsageResponse {
  message: string;
  usage: {
    callsUsed: number;
    remainingCalls: number;
    maxCalls: number;
    usagePercentage: number;
  };
  warning?: string;
}

export interface PopularCoursesResponse {
  message: string;
  courses: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    instructorName: string;
    duration: number;
    price: number;
    enrollmentCount: number;
    popularity: string;
  }[];
  metadata: {
    totalCourses: number;
    sortedBy: string;
  };
}

class GPTService {
  /**
   * Get AI-powered course recommendations based on user prompt
   * Only available for students
   */
  static async getCourseRecommendations(prompt: string): Promise<{
    success: boolean;
    data?: GPTRecommendationResponse;
    error?: string;
  }> {
    try {
      if (!prompt || prompt.trim().length === 0) {
        return {
          success: false,
          error: 'Please provide a valid prompt describing your learning goals'
        };
      }

      console.log('🔧 GPTService: Making API call with prompt:', prompt.trim());
      const response = await ApiService.getCourseRecommendations(prompt.trim());
      console.log('🔧 GPTService: API response received:', response);

      if (response.success && response.data) {
        // Handle the nested data structure from backend
        const backendData = response.data.data || response.data;
        
        console.log('🔧 GPTService: Processing backend data:', backendData);
        
        return {
          success: true,
          data: {
            message: backendData.message || 'AI recommendations generated successfully',
            prompt: backendData.prompt || prompt.trim(),
            recommendations: backendData.recommendations || [],
            aiResponse: backendData.aiResponse || '',
            metadata: backendData.metadata || {
              totalAvailableCourses: 0,
              recommendationsCount: 0,
              apiCallsUsed: 0,
              remainingApiCalls: 250
            }
          }
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to get course recommendations'
        };
      }
    } catch (error) {
      console.error('🔧 GPTService: Error getting course recommendations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  /**
   * Get popular courses as fallback when AI is unavailable
   */
  static async getPopularCourses(): Promise<{
    success: boolean;
    data?: PopularCoursesResponse;
    error?: string;
  }> {
    try {
      const response = await ApiService.getPopularCourses();

      if (response.success) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to get popular courses'
        };
      }
    } catch (error) {
      console.error('Error getting popular courses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  /**
   * Get API usage statistics
   * Only available for instructors and admins
   */
  static async getAPIUsage(): Promise<{
    success: boolean;
    data?: GPTUsageResponse;
    error?: string;
  }> {
    try {
      const response = await ApiService.getGPTUsage();

      if (response.success) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to get API usage statistics'
        };
      }
    } catch (error) {
      console.error('Error getting API usage:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  /**
   * Validate prompt before sending to API
   */
  static validatePrompt(prompt: string): { valid: boolean; error?: string } {
    if (!prompt || prompt.trim().length === 0) {
      return { valid: false, error: 'Prompt cannot be empty' };
    }

    if (prompt.trim().length < 10) {
      return { valid: false, error: 'Please provide a more detailed description of your learning goals' };
    }

    if (prompt.trim().length > 500) {
      return { valid: false, error: 'Prompt is too long. Please keep it under 500 characters' };
    }

    return { valid: true };
  }

  /**
   * Get sample prompts for users
   */
  static getSamplePrompts(): string[] {
    return [
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
    ];
  }
}

export default GPTService;
