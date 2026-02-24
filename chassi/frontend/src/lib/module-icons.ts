/**
 * Ícone e cor do card/sidebar de módulos.
 * Definidos no manifest.json do módulo (icon, color); fallback por slug.
 */

import {
  Layers,
  UserPlus,
  FileText,
  Users,
  Settings,
  MessageSquare,
  BarChart3,
  Package,
  type LucideIcon,
} from "lucide-react";

const MODULE_PALETTE = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#6b7280"];

export const MODULE_ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  UserPlus,
  FileText,
  Users,
  Settings,
  MessageSquare,
  BarChart3,
  Package,
};

export interface ModuleLike {
  slug: string;
  icon?: string | null;
  color?: string | null;
}

function getPaletteIndex(slug: string): number {
  const source = String(slug || "");
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }
  return hash % MODULE_PALETTE.length;
}

export function getModuleIcon(module: ModuleLike): LucideIcon {
  const name = module.icon && String(module.icon).trim();
  if (name && MODULE_ICON_MAP[name]) return MODULE_ICON_MAP[name];
  return Layers;
}

export function getModuleColor(module: ModuleLike): string {
  if (module.color && /^#[0-9A-Fa-f]{3,8}$/.test(String(module.color).trim())) {
    return String(module.color).trim();
  }
  return MODULE_PALETTE[getPaletteIndex(module.slug)];
}
