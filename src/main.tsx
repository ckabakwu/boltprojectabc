import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import mixpanel from './lib/analytics';
import { apiMonitor } from './lib/apiMonitor';
import { errorMonitor } from './lib/errorMonitor';
import { securityMonitor } from './lib/securityMonitor';

// Initialize monitoring
apiMonitor.startMonitoring();

// Test event to verify Mixpanel is working
mixpanel.track('Application Started');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);