import * as React from "react";
import { cn } from "../lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientação do separador */
  orientation?: "horizontal" | "vertical";
  /** Se o separador é decorativo (não lido por screen readers) */
  decorative?: boolean;
}

/**
 * Componente Separator do Design System SGO.
 *
 * Linha divisória visual entre seções ou elementos.
 * Utiliza token CSS --border para cor e suporta orientações horizontal/vertical.
 *
 * @component
 * @example
 * <Separator />
 * <Separator orientation="vertical" className="h-4" />
 *
 * @props
 * @param {string} [orientation="horizontal"] - Direção: horizontal ou vertical
 * @param {boolean} [decorative=true] - Se é puramente decorativo (não lido por screen readers)
 * @param {string} [className] - Classes CSS adicionais
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };
