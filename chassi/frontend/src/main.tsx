import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import App from "./App";

// Importa estilos globais do Design System
import "@sgo/ui/globals.css";
import "./styles/globals.css";

// Cliente do React Query para cache e estado do servidor
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <LayoutProvider>
              <AuthProvider>
                <NotificationProvider>
                  <App />
                  {/* Toasts globais — 4s, fechável manualmente (TD-S04) */}
                  <Toaster richColors closeButton duration={4000} />
                </NotificationProvider>
              </AuthProvider>
            </LayoutProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
