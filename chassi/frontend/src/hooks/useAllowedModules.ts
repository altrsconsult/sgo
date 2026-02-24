import { useQuery } from "@tanstack/react-query";

export interface Module {
  id: number;
  slug: string;
  name: string;
  description: string;
  version: string;
  active: number;
  /** Nome do ícone Lucide (ex.: UserPlus) definido no manifest do módulo */
  icon?: string | null;
  /** Cor em hex (ex.: #3b82f6) definida no manifest do módulo */
  color?: string | null;
}

async function fetchAllowedModules(): Promise<Module[]> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/modules", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar módulos");
  const modules = await res.json();
  return modules.filter((m: Module) => m.active);
}

/** Lista de módulos ativos permitidos para o usuário (cache compartilhado). */
export function useAllowedModules() {
  return useQuery({
    queryKey: ["allowed-modules"],
    queryFn: fetchAllowedModules,
  });
}
