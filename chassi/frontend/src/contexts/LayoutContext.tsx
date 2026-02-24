import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type LayoutMode = "gallery" | "sidebar";

interface LayoutContextValue {
  layout: LayoutMode;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

/**
 * Provider de layout do shell (galeria de módulos vs sidebar + conteúdo).
 * Lê ui_layout de /api/public/settings; alteração é feita em Manager > Aparência.
 */
export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<LayoutMode>("gallery");

  useEffect(() => {
    fetch("/api/public/settings")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: { ui_layout?: string }) => {
        const v = data.ui_layout;
        if (v === "sidebar" || v === "gallery") setLayout(v);
      })
      .catch(() => {});
  }, []);

  return (
    <LayoutContext.Provider value={{ layout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (ctx === undefined) throw new Error("useLayout deve ser usado dentro de LayoutProvider");
  return ctx;
}
