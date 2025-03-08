import { sesService } from './ses';

export async function sendTestEmail() {
  try {
    const success = await sesService.testConnection();
    
    if (success) {
      console.log('Test email sent successfully');
      return {
        success: true,
        message: 'Test email sent successfully'
      };
    } else {
      console.error('Failed to send test email');
      return {
        success: false,
        message: 'Failed to send test email'
      };
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      message: `Error sending test email: ${error.message}`
    };
  }
}

// Execute test email send
sendTestEmail();