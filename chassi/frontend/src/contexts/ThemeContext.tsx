import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Adicionando suporte aos novos temas
export type Theme = "light" | "dark" | "system" | "minimal" | "group";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  activeSkin: "default" | "minimal" | "group";
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
  const [activeSkin, setActiveSkin] = useState<"default" | "minimal" | "group">("default");

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
        // Minimal segue o sistema ou padrão light, vamos deixar light por padrão se não especificado
        // mas idealmente minimal suporta ambos. Vamos assumir light para minimal por enquanto
        // ou checar system preference se quisermos minimal-dark
         setResolvedTheme("light"); 
      }

      // 2. Determina Skin
      if (theme === "minimal") {
        setActiveSkin("minimal");
      } else if (theme === "group") {
        setActiveSkin("group");
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
    
    // Remove todas as classes de tema conhecidas
    root.classList.remove("light", "dark", "theme-minimal", "theme-group");

    // Adiciona o modo (light/dark)
    root.classList.add(resolvedTheme);

    // Adiciona a skin se não for default
    if (activeSkin !== "default") {
      root.classList.add(`theme-${activeSkin}`);
    }
  }, [resolvedTheme, activeSkin]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, activeSkin }}>
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
