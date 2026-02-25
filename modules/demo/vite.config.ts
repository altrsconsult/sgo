import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Módulo Demo — build standalone (iframe no chassi).
 * Sem Module Federation: React embutido, base relativa para /modules-assets/.
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sgo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@sgo/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
    },
  },
  server: {
    port: 5010,
    host: true,
    cors: true,
    allowedHosts: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    outDir: 'dist',
  },
});
