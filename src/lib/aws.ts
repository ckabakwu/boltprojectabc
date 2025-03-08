import { SESClient, SendEmailCommand, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { EmailTemplate } from './emailTemplates';

// Initialize SES client
const ses = new SESClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

interface EmailOptions {
  to: string | string[];
  template: EmailTemplate;
  metadata?: Record<string, any>;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const command = new SendEmailCommand({
      Source: import.meta.env.VITE_AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: Array.isArray(options.to) ? options.to : [options.to]
      },
      Message: {
        Subject: {
          Data: options.template.subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: options.template.html,
            Charset: 'UTF-8'
          },
          Text: {
            Data: options.template.text,
            Charset: 'UTF-8'
          }
        }
      },
      Tags: [
        {
          Name: 'template',
          Value: options.template.subject
        },
        {
          Name: 'environment',
          Value: import.meta.env.MODE
        }
      ]
    });

    const response = await ses.send(command);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const verifyEmailAddress = async (email: string): Promise<boolean> => {
  try {
    const command = new SendEmailCommand({
      Source: import.meta.env.VITE_AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: 'Verify Your Email Address',
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: `
              <h2>Email Verification</h2>
              <p>Please verify your email address by clicking the link below:</p>
              <p><a href="${import.meta.env.VITE_APP_URL}/verify-email?token=${generateVerificationToken()}">
                Verify Email Address
              </a></p>
            `,
            Charset: 'UTF-8'
          }
        }
      }
    });

    await ses.send(command);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
};

function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}