import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Force Vite to always use polling for file changes
      usePolling: true,
      // Increase interval to reduce CPU usage
      interval: 100
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
