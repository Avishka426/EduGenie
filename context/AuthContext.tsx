import { UserRole } from '@/constants';
import ApiService from '@/services/api';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    // TEMPORARY: Disable API calls during startup to fix Expo Go
    console.log('⚠️ Auth initialization temporarily disabled for debugging');
    
    // Just set loading to false without any network calls
    setTimeout(() => {
      setIsLoading(false);
      console.log('✅ Auth context ready (offline mode)');
    }, 100);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await ApiService.login(email, password);
      
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        };

        setUser(userData);
        console.log('✅ Login successful for:', userData.email, 'Role:', userData.role);
        
        return {
          success: true,
          user: userData,
        };
      } else {
        console.log('❌ Login failed:', response.error);
        return {
          success: false,
          error: response.error || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during login',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    try {
      setIsLoading(true);
      const response = await ApiService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });

      if (response.success && response.data) {
        const newUser: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        };

        setUser(newUser);
        console.log('✅ Registration successful for:', newUser.email, 'Role:', newUser.role);

        return {
          success: true,
          user: newUser,
        };
      } else {
        console.log('❌ Registration failed:', response.error);
        return {
          success: false,
          error: response.error || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during registration',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
      setUser(null);
      console.log('🚪 User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
