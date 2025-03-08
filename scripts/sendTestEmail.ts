import { sesService } from '../src/lib/ses';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    const success = await sesService.testConnection();
    console.log(success ? 'Test email sent successfully!' : 'Failed to send test email');
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Error sending test email:', error);
    process.exit(1);
  }
}

main();