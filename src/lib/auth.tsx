import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import { emailService } from './emailService';
import { welcomeTemplates } from './emailTemplates';
import { passwordService } from './passwordService';
import mixpanel from './analytics';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'provider' | 'customer';
  full_name: string;
  avatar_url?: string;
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
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for changes on auth state 
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setState(prev => ({ ...prev, user: null, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: data,
        loading: false,
        error: null
      }));

      // Track user identification in analytics
      mixpanel.identify(userId);
      mixpanel.people.set({
        $email: data.email,
        $name: data.full_name,
        role: data.role,
        last_login: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setState(prev => ({
        ...prev,
        error: 'Error fetching user profile',
        loading: false
      }));
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // First try regular sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // If regular sign in fails, check for temporary credentials
        const { data: tempCreds, error: tempError } = await supabase
          .from('temp_admin_auth')
          .select('*')
          .eq('email', email)
          .eq('used', false)
          .gt('expires_at', new Date().toISOString())
          .maybeSingle();

        if (tempError) throw tempError;

        if (tempCreds) {
          // Verify the password matches
          const { data: pwMatch } = await supabase.rpc('verify_temp_password', {
            temp_pw: password,
            stored_hash: tempCreds.password_hash
          });

          if (!pwMatch) {
            throw new Error('Invalid credentials');
          }

          // Get user role
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('email', email)
            .single();

          if (userError || !userData) {
            throw new Error('User not found');
          }

          // Verify admin role
          if (userData.role !== 'admin') {
            throw new Error('Access denied. Admin only.');
          }

          // Mark temporary credentials as used
          await supabase
            .from('temp_admin_auth')
            .update({ used: true })
            .eq('id', tempCreds.id);

          // Create password reset request
          await supabase
            .from('password_reset_audit')
            .insert([{
              email: email,
              status: 'requested',
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }]);

          // Redirect to password reset
          navigate('/reset-password');
          return;
        }

        throw error;
      }

      // Fetch user role and validate access
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user?.id)
        .single();

      if (!userData) {
        throw new Error('User not found');
      }

      // Check admin access
      if (email.endsWith('@admin.homemaidy.com') && userData.role !== 'admin') {
        throw new Error('Admin access not found');
      }

      // Track successful login
      mixpanel.track('User Login', {
        email,
        role: userData.role,
        timestamp: new Date().toISOString()
      });

      // Redirect based on role
      switch (userData.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'provider':
          navigate('/pro-dashboard');
          break;
        case 'customer':
          navigate('/customer-dashboard');
          break;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Invalid email or password'
      }));
      
      mixpanel.track('Login Failed', {
        email,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };

  const signUp = async (email: string, password: string, role: string, fullName: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // Prevent admin role creation through signup
      if (role === 'admin') {
        throw new Error('Admin accounts cannot be created through signup');
      }

      // Validate password strength
      const validation = passwordService.validatePassword(password);
      if (!validation.isValid) {
        throw new Error(validation.feedback.warning || 'Password is not strong enough');
      }

      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role
          }
        }
      });

      if (authError) throw authError;

      if (authData?.user) {
        // Send welcome email
        const template = welcomeTemplates[role as 'customer' | 'provider']({
          name: fullName,
          activationLink: `${window.location.origin}/activate?token=${authData.user.confirmation_token}`
        });

        await emailService.sendEmail({
          to: email,
          template,
          metadata: {
            type: 'welcome',
            userId: authData.user.id
          }
        });

        // Track successful registration
        mixpanel.track('User Registration', {
          email,
          role,
          timestamp: new Date().toISOString()
        });

        // Redirect based on role
        switch (role) {
          case 'provider':
            navigate('/pro-dashboard');
            break;
          case 'customer':
            navigate('/customer-dashboard');
            break;
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({ ...prev, error: error.message }));
      
      mixpanel.track('Registration Failed', {
        email,
        role,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Track logout
      if (state.user) {
        mixpanel.track('User Logout', {
          userId: state.user.id,
          timestamp: new Date().toISOString()
        });
      }

      setState(prev => ({ ...prev, user: null }));
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const success = await passwordService.initiatePasswordReset(email);
      
      if (!success) {
        throw new Error('Failed to initiate password reset');
      }

      // Track password reset request
      mixpanel.track('Password Reset Requested', {
        email,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Password reset error:', error);
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // Validate new password
      const validation = passwordService.validatePassword(newPassword);
      if (!validation.isValid) {
        throw new Error(validation.feedback.warning || 'Password is not strong enough');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Track password update
      if (state.user) {
        mixpanel.track('Password Updated', {
          userId: state.user.id,
          timestamp: new Date().toISOString()
        });
      }

      // If this was a temporary admin password, redirect to dashboard
      if (state.user?.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Password update error:', error);
      setState(prev => ({ ...prev, error: error.message }));
    }
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