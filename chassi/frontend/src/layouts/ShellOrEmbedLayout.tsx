import { Outlet, useSearchParams, useLocation } from "react-router-dom";
import { ShellLayout } from "@/layouts/ShellLayout";

/**
 * Quando a URL tem ?embed=true e a rota é de módulo (/app/:slug), renderiza apenas
 * o conteúdo (Outlet) sem o Shell — para embed de um único módulo em iframe.
 * Na home (/) ou em qualquer outra rota com ?embed=true, mantém o Shell (header)
 * para o header não sumir quando o chassi inteiro está em iframe.
 */
export function ShellOrEmbedLayout() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isEmbed = searchParams.get("embed") === "true";
  const isModuleRoute = location.pathname.startsWith("/app/");

  if (isEmbed && isModuleRoute) {
    return (
      <div className="min-h-screen w-full min-w-0 bg-background">
        <Outlet />
      </div>
    );
  }

  return <ShellLayout />;
}
