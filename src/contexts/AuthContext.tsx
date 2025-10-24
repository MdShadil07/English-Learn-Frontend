import React, { createContext, useContext, useEffect, useState } from 'react';

// Custom User interface for MongoDB-based authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
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
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!(user || localStorage.getItem('accessToken'));

  const refreshUser = async () => {
    try {
      console.log('🔄 AuthContext: refreshUser called');
      // Check if we have custom API tokens
      const accessToken = localStorage.getItem('accessToken');
      console.log('🔑 AuthContext refreshUser: Access token found:', !!accessToken);

      if (accessToken) {
        // Check if we have cached user data first
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          try {
            const userData = JSON.parse(cachedUserData);
            console.log('✅ AuthContext refreshUser: Using cached user data');
            setUser(userData);
            return;
          } catch (parseError) {
            console.error('❌ AuthContext refreshUser: Error parsing cached user data:', parseError);
            localStorage.removeItem('userData');
          }
        }

        console.log('📡 AuthContext refreshUser: Calling profile API...');
        // Try to get user profile from API
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 AuthContext refreshUser: Profile API response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('📡 AuthContext refreshUser: Profile API result:', result);

          if (result.success && result.data?.user) {
            // Cache user data in localStorage for faster access
            localStorage.setItem('userData', JSON.stringify(result.data.user));
            console.log('✅ AuthContext refreshUser: User created and cached from API response');
            setUser(result.data.user);
            return;
          }
        } else if (response.status === 401) {
          // Only clear tokens if we get a 401 (unauthorized) response
          console.log('🚨 AuthContext refreshUser: 401 response, clearing invalid tokens');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          setUser(null);
          return;
        }
        // For other errors (network, server errors, etc.), don't clear tokens
        console.log('⚠️ AuthContext refreshUser: API call failed, keeping tokens');
      }

      // No valid tokens found
      setUser(null);
    } catch (error) {
      console.error('❌ AuthContext refreshUser: Error:', error);
      // Don't clear tokens on network errors, just set user to null
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);

      // Clear custom API tokens and cached user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');

      // Call API logout if we have a refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
        } catch (error) {
          console.error('Error calling API logout:', error);
        }
      }

      setUser(null);
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🚀 AuthContext: Initializing authentication check...');
        // Check for custom API tokens
        const accessToken = localStorage.getItem('accessToken');
        console.log('🔑 AuthContext initial: Access token found:', !!accessToken);

        if (accessToken) {
          // Check if we have cached user data first
          const cachedUserData = localStorage.getItem('userData');
          if (cachedUserData) {
            try {
              const userData = JSON.parse(cachedUserData);
              console.log('✅ AuthContext initial: Using cached user data');
              setUser(userData);
              setIsLoading(false);
              return;
            } catch (parseError) {
              console.error('❌ AuthContext initial: Error parsing cached user data:', parseError);
              localStorage.removeItem('userData');
            }
          }

          console.log('📡 AuthContext initial: Calling profile API for initial auth...');
          // Try to get user profile from API
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('📡 AuthContext initial: Profile API response status:', response.status);

          if (response.ok) {
            const result = await response.json();
            console.log('📡 AuthContext initial: Profile API result:', result);

            if (result.success && result.data?.user) {
              // Cache user data in localStorage for faster access
              localStorage.setItem('userData', JSON.stringify(result.data.user));
              console.log('✅ AuthContext initial: User authenticated via API tokens');
              setUser(result.data.user);
              setIsLoading(false);
              return;
            }
          } else if (response.status === 401) {
            // Only clear tokens if we get a 401 (unauthorized) response
            console.log('🚨 AuthContext initial: 401 response, clearing invalid tokens');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
          }
          // For other errors (network, server errors, etc.), don't clear tokens
        }

        // No valid tokens found
        setUser(null);
      } catch (error) {
        console.error('❌ AuthContext initial: Error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for localStorage changes (for custom API tokens)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        if (e.newValue) {
          // Token was set, get user profile (but don't clear on failure)
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${e.newValue}`,
              'Content-Type': 'application/json',
            },
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 401) {
              // Only clear tokens if we get a 401 (unauthorized) response
              console.log('🚨 Storage handler: 401 response, clearing invalid tokens');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userData');
              setUser(null);
              return null;
            }
            // For other errors, don't clear tokens
            throw new Error(`HTTP ${response.status}`);
          })
          .then(result => {
            if (result && result.success && result.data?.user) {
              localStorage.setItem('userData', JSON.stringify(result.data.user));
              setUser(result.data.user);
            }
          })
          .catch(error => {
            console.error('Storage handler: Error fetching user profile:', error);
            // Don't clear tokens on network errors or other failures
          });
        } else {
          // Token was removed
          setUser(null);
        }
      }
    };

    // Listen for localStorage changes in the same window
    const handleLocalStorageChange = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data?.user) {
              localStorage.setItem('userData', JSON.stringify(result.data.user));
              setUser(result.data.user);
            }
          } else if (response.status === 401) {
            // Only clear tokens if we get a 401 (unauthorized) response
            console.log('🚨 LocalStorage handler: 401 response, clearing invalid tokens');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            setUser(null);
          }
          // For other errors, don't clear tokens
        } catch (error) {
          console.error('Error in localStorage change handler:', error);
          // Don't clear tokens on network errors
        }
      } else {
        setUser(null);
      }
    };

    // Check immediately for localStorage changes
    handleLocalStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleLocalStorageChange);
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
