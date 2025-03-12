import Cookies from 'js-cookie';
import { supabase } from './supabase';
import mixpanel from './analytics';

const SESSION_COOKIE = 'sb-session';
const REFRESH_COOKIE = 'sb-refresh-token';
const USER_ROLE_COOKIE = 'user-role';

class SessionService {
  private static instance: SessionService;

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  public async restoreSession(): Promise<boolean> {
    try {
      const session = Cookies.get(SESSION_COOKIE);
      const refreshToken = Cookies.get(REFRESH_COOKIE);

      if (!session && !refreshToken) {
        return false;
      }

      if (session) {
        // Validate existing session
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          // Get user role
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (userData) {
            Cookies.set(USER_ROLE_COOKIE, userData.role, {
              secure: true,
              sameSite: 'Strict'
            });
          }
          return true;
        }
      }

      if (refreshToken) {
        // Try to refresh the session
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (!error && session) {
          this.saveSession(session);
          return true;
        }
      }

      // Clear invalid session data
      this.clearSession();
      return false;
    } catch (error) {
      console.error('Error restoring session:', error);
      this.clearSession();
      return false;
    }
  }

  public async saveSession(session: any, userRole?: string): Promise<void> {
    try {
      // Add session expiry check
      const expiresAt = new Date(session.expires_at);
      if (expiresAt < new Date()) {
        await this.clearSession();
        throw new Error('Session expired');
      }

      // Save session data with expiry
      Cookies.set(SESSION_COOKIE, session.access_token, {
        expires: new Date(session.expires_at),
        secure: true,
        sameSite: 'Strict'
      });

      if (session.refresh_token) {
        Cookies.set(REFRESH_COOKIE, session.refresh_token, {
          expires: 30, // 30 days
          secure: true,
          sameSite: 'Strict'
        });
      }

      // Save user role if provided
      if (userRole) {
        Cookies.set(USER_ROLE_COOKIE, userRole, {
          secure: true,
          sameSite: 'Strict'
        });
      }

      // Track session in analytics
      if (session.user) {
        mixpanel.identify(session.user.id);
        mixpanel.people.set({
          $last_login: new Date().toISOString(),
          role: userRole
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  public clearSession(): void {
    Cookies.remove(SESSION_COOKIE);
    Cookies.remove(REFRESH_COOKIE);
    Cookies.remove(USER_ROLE_COOKIE);
    mixpanel.reset();
  }

  public isSessionValid(): boolean {
    return !!Cookies.get(SESSION_COOKIE);
  }

  public getAccessToken(): string | null {
    return Cookies.get(SESSION_COOKIE) || null;
  }

  public getUserRole(): string | null {
    return Cookies.get(USER_ROLE_COOKIE) || null;
  }
}

export const sessionService = SessionService.getInstance();