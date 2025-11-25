import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthUser {
  id: string;
  name: string;
  role: 'student' | 'alumni';
  email: string;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const API_URL = 'http://localhost:5000/api/auth'; // Hardcoded for now, or use env

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('checkAuth running, token:', !!token);

      if (token) {
        try {
          const response = await fetch(`${API_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('checkAuth response:', response.status);

          if (response.ok) {
            const userData = await response.json();
            setUser({
              id: userData._id,
              name: userData.name,
              role: userData.role,
              email: userData.email,
            });
          } else {
            console.warn('checkAuth failed with status:', response.status);
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed (network/server error):', error);
          // Do NOT remove token on network error, to avoid logout loop during flaky connection
          // But if it's a persistent error, user might be stuck.
          // For now, let's keep the token but maybe set a "connection error" state?
          // Or just remove it to be safe.
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (email: string, password: string, name: string, role: 'student' | 'alumni') => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      setUser({
        id: data._id,
        name: data.name,
        role: data.role,
        email: data.email,
      });

      toast({
        title: "Account created successfully",
        description: "Welcome to AlumniLink!",
      });

      if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/alumni-dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const login = async (email: string, password: string, role: 'student' | 'alumni') => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.role !== role) {
        throw new Error(`You cannot login as a ${role} with these credentials`);
      }

      localStorage.setItem('token', data.token);
      setUser({
        id: data._id,
        name: data.name,
        role: data.role,
        email: data.email,
      });

      if (role === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else {
        navigate('/alumni-dashboard', { replace: true });
      }

      toast({
        title: "Logged in successfully",
        description: `Welcome back!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/', { replace: true });

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
