import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite config do módulo boilerplate.
 * Padrão iframe: o módulo builda como app standalone (dist/index.html).
 * Ao rodar localmente, o chassi backend detecta o módulo via /manifest.json (porta 5001).
 */
export default defineConfig({
  plugins: [react()],
  // Base relativa para funcionar dentro de /modules-assets/<slug>/dist/
  base: "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sgo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@sgo/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
    },
  },
  server: {
    port: 5001,
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
