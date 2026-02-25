import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Layouts
import { ShellOrEmbedLayout } from "@/layouts/ShellOrEmbedLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ManagerLayout } from "@/layouts/ManagerLayout";

// Páginas de Auth
import { LoginPage } from "@/pages/auth/LoginPage";
import { ActivatePage } from "@/pages/auth/ActivatePage";

// Páginas do Usuário
import { HomePage } from "@/pages/HomePage";
import { ModuleViewerPage } from "@/pages/ModuleViewerPage";

// Páginas do Admin
import { AdminModulesPage } from "@/pages/admin/AdminModulesPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminGroupsPage } from "@/pages/admin/AdminGroupsPage";
import { AdminPermissionsPage } from "@/pages/admin/AdminPermissionsPage";
import { AdminTicketsPage } from "@/pages/admin/AdminTicketsPage";
import { AdminEmbedPage } from "@/pages/admin/AdminEmbedPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";
import { AdminModuleConfigPage } from "@/pages/admin/AdminModuleConfigPage";
import { AdminAuditPage } from "@/pages/admin/AdminAuditPage";

// Páginas do Manager (Superadmin)
import { ManagerModulesPage } from "@/pages/manager/ManagerModulesPage";
import { ManagerHealthPage } from "@/pages/manager/ManagerHealthPage";
import { ManagerSettingsPage } from "@/pages/manager/ManagerSettingsPage";
import { SetupPage } from "@/pages/SetupPage";

/**
 * Componente principal do aplicativo.
 * Define todas as rotas e seus layouts correspondentes.
 */
export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rota de Setup (Wizard) — /install redireciona para /setup */}
      <Route path="/install" element={<Navigate to="/setup" replace />} />
      <Route path="/setup" element={<SetupPage />} />

      {/* Rota de Login (pública) */}

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      {/* Ativação de conta (link de convite — admin copia e envia) */}
      <Route path="/activate" element={<ActivatePage />} />

      {/* Rotas do Usuário (Shell Layout; ?embed=true mostra só o conteúdo, sem header/sidebar) */}
      <Route
        element={
          <ProtectedRoute>
            <ShellOrEmbedLayout />
          </ProtectedRoute>
        }
      >
        {/* Home / Launcher */}
        <Route index element={<HomePage />} />

        {/* Área do módulo (Module Federation) */}
        <Route path="/app/:moduleSlug/*" element={<ModuleViewerPage />} />
      </Route>

      {/* Rotas do Admin (Admin Layout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/modules" replace />} />
        <Route path="modules" element={<AdminModulesPage />} />
        <Route path="modules/:moduleSlug/config" element={<AdminModuleConfigPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="groups" element={<AdminGroupsPage />} />
        <Route path="permissions" element={<AdminPermissionsPage />} />
        <Route path="tickets" element={<AdminTicketsPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
        <Route path="embed" element={<AdminEmbedPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Rotas do Manager/Superadmin (Manager Layout) */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute requireSuperAdmin>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/manager/modules" replace />} />
        <Route path="modules" element={<ManagerModulesPage />} />
        <Route path="health" element={<ManagerHealthPage />} />
        <Route path="settings" element={<ManagerSettingsPage />} />
      </Route>

      {/* Fallback: redireciona para home ou login */}
      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

/**
 * Placeholder para área de módulos.
 * Será substituído por Module Federation no futuro.
 */
function ModulePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold">Área do Módulo</h2>
      <p className="text-muted-foreground mt-2">
        O conteúdo do módulo será carregado aqui via Module Federation.
      </p>
    </div>
  );
}
