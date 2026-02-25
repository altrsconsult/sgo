import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@sgo/sdk";

/** Contexto de autenticação (chassi só tem admin/user; sem superadmin) */
interface ExtendedAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: false; // chassi não tem superadmin
  logout: () => void;
  refresh: () => Promise<void>;
  isImpersonating: boolean;
  impersonatedBy: { id: number; name: string } | null;
  impersonate: (userId: number) => Promise<boolean>;
  stopImpersonation: () => Promise<boolean>;
}

const AuthContext = createContext<ExtendedAuthContext | undefined>(undefined);

const TOKEN_KEY = "sgo-token";

/**
 * Provider de autenticação.
 * Gerencia o estado do usuário logado e token JWT.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupReady, setSetupReady] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedBy, setImpersonatedBy] = useState<{ id: number; name: string } | null>(null);

  // 1) Resolve setup antes de mostrar app: em dev pula setup e usa credenciais padrão (admin/admin123)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/setup") || path.startsWith("/install")) {
      setSetupReady(true);
      return;
    }
    if (import.meta.env.DEV) {
      setSetupReady(true);
      return;
    }
    let retried = false;
    function check() {
      fetch("/api/setup/status")
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok && data.installed === true) {
            setSetupReady(true);
          } else if (!retried) {
            retried = true;
            setTimeout(check, 1500);
          } else {
            window.location.href = "/setup";
          }
        })
        .catch(() => {
          if (!retried) {
            retried = true;
            setTimeout(check, 1500);
          } else {
            window.location.href = "/setup";
          }
        });
    }
    check();
  }, []);

  // 2) Verifica token só depois de setup pronto
  useEffect(() => {
    if (!setupReady) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, [setupReady]);

  // Verifica se o token é válido
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        // Verifica se é impersonation decodificando o token
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.impersonatedBy) {
            setIsImpersonating(true);
            setImpersonatedBy({
              id: payload.impersonatedBy,
              name: payload.impersonatedByName || "Superadmin",
            });
          } else {
            setIsImpersonating(false);
            setImpersonatedBy(null);
          }
        } catch {
          setIsImpersonating(false);
          setImpersonatedBy(null);
        }
      } else {
        // Token inválido, remove
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsImpersonating(false);
    setImpersonatedBy(null);
  };

  // Recarrega dados do usuário
  const refresh = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await verifyToken(token);
    }
  };

  // Impersonate (logar como outro usuário)
  const impersonate = async (userId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`/api/auth/impersonate/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
        setIsImpersonating(true);
        setImpersonatedBy({
          id: data.impersonation.originalUserId,
          name: data.impersonation.originalUserName,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao impersonate:", error);
      return false;
    }
  };

  // Encerrar impersonation
  const stopImpersonation = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch("/api/auth/stop-impersonation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
        setIsImpersonating(false);
        setImpersonatedBy(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao encerrar impersonation:", error);
      return false;
    }
  };

  const value: ExtendedAuthContext = {
    user,
    isAuthenticated: !!user,
    isSuperAdmin: false, // chassi não tem role superadmin
    isAdmin: user?.role === "admin",
    logout,
    refresh,
    isImpersonating,
    impersonatedBy,
    impersonate,
    stopImpersonation,
  };

  // Mostra loading até setup OK e verificação de token
  if (!setupReady || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

/**
 * Hook auxiliar para fazer login.
 * Retornado separadamente do useAuth para evitar re-renders desnecessários.
 */
export function useLogin() {
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        // Força reload para atualizar o contexto
        window.location.reload();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  return { login };
}
