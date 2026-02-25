import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
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
import { Button, cn, Sidebar, useSidebar } from "@sgo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Logo } from "@/components/Logo";
import { CHASSIS_VERSION } from "@/version";

const SIDEBAR_COLLAPSED_KEY = "sgo-sidebar-collapsed";

/**
 * Links de navegação do Admin.
 */
const adminNavLinks = [
  { to: "/admin/tickets", icon: MessageSquare, label: "Suporte" },
  { to: "/admin/modules", icon: Layers, label: "Módulos" },
  { to: "/admin/users", icon: User, label: "Usuários" },
  { to: "/admin/groups", icon: UsersRound, label: "Grupos" },
  { to: "/admin/permissions", icon: Shield, label: "Permissões" },
  { to: "/admin/audit", icon: ClipboardList, label: "Auditoria" },
  { to: "/admin/embed", icon: Code, label: "Embed" },
  { to: "/admin/settings", icon: Settings, label: "Configurações" },
];

/** Nav do Admin que reage ao colapso (design system: sidebar-nav-link, useSidebar). */
function AdminSidebarNavContent() {
  const { collapsed } = useSidebar();
  return (
    <ul className="space-y-0.5" role="list">
      {adminNavLinks.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            className={({ isActive }) => `sidebar-nav-link ${isActive ? "active" : ""}`}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className="sidebar-nav-link__icon" aria-hidden />
            {!collapsed && <span className="sidebar-nav-link__label">{link.label}</span>}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

/**
 * Layout da área administrativa (Cliente/Gestor).
 * Sidebar colapsável (design system), estado em localStorage.
 */
export function AdminLayout() {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header no topo: logo + título sempre no header; acima da sidebar */}
      <header className="flex-shrink-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 lg:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="admin-header__logo flex items-center shrink-0 hover:opacity-90 transition-opacity" aria-label="Ir para início">
            <Logo size="sm" />
          </Link>
          <span className="font-semibold tracking-tight truncate hidden sm:inline">Administração</span>
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

      {/* Área: sidebar + conteúdo (abaixo do header, como no Shell) */}
      <div className="flex flex-1 min-h-0 min-w-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={setSidebarCollapsed}
          footerContent={
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="sidebar-nav-link w-full justify-center"
                title={sidebarCollapsed ? "Voltar ao Início" : undefined}
              >
                <ChevronLeft className="sidebar-nav-link__icon" aria-hidden />
                {!sidebarCollapsed && <span className="sidebar-nav-link__label">Voltar ao Início</span>}
              </button>
              <p className="text-[10px] text-muted-foreground/80 font-mono px-3 pt-1">SGO {CHASSIS_VERSION}</p>
            </div>
          }
          className={cn(
            "flex flex-col flex-shrink-0 h-full border-r bg-card transition-[width] duration-300",
            "fixed left-0 top-16 bottom-0 z-40 lg:relative lg:top-auto lg:left-auto lg:bottom-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <AdminSidebarNavContent />
        </Sidebar>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 lg:p-8 bg-muted/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
