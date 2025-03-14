import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from './analytics';
import toast from 'react-hot-toast';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'provider' | 'customer';
  full_name: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, role: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearError: () => void;
  isAdmin: boolean;
  isProvider: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...context,
    isAdmin: context.user?.role === 'admin'
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  const navigate = useNavigate();

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const profile = localStorage.getItem('user-profile') || sessionStorage.getItem('user-profile');
        if (profile) {
          setState(prev => ({
            ...prev,
            user: JSON.parse(profile),
            loading: false
          }));
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, role: string, fullName: string) => {
    try {
      setState(prev => ({ ...prev, error: null, loading: true }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email,
              full_name: fullName,
              role,
              status: 'pending'
            });

          if (profileError) throw profileError;
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
        }

        mixpanel.track('User Registration', {
          email,
          role,
          timestamp: new Date().toISOString()
        });

        setState(prev => ({ ...prev, loading: false }));
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/login', { 
          replace: true,
          state: { message: 'Please check your email for verification link.' }
        });
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, error: null, loading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get the user's role from metadata
        const role = data.user.user_metadata?.role || 'customer';

        // Create user profile
        const userProfile = {
          id: data.user.id,
          email: data.user.email,
          role: role,
          full_name: data.user.user_metadata?.full_name || '',
          status: 'active',
          avatar_url: data.user.user_metadata?.avatar_url
        };

        // Store the profile
        localStorage.setItem('user-profile', JSON.stringify(userProfile));

        setState(prev => ({
          ...prev,
          loading: false,
          user: userProfile 
        }));

        toast.success('Login successful');

        // Route based on user role
        switch (role) {
          case 'admin':
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'provider':
            navigate('/pro-dashboard', { replace: true });
            break;
          case 'customer':
          default:
            navigate('/customer-dashboard', { replace: true });
            break;
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (state.user) {
        mixpanel.track('User Logout', {
          userId: state.user.id,
          timestamp: new Date().toISOString()
        });
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear stored profile
      localStorage.removeItem('user-profile');
      sessionStorage.removeItem('user-profile');

      setState(prev => ({ ...prev, user: null, error: null }));
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('Sign out error:', error);
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  const resetPassword = async (email: string) => {
    // Implement password reset logic
  };

  const updatePassword = async (newPassword: string) => {
    // Implement password update logic
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      clearError,
      isAdmin: state.user?.role === 'admin',
      isProvider: state.user?.role === 'provider',
      isCustomer: state.user?.role === 'customer'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;