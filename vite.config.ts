import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'map-vendor': ['mapbox-gl', 'react-map-gl', '@turf/turf'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers/zod', 'zod'],
          'analytics-vendor': ['mixpanel-browser']
        }
      }
    }
  }
});