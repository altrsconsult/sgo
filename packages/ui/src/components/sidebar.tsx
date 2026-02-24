import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * Variantes do container Sidebar
 */
const sidebarVariants = cva(
  "border-r bg-background transition-all duration-300 overflow-y-auto",
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

/**
 * Tamanho do sidebar (afeta largura e responsive)
 */
const sidebarSizeVariants = cva("", {
  variants: {
    size: {
      default: "w-64",
      compact: "w-16",
      lg: "w-80",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants>,
    VariantProps<typeof sidebarSizeVariants> {
  /** Itens de navegação */
  items?: SidebarItem[];
  /** Se true, sidebar fica colapsado */
  collapsed?: boolean;
  /** Callback quando collapsar/expandir */
  onToggleCollapse?: (collapsed: boolean) => void;
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
      size,
      items,
      collapsed,
      onToggleCollapse,
      children,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(collapsed ?? false);
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
      new Set()
    );

    const handleToggle = (collapsed: boolean) => {
      setIsCollapsed(collapsed);
      onToggleCollapse?.(collapsed);
    };

    const toggleSubmenu = (itemId: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
    };

    return (
      <aside
        ref={ref}
        className={cn(
          sidebarVariants({ variant }),
          sidebarSizeVariants({ size }),
          isCollapsed && "w-16",
          className
        )}
        role="complementary"
        aria-label="Sidebar navigation"
        {...props}
      >
        <div className="flex flex-col h-full">
          {/* Header com botão de collapse */}
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Menu
              </span>
            )}
            <button
              onClick={() => handleToggle(!isCollapsed)}
              className="p-1 hover:bg-accent rounded transition-colors"
              aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              title={isCollapsed ? "Expandir" : "Colapsar"}
            >
              {/* Ícone chevron simplificado */}
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  isCollapsed ? "rotate-180" : ""
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 py-4">
            {items && items.length > 0 ? (
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
        </div>
      </aside>
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
