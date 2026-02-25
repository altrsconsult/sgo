import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './styles/globals.css';

/**
 * Ponte com o chassi: detecta iframe, aplica fundo transparente e sincroniza tema.
 * Padrão idêntico aos módulos Edukaead (modules-lab).
 */
function initChassisBridge() {
  if (typeof window === 'undefined') return;

  /* Quando rodando em iframe dentro do chassi: fundo transparente */
  if (window.self !== window.top) {
    document.documentElement.classList.add('in-chassis');
    const injectTransparent = () => {
      if (document.getElementById('sgo-module-in-chassis-transparent')) return;
      const style = document.createElement('style');
      style.id = 'sgo-module-in-chassis-transparent';
      style.textContent = `
        html.in-chassis,
        html.in-chassis body,
        html.in-chassis #root,
        html.in-chassis #root > *,
        html.in-chassis #root > * > *,
        html.in-chassis #root > * > * > *,
        html.dark.in-chassis,
        html.dark.in-chassis body,
        html.dark.in-chassis #root,
        html.dark.in-chassis #root > *,
        html.dark.in-chassis #root > * > *,
        html.dark.in-chassis #root > * > * > * {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        html.in-chassis #root, html.in-chassis #root > * { min-height: 100%; }
      `;
      document.head.appendChild(style);
    };
    injectTransparent();
    setTimeout(injectTransparent, 0);
  }

  /* Ouve mensagens do chassi: tema e token */
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'sgo-auth' && data.token) {
      localStorage.setItem('sgo-token', data.token);
    }
    if (data.type === 'sgo-theme' && (data.theme === 'light' || data.theme === 'dark')) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(data.theme);
    }
  });
}
initChassisBridge();

/**
 * Entry point do módulo — modo standalone (pnpm dev).
 * No chassi, o módulo é carregado em iframe a partir do dist/index.html.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
