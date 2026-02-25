import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/** Contexto do sidebar: estado colapsado para filhos (nav, módulos) */
type SidebarContextValue = { collapsed: boolean };
const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar deve ser usado dentro de Sidebar");
  return ctx;
}

/**
 * Variantes do container Sidebar
 */
const sidebarVariants = cva(
  "border-r bg-background transition-[width] duration-300 overflow-y-auto flex-shrink-0",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  /** Itens de navegação (opcional; se não informado, use children) */
  items?: SidebarItem[];
  /** Se true, sidebar fica colapsada (apenas ícones). Controlado quando onToggleCollapse é passado. */
  collapsed?: boolean;
  /** Callback ao colapsar/expandir — quando passado, estado é controlado (persistir em localStorage no app). */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Largura quando expandido (usa token --sidebar-width-expanded) */
  size?: "default" | "lg";
  /** Conteúdo do cabeçalho (ex.: Logo + título); exibido quando expandido. */
  headerContent?: React.ReactNode;
  /** Conteúdo do rodapé (ex.: link Voltar, versão). */
  footerContent?: React.ReactNode;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: number | string;
  submenu?: SidebarItem[];
}

/**
 * Container principal do Sidebar
 * Organism: Compõe Nav, Items com suporte a submenu
 */
const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      variant,
      size = "default",
      items,
      collapsed: controlledCollapsed,
      onToggleCollapse,
      headerContent,
      footerContent,
      children,
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = React.useState(false);
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

    const isControlled = onToggleCollapse != null;
    const isCollapsed = isControlled ? (controlledCollapsed ?? false) : internalCollapsed;

    React.useEffect(() => {
      if (isControlled && controlledCollapsed !== undefined) {
        setInternalCollapsed(controlledCollapsed);
      }
    }, [isControlled, controlledCollapsed]);

    const handleToggle = () => {
      const next = !isCollapsed;
      if (!isControlled) setInternalCollapsed(next);
      onToggleCollapse?.(next);
    };

    const toggleSubmenu = (itemId: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) next.delete(itemId);
        else next.add(itemId);
        return next;
      });
    };

    return (
      <SidebarContext.Provider value={{ collapsed: isCollapsed }}>
        <aside
          ref={ref}
          className={cn(
            sidebarVariants({ variant }),
            isCollapsed ? "sidebar--collapsed" : cn("sidebar--expanded", size === "lg" && "sidebar--size-lg"),
            className
          )}
          role="complementary"
          aria-label="Sidebar navigation"
          {...props}
        >
          <div className="flex flex-col h-full min-h-0">
            {/* Cabeçalho: conteúdo opcional (expandido) + gatilho de colapso; alinhado ao eixo dos ícones */}
            <div className={cn(
              "flex items-center border-b px-2 py-3 flex-shrink-0 sidebar-header",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && (
                <div className="sidebar-header__logo-axis flex items-center min-w-0 flex-1">
                  {headerContent}
                </div>
              )}
              <button
                type="button"
                onClick={handleToggle}
                className="sidebar-trigger p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
                aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                title={isCollapsed ? "Expandir" : "Colapsar"}
              >
                <svg
                  className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-4 min-h-0">
              {items != null && items.length > 0 ? (
                <SidebarNav
                  items={items}
                  collapsed={isCollapsed}
                  expandedItems={expandedItems}
                  onToggleSubmenu={toggleSubmenu}
                />
              ) : (
                children
              )}
            </nav>
            {footerContent != null && (
              <div className="flex-shrink-0 border-t px-2 py-3">
                {footerContent}
              </div>
            )}
          </div>
        </aside>
      </SidebarContext.Provider>
    );
  }
);
Sidebar.displayName = "Sidebar";

/**
 * Container de itens do sidebar
 */
interface SidebarNavProps {
  items: SidebarItem[];
  collapsed: boolean;
  expandedItems: Set<string>;
  onToggleSubmenu: (itemId: string) => void;
}

const SidebarNav = React.forwardRef<HTMLUListElement, SidebarNavProps>(
  ({ items, collapsed, expandedItems, onToggleSubmenu }, ref) => {
    return (
      <ul ref={ref} className="space-y-1">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            isExpanded={expandedItems.has(item.id)}
            onToggleSubmenu={() => onToggleSubmenu(item.id)}
            level={0}
          />
        ))}
      </ul>
    );
  }
);
SidebarNav.displayName = "SidebarNav";

/**
 * Item individual do sidebar (recursivo para subitens)
 */
interface SidebarItemComponentProps {
  item: SidebarItem;
  collapsed: boolean;
  isExpanded: boolean;
  onToggleSubmenu: () => void;
  level: number;
}

const SidebarItem = React.forwardRef<HTMLLIElement, SidebarItemComponentProps>(
  ({ item, collapsed, isExpanded, onToggleSubmenu, level }, ref) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    const handleClick = () => {
      if (hasSubmenu) {
        onToggleSubmenu();
      } else {
        item.onClick?.();
      }
    };

    return (
      <li ref={ref}>
        <button
          onClick={handleClick}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
            item.active
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            level > 0 && "ml-4"
          )}
          title={collapsed ? item.label : undefined}
        >
          <span className="flex items-center gap-3 flex-1 min-w-0">
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            {!collapsed && <span className="truncate">{item.label}</span>}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {item.badge && !collapsed && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold">
                {item.badge}
              </span>
            )}
            {hasSubmenu && !collapsed && (
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded ? "rotate-90" : ""
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Submenu */}
        {hasSubmenu && isExpanded && !collapsed && (
          <ul className="space-y-1 mt-1">
            {item.submenu!.map((subitem) => (
              <SidebarItem
                key={subitem.id}
                item={subitem}
                collapsed={false}
                isExpanded={false}
                onToggleSubmenu={() => {}}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
);
SidebarItem.displayName = "SidebarItem";

export { Sidebar, SidebarNav, SidebarItem };
