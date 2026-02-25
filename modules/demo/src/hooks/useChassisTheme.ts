import { useEffect } from 'react';

/**
 * Ouve o postMessage do chassi e aplica a classe dark/light no <html>.
 * O chassi envia: { type: "sgo-theme", theme: "dark" | "light" }
 * Também aplica o tema inicial pelo localStorage do chassi (sgo-theme)
 * para o caso de o módulo abrir direto sem receber a mensagem.
 */
export function useChassisTheme() {
  useEffect(() => {
    /* Aplica tema inicial via localStorage do chassi (quando disponível) */
    const stored = localStorage.getItem('sgo-theme');
    if (stored === 'dark' || stored === 'group') {
      applyTheme('dark');
    } else if (stored === 'light' || stored === 'minimal') {
      applyTheme('light');
    }

    /* Ouve mensagens do chassi pai */
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'sgo-theme') {
        applyTheme(event.data.theme as 'dark' | 'light');
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
}

/** Aplica classe dark/light no elemento <html> */
function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
}
