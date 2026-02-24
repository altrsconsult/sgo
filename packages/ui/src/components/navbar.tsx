import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * Variantes do container NavBar
 */
const navBarVariants = cva(
  "w-full border-b bg-background sticky top-0 z-50",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "border-transparent shadow-sm",
        ghost: "border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface NavBarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navBarVariants> {
  /** Elemento logo (ReactNode) */
  logo?: React.ReactNode;
  /** Links de navegação */
  links?: Array<{ label: string; href: string; active?: boolean }>;
  /** Dados do usuário logado */
  user?: { name: string; avatar?: string };
  /** Callback ao fazer logout */
  onLogout?: () => void;
}

/**
 * Container principal do NavBar
 * Organism: Compõe Logo, Links, UserMenu
 */
const NavBar = React.forwardRef<HTMLElement, NavBarProps>(
  (
    { className, variant, logo, links, user, onLogout, children, ...props },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(navBarVariants({ variant, className }))}
        role="navigation"
        aria-label="Main navigation"
        {...props}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 max-w-full">
          {/* Logo */}
          <div className="flex-shrink-0">{logo}</div>

          {/* Links centrais */}
          {links && links.length > 0 && (
            <NavLinks links={links} className="hidden md:flex" />
          )}

          {/* User menu direita */}
          <div className="flex items-center gap-4">
            {children}
            {user && <NavUserMenu user={user} onLogout={onLogout} />}
          </div>
        </div>
      </nav>
    );
  }
);
NavBar.displayName = "NavBar";

/**
 * Componente logo simples
 */
interface NavLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  text?: string;
}

const NavLogo = React.forwardRef<HTMLDivElement, NavLogoProps>(
  ({ className, src, alt, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 font-semibold text-lg", className)}
        {...props}
      >
        {src && <img src={src} alt={alt || "Logo"} className="h-8 w-8" />}
        {text && <span>{text}</span>}
      </div>
    );
  }
);
NavLogo.displayName = "NavLogo";

/**
 * Container de links de navegação
 */
interface NavLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  links: Array<{ label: string; href: string; active?: boolean }>;
}

const NavLinks = React.forwardRef<HTMLDivElement, NavLinksProps>(
  ({ className, links, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        role="group"
        {...props}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              link.active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-current={link.active ? "page" : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
    );
  }
);
NavLinks.displayName = "NavLinks";

/**
 * Menu do usuário (dropdown simplificado)
 */
interface NavUserMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  user: { name: string; avatar?: string };
  onLogout?: () => void;
}

const NavUserMenu = React.forwardRef<HTMLDivElement, NavUserMenuProps>(
  ({ className, user, onLogout, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="hidden sm:inline">{user.name}</span>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-10"
            role="menu"
          >
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout?.();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
              role="menuitem"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    );
  }
);
NavUserMenu.displayName = "NavUserMenu";

export { NavBar, NavLogo, NavLinks, NavUserMenu };
