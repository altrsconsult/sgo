import React from 'react';
import { Package } from 'lucide-react';
import type { ModuleContext } from '@sgo/sdk';

interface AppProps {
  context?: ModuleContext;
}

/**
 * Componente principal do módulo boilerplate.
 * Tela de estado vazio simples — substitua pelo conteúdo real do seu módulo.
 */
export default function App({ context: _context }: AppProps) {
  return (
    <div className="module-root">
      <div className="module-empty">
        <div className="module-empty-icon">
          <Package className="module-empty-icon-svg" />
        </div>
        <h2 className="module-empty-title">Nenhum item ainda</h2>
        <p className="module-empty-desc">
          Este módulo ainda não possui dados. Substitua este componente
          pela lógica do seu módulo.
        </p>
      </div>
    </div>
  );
}
