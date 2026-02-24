import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

/**
 * Vite config do módulo boilerplate.
 * O módulo é um REMOTE do Module Federation — expõe App e Widget para o chassi consumir.
 * Ao rodar localmente, o chassi backend detecta o módulo via /manifest.json (porta 5001).
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'boilerplate',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './Widget': './src/Widget.tsx',
      },
      // Shared deve espelhar exatamente o chassi para evitar duplicação
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
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
    port: 5001,
    strictPort: false,
    cors: true,
    // Expõe o manifest.json na raiz do dev server
    middlewareMode: false,
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
