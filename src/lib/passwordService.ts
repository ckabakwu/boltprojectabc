import { supabase } from './supabase';
import { emailService } from './emailService';
import { passwordTemplates } from './emailTemplates';
import zxcvbn from 'zxcvbn';

interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: {
    warning?: string;
    suggestions: string[];
  };
}

interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

class PasswordService {
  private static instance: PasswordService;
  private readonly RESET_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MIN_PASSWORD_LENGTH = 8;

  private constructor() {}

  public static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService();
    }
    return PasswordService.instance;
  }

  public validatePassword(password: string): PasswordValidationResult {
    // Use zxcvbn for password strength estimation
    const result = zxcvbn(password);

    // Basic requirements check
    const hasMinLength = password.length >= this.MIN_PASSWORD_LENGTH;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;

    // Combine zxcvbn feedback with basic requirements
    const suggestions = [...result.feedback.suggestions];
    if (!hasMinLength) suggestions.push('Use at least 8 characters');
    if (!hasUpperCase) suggestions.push('Include at least one uppercase letter');
    if (!hasLowerCase) suggestions.push('Include at least one lowercase letter');
    if (!hasNumbers) suggestions.push('Include at least one number');
    if (!hasSpecialChar) suggestions.push('Include at least one special character (!@#$%^&*)');

    return {
      isValid,
      score: result.score,
      feedback: {
        warning: result.feedback.warning,
        suggestions
      }
    };
  }

  public async initiatePasswordReset(email: string): Promise<boolean> {
    try {
      // Generate reset token
      const token = this.generateResetToken();
      const expiresAt = new Date(Date.now() + this.RESET_TOKEN_EXPIRY);

      // Store reset token in database
      const { error: tokenError } = await supabase
        .from('password_resets')
        .insert([{
          email,
          token,
          expires_at: expiresAt,
          used: false
        }]);

      if (tokenError) throw tokenError;

      // Send reset email
      const resetLink = `${window.location.origin}/reset-password?token=${token}`;
      const template = passwordTemplates.reset({
        resetLink,
        expiresIn: '24 hours'
      });

      await emailService.sendEmail({
        to: email,
        template,
        metadata: {
          type: 'password_reset',
          timestamp: new Date().toISOString()
        }
      });

      return true;
    } catch (error) {
      console.error('Password reset initiation error:', error);
      return false;
    }
  }

  public async verifyResetToken(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('password_resets')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (error) throw error;

      // Check if token is expired
      if (new Date(data.expires_at) < new Date()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Validate token
      const { data: resetData, error: resetError } = await supabase
        .from('password_resets')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (resetError || !resetData) throw new Error('Invalid or expired token');

      // Validate new password
      const validation = this.validatePassword(newPassword);
      if (!validation.isValid) {
        throw new Error('Password does not meet requirements');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Mark token as used
      await supabase
        .from('password_resets')
        .update({ used: true, used_at: new Date() })
        .eq('token', token);

      // Send confirmation email
      if (resetData.email) {
        const template = passwordTemplates.changed({
          timestamp: new Date().toISOString(),
          ipAddress: 'Unknown' // In a real app, you'd get the actual IP
        });

        await emailService.sendEmail({
          to: resetData.email,
          template,
          metadata: {
            type: 'password_changed',
            timestamp: new Date().toISOString()
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  }

  public async setSecurityQuestions(userId: string, questions: SecurityQuestion[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('security_questions')
        .upsert(
          questions.map(q => ({
            user_id: userId,
            question: q.question,
            answer: q.answer
          }))
        );

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Security questions setup error:', error);
      return false;
    }
  }

  public async verifySecurityQuestions(userId: string, answers: Record<string, string>): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('security_questions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Verify all answers match
      return data.every(q => answers[q.id] === q.answer);
    } catch (error) {
      console.error('Security questions verification error:', error);
      return false;
    }
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2) + 
           Date.now().toString(36) + 
           Math.random().toString(36).substring(2);
  }
}

export const passwordService = PasswordService.getInstance();