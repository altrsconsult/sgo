import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Exige role de admin ou superior */
  requireAdmin?: boolean;
  /** Exige role de superadmin */
  requireSuperAdmin?: boolean;
}

/**
 * Componente que protege rotas baseado em autenticação e role.
 * Redireciona para login se não autenticado.
 * Redireciona para home se não tem permissão.
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  // Não autenticado -> Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Exige superadmin mas não é
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  // Exige admin mas não é
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
