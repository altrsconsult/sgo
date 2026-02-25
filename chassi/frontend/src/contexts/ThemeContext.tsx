import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  loadCustomThemeFromStorage,
  customThemeToCss,
  googleFontsUrl,
  type CustomThemeJson,
} from "@/utils/customTheme";

// Temas: light/dark/system + skins (default, minimal, group, custom)
export type Theme = "light" | "dark" | "system" | "minimal" | "group" | "custom";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  activeSkin: "default" | "minimal" | "group" | "custom";
  /** Tema personalizado carregado (apenas quando activeSkin === "custom") */
  customThemeData: CustomThemeJson | null;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "sgo-theme";

/**
 * Provider de tema (dark/light mode + skins).
 * Persiste a escolha no localStorage e respeita preferência do sistema.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [activeSkin, setActiveSkin] = useState<"default" | "minimal" | "group" | "custom">("default");
  const [customThemeData, setCustomThemeData] = useState<CustomThemeJson | null>(null);

  // Carrega tema do servidor (configuração global)
  useEffect(() => {
    fetch("/api/public/settings")
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Se houver um tema configurado no servidor, usa ele
        // Isso garante que a escolha na instalação/admin seja respeitada
        if (data.ui_theme) {
          setThemeState(data.ui_theme as Theme);
          localStorage.setItem(STORAGE_KEY, data.ui_theme);
        }
      })
      .catch((err) => {
        // Silently fail is acceptable here, just use default/local
        console.warn("Tema do servidor indisponível:", err.message);
      });
  }, []);

  // Lógica para separar Skin de Mode (Dark/Light)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateThemeLogic = () => {
      // 1. Determina Light/Dark
      if (theme === "system") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      } else if (theme === "dark" || theme === "group") {
        // Group é sempre dark-ish por padrão, mas vamos tratar como dark mode base
        setResolvedTheme("dark");
      } else if (theme === "light") {
        setResolvedTheme("light");
      } else if (theme === "minimal") {
        setResolvedTheme("light");
      } else if (theme === "custom") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      }

      // 2. Determina Skin
      if (theme === "minimal") {
        setActiveSkin("minimal");
      } else if (theme === "group") {
        setActiveSkin("group");
      } else if (theme === "custom") {
        setActiveSkin("custom");
      } else {
        setActiveSkin("default");
      }
    };

    updateThemeLogic();
    mediaQuery.addEventListener("change", updateThemeLogic);

    return () => mediaQuery.removeEventListener("change", updateThemeLogic);
  }, [theme]);

  // Aplica classes no document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "theme-minimal", "theme-group", "theme-custom");
    root.classList.add(resolvedTheme);
    if (activeSkin !== "default") {
      root.classList.add(`theme-${activeSkin}`);
    }
  }, [resolvedTheme, activeSkin]);

  // Injeta CSS do tema personalizado e opcionalmente link do Google Font
  useEffect(() => {
    if (activeSkin !== "custom") return;
    const data = loadCustomThemeFromStorage();
    setCustomThemeData(data);
    if (!data) return;

    let styleEl = document.getElementById("sgo-custom-theme") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "sgo-custom-theme";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customThemeToCss(data);

    if (data.font) {
      let linkEl = document.getElementById("sgo-custom-theme-font") as HTMLLinkElement | null;
      if (!linkEl) {
        linkEl = document.createElement("link");
        linkEl.id = "sgo-custom-theme-font";
        linkEl.rel = "stylesheet";
        linkEl.href = googleFontsUrl(data.font);
        document.head.appendChild(linkEl);
      } else {
        linkEl.href = googleFontsUrl(data.font);
      }
      const root = document.documentElement;
      root.style.setProperty("--font-sans", `"${data.font}", ui-sans-serif, system-ui, sans-serif`);
    }
    return () => {
      const el = document.getElementById("sgo-custom-theme");
      if (el) el.remove();
      const fontEl = document.getElementById("sgo-custom-theme-font");
      if (fontEl) fontEl.remove();
      if (data.font) document.documentElement.style.removeProperty("--font-sans");
    };
  }, [activeSkin]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, activeSkin, customThemeData }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acessar o tema atual.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}
