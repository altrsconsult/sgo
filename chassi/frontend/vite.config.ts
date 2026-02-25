import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

/**
 * Vite config do chassi — HOST do Module Federation
 * Consome módulos remotos descobertos dinamicamente pelo backend em runtime.
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'chassi',
      remotes: {},
      // singleton garante uma única instância de React entre host e remotes
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '^5.0.0' },
        zustand: { singleton: true, requiredVersion: '^5.0.0' },
      } as unknown as Record<string, { singleton: boolean; requiredVersion: string }>,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sgo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@sgo/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
    },
  },
  server: {
    // Frontend em dev (pnpm dev) na 5173; backend fica no Docker (3001)
    port: Number(process.env.VITE_DEV_FRONTEND_PORT) || 5173,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    // Proxy para o backend (Docker na 3001)
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.VITE_API_PORT || '3001'}`,
        changeOrigin: true,
      },
      '/modules-assets': {
        target: `http://localhost:${process.env.VITE_API_PORT || '3001'}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: false,
    outDir: 'dist',
    sourcemap: false,
  },
});
