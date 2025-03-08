import { supabase } from './supabase';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// System Notification Templates
export const systemTemplates = {
  maintenanceAlert: (details: { startTime: string; duration: string; impact: string }): EmailTemplate => ({
    subject: 'Scheduled Maintenance Notice',
    html: `
      <h2>Scheduled Maintenance Notice</h2>
      <p>Our system will undergo scheduled maintenance:</p>
      <ul>
        <li>Start Time: ${details.startTime}</li>
        <li>Estimated Duration: ${details.duration}</li>
        <li>Impact: ${details.impact}</li>
      </ul>
      <p>We apologize for any inconvenience.</p>
    `,
    text: `Scheduled Maintenance Notice\n\nStart Time: ${details.startTime}\nDuration: ${details.duration}\nImpact: ${details.impact}`
  }),

  errorAlert: (details: { error: string; component: string; timestamp: string }): EmailTemplate => ({
    subject: 'System Error Alert',
    html: `
      <h2>System Error Detected</h2>
      <p>A system error has been detected:</p>
      <ul>
        <li>Component: ${details.component}</li>
        <li>Error: ${details.error}</li>
        <li>Time: ${details.timestamp}</li>
      </ul>
    `,
    text: `System Error Alert\n\nComponent: ${details.component}\nError: ${details.error}\nTime: ${details.timestamp}`
  }),

  performanceAlert: (details: { metric: string; threshold: string; value: string }): EmailTemplate => ({
    subject: 'Performance Alert',
    html: `
      <h2>Performance Threshold Exceeded</h2>
      <p>A performance metric has exceeded its threshold:</p>
      <ul>
        <li>Metric: ${details.metric}</li>
        <li>Threshold: ${details.threshold}</li>
        <li>Current Value: ${details.value}</li>
      </ul>
    `,
    text: `Performance Alert\n\nMetric: ${details.metric}\nThreshold: ${details.threshold}\nCurrent Value: ${details.value}`
  })
};

// User Welcome Templates
export const welcomeTemplates = {
  customer: (details: { name: string; activationLink: string }): EmailTemplate => ({
    subject: 'Welcome to HomeMaidy!',
    html: `
      <h2>Welcome to HomeMaidy, ${details.name}!</h2>
      <p>Thank you for choosing HomeMaidy for your cleaning needs. We're excited to help you maintain a clean and comfortable home.</p>
      <h3>Getting Started</h3>
      <ol>
        <li>Activate your account: <a href="${details.activationLink}">Click here</a></li>
        <li>Complete your profile</li>
        <li>Book your first cleaning</li>
      </ol>
      <h3>Key Features</h3>
      <ul>
        <li>Easy online booking</li>
        <li>Secure payments</li>
        <li>Professional cleaners</li>
        <li>Satisfaction guarantee</li>
      </ul>
    `,
    text: `Welcome to HomeMaidy, ${details.name}!\n\nThank you for choosing HomeMaidy. To get started:\n1. Activate your account: ${details.activationLink}\n2. Complete your profile\n3. Book your first cleaning`
  }),

  provider: (details: { name: string; activationLink: string }): EmailTemplate => ({
    subject: 'Welcome to the HomeMaidy Team!',
    html: `
      <h2>Welcome to the HomeMaidy Team, ${details.name}!</h2>
      <p>We're excited to have you join our network of professional cleaners.</p>
      <h3>Next Steps</h3>
      <ol>
        <li>Activate your account: <a href="${details.activationLink}">Click here</a></li>
        <li>Complete your profile and background check</li>
        <li>Set up your availability</li>
        <li>Start accepting jobs</li>
      </ol>
    `,
    text: `Welcome to the HomeMaidy Team, ${details.name}!\n\nTo get started:\n1. Activate your account: ${details.activationLink}\n2. Complete your profile and background check\n3. Set up your availability\n4. Start accepting jobs`
  })
};

// Password Management Templates
export const passwordTemplates = {
  reset: (details: { resetLink: string; expiresIn: string }): EmailTemplate => ({
    subject: 'Reset Your HomeMaidy Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your HomeMaidy password. Click the link below to set a new password:</p>
      <p><a href="${details.resetLink}">Reset Password</a></p>
      <p>This link will expire in ${details.expiresIn}.</p>
      <h3>Security Tips</h3>
      <ul>
        <li>Use a strong, unique password</li>
        <li>Never share your password</li>
        <li>Enable two-factor authentication</li>
      </ul>
      <p>If you didn't request this reset, please ignore this email or contact support.</p>
    `,
    text: `Password Reset Request\n\nClick here to reset your password: ${details.resetLink}\n\nThis link will expire in ${details.expiresIn}.\n\nIf you didn't request this reset, please ignore this email or contact support.`
  }),

  changed: (details: { timestamp: string; ipAddress: string }): EmailTemplate => ({
    subject: 'Your HomeMaidy Password Was Changed',
    html: `
      <h2>Password Change Notification</h2>
      <p>Your HomeMaidy password was changed on ${details.timestamp} from IP address ${details.ipAddress}.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `,
    text: `Your HomeMaidy password was changed on ${details.timestamp} from IP address ${details.ipAddress}.\n\nIf you didn't make this change, please contact support immediately.`
  })
};

// Booking Notification Templates
export const bookingTemplates = {
  confirmation: (details: { 
    bookingId: string;
    service: string;
    date: string;
    time: string;
    address: string;
    amount: string;
  }): EmailTemplate => ({
    subject: 'Booking Confirmation - HomeMaidy',
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Your cleaning service has been scheduled:</p>
      <ul>
        <li>Booking ID: ${details.bookingId}</li>
        <li>Service: ${details.service}</li>
        <li>Date: ${details.date}</li>
        <li>Time: ${details.time}</li>
        <li>Address: ${details.address}</li>
        <li>Amount: ${details.amount}</li>
      </ul>
      <p>Your cleaner will arrive within the scheduled time window.</p>
    `,
    text: `Booking Confirmed!\n\nBooking ID: ${details.bookingId}\nService: ${details.service}\nDate: ${details.date}\nTime: ${details.time}\nAddress: ${details.address}\nAmount: ${details.amount}`
  }),

  reminder: (details: {
    bookingId: string;
    service: string;
    date: string;
    time: string;
    address: string;
    instructions?: string;
  }): EmailTemplate => ({
    subject: 'Upcoming Cleaning Reminder - HomeMaidy',
    html: `
      <h2>Cleaning Reminder</h2>
      <p>Your cleaning service is scheduled for tomorrow:</p>
      <ul>
        <li>Service: ${details.service}</li>
        <li>Date: ${details.date}</li>
        <li>Time: ${details.time}</li>
        <li>Address: ${details.address}</li>
      </ul>
      ${details.instructions ? `<p>Special Instructions: ${details.instructions}</p>` : ''}
      <p>Please ensure access to your property at the scheduled time.</p>
    `,
    text: `Cleaning Reminder\n\nService: ${details.service}\nDate: ${details.date}\nTime: ${details.time}\nAddress: ${details.address}${details.instructions ? `\n\nSpecial Instructions: ${details.instructions}` : ''}`
  }),

  cancellation: (details: {
    bookingId: string;
    service: string;
    date: string;
    time: string;
    reason?: string;
    refundAmount?: string;
  }): EmailTemplate => ({
    subject: 'Booking Cancellation - HomeMaidy',
    html: `
      <h2>Booking Cancelled</h2>
      <p>Your cleaning service has been cancelled:</p>
      <ul>
        <li>Booking ID: ${details.bookingId}</li>
        <li>Service: ${details.service}</li>
        <li>Date: ${details.date}</li>
        <li>Time: ${details.time}</li>
        ${details.reason ? `<li>Reason: ${details.reason}</li>` : ''}
        ${details.refundAmount ? `<li>Refund Amount: ${details.refundAmount}</li>` : ''}
      </ul>
    `,
    text: `Booking Cancelled\n\nBooking ID: ${details.bookingId}\nService: ${details.service}\nDate: ${details.date}\nTime: ${details.time}${details.reason ? `\nReason: ${details.reason}` : ''}${details.refundAmount ? `\nRefund Amount: ${details.refundAmount}` : ''}`
  }),

  modification: (details: {
    bookingId: string;
    service: string;
    oldDate: string;
    oldTime: string;
    newDate: string;
    newTime: string;
    address: string;
  }): EmailTemplate => ({
    subject: 'Booking Modified - HomeMaidy',
    html: `
      <h2>Booking Modified</h2>
      <p>Your cleaning service has been modified:</p>
      <h3>Previous Schedule</h3>
      <ul>
        <li>Date: ${details.oldDate}</li>
        <li>Time: ${details.oldTime}</li>
      </ul>
      <h3>New Schedule</h3>
      <ul>
        <li>Date: ${details.newDate}</li>
        <li>Time: ${details.newTime}</li>
        <li>Service: ${details.service}</li>
        <li>Address: ${details.address}</li>
      </ul>
    `,
    text: `Booking Modified\n\nPrevious Schedule:\nDate: ${details.oldDate}\nTime: ${details.oldTime}\n\nNew Schedule:\nDate: ${details.newDate}\nTime: ${details.newTime}\nService: ${details.service}\nAddress: ${details.address}`
  })
};