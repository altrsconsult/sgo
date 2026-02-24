import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * Variantes do botão com ícone usando class-variance-authority.
 * Botões quadrados com ícone centralizado e ripple suave no hover.
 */
const iconButtonVariants = cva(
  // Base: quadrado, ícone centralizado, transição suave
  "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-shrink-0",
  {
    variants: {
      variant: {
        // Primário (cor sólida com hover)
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        // Secundário
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        // Sem background, apenas hover
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        // Ícone apenas, com hover sutil
        minimal: "text-foreground hover:text-foreground/90 active:text-foreground/70",
        // Perigoso (vermelho)
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
      },
      size: {
        // Pequeno (32px)
        sm: "h-8 w-8 [&_svg]:size-4",
        // Médio (40px) - padrão
        md: "h-10 w-10 [&_svg]:size-5",
        // Grande (48px)
        lg: "h-12 w-12 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Ícone (ReactNode, geralmente um SVG ou ícone do lucide-react) */
  icon: React.ReactNode;
  /** Rótulo ARIA para acessibilidade (obrigatório) */
  ariaLabel: string;
}

/**
 * Componente IconButton do Design System SGO.
 *
 * Botão quadrado com ícone, otimizado para ações secundárias e controles.
 * Utiliza tokens CSS para cores e suporta múltiplos tamanhos e variantes.
 *
 * @component
 * @example
 * <IconButton icon={<Check />} ariaLabel="Confirmar" variant="default" />
 * <IconButton icon={<X />} ariaLabel="Fechar" variant="ghost" size="sm" />
 * <IconButton icon={<Trash />} ariaLabel="Deletar" variant="destructive" />
 *
 * @props
 * @param {React.ReactNode} icon - Ícone a ser exibido (SVG ou componente)
 * @param {string} ariaLabel - Rótulo ARIA para acessibilidade (obrigatório)
 * @param {string} [variant="default"] - Estilo: default, secondary, ghost, minimal, destructive
 * @param {string} [size="md"] - Tamanho: sm, md, lg
 * @param {boolean} [disabled] - Desabilita o botão
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      ariaLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        aria-label={ariaLabel}
        title={ariaLabel}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
