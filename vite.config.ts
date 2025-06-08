import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/phonepe': {
        target: 'https://api.phonepe.com/apis/hermes',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/phonepe/, ''),
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Forward all headers from the original request
            if (req.headers['x-verify']) {
              proxyReq.setHeader('X-VERIFY', req.headers['x-verify']);
            }
            if (req.headers['x-merchant-id']) {
              proxyReq.setHeader('X-MERCHANT-ID', req.headers['x-merchant-id']);
            }
            // Log the request for debugging
            console.log('Proxy Request:', {
              url: proxyReq.path,
              headers: proxyReq.getHeaders()
            });
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Log the response for debugging
            console.log('Proxy Response:', {
              statusCode: proxyRes.statusCode,
              headers: proxyRes.headers,
              url: req.url
            });
          });
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization, X-VERIFY, X-MERCHANT-ID'
        }
      }
    }
  }
});