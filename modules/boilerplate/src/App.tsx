import React from 'react';
import type { ModuleContext } from '@sgo/sdk';

interface AppProps {
  context?: ModuleContext;
}

/**
 * Componente principal do módulo — renderizado dentro do layout do chassi.
 * Recebe o ModuleContext como prop quando carregado pelo chassi.
 */
export default function App({ context }: AppProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Boilerplate Module</h1>
      <p className="text-muted-foreground">
        Substitua este componente com a lógica do seu módulo.
      </p>
      {context && (
        <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto">
          {JSON.stringify(context, null, 2)}
        </pre>
      )}
    </div>
  );
}
