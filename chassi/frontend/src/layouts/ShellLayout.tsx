import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon, LogOut, User, Settings, AlertTriangle, LayoutGrid, Menu } from "lucide-react";
import {
  Button, Avatar, AvatarFallback, Separator,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  Sheet, SheetContent, SheetTitle,
  Sidebar,
  useSidebar,
} from "@sgo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useAllowedModules } from "@/hooks/useAllowedModules";
import { Logo } from "@/components/Logo";
import { CHASSIS_VERSION } from "@/version";
import { getModuleIcon } from "@/lib/module-icons";

const SIDEBAR_COLLAPSED_KEY = "sgo-sidebar-collapsed";

/**
 * Nav da sidebar desktop — usa useSidebar() e classes do design system.
 * Quando colapsada, mostra apenas ícones e title (tooltip nativo).
 */
function ShellSidebarNavContent({ modules, onNavigate }: { modules: any[]; onNavigate: () => void }) {
  const { collapsed } = useSidebar();
  return (
    <ul className="space-y-0.5" aria-label="Módulos" role="list">
      <li>
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `sidebar-nav-link ${isActive ? "active" : ""}`
          }
          title={collapsed ? "Início" : undefined}
        >
          <LayoutGrid className="sidebar-nav-link__icon" aria-hidden />
          {!collapsed && <span className="sidebar-nav-link__label">Início</span>}
        </NavLink>
      </li>
      {modules.map((mod) => {
        const Icon = getModuleIcon(mod);
        return (
          <li key={mod.id}>
            <NavLink
              to={`/app/${mod.slug}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
              title={collapsed ? mod.name : undefined}
            >
              <Icon className="sidebar-nav-link__icon" aria-hidden />
              {!collapsed && <span className="sidebar-nav-link__label">{mod.name}</span>}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Nav para drawer mobile (sem colapso); reutiliza estilos do design system.
 */
function SidebarNav({ modules, onNavigate }: { modules: any[]; onNavigate: () => void }) {
  return (
    <nav className="p-2 space-y-0.5" aria-label="Módulos">
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          "sidebar-nav-link " + (isActive ? "active" : "")
        }
      >
        <LayoutGrid className="sidebar-nav-link__icon" />
        <span className="sidebar-nav-link__label">Início</span>
      </NavLink>
      {modules.map((mod) => {
        const Icon = getModuleIcon(mod);
        return (
          <NavLink
            key={mod.id}
            to={`/app/${mod.slug}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              "sidebar-nav-link " + (isActive ? "active" : "")
            }
          >
            <Icon className="sidebar-nav-link__icon" />
            <span className="sidebar-nav-link__label">{mod.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * Layout principal do Shell (casca do sistema).
 * Contém a TopBar com menu do usuário e área de conteúdo.
 * Modo galeria: conteúdo único (grid na home). Modo sidebar: lista de módulos à esquerda + conteúdo.
 * Em mobile (<768px): sidebar vira drawer (Sheet) ativado por botão hamburger.
 */
export function ShellLayout() {
  const { user, logout, isAdmin, isSuperAdmin, isImpersonating, impersonatedBy, stopImpersonation } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { layout } = useLayout();
  const { data: modules = [] } = useAllowedModules();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) ?? "false");
    } catch {
      return false;
    }
  });
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  const isSidebar = layout === "sidebar";
  const location = useLocation();
  const isModuleRoute = location.pathname.startsWith("/app/");

  const rootClass = isSidebar ? "h-screen flex flex-col overflow-hidden bg-background" : "min-h-screen bg-background";
  return (
    <div className={rootClass}>
      {/* Skip-to-main: acessibilidade — visível apenas no foco por teclado (TD-S05a) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:border focus:rounded-md focus:text-sm focus:font-medium focus:shadow-md"
      >
        Pular para o conteúdo principal
      </a>

      {/* Banner de Impersonation */}
      {isImpersonating && impersonatedBy && (
        <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 px-4 py-2 relative z-50">
          <div className="w-full flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>
                Acessando como <strong>{user?.name}</strong> <span className="opacity-75 text-xs">(Visualização de Suporte)</span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={stopImpersonation}
              className="h-7 text-xs hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100"
            >
              Voltar ao Admin
            </Button>
          </div>
        </div>
      )}

      {/* TopBar — fixo quando sidebar */}
      <header className={`z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isSidebar ? "flex-shrink-0" : "sticky top-0"}`}>
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 transition-all duration-200">
          {/* Hamburger mobile — aparece apenas em telas pequenas com sidebar ativa */}
          {isSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-1 rounded-full w-9 h-9"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Logo — alinhado ao eixo (mesma classe do Admin) */}
          <Link to="/" className="admin-header__logo flex items-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity" aria-label="Ir para início">
            <Logo size="sm" />
          </Link>

          {/* Ações da direita */}
          <div className="flex items-center gap-4">
            {/* Toggle de tema */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 text-foreground hover:text-foreground"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              title={resolvedTheme === "dark" ? "Modo claro" : "Modo escuro"}
              aria-label="Alternar tema"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] shrink-0" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] shrink-0" />
              )}
            </Button>

            {/* Menu do usuário — Radix DropdownMenu (acessível por teclado e ARIA) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Menu do usuário"
                >
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-4 w-4" aria-hidden />
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                {/* Info do usuário (não é item clicável) */}
                <div className="px-3 py-2.5">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1.5">{user?.email || user?.username}</p>
                  <p className="text-[10px] text-muted-foreground/80 mt-1.5 font-mono">SGO {CHASSIS_VERSION}</p>
                </div>

                <DropdownMenuSeparator />

                {/* Link de administração */}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <a href="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Administração</span>
                    </a>
                  </DropdownMenuItem>
                )}

                {/* Link de superadmin */}
                {isSuperAdmin && (
                  <DropdownMenuItem asChild>
                    <a href="/manager" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Painel Superadmin</span>
                    </a>
                  </DropdownMenuItem>
                )}

                {(isAdmin || isSuperAdmin) && <DropdownMenuSeparator />}

                {/* Logout */}
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Conteúdo principal: com ou sem sidebar */}
      <div className={isSidebar ? "flex flex-1 min-h-0 min-w-0" : ""}>
        {isSidebar && (
          <>
            {/* Sidebar desktop — colapsável (design system), estado em localStorage */}
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={setSidebarCollapsed}
              className="hidden md:flex flex-col min-h-0 bg-muted/30"
            >
              <ShellSidebarNavContent modules={modules} onNavigate={() => {}} />
            </Sidebar>

            {/* Drawer mobile — Sheet que desliza da esquerda */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <div className="pt-14">
                  <SidebarNav modules={modules} onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
        <main id="main-content" className={isSidebar ? "flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden" : "container mx-auto px-4 py-6 max-w-7xl"}>
          {isSidebar ? (
            isModuleRoute ? (
              <div className="w-full min-w-0">
                <Outlet />
              </div>
            ) : (
              <div className="p-4 md:p-6">
                <Outlet />
              </div>
            )
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
