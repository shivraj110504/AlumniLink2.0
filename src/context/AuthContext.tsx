
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

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
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const isAuthenticated = !!user;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession && currentSession.user) {
          // Fetch user profile data including role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setUser(null);
          } else if (profileData) {
            setUser({
              id: profileData.id,
              name: profileData.name,
              role: profileData.role as 'student' | 'alumni',
              email: profileData.email
            });
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession && currentSession.user) {
        // Fetch user profile data including role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setUser(null);
          setSession(null);
        } else if (profileData) {
          setUser({
            id: profileData.id,
            name: profileData.name,
            role: profileData.role as 'student' | 'alumni',
            email: profileData.email
          });
          setSession(currentSession);
          
          // Auto-navigate to dashboard if authenticated and on login page
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/login') {
            profileData.role === 'student' 
              ? navigate('/student-dashboard')
              : navigate('/alumni-dashboard');
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signup = async (email: string, password: string, name: string, role: 'student' | 'alumni') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created successfully",
        description: "You can now login with your credentials",
      });
      
      return;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // Verify the role matches
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, name, id, email')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profileData) {
          throw new Error('Could not verify user role');
        }

        if (profileData.role !== role) {
          // Role mismatch - log out and throw error
          await supabase.auth.signOut();
          throw new Error(`You cannot login as a ${role} with these credentials`);
        }

        // Set user immediately to avoid delay in UI updates
        setUser({
          id: profileData.id,
          name: profileData.name,
          role: profileData.role as 'student' | 'alumni',
          email: profileData.email
        });
        
        setSession(data.session);

        // Login successful - redirect to appropriate dashboard
        if (role === 'student') {
          navigate('/student-dashboard', { replace: true });
        } else {
          navigate('/alumni-dashboard', { replace: true });
        }

        toast({
          title: "Logged in successfully",
          description: `Welcome back!`,
        });
      }
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
      setLoading(true);
      
      // First clear the local state
      setUser(null);
      setSession(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup,
      logout, 
      isAuthenticated,
      loading,
      session
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
