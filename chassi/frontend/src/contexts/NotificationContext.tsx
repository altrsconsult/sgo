import { createContext, useContext, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

/**
 * NotificationContext — wrapper sobre Sonner (TD-S04).
 * As páginas admin chamam success/error/info/warning via useNotification(),
 * que internamente dispara os toasts do Sonner (4s, richColors, fechável).
 */

interface NotificationContextValue {
  /** @deprecated use diretamente `toast.success/error/info/warning` do sonner se preferir */
  addNotification: (notification: { type: "success" | "error" | "info" | "warning"; title: string; message?: string }) => void;
  removeNotification: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const success = useCallback((title: string, message?: string) => {
    toast.success(title, { description: message });
  }, []);

  const error = useCallback((title: string, message?: string) => {
    toast.error(title, { description: message });
  }, []);

  const info = useCallback((title: string, message?: string) => {
    toast.info(title, { description: message });
  }, []);

  const warning = useCallback((title: string, message?: string) => {
    toast.warning(title, { description: message });
  }, []);

  const addNotification = useCallback(
    (n: { type: "success" | "error" | "info" | "warning"; title: string; message?: string }) => {
      const fn = { success, error, info, warning }[n.type];
      fn(n.title, n.message);
    },
    [success, error, info, warning]
  );

  // removeNotification mantida por compatibilidade (Sonner gerencia o próprio ciclo)
  const removeNotification = useCallback((_id: string) => {}, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, success, error, info, warning }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification deve ser usado dentro de NotificationProvider");
  }
  return context;
}

/** Função global para notificações fora de componentes. */
export function notify(notification: { type: "success" | "error" | "info" | "warning"; title: string; message?: string }) {
  const fn = { success: toast.success, error: toast.error, info: toast.info, warning: toast.warning }[notification.type];
  fn(notification.title, { description: notification.message });
}
