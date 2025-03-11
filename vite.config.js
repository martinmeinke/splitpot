// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      svelte({
        compilerOptions: {
          runes: true
        }
      })
    ],
    
    // Only use proxy in development mode
    server: {
      cors: true,
      proxy: isProduction ? undefined : {
        '/socket.io': {
          target: 'http://localhost:8080',
          ws: true,
          changeOrigin: true
        }
      }
    },
    
    // Add .env variable handling for production
    define: {
      // This ensures environment variables are properly replaced at build time
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL)
    }
  };
});