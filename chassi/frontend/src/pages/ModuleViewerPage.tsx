import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button, Skeleton } from "@sgo/ui";
import { useRemoteModule, ModuleLoadingFallback, ModuleErrorFallback } from "@/hooks/useRemoteModule.js";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Busca os dados de um módulo pelo slug.
 */
async function fetchModule(slug: string) {
  const token = localStorage.getItem("sgo-token");
  const response = await fetch(`/api/modules?slug=${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Módulo não encontrado");
  }

  const modules = await response.json();
  return modules.find((m: { slug: string }) => m.slug === slug) || null;
}

/**
 * Detecta a view apropriada baseada no contexto.
 */
function detectViewContext(): string {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const isEmbed = window.self !== window.top;

  if (isEmbed) return "./Embed";
  if (isMobile) return "./Mobile";
  return "./App";
}

/**
 * Página que renderiza um módulo remoto via Module Federation.
 * Rota: /app/:moduleSlug/*
 */
export function ModuleViewerPage() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();

  // Estado para controlar qual view carregar (fallback pattern)
  const [currentView, setCurrentView] = useState(detectViewContext());
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  // Busca metadados do módulo
  const { data: moduleData, isLoading: isLoadingMeta, error: metaError } = useQuery({
    queryKey: ["module", moduleSlug],
    queryFn: () => fetchModule(moduleSlug!),
    enabled: !!moduleSlug,
  });

  // URL do módulo: path pode ser base (standalone), remoteEntry.js (Federation) ou dev server (iframe com HMR)
  const rawPath = moduleData?.remoteUrl ?? moduleData?.path ?? moduleData?.remoteEntry ?? null;
  const remoteUrl = rawPath?.startsWith("http") ? rawPath : (rawPath ? `${window.location.origin}${rawPath}` : null);
  const isStandalone = !!rawPath?.endsWith("/");
  const isDev = import.meta.env.DEV && !import.meta.env.PROD;
  const devServerUrl = moduleData?.devServerUrl ?? null;
  const isDevStandalone =
    isDev &&
    !!remoteUrl &&
    /^https?:\/\/localhost:\d+\/remoteEntry\.js$/.test(remoteUrl);
  const useDevServerForIframe = isDev && !!devServerUrl;
  const useIframe = (isStandalone || isDevStandalone || useDevServerForIframe) && (!!remoteUrl || !!devServerUrl);
  const scope = (moduleData?.slug ?? "").replace(/-/g, "_") || moduleData?.slug;
  const remoteConfig =
    !useIframe && remoteUrl && scope
      ? { url: remoteUrl, scope, module: currentView }
      : null;

  const { Component, isLoading: isLoadingModule, error: moduleError } = useRemoteModule(remoteConfig);

  // Refs para o iframe (sempre declarados para manter ordem de Hooks)
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeOriginRef = useRef<string | null>(null);
  const onIframeLoad = useCallback(() => {
    const origin = iframeOriginRef.current;
    if (!origin || !iframeRef.current?.contentWindow) return;
    const win = iframeRef.current.contentWindow;
    const token = localStorage.getItem("sgo-token");
    if (token) win.postMessage({ type: "sgo-auth", token }, origin);
    // Repassa tema do chassis para o módulo (iframe tem documento separado, não herda class dark/light)
    win.postMessage({ type: "sgo-theme", theme: resolvedTheme }, origin);
    // Repassa usuário logado para auditoria em módulos (ex.: quem matriculou)
    if (user?.name) win.postMessage({ type: "sgo-user", user: { name: user.name, username: user.username } }, origin);
  }, [resolvedTheme, user]);

  // Quando o tema do chassis muda, atualiza o iframe do módulo
  useEffect(() => {
    const origin = iframeOriginRef.current;
    if (!origin || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: "sgo-theme", theme: resolvedTheme }, origin);
  }, [resolvedTheme]);

  // Repassa usuário quando disponível (pode carregar após o iframe)
  useEffect(() => {
    const origin = iframeOriginRef.current;
    if (!origin || !iframeRef.current?.contentWindow || !user?.name) return;
    iframeRef.current.contentWindow.postMessage(
      { type: "sgo-user", user: { name: user.name, username: user.username } },
      origin
    );
  }, [user]);

  // Módulo pode pedir para voltar (postMessage sgo-navigate-back) — header único fica no módulo
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "sgo-navigate-back") navigate("/");
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [navigate]);

  // Lógica de Fallback: Se falhar Mobile ou Embed, tenta App (Desktop)
  useEffect(() => {
    if (moduleError && !hasTriedFallback && currentView !== "./App") {
      console.warn(`Falha ao carregar view '${currentView}', tentando fallback para './App'...`);
      setCurrentView("./App");
      setHasTriedFallback(true);
    }
  }, [moduleError, currentView, hasTriedFallback]);

  // Loading inicial
  if (isLoadingMeta) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Erro ao buscar metadados
  if (metaError || !moduleData) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <ModuleErrorFallback
          error={new Error("Módulo não encontrado ou sem permissão de acesso")}
          retry={() => navigate("/")}
        />
      </div>
    );
  }

  // Se o módulo não tem URL remota (path ou remoteUrl), mostra placeholder
  // remoteUrl já foi calculado acima: path absoluto usa como-is, relativo usa origin
  if (!remoteUrl) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{moduleData.name}</h1>
            <p className="text-muted-foreground">{moduleData.description}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Este módulo ainda não possui um frontend remoto configurado.
            Quando o módulo for buildado e publicado, seu conteúdo aparecerá aqui.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Slug: <code className="bg-muted px-1 rounded">{moduleData.slug}</code>
            {" | "}
            Versão: <code className="bg-muted px-1 rounded">{moduleData.version}</code>
          </p>
        </div>
      </div>
    );
  }

  // Loading do módulo remoto (só Federation; standalone e dev-standalone usam iframe direto)
  if (!useIframe && isLoadingModule) {
    return (
      <div className="space-y-2">
        <div className="shrink-0 h-8 flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => navigate("/")} aria-label="Voltar">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <ModuleLoadingFallback />
      </div>
    );
  }

  // Erro ao carregar módulo remoto (só Federation)
  if (!useIframe && moduleError && (currentView === "./App" || hasTriedFallback)) {
    const isDevRemote = remoteUrl && remoteUrl.includes("localhost");
    return (
      <div className="space-y-2">
        <div className="shrink-0 h-8 flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => navigate("/")} aria-label="Voltar">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <ModuleErrorFallback 
          error={moduleError} 
          retry={() => {
            setHasTriedFallback(false);
            setCurrentView(detectViewContext());
          }}
        />
        {isDevRemote && (
          <p className="text-sm text-muted-foreground mt-2">
            Para o Chassi carregar o módulo, use <code className="bg-muted px-1 rounded">pnpm dev:remote</code> em{" "}
            <code className="bg-muted px-1 rounded">modules/{moduleData.slug}</code> (build + preview na porta da URL). O <code className="bg-muted px-1 rounded">pnpm dev</code> não expõe <code className="bg-muted px-1 rounded">remoteEntry.js</code> no path esperado.
          </p>
        )}
      </div>
    );
  }

  // Standalone ou Dev: iframe (standalone = build; dev = servidor do módulo para HMR)
  // Nunca usar URL da rota do app (/app/:slug) nem same-origin /modules-assets/ como src — evita cascata
  if (useIframe && (remoteUrl || devServerUrl)) {
    const origin = window.location.origin;
    let base: string;
    if (useDevServerForIframe && devServerUrl) {
      base = devServerUrl.replace(/\/$/, "");
    } else if (isDevStandalone && remoteUrl) {
      base = remoteUrl.replace(/\/remoteEntry\.js$/, "").replace(/\/$/, "");
    } else if (remoteUrl) {
      base = remoteUrl.replace(/\/$/, "");
      const sameOrigin = base.startsWith(origin);
      const pathPart = sameOrigin ? base.slice(origin.length) || "/" : base;
      if (sameOrigin && (pathPart.startsWith("/app/") || pathPart.startsWith("/modules-assets/"))) {
        base = devServerUrl ? devServerUrl.replace(/\/$/, "") : `${origin}/modules-assets/${moduleSlug || ""}/dist`;
      }
    } else {
      base = "";
    }
    if (!base) return null;
    if (isDev && base.startsWith(origin) && base.includes("/modules-assets/")) {
      // Em dev, evita fallback por slug/porta fixa para manter o core desacoplado.
      return (
        <div className="space-y-2 flex flex-col h-[calc(100vh-8rem)]">
          <div className="shrink-0 flex items-center min-h-8">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -ml-2" onClick={() => navigate("/")} aria-label="Voltar">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-lg border bg-amber-500/10 border-amber-500/30 p-6 text-amber-800 dark:text-amber-200">
            <p className="font-medium">Modo dev: use o servidor do módulo para evitar aninhamento.</p>
            <p className="text-sm mt-2">Em outro terminal: <code className="bg-muted px-1 rounded">cd modules/{moduleData.slug} ; pnpm dev</code>. Depois recarregue esta página.</p>
          </div>
        </div>
      );
    }
    const subpath = location.pathname.replace(new RegExp(`^/app/${moduleSlug || ""}`), "") || "";
    const iframeSrc = subpath ? `${base}${subpath.startsWith("/") ? subpath : `/${subpath}`}` : `${base}/`;
    try {
      iframeOriginRef.current = new URL(base).origin;
    } catch {
      iframeOriginRef.current = null;
    }

    return (
      <div className="flex flex-col w-full min-w-0 h-[calc(100vh-8rem)] outline-none focus:outline-none focus-within:outline-none">
        <iframe
          ref={iframeRef}
          title={moduleData.name}
          src={iframeSrc}
          className="w-full flex-1 min-h-[400px] border-0 rounded-lg bg-background outline-none focus:outline-none focus-visible:ring-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          allow="clipboard-write"
          onLoad={onIframeLoad}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-w-0 h-[calc(100vh-8rem)] min-h-[400px] outline-none focus:outline-none">
      {Component && <Component />}
    </div>
  );
}
