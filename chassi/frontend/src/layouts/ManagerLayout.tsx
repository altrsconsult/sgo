import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Layers,
  Activity,
  Settings,
  ChevronLeft,
  Sun,
  Moon,
  Shield,
} from "lucide-react";
import { Button, cn, Badge } from "@sgo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { CHASSIS_VERSION } from "@/version";

/**
 * Links de navegação do Manager (Superadmin/Consultoria).
 */
const managerNavLinks = [
  { to: "/manager/modules", icon: Layers, label: "Módulos" },
  { to: "/manager/health", icon: Activity, label: "Saúde do Sistema" },
  { to: "/manager/settings", icon: Settings, label: "Configs Técnicas" },
];

/**
 * Layout da área do Superadmin (Consultoria).
 * Acesso total ao sistema: instalação de módulos, configs técnicas, diagnóstico.
 */
export function ManagerLayout() {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header da sidebar */}
          <div className="flex h-16 items-center justify-between border-b px-6 bg-card/50">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm leading-none">Superadmin</span>
                <span className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                  Modo Técnico
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Links de navegação */}
          <nav className="flex-1 space-y-1 p-4">
            {managerNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
                  )
                }
              >
                <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer da sidebar */}
          <div className="border-t p-4 space-y-2">
            <button
              onClick={() => navigate("/admin")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
              Ir para Admin
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar ao Início
            </button>
            <p className="text-[10px] text-muted-foreground/80 font-mono px-3 pt-1">SGO {CHASSIS_VERSION}</p>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 lg:px-8 border-amber-500/10">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
             <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Ambiente de Gestão de Alto Nível
             </div>
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 p-6 lg:p-8 bg-amber-50/30 dark:bg-amber-950/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
