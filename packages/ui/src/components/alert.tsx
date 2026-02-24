import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * Variantes de Alert com ícones e cores semânticas.
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 flex gap-3",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
        error: "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Mapeamento de ícones por variante
 */
const iconVariantMap: Record<string, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 flex-shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 flex-shrink-0" />,
  error: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
  info: <Info className="h-5 w-5 flex-shrink-0" />,
  default: <Info className="h-5 w-5 flex-shrink-0" />,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Variante de estilo (success, warning, error, info) */
  variant?: "default" | "success" | "warning" | "error" | "info";
  /** Título da alerta (opcional) */
  title?: string;
  /** Mensagem principal */
  message: string;
  /** Permite fechar a alerta */
  closable?: boolean;
  /** Callback ao fechar */
  onClose?: () => void;
}

/**
 * Molecule: Alert
 * Container de mensagens semânticas com ícones e cores.
 *
 * @example
 * <Alert variant="success" message="Salvo com sucesso!" />
 * <Alert
 *   variant="error"
 *   title="Erro na operação"
 *   message="Verifique os dados e tente novamente"
 *   closable
 *   onClose={() => console.log('fechou')}
 * />
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "default",
      title,
      message,
      closable,
      onClose,
      className,
      role,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const handleClose = () => {
      setIsOpen(false);
      onClose?.();
    };

    if (!isOpen && closable) {
      return null;
    }

    // Role semântica: error/warning → alert, outras → status
    const semanticRole =
      role ||
      (variant === "error" || variant === "warning" ? "alert" : "status");

    return (
      <div
        ref={ref}
        role={semanticRole}
        aria-live={variant === "error" || variant === "warning" ? "assertive" : "polite"}
        className={cn(alertVariants({ variant, className }))}
        {...props}
      >
        {/* Ícone */}
        <div className="flex-shrink-0 mt-0.5">
          {iconVariantMap[variant] || iconVariantMap.default}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>

        {/* Botão de fechar */}
        {closable && (
          <button
            onClick={handleClose}
            className={cn(
              "flex-shrink-0 opacity-50 hover:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "rounded transition-opacity"
            )}
            aria-label="Fechar alerta"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
