/**
 * Tema personalizado: schema JSON compatível com as variáveis CSS do design system.
 * Permite upload de arquivo .json com paleta (claro/escuro) e opcionalmente tipografia (Google Fonts).
 *
 * Schema esperado:
 * {
 *   "name": "Nome do tema",
 *   "light": { "background": "55 25% 97%", "primary": "220 70% 50%", ... },
 *   "dark":  { "background": "213 22% 8%", "primary": "220 70% 50%", ... },
 *   "font":  "Inter"  // opcional; nome da fonte no Google Fonts
 * }
 *
 * Variáveis aceitas (valores em HSL sem "hsl()"): background, foreground, card, cardForeground,
 * popover, popoverForeground, primary, primaryForeground, secondary, secondaryForeground,
 * muted, mutedForeground, accent, accentForeground, destructive, destructiveForeground,
 * border, input, ring, radius. font → --font-sans (com fallback).
 */

export const CUSTOM_THEME_STORAGE_KEY = "sgo-custom-theme";

/** Chaves de variáveis CSS (camelCase no JSON → --kebab-case no CSS) */
const VAR_KEYS = [
  "background",
  "foreground",
  "card",
  "cardForeground",
  "popover",
  "popoverForeground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "accent",
  "accentForeground",
  "destructive",
  "destructiveForeground",
  "border",
  "input",
  "ring",
  "radius",
] as const;

function camelToKebab(s: string): string {
  return s.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
}

export interface CustomThemePalette {
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  radius?: string;
  [k: string]: string | undefined;
}

export interface CustomThemeJson {
  name?: string;
  light?: CustomThemePalette;
  dark?: CustomThemePalette;
  font?: string;
}

/**
 * Valida e normaliza um objeto de tema (aceita do servidor ou arquivo).
 */
export function parseCustomThemeJson(raw: unknown): CustomThemeJson | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const light =
    o.light && typeof o.light === "object" && !Array.isArray(o.light)
      ? (o.light as CustomThemePalette)
      : undefined;
  const dark =
    o.dark && typeof o.dark === "object" && !Array.isArray(o.dark)
      ? (o.dark as CustomThemePalette)
      : undefined;
  const font = typeof o.font === "string" && o.font.trim() ? o.font.trim() : undefined;
  const name = typeof o.name === "string" ? o.name.trim() : undefined;
  if (!light && !dark) return null;
  return { name: name || "Tema personalizado", light, dark, font };
}

/**
 * Gera o bloco CSS para uma paleta (variáveis :root ou .dark).
 */
function paletteToCssVars(palette: CustomThemePalette): string {
  const lines: string[] = [];
  for (const key of VAR_KEYS) {
    const val = palette[key];
    if (val && typeof val === "string") {
      const cssVar = "--" + camelToKebab(key);
      lines.push(`  ${cssVar}: ${val};`);
    }
  }
  return lines.join("\n");
}

/**
 * Gera a folha de estilo completa para .theme-custom (light e dark).
 */
export function customThemeToCss(data: CustomThemeJson): string {
  const parts: string[] = ["/* Tema personalizado (upload) */"];
  if (data.light && Object.keys(data.light).length > 0) {
    parts.push(".theme-custom {");
    parts.push(paletteToCssVars(data.light));
    parts.push("}");
  }
  if (data.dark && Object.keys(data.dark).length > 0) {
    parts.push(".theme-custom.dark {");
    parts.push(paletteToCssVars(data.dark));
    parts.push("}");
  }
  return parts.join("\n");
}

/**
 * Salva tema no localStorage e retorna true; em caso de erro retorna false.
 */
export function saveCustomThemeToStorage(data: CustomThemeJson): boolean {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, json);
    return true;
  } catch {
    return false;
  }
}

/**
 * Lê tema do localStorage; retorna null se não houver ou for inválido.
 */
export function loadCustomThemeFromStorage(): CustomThemeJson | null {
  try {
    const raw = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return parseCustomThemeJson(parsed);
  } catch {
    return null;
  }
}

/**
 * Remove tema personalizado do localStorage.
 */
export function clearCustomThemeFromStorage(): void {
  localStorage.removeItem(CUSTOM_THEME_STORAGE_KEY);
}

/**
 * Retorna a URL do Google Fonts para uma família (ex: "Inter", "Roboto").
 */
export function googleFontsUrl(fontFamily: string): string {
  const family = fontFamily.replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700&display=swap`;
}
