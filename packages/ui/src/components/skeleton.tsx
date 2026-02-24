import { cn } from "../lib/utils";

/**
 * Componente Skeleton do Design System SGO.
 * Usado para mostrar placeholders enquanto o conteúdo carrega.
 * 
 * @example
 * <Skeleton className="h-12 w-12 rounded-full" />
 * <Skeleton className="h-4 w-[250px]" />
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
