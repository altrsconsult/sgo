/**
 * EmptyState — componente visual para listas/tabelas sem dados.
 * Exibe ícone, título e mensagem descritiva. Suporta ação opcional (botão).
 */

import * as React from "react";
import { cn } from "../lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ícone ilustrativo (componente React, ex: Lucide icon) */
  icon?: React.ReactNode;
  /** Título principal */
  title: string;
  /** Descrição complementar */
  description?: string;
  /** Ação sugerida (ex: botão "Criar novo") */
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
export type { EmptyStateProps };
