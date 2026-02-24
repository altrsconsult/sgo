import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sun, Moon, LogOut, User, Settings, AlertTriangle, LayoutGrid, Menu } from "lucide-react";
import {
  Button, Avatar, AvatarFallback, Separator,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  Sheet, SheetContent, SheetTitle,
} from "@sgo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useAllowedModules } from "@/hooks/useAllowedModules";
import { Logo } from "@/components/Logo";
import { CHASSIS_VERSION } from "@/version";
import { getModuleIcon } from "@/lib/module-icons";

/**
 * Conteúdo de navegação compartilhado entre sidebar desktop e drawer mobile.
 * onNavigate: chamado ao clicar em um link (fecha o drawer mobile).
 */
function SidebarNav({ modules, onNavigate }: { modules: any[]; onNavigate: () => void }) {
  return (
    <nav className="p-2 space-y-0.5" aria-label="Módulos">
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
          (isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")
        }
      >
        <LayoutGrid className="h-4 w-4 shrink-0" />
        Início
      </NavLink>
      {modules.map((mod) => {
        const Icon = getModuleIcon(mod);
        return (
          <NavLink
            key={mod.id}
            to={`/app/${mod.slug}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
              (isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{mod.name}</span>
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
  const isSidebar = layout === "sidebar";
  const location = useLocation();
  const isModuleRoute = location.pathname.startsWith("/app/");

  // Pega as iniciais do nome do usuário
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Skip-to-main: acessibilidade — visível apenas no foco por teclado (TD-S05a) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:border focus:rounded-md focus:text-sm focus:font-medium focus:shadow-md"
      >
        Pular para o conteúdo principal
      </a>

      {/* Banner de Impersonation */}
      {isImpersonating && impersonatedBy && (
        <div className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 px-4 py-2 relative z-50">
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

      {/* TopBar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

          {/* Logo — clique leva à home */}
          <Link to="/" className="flex items-center cursor-pointer hover:opacity-90 transition-opacity" aria-label="Ir para início">
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
                    <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
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
      <div className={isSidebar ? "flex flex-1 min-h-[calc(100vh-4rem)]" : ""}>
        {isSidebar && (
          <>
            {/* Sidebar desktop — oculta em mobile */}
            <aside className="shell-sidebar hidden md:flex w-56 shrink-0 border-r bg-muted/30 flex-col">
              <SidebarNav modules={modules} onNavigate={() => {}} />
            </aside>

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
        <main id="main-content" className={isSidebar ? "flex-1 overflow-auto min-w-0" : "container mx-auto px-4 py-6 max-w-7xl"}>
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
