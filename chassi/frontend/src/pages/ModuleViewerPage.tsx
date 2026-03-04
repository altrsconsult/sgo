import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button, Skeleton } from "@sgo/ui";
import { ModuleErrorFallback } from "@/hooks/useRemoteModule.js";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useCallback } from "react";

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
 * Página que renderiza módulos instaláveis via iframe.
 * Rota: /app/:moduleSlug/*
 */
export function ModuleViewerPage() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();

  // Busca metadados do módulo
  const { data: moduleData, isLoading: isLoadingMeta, error: metaError } = useQuery({
    queryKey: ["module", moduleSlug],
    queryFn: () => fetchModule(moduleSlug!),
    enabled: !!moduleSlug,
  });

  const isDev = import.meta.env.DEV && !import.meta.env.PROD;
  const devServerUrl = typeof moduleData?.devServerUrl === "string" ? moduleData.devServerUrl : null;
  const rawModuleUrl = typeof moduleData?.remoteUrl === "string" ? moduleData.remoteUrl : typeof moduleData?.remoteEntry === "string" ? moduleData.remoteEntry : null;

  // Refs do iframe para sincronizar tema/token/usuário com o módulo.
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

  // Resolve URL base do módulo para iframe-only:
  // - Em dev, prioriza devServerUrl (HMR).
  // - Em produção, usa remoteUrl/remoteEntry legado ou fallback para /modules-assets/<slug>/dist/index.html.
  const normalizedRawUrl =
    isDev && devServerUrl
      ? devServerUrl
      : rawModuleUrl || `/modules-assets/${moduleData.slug}/dist/index.html`;
  const absoluteRawUrl = normalizedRawUrl.startsWith("http")
    ? normalizedRawUrl
    : `${window.location.origin}${normalizedRawUrl.startsWith("/") ? "" : "/"}${normalizedRawUrl}`;

  let baseUrl = absoluteRawUrl;
  if (absoluteRawUrl.endsWith("/assets/remoteEntry.js")) {
    baseUrl = absoluteRawUrl.replace(/\/assets\/remoteEntry\.js$/, "");
  } else if (absoluteRawUrl.endsWith("index.html")) {
    baseUrl = absoluteRawUrl.replace(/\/index\.html$/, "");
  } else {
    baseUrl = absoluteRawUrl.replace(/\/$/, "");
  }

  if (!baseUrl) {
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

  const subpath = location.pathname.replace(new RegExp(`^/app/${moduleSlug || ""}`), "") || "";
  const iframePath = subpath ? (subpath.startsWith("/") ? subpath : `/${subpath}`) : "/";
  const iframeSrc = `${baseUrl}${iframePath}${location.search}${location.hash}`;

  try {
    iframeOriginRef.current = new URL(baseUrl).origin;
  } catch {
    iframeOriginRef.current = null;
  }

  return (
    <div className="flex flex-col w-full min-w-0 h-[calc(100vh-8rem)] outline-none focus:outline-none focus-within:outline-none">
      <iframe
        ref={iframeRef}
        title={moduleData.name}
        src={iframeSrc}
        className="w-full flex-1 min-h-[400px] border-0 rounded-lg bg-transparent outline-none focus:outline-none focus-visible:ring-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        allow="clipboard-write"
        onLoad={onIframeLoad}
      />
    </div>
  );
}
