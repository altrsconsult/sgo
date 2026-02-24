import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mensagem de erro (se houver) */
  error?: string;
}

/**
 * Componente Input do Design System SGO.
 *
 * Campo de entrada de texto com suporte a estados de erro, desabilitado e foco.
 * Utiliza tokens CSS para bordas, backgrounds e cores de texto.
 *
 * @component
 * @example
 * <Input placeholder="Digite seu e-mail" type="email" />
 * <Input error="Campo obrigatório" />
 * <Input type="password" disabled />
 *
 * @props
 * @param {string} [type="text"] - Tipo do input (text, email, password, etc)
 * @param {string} [error] - Mensagem de erro exibida abaixo do input (torna a borda vermelha)
 * @param {string} [placeholder] - Texto placeholder
 * @param {boolean} [disabled] - Desabilita o input
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
