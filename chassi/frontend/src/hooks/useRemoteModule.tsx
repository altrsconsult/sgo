import { useState, useEffect, lazy, ComponentType } from "react";

/**
 * Cache de módulos já carregados para evitar recarregar.
 */
const moduleCache = new Map<string, ComponentType<unknown>>();

const REMOTE_LOAD_TIMEOUT_MS = 20000;

/**
 * Carrega módulo remoto via @module-federation/vite (funciona em dev + build).
 * Timeout para não ficar eternamente no skeleton quando o remote não responde.
 */
async function loadRemoteModule(
  url: string,
  scope: string,
  module: string
): Promise<ComponentType<unknown>> {
  const urlsToTry = [url];
  // Fallback só para dev (ex.: Vite em localhost com /assets/remoteEntry.js)
  // Em produção com /modules-assets/<slug>/... não tentar origin/remoteEntry.js (não existe no chassi)
  if (url.includes("/assets/remoteEntry.js") && !url.includes("/modules-assets/")) {
    try {
      const u = new URL(url);
      urlsToTry.push(`${u.origin}/remoteEntry.js`);
    } catch {}
  }

  let lastError: Error | null = null;
  for (const tryUrl of urlsToTry) {
    try {
      const mod = await Promise.race([
        import(/* @vite-ignore */ tryUrl),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ao carregar remoto (${REMOTE_LOAD_TIMEOUT_MS / 1000}s): ${tryUrl}`)), REMOTE_LOAD_TIMEOUT_MS)
        ),
      ]);
      if (mod && typeof (mod as any).get === "function") {
        const shareScope = (globalThis as any).__federation_shared_scope__ || {};
        if ((mod as any).init) await (mod as any).init(shareScope);
        
        // Verifica se o módulo exposto existe
        if (typeof (mod as any).get !== "function") {
          throw new Error(`O módulo ${scope} não exporta o método 'get'. Verifique a configuração do vite-plugin-federation.`);
        }
        
        try {
          const factory = await (mod as any).get(module);
          const Component = typeof factory === "function" ? factory() : factory;
          return (Component?.default ?? Component) as ComponentType<unknown>;
        } catch (e) {
          console.error("Module Federation Erro no get():", e);
          throw new Error(`O módulo ${scope} não expõe '${module}'. Exposes disponíveis não puderam ser lidos. Verifique o vite.config.ts do módulo.`);
        }
      }
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (import.meta.env?.DEV) {
        console.warn("[useRemoteModule] Falha em", tryUrl, lastError.message);
      }
    }
  }
  throw lastError ?? new Error(`Falha ao carregar ${scope} de ${url}`);
}

interface UseRemoteModuleResult {
  Component: ComponentType<unknown> | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook para carregar módulos remotos via Module Federation.
 * 
 * @example
 * const { Component, isLoading, error } = useRemoteModule({
 *   url: "http://localhost:5001/assets/remoteEntry.js",
 *   scope: "leads",
 *   module: "./App"
 * });
 */
export function useRemoteModule(config: {
  url: string;
  scope: string;
  module: string;
} | null): UseRemoteModuleResult {
  const [Component, setComponent] = useState<ComponentType<unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!config) {
      setComponent(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const cacheKey = `${config.url}:${config.scope}:${config.module}`;

    // Verifica cache
    if (moduleCache.has(cacheKey)) {
      setComponent(moduleCache.get(cacheKey)!);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    loadRemoteModule(config.url, config.scope, config.module)
      .then((mod) => {
        moduleCache.set(cacheKey, mod);
        setComponent(() => mod);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("[useRemoteModule] Erro ao carregar módulo remoto:", config.scope, config.module, config.url, err);
        setError(err);
        setIsLoading(false);
      });
  }, [config?.url, config?.scope, config?.module]);

  return { Component, isLoading, error };
}

import { Button, Card, CardContent } from "@sgo/ui";
import { Skeleton } from "@sgo/ui";
import { RefreshCw, AlertCircle } from "lucide-react";

/**
 * Componente de fallback enquanto o módulo carrega.
 * Simula a estrutura de um módulo típico.
 */
export function ModuleLoadingFallback() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header simulado */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Conteúdo principal simulado */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card Grande */}
        <Card className="col-span-2 h-[300px]">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-8 grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Card Lateral */}
        <Card className="col-span-1 h-[300px]">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Componente de erro quando o módulo falha ao carregar.
 */
export function ModuleErrorFallback({ error, retry }: { error: Error; retry?: () => void }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5 my-8">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-4 ring-8 ring-destructive/5">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-semibold text-foreground">Falha ao carregar módulo</h3>
          <p className="text-sm text-muted-foreground break-words">
            {error.message || "Ocorreu um erro inesperado ao tentar carregar este recurso remoto."}
          </p>
        </div>

        {retry && (
          <Button 
            onClick={retry}
            variant="outline"
            className="border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
