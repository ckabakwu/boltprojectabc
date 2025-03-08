import { sesService } from './ses';
import { EmailTemplate } from './emailTemplates';
import mixpanel from './analytics';

interface EmailOptions {
  to: string;
  template: EmailTemplate;
  metadata?: Record<string, any>;
}

class EmailService {
  private static instance: EmailService;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<boolean> {
    // In development, just log the email and return success
    if (import.meta.env.DEV) {
      console.log('Development mode - Email would be sent:', {
        to: options.to,
        subject: options.template.subject,
        metadata: options.metadata
      });
      return true;
    }

    let attempts = 0;
    let success = false;

    while (attempts < this.maxRetries && !success) {
      try {
        // Send email using AWS SES
        const result = await sesService.sendEmail({
          to: options.to,
          subject: options.template.subject,
          html: options.template.html,
          text: options.template.text
        });
        
        if (!result) {
          throw new Error('Failed to send email via SES');
        }

        // Track successful email send in analytics
        mixpanel.track('Email Sent', {
          template: this.getTemplateName(options.template),
          timestamp: new Date().toISOString(),
          ...options.metadata
        });

        success = true;
        return true;
      } catch (error) {
        attempts++;
        console.warn(`Email send attempt ${attempts} failed:`, error);
        
        if (attempts === this.maxRetries) {
          // Log final failure
          await this.logFailure(options, error);
          return false;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempts));
      }
    }

    return false;
  }

  private async logFailure(options: EmailOptions, error: any): Promise<void> {
    try {
      // Log to analytics
      mixpanel.track('Email Send Failed', {
        template: this.getTemplateName(options.template),
        error: error.message,
        timestamp: new Date().toISOString(),
        ...options.metadata
      });

      // Log to database if needed
      if (!import.meta.env.DEV) {
        await this.logToDatabase(options, error);
      }
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }
  }

  private async logToDatabase(options: EmailOptions, error: any): Promise<void> {
    try {
      const { data, error: dbError } = await supabase
        .from('email_log')
        .insert([{
          to: options.to,
          template_name: this.getTemplateName(options.template),
          status: 'failed',
          error: error.message,
          metadata: options.metadata
        }]);

      if (dbError) throw dbError;
    } catch (dbError) {
      console.error('Failed to log email error to database:', dbError);
    }
  }

  private getTemplateName(template: EmailTemplate): string {
    // Extract template name from the template content
    const content = template.html || template.text;
    const matches = content.match(/<h2>(.*?)<\/h2>/);
    return matches ? matches[1].toLowerCase().replace(/\s+/g, '_') : 'unknown_template';
  }
}

export const emailService = EmailService.getInstance();