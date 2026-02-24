import React from 'react';
import type { ModuleContext } from '@sgo/sdk';

interface WidgetProps {
  context?: ModuleContext;
}

/**
 * Widget do módulo — exibido no dashboard do chassi.
 * Deve ser pequeno e informativo (card de resumo).
 */
export default function Widget({ context: _context }: WidgetProps) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <h3 className="font-semibold text-sm">Boilerplate</h3>
      <p className="text-xs text-muted-foreground mt-1">Widget de exemplo</p>
    </div>
  );
}
