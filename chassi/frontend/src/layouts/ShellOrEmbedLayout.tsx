import { Outlet, useSearchParams } from "react-router-dom";
import { ShellLayout } from "@/layouts/ShellLayout";

/**
 * Quando a URL tem ?embed=true, renderiza apenas o conteúdo (Outlet) sem o Shell
 * (sem topbar, sem sidebar). Usado para embeds em iframe: só o módulo aparece.
 * Caso contrário, usa o ShellLayout normal.
 */
export function ShellOrEmbedLayout() {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";

  if (isEmbed) {
    return (
      <div className="min-h-screen w-full min-w-0 bg-background">
        <Outlet />
      </div>
    );
  }

  return <ShellLayout />;
}
