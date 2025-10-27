/**
 * API Configuration
 * Frontend API client for backend integration with comprehensive profile features
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

/**
 * Create API function with proper authentication and typing
 */
const createApiFunction = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  options: {
    requiresAuth?: boolean;
    isFormData?: boolean;
    customHeaders?: Record<string, string>;
  } = {}
) => {
  return async (data?: any) => {
    try {
      const { requiresAuth = true, isFormData = false, customHeaders = {} } = options;

      const headers: Record<string, string> = {};

      // Add authentication header if required
      if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // Set content type based on data format
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      // Add custom headers
      Object.assign(headers, customHeaders);

      const config: RequestInit = {
        method,
        headers,
      };

      // Handle different data formats
      if (data) {
        if (isFormData) {
          // For FormData (file uploads)
          config.body = data;
        } else {
          // For JSON data
          config.body = JSON.stringify(data);
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle unauthorized responses
      if (response.status === 401) {
        // For profile endpoint, don't redirect - let the frontend handle it
        if (endpoint === '/profile' && method === 'GET') {
          throw new Error('401: Authentication required');
        }

        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      const result = await response.json();

      // Handle API errors
      if (!result.success && response.status >= 400) {
        throw new Error(result.message || 'API request failed');
      }

      return result;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);

      // Network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }

      throw error;
    }
  };
};

/**
 * API endpoints organized by feature with full backend alignment
 */
export const api = {
  // Authentication endpoints
  auth: {
    signup: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username: string;
      nativeLanguage?: string;
      targetLanguage?: string;
      country?: string;
      proficiencyLevel?: string;
    }) => createApiFunction('POST', '/auth/register', { requiresAuth: false })(data),

    login: (data: { email: string; password: string }) =>
      createApiFunction('POST', '/auth/login', { requiresAuth: false })(data),

    logout: () => createApiFunction('POST', '/auth/logout')(),

    getProfile: () => createApiFunction('GET', '/auth/profile')(),

    updateProfile: (data: any) => createApiFunction('PUT', '/auth/profile')(data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      createApiFunction('POST', '/auth/change-password')(data),

    refreshToken: (data: { refreshToken: string }) =>
      createApiFunction('POST', '/auth/refresh-token', { requiresAuth: false })(data),
  },

  // Profile management endpoints (comprehensive system)
  profile: {
    // Basic profile operations
    get: () => createApiFunction('GET', '/profile')(),
    update: (data: any) => createApiFunction('PUT', '/profile')(data),

    // Password management
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      createApiFunction('POST', '/profile/change-password')(data),

    // File upload endpoints (new comprehensive system)
    uploadAvatar: (data: FormData) =>
      createApiFunction('POST', '/profile/avatar-optimized', {
        requiresAuth: true,
        isFormData: true
      })(data),

    uploadDocument: (data: FormData) =>
      createApiFunction('POST', '/profile/document', {
        requiresAuth: true,
        isFormData: true
      })(data),

    deleteFile: (fileType: string, fileKey: string) =>
      createApiFunction('DELETE', `/profile/file/${fileType}/${fileKey}`)(),

    getFileUrl: (fileKey: string, expiresIn?: number) =>
      createApiFunction('GET', `/profile/file/${fileKey}${expiresIn ? `?expiresIn=${expiresIn}` : ''}`)(),

    // Legacy photo upload (maintained for compatibility)
    uploadPhoto: (data: FormData) => {
      return fetch(`${API_BASE_URL}/profile/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: data,
      }).then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.message || 'Upload failed');
        }
        return result;
      });
    },
  },

  // User management endpoints
  user: {
    getStats: () => createApiFunction('GET', '/user/stats')(),
    getLevel: () => createApiFunction('GET', '/user/level')(),
    initialize: (data: { userName?: string; userEmail?: string }) =>
      createApiFunction('POST', '/user/initialize')(data),
    addXP: (data: { xpAmount: number; reason?: string }) =>
      createApiFunction('POST', '/user/xp')(data),
    updateSession: () => createApiFunction('PUT', '/user/session')(),
    updateSkills: (skills: any) => createApiFunction('PUT', '/user/skills')(skills),
    update: (data: { firstName?: string; lastName?: string; username?: string }) =>
      createApiFunction('PUT', '/user/profile')(data),
  },

  // Progress tracking endpoints
  progress: {
    calculateXPReward: (data: { action: string; multiplier?: number; customXP?: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-reward')(data),
    getLevelInfo: (data: { totalXP: number }) =>
      createApiFunction('POST', '/progress/get-level-info')(data),
    calculateXPForLevel: (data: { level: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-for-level')(data),
    calculateXPForNextLevel: (data: { currentLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-for-next-level')(data),
    calculateLevelFromXP: (data: { totalXP: number }) =>
      createApiFunction('POST', '/progress/calculate-level-from-xp')(data),
    calculateCurrentLevelXP: (data: { totalXP: number; currentLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-current-level-xp')(data),
    calculateXPToNextLevel: (data: { totalXP: number; currentLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-to-next-level')(data),
    checkLevelUp: (data: { oldXP: number; newXP: number }) =>
      createApiFunction('POST', '/progress/check-level-up')(data),
    calculateTotalXPForLevel: (data: { targetLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-total-xp-for-level')(data),
    updateProgress: (userId: string, data: { xpAmount?: number; accuracy?: number; skills?: any }) =>
      createApiFunction('POST', `/progress/${userId}/update`)(data),
  },

  // User level management endpoints
  level: {
    getUserLevel: (userId: string) => createApiFunction('GET', `/level/${userId}`)(),
    initializeUserLevel: (data: { userId: string; userName?: string; userEmail?: string }) =>
      createApiFunction('POST', '/level/initialize')(data),
    addXP: (userId: string, data: { xpAmount: number; reason?: string }) =>
      createApiFunction('POST', `/level/${userId}/xp`)(data),
    updateSession: (userId: string) => createApiFunction('POST', `/level/${userId}/session`)(),
    updateSkills: (userId: string, skills: any) =>
      createApiFunction('PUT', `/level/${userId}/skills`)(skills),
    getStats: (userId: string) => createApiFunction('GET', `/level/${userId}/stats`)(),
  },

  // Accuracy analysis endpoints
  accuracy: {
    analyzeMessage: (data: { userMessage: string; aiResponse?: string }) =>
      createApiFunction('POST', '/accuracy/analyze')(data),
  },

  // Admin endpoints
  admin: {
    getUsers: () => createApiFunction('GET', '/admin/users')(),
    getAnalytics: () => createApiFunction('GET', '/admin/analytics')(),
    updateUser: (id: string, data: any) => createApiFunction('PUT', `/admin/users/${id}`)(data),
  },

  // Health check and monitoring
  health: {
    check: () => createApiFunction('GET', '/health', { requiresAuth: false })(),
    getMetrics: () => createApiFunction('GET', '/metrics', { requiresAuth: false })(),
    getApiDocs: () => createApiFunction('GET', '/api-docs.json', { requiresAuth: false })(),
  },
};

/**
 * API Response types for better TypeScript support
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
  requestId?: string;
}

export interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName?: string;
  username?: string;
  targetLanguage: string;
  nativeLanguage?: string;
  country?: string;
  proficiencyLevel: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

export interface ProfileData {
  full_name: string;
  avatar_url?: string;
  bio: string;
  isPremium: boolean;
  location: string;
  phone: string;
  address: string;
  personalInfo: {
    dateOfBirth?: string;
    gender: string;
    nationality: string;
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
  };
  role: string;
  experienceLevel: string;
  field: string;
  goals: string[];
  interests: string[];
  professionalInfo: {
    company: string;
    position: string;
    experienceYears?: number;
    industry: string;
    skills: string[];
    resumeUrl?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear?: number;
    endYear?: number | null;
    grade?: string;
    isCurrentlyEnrolled: boolean;
    educationLevel: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
    skills: string[];
    isVerified: boolean;
  }>;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
    size?: number;
    uploadedAt: string;
  }>;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
    portfolio?: string;
  };
  learningPreferences: {
    preferredLearningStyle: string;
    dailyLearningGoal: number;
    weeklyLearningGoal: number;
    targetEnglishLevel: string;
    focusAreas: string[];
  };
  privacySettings: {
    profileVisibility: string;
    activityTracking: Record<string, boolean>;
    communicationPreferences: Record<string, boolean>;
  };
}
