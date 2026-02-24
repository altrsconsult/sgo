import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";
import { cn } from "../lib/utils";

/**
 * Item do Menu com dados estruturados.
 */
interface MenuItem {
  /** ID único do item */
  id?: string;
  /** Rótulo exibido */
  label: string;
  /** Ícone (Lucide) ou componente */
  icon?: React.ReactNode;
  /** Callback ao clicar no item */
  onClick: () => void;
  /** Se o item está desabilitado */
  disabled?: boolean;
  /** Classe customizada */
  className?: string;
  /** Subtítulo/descrição do item */
  description?: string;
  /** Type discriminator (sempre undefined para MenuItem) */
  type?: never;
}

/**
 * Separador de Menu (agrupa itens visualmente).
 */
interface MenuSeparator {
  type: "separator";
  id?: string;
}

/**
 * Label/título do Menu (agrupa itens semanticamente).
 */
interface MenuLabel {
  type: "label";
  label: string;
  id?: string;
}

/**
 * Item do Menu pode ser MenuItem, separador ou label.
 */
type MenuItemType = MenuItem | MenuSeparator | MenuLabel;

/**
 * Props do componente Menu.
 */
interface MenuProps {
  /** Trigger button - elemento que abre o menu */
  trigger: React.ReactElement;
  /** Array de itens do menu (suporta separadores e labels) */
  items: MenuItemType[];
  /** Classe customizada para o trigger */
  triggerClassName?: string;
  /** Classe customizada para o content */
  contentClassName?: string;
  /** Callback ao abrir/fechar */
  onOpenChange?: (open: boolean) => void;
  /** Posição do menu (top, bottom, etc) */
  side?: "top" | "right" | "bottom" | "left";
  /** Offset em pixels do trigger */
  sideOffset?: number;
  /** Se deve fechar após clicar em um item */
  closeOnSelect?: boolean;
}

/**
 * Componente Menu - Dropdown com items estruturados.
 * Encapsula DropdownMenu do Radix com API simplificada.
 *
 * @example
 * <Menu
 *   trigger={<Button>Ações</Button>}
 *   items={[
 *     { label: "Editar", icon: <Edit2 />, onClick: () => {} },
 *     { label: "Duplicar", icon: <Copy />, onClick: () => {} },
 *     { type: "separator" },
 *     { label: "Excluir", icon: <Trash />, onClick: () => {}, disabled: false },
 *   ]}
 * />
 */
const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      trigger,
      items,
      triggerClassName,
      contentClassName,
      onOpenChange,
      side = "bottom",
      sideOffset = 4,
      closeOnSelect = true,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
      },
      [onOpenChange]
    );

    const handleItemClick = React.useCallback(
      (callback: () => void) => {
        callback();
        if (closeOnSelect) {
          handleOpenChange(false);
        }
      },
      [closeOnSelect, handleOpenChange]
    );

    return (
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        {/* Trigger button */}
        <DropdownMenuTrigger asChild className={triggerClassName}>
          {trigger}
        </DropdownMenuTrigger>

        {/* Content - lista de items */}
        <DropdownMenuContent
          ref={ref}
          side={side}
          sideOffset={sideOffset}
          className={cn("min-w-[200px]", contentClassName)}
        >
          {items.map((item, idx) => {
            // Type guard: Separador
            if ("type" in item && item.type === "separator") {
              return <DropdownMenuSeparator key={item.id || `sep-${idx}`} />;
            }

            // Type guard: Label/título
            if ("type" in item && item.type === "label") {
              return (
                <DropdownMenuLabel key={item.id || `label-${idx}`}>
                  {item.label}
                </DropdownMenuLabel>
              );
            }

            // MenuItem regular (sem type ou type undefined)
            const menuItem = item as MenuItem;
            return (
              <DropdownMenuItem
                key={menuItem.id || `item-${idx}`}
                disabled={menuItem.disabled}
                onClick={() => handleItemClick(menuItem.onClick)}
                className={menuItem.className}
              >
                <div className="flex items-center gap-2 w-full">
                  {menuItem.icon && (
                    <span className="flex-shrink-0 [&_svg]:size-4">
                      {menuItem.icon}
                    </span>
                  )}
                  <div className="flex flex-col flex-1">
                    <span>{menuItem.label}</span>
                    {menuItem.description && (
                      <span className="text-xs opacity-70">{menuItem.description}</span>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

Menu.displayName = "Menu";

export {
  Menu,
  type MenuProps,
  type MenuItem,
  type MenuItemType,
  type MenuSeparator,
  type MenuLabel,
};
