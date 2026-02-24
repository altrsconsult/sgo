import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

/**
 * Entry point do módulo — usado apenas em modo standalone (pnpm dev).
 * Quando carregado pelo chassi via Module Federation, App é importado diretamente.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
