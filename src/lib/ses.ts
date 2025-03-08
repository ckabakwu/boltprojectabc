import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client with environment variables from Vite
const ses = new SESClient({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
  }
});

class SESService {
  private static instance: SESService;

  private constructor() {}

  public static getInstance(): SESService {
    if (!SESService.instance) {
      SESService.instance = new SESService();
    }
    return SESService.instance;
  }

  public async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text: string;
  }): Promise<boolean> {
    try {
      // Skip sending in development
      if (import.meta.env.DEV) {
        console.log('Email sending simulated in development:', options);
        return true;
      }

      // Verify AWS credentials are configured
      if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
        console.warn('AWS credentials not configured - email service disabled');
        return false;
      }

      const command = new SendEmailCommand({
        Source: import.meta.env.VITE_AWS_SES_FROM_EMAIL || 'noreply@homemaidy.com',
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to]
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: options.html,
              Charset: 'UTF-8'
            },
            Text: {
              Data: options.text,
              Charset: 'UTF-8'
            }
          }
        }
      });

      await ses.send(command);
      return true;
    } catch (error) {
      console.warn('Failed to send email:', error);
      return false;
    }
  }
}

export const sesService = SESService.getInstance();