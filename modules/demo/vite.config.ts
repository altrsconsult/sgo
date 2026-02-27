import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

/**
 * Vite config do módulo demo (Refatorado para Module Federation).
 * Expõe App e Widget para o chassi consumir.
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'demo',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      // Shared deve espelhar exatamente o chassi para evitar duplicação
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '^5.0.0' },
        zustand: { singleton: true, requiredVersion: '^5.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^7.1.1' },
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
    port: 5010,
    host: true,
    strictPort: false,
    cors: true,
    allowedHosts: true, // aceita Host host.docker.internal (backend no Docker)
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
