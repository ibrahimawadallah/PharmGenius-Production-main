import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DEV_API_PORT = process.env.VITE_API_PORT || '3001';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure assets are loaded from root
  server: {
    port: parseInt(process.env.VITE_PORT || '5173'),
    strictPort: false,
    proxy: {
      // Proxy any request starting with /api to the backend server
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://pharmgenius-production-production.up.railway.app'
          : `http://localhost:${DEV_API_PORT}`,
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});