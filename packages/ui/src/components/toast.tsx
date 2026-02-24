import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

/**
 * Tipos de variante para Toast.
 * - success: mensagem de sucesso (verde)
 * - error: mensagem de erro (vermelho)
 * - warning: mensagem de aviso (amarelo)
 * - info: mensagem informativa (azul)
 */
type ToastVariant = "success" | "error" | "warning" | "info";

/**
 * Posições possíveis para o Toast na tela.
 */
type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

/**
 * Estilos base do Toast usando CVA.
 */
const toastVariants = cva(
  // Estilos base: flex, padding, border, sombra
  "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      variant: {
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

/**
 * Interface para ação no Toast (ex: botão "Desfazer").
 */
interface ToastAction {
  label: string;
  onClick: () => void;
}

/**
 * Props do componente Toast.
 */
interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  /** Mensagem principal do Toast */
  message: React.ReactNode;
  /** Variante visual (success, error, warning, info) */
  variant?: ToastVariant;
  /** Tempo em ms para auto-descartar (0 = never) */
  duration?: number;
  /** Callback ao fechar */
  onClose?: () => void;
  /** Ação adicional (botão + callback) */
  action?: ToastAction;
  /** Se deve mostrar ícone automático */
  showIcon?: boolean;
}

/**
 * Mapa de ícones por variante.
 */
const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="size-5 flex-shrink-0" />,
  error: <AlertCircle className="size-5 flex-shrink-0" />,
  warning: <AlertTriangle className="size-5 flex-shrink-0" />,
  info: <Info className="size-5 flex-shrink-0" />,
};

/**
 * Componente Toast - Notificação temporária com auto-dismiss.
 *
 * @example
 * <Toast variant="success" message="Salvo com sucesso!" duration={4000} />
 * <Toast variant="error" message="Algo deu errado" action={{ label: "Tentar novamente", onClick: () => {} }} />
 */
const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      message,
      variant = "info",
      duration = 4000,
      onClose,
      action,
      showIcon = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    // Auto-dismiss após duration (se > 0)
    React.useEffect(() => {
      if (duration <= 0) return;

      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {/* Ícone automático baseado na variante */}
        {showIcon && (
          <div className="mt-0.5">
            {iconMap[variant]}
          </div>
        )}

        {/* Conteúdo: mensagem + ação */}
        <div className="flex flex-1 items-center gap-3">
          <div className="flex-1">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>

          {action && (
            <button
              onClick={action.onClick}
              className="whitespace-nowrap font-semibold underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-1"
              aria-label={action.label}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Botão de fechar */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 flex-shrink-0 text-current opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          aria-label="Fechar notificação"
        >
          <X className="size-5" />
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";

export { Toast, type ToastProps, type ToastAction, type ToastVariant, type ToastPosition };
