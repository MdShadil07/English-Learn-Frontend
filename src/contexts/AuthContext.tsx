import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { api } from '@/utils/api';
import { queryKeys, queryOptions } from '@/utils/queryKeys';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  fullName: string;
  avatar?: string;
  targetLanguage: string;
  proficiencyLevel: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
  refreshUser: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Unified user profile query - single source of truth
  const {
    data: userData,
    isLoading,
    error,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: queryKeys.global.currentUser(),
    queryFn: async () => {
      console.log('🔄 AuthProvider: Fetching user profile via React Query...');

      try {
        // Try main profile API first (consistent with EditProfile)
        const result = await api.profile.get();
        console.log('📡 AuthProvider: Profile API result:', result);

        if (result.success && result.data) {
          // Transform to consistent format
          const transformedUser: User = {
            id: result.data.user?._id || result.data.user?.id || '1',
            email: result.data.user?.email || 'user@example.com',
            firstName: result.data.user?.firstName || '',
            lastName: result.data.user?.lastName || '',
            username: result.data.user?.username || '',
            fullName: result.data.user?.fullName || result.data.user?.displayName || result.data.profile?.displayName || 'User',
            avatar: result.data.user?.avatar || result.data.user?.avatar_url || result.data.profile?.avatar_url || undefined,
            targetLanguage: result.data.profile?.targetLanguage || result.data.user?.targetLanguage || 'English',
            proficiencyLevel: result.data.profile?.proficiencyLevel || result.data.user?.proficiencyLevel || 'beginner',
            role: result.data.user?.role || 'student',
            isEmailVerified: true, // Assume verified if we have profile data
            createdAt: result.data.user?.createdAt || new Date().toISOString(),
            lastLoginAt: result.data.user?.lastLoginAt,
          };

          console.log('✅ AuthProvider: User data transformed and cached');
          return transformedUser;
        }
      } catch (error) {
        console.error('❌ AuthProvider: Main profile API failed, trying auth API:', error);

        // If it's a 401 error, the user is not authenticated
        if (error instanceof Error && (error.message.includes('401') || error.message.includes('unauthorized'))) {
          console.log('🚫 AuthProvider: User not authenticated (401)');
          throw new Error('Not authenticated');
        }

        // Fallback to auth API
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const authResult = await authService.getProfile(accessToken);
          if (authResult.success && authResult.data?.user) {
            console.log('✅ AuthProvider: Fallback to auth API successful');
            return authResult.data.user;
          }
        }

        // If fallback also fails, throw the original error
        throw error;
      }
    },
    ...queryOptions.user,
    enabled: true, // Always enabled for authenticated users
    staleTime: 30 * 1000, // 30 seconds for user data
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        console.log('🚫 AuthContext: 401 error detected, not retrying');
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update local user state when query data changes
  useEffect(() => {
    if (userData) {
      console.log('🔄 AuthProvider: User state updated from React Query');
      setUser(userData);
      // Update localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
    } else if (error) {
      console.log('🚨 AuthProvider: User authentication failed, clearing data');
      // Only clear data if it's an authentication error, not other types of errors
      if (error.message === 'Not authenticated' || error.message?.includes('401') || error.message?.includes('unauthorized')) {
        console.log('🚫 AuthProvider: Authentication error detected, clearing user data');
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
  }, [userData, error]);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('ℹ️ AuthProvider: No access token found, user not authenticated');
        setUser(null);
        return;
      }

      // Check if we have cached user data
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        try {
          const userData = JSON.parse(cachedUserData);
          console.log('✅ AuthProvider: Using cached user data');
          setUser(userData);
        } catch (parseError) {
          console.error('❌ AuthProvider: Error parsing cached user data:', parseError);
          localStorage.removeItem('userData');
        }
      }

      // Always refetch to ensure fresh data
      refetchUserData();
    };

    initializeAuth();

    // Listen for localStorage changes (cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'userData') {
        console.log('🔄 AuthProvider: Storage changed, reinitializing auth');
        initializeAuth();
      }
    };

    // Listen for manual auth updates (e.g., profile changes)
    const handleAuthUpdate = (event: CustomEvent) => {
      console.log('🔄 AuthProvider: Manual auth update received:', event.detail);
      setUser(event.detail);
      queryClient.setQueryData(queryKeys.global.currentUser(), event.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authUpdate', handleAuthUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authUpdate', handleAuthUpdate as EventListener);
    };
  }, [refetchUserData, queryClient]);

  // Sign out function
  const signOut = useCallback(async () => {
    console.log('🚪 AuthProvider: Signing out user');
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('❌ AuthProvider: Logout API call failed:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');

      // Clear React Query cache
      queryClient.clear();

      // Reset user state
      setUser(null);

      console.log('✅ AuthProvider: User signed out successfully');
    }
  }, [queryClient]);

  // Refresh user data
  const refreshUser = useCallback(() => {
    console.log('🔄 AuthProvider: Manual user refresh requested');
    refetchUserData();
  }, [refetchUserData]);

  // Update user data (for optimistic updates)
  const updateUser = useCallback((updates: Partial<User>) => {
    console.log('🔄 AuthProvider: Updating user data:', updates);
    setUser(prev => prev ? { ...prev, ...updates } : null);
    queryClient.setQueryData(queryKeys.global.currentUser(), (prev: User | undefined) =>
      prev ? { ...prev, ...updates } : prev
    );
  }, [queryClient]);

  // Check authentication status
  const isAuthenticated = !!user && !error;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isLoading || (!user && !error), // Loading if no user data and no error
    signOut,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
