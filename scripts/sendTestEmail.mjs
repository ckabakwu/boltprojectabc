import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { sesService } from '../src/lib/ses.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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