import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

interface AuthUser {
  id: string;
  name: string;
  role: 'student' | 'alumni';
  email: string;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: 'student' | 'alumni') => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'student' | 'alumni') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set up axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add a request interceptor to include the auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (token) {
          // Verify token and get user data
          const response = await axios.get(`${API_URL}/auth/me`);
          setUser(response.data);

          // Auto-navigate to dashboard if authenticated and on login page
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/login') {
            response.data.role === 'student'
              ? navigate('/student-dashboard')
              : navigate('/alumni-dashboard');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Sign up a new user
  const signup = async (email: string, password: string, name: string, role: 'student' | 'alumni') => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role
      });

      const { token, user } = response.data;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Set the user in state
      setUser(user);

      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on role
      if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/alumni-dashboard');
      }

      toast({
        title: 'Account created successfully',
        description: 'Welcome to AlumniLink!',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string, role: 'student' | 'alumni') => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        role
      });

      const { token, user } = response.data;

      // Verify the role matches
      if (user.role !== role) {
        throw new Error(`You cannot login as a ${role} with these credentials`);
      }

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Set the user in state
      setUser(user);

      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on role
      if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/alumni-dashboard');
      }

      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');

      toast({
        title: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
