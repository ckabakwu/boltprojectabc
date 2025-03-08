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
  static instance = null;

  constructor() {
    if (SESService.instance) {
      return SESService.instance;
    }
    SESService.instance = this;
  }

  async testConnection() {
    try {
      // Verify AWS credentials are configured
      if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
        console.error('AWS credentials not configured');
        return false;
      }

      const testTemplate = {
        subject: 'HomeMaidy Email Service Test',
        html: `
          <h2>Test Email</h2>
          <p>This is a test email to verify the AWS SES integration.</p>
          <p>If you received this email, the service is working correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        `,
        text: 'This is a test email to verify the AWS SES integration. If you received this email, the service is working correctly.'
      };

      const command = new SendEmailCommand({
        Source: import.meta.env.VITE_AWS_SES_FROM_EMAIL || 'noreply@homemaidy.com',
        Destination: {
          ToAddresses: ['test@example.com']
        },
        Message: {
          Subject: {
            Data: testTemplate.subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: testTemplate.html,
              Charset: 'UTF-8'
            },
            Text: {
              Data: testTemplate.text,
              Charset: 'UTF-8'
            }
          }
        }
      });

      await ses.send(command);
      return true;
    } catch (error) {
      console.error('SES connection test failed:', error);
      return false;
    }
  }

  async sendEmail(options) {
    try {
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
      console.error('Failed to send email:', error);
      return false;
    }
  }
}

export const sesService = new SESService();