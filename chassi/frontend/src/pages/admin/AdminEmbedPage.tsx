import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Check, Code, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Skeleton,
} from "@sgo/ui";

interface Module {
  id: number;
  slug: string;
  name: string;
  active: boolean;
}

// Busca módulos
async function fetchModules(): Promise<Module[]> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/modules", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar módulos");
  return res.json();
}

/**
 * Página de configuração de embeds.
 * Gera URLs e snippets de iframe para incorporar módulos em sistemas externos.
 */
export function AdminEmbedPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: modules, isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
  });

  // Gera a URL base
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Copia para clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Gera snippet de iframe
  const generateIframeSnippet = (moduleSlug: string, width = "100%", height = "600px") => {
    return `<iframe
  src="${baseUrl}/app/${moduleSlug}?embed=true"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="clipboard-write"
  style="border: none; border-radius: 8px;"
></iframe>`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const activeModules = modules?.filter((m) => m.active) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6" />
          Embed & Integração
        </h1>
        <p className="text-muted-foreground">
          Incorpore módulos em outros sistemas usando iframes.
        </p>
      </div>

      {/* URL do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">URL Base do Sistema</CardTitle>
          <CardDescription>
            Use esta URL como base para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={baseUrl} readOnly />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(baseUrl, "base-url")}
            >
              {copiedId === "base-url" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Embed do Sistema Completo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Embed do Sistema Completo</CardTitle>
          <CardDescription>
            Incorpora o sistema inteiro (com login e navegação).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">URL de Embed</Label>
            <div className="flex gap-2 mt-1">
              <Input value={`${baseUrl}?embed=true`} readOnly />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(`${baseUrl}?embed=true`, "full-embed")}
              >
                {copiedId === "full-embed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Snippet Iframe</Label>
            <div className="relative mt-1">
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                {`<iframe
  src="${baseUrl}?embed=true"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>`}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() =>
                  copyToClipboard(
                    `<iframe src="${baseUrl}?embed=true" width="100%" height="600px" frameborder="0"></iframe>`,
                    "full-snippet"
                  )
                }
              >
                {copiedId === "full-snippet" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embeds por Módulo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Embed por Módulo</CardTitle>
          <CardDescription>
            Incorpora um módulo específico diretamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeModules.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum módulo ativo disponível para embed.
            </p>
          ) : (
            <div className="space-y-4">
              {activeModules.map((module) => (
                <div
                  key={module.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{module.name}</span>
                      <Badge variant="secondary">{module.slug}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(`${baseUrl}/app/${module.slug}`, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">URL de Embed</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={`${baseUrl}/app/${module.slug}?embed=true`}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `${baseUrl}/app/${module.slug}?embed=true`,
                            `url-${module.slug}`
                          )
                        }
                      >
                        {copiedId === `url-${module.slug}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Snippet Iframe</Label>
                    <div className="relative mt-1">
                      <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                        {generateIframeSnippet(module.slug)}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() =>
                          copyToClipboard(
                            generateIframeSnippet(module.slug),
                            `snippet-${module.slug}`
                          )
                        }
                      >
                        {copiedId === `snippet-${module.slug}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
