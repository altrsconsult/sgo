import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Users,
  UsersRound,
  Layers,
  Shield,
  MessageSquare,
  ClipboardList,
  Code,
  Settings,
  ChevronLeft,
  Sun,
  Moon,
} from "lucide-react";
import { Button, cn } from "@sgo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Logo } from "@/components/Logo";
import { CHASSIS_VERSION } from "@/version";

/**
 * Links de navegação do Admin.
 */
const adminNavLinks = [
  { to: "/admin/modules", icon: Layers, label: "Módulos" },
  { to: "/admin/users", icon: Users, label: "Usuários" },
  { to: "/admin/groups", icon: UsersRound, label: "Grupos" },
  { to: "/admin/permissions", icon: Shield, label: "Permissões" },
  { to: "/admin/tickets", icon: MessageSquare, label: "Suporte" },
  { to: "/admin/audit", icon: ClipboardList, label: "Auditoria" },
  { to: "/admin/embed", icon: Code, label: "Embed" },
  { to: "/admin/settings", icon: Settings, label: "Configurações" },
];

/**
 * Layout da área administrativa (Cliente/Gestor).
 * Sidebar fixa com navegação + área de conteúdo.
 */
export function AdminLayout() {
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
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="cursor-pointer hover:opacity-90 transition-opacity flex items-center" aria-label="Ir para início">
                <Logo size="sm" />
              </Link>
              <span className="font-semibold tracking-tight">Administração</span>
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
            {adminNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 transition-all duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            {/* Breadcrumb ou Título da Página (futuro) */}
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
        <main className="flex-1 p-6 lg:p-8 w-full max-w-full overflow-x-hidden bg-muted/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
