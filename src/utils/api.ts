/**
 * API Configuration
 * Frontend API client for backend integration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create API function with proper typing
 */
const createApiFunction = (method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string) => {
  return async (data?: any) => {
    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  };
};

/**
 * API endpoints organized by feature
 */
export const api = {
  auth: {
    signup: (data: { email: string; password: string; fullName: string }) =>
      createApiFunction('POST', '/auth/signup')(data),
    login: (data: { email: string; password: string }) =>
      createApiFunction('POST', '/auth/login')(data),
    logout: () => createApiFunction('POST', '/auth/logout')(),
    getSession: () => createApiFunction('GET', '/auth/session')(),
  },

  user: {
    getProfile: () => createApiFunction('GET', '/profile')(),
    updateProfile: (data: any) => createApiFunction('PUT', '/profile')(data),
  },

  accuracy: {
    analyzeMessage: (data: { userMessage: string; aiResponse?: string }) =>
      createApiFunction('POST', '/accuracy/analyze')(data),
  },

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

  // Placeholder for other API endpoints
  tasks: {
    getAll: () => createApiFunction('GET', '/tasks')(),
    create: (data: any) => createApiFunction('POST', '/tasks')(data),
    update: (id: string, data: any) => createApiFunction('PUT', `/tasks/${id}`)(data),
    delete: (id: string) => createApiFunction('DELETE', `/tasks/${id}`)(),
  },

  notes: {
    getAll: () => createApiFunction('GET', '/notes')(),
    create: (data: any) => createApiFunction('POST', '/notes')(data),
    update: (id: string, data: any) => createApiFunction('PUT', `/notes/${id}`)(data),
    delete: (id: string) => createApiFunction('DELETE', `/notes/${id}`)(),
  },

  learningSessions: {
    getAll: () => createApiFunction('GET', '/sessions')(),
    create: (data: any) => createApiFunction('POST', '/sessions')(data),
    update: (id: string, data: any) => createApiFunction('PUT', `/sessions/${id}`)(data),
  },

  achievements: {
    getAll: () => createApiFunction('GET', '/achievements')(),
    unlock: (id: string) => createApiFunction('POST', `/achievements/${id}/unlock`)(),
  },

  socialLinks: {
    getAll: () => createApiFunction('GET', '/social')(),
    create: (data: any) => createApiFunction('POST', '/social')(data),
  },

  ai: {
    chat: (data: { message: string; conversationId?: string }) =>
      createApiFunction('POST', '/ai/chat')(data),
    getConversation: (id: string) => createApiFunction('GET', `/ai/conversation/${id}`)(),
  },

  profile: {
    get: () => createApiFunction('GET', '/profile')(),
    update: (data: any) => createApiFunction('PUT', '/profile')(data),
    uploadPhoto: (data: FormData) => {
      return fetch(`${API_BASE_URL}/profile/photo`, {
        method: 'POST',
        body: data,
      }).then(res => res.json());
    },
  },

  admin: {
    getUsers: () => createApiFunction('GET', '/admin/users')(),
    getAnalytics: () => createApiFunction('GET', '/admin/analytics')(),
    updateUser: (id: string, data: any) => createApiFunction('PUT', `/admin/users/${id}`)(data),
  },
};
