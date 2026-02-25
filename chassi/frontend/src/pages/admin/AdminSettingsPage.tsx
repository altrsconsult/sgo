import { useState, useEffect, useRef } from "react";
import { Save, Palette, LayoutGrid, PanelLeft, ImageIcon, FileCode2, Trash2, Download } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
import {
  parseCustomThemeJson,
  saveCustomThemeToStorage,
  clearCustomThemeFromStorage,
  loadCustomThemeFromStorage,
} from "@/utils/customTheme";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
  Skeleton,
} from "@sgo/ui";

/**
 * Página de configurações de negócio para o Admin (Cliente).
 * Inclui Informações da Organização, Aparência (tema, layout, logo) e módulos.
 */
export function AdminSettingsPage() {
  const { success, error: showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileLightRef = useRef<HTMLInputElement>(null);
  const fileDarkRef = useRef<HTMLInputElement>(null);
  const themeFileRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    orgName: "",
    orgEmail: "",
    ui_theme: "default" as string,
    ui_layout: "gallery" as "gallery" | "sidebar",
    logo_format: "icon" as "icon" | "horizontal",
    logoFileId: null as string | null,
    logoDarkFileId: null as string | null,
  });
  // Arquivos novos selecionados (ainda não enviados)
  const [pendingLogoLight, setPendingLogoLight] = useState<File | null>(null);
  const [pendingLogoDark, setPendingLogoDark] = useState<File | null>(null);
  // JSON colado para tema personalizado (alternativa ao upload para usuários não técnicos)
  const [pastedThemeJson, setPastedThemeJson] = useState("");

  // Carrega configurações
  useEffect(() => {
    async function loadSettings() {
      try {
        const token = localStorage.getItem("sgo-token");
        const res = await fetch("/api/settings/general", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSettings({
            orgName: data.orgName || "",
            orgEmail: data.orgEmail || "",
            ui_theme: data.ui_theme || "default",
            ui_layout: data.ui_layout === "sidebar" ? "sidebar" : "gallery",
            logo_format: data.logo_format === "horizontal" ? "horizontal" : "icon",
            logoFileId: data.logoFileId || null,
            logoDarkFileId: data.logoDarkFileId || null,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar configurações", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Salva configurações (inclui upload de logos se houver arquivos pendentes)
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("sgo-token");
      const headers: HeadersInit = { Authorization: `Bearer ${token}` };
      let logoFileId = settings.logoFileId;
      let logoDarkFileId = settings.logoDarkFileId;

      // Upload do logo tema claro se houver novo arquivo
      if (pendingLogoLight) {
        const fd = new FormData();
        fd.append("file", pendingLogoLight);
        const up = await fetch("/api/storage/files", { method: "POST", headers, body: fd });
        if (!up.ok) throw new Error("Falha ao enviar logo (claro)");
        const rec = await up.json();
        logoFileId = rec.id;
        setPendingLogoLight(null);
      }
      // Upload do logo tema escuro se houver novo arquivo
      if (pendingLogoDark) {
        const fd = new FormData();
        fd.append("file", pendingLogoDark);
        const up = await fetch("/api/storage/files", { method: "POST", headers, body: fd });
        if (!up.ok) throw new Error("Falha ao enviar logo (escuro)");
        const rec = await up.json();
        logoDarkFileId = rec.id;
        setPendingLogoDark(null);
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "general",
          settings: {
            orgName: settings.orgName,
            orgEmail: settings.orgEmail,
            ui_theme: settings.ui_theme,
            ui_layout: settings.ui_layout,
            logo_format: settings.logo_format,
            logoFileId: logoFileId ?? null,
            logoDarkFileId: logoDarkFileId ?? null,
          },
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      setSettings((s) => ({ ...s, logoFileId: logoFileId ?? null, logoDarkFileId: logoDarkFileId ?? null }));
      success("Configurações salvas com sucesso!");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showError("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Ajuste as configurações do seu ambiente.
        </p>
      </div>

      {/* Informações da Organização */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Organização</CardTitle>
          <CardDescription>
            Dados básicos que aparecem no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome da Organização</Label>
              <Input
                id="orgName"
                placeholder="Ex: Minha Empresa LTDA"
                value={settings.orgName}
                onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgEmail">E-mail de Contato</Label>
              <Input
                id="orgEmail"
                type="email"
                placeholder="contato@empresa.com"
                value={settings.orgEmail}
                onChange={(e) => setSettings({ ...settings, orgEmail: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aparência: tema, layout, logo (espelhado do Superadmin) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Aparência</CardTitle>
          </div>
          <CardDescription>
            Tema visual, layout dos módulos e logotipo (claro e escuro).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Layout: Galeria vs Sidebar */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Layout dos módulos</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all flex items-start gap-3 ${settings.ui_layout === "gallery" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSettings({ ...settings, ui_layout: "gallery" })}
              >
                <LayoutGrid className="h-8 w-8 shrink-0 text-muted-foreground" />
                <div>
                  <div className="font-semibold">Galeria</div>
                  <p className="text-xs text-muted-foreground">Módulos em cards na página inicial.</p>
                </div>
              </div>
              <div
                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all flex items-start gap-3 ${settings.ui_layout === "sidebar" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSettings({ ...settings, ui_layout: "sidebar" })}
              >
                <PanelLeft className="h-8 w-8 shrink-0 text-muted-foreground" />
                <div>
                  <div className="font-semibold">Sidebar</div>
                  <p className="text-xs text-muted-foreground">Módulos na barra lateral e conteúdo ao lado.</p>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          {/* Tema visual */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Tema visual</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${settings.ui_theme === "default" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSettings({ ...settings, ui_theme: "default" })}
              >
                <div className="h-20 bg-blue-500 rounded mb-2 opacity-80" />
                <div className="font-semibold">Padrão</div>
                <p className="text-xs text-muted-foreground">Tema clássico azul.</p>
              </div>
              <div
                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${settings.ui_theme === "minimal" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSettings({ ...settings, ui_theme: "minimal" })}
              >
                <div className="h-20 bg-zinc-200 border border-zinc-300 rounded mb-2" />
                <div className="font-semibold">Minimal</div>
                <p className="text-xs text-muted-foreground">Escala de cinza e alto contraste.</p>
              </div>
              <div
                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${settings.ui_theme === "group" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSettings({ ...settings, ui_theme: "group" })}
              >
                <div className="h-20 bg-zinc-900 rounded mb-2" />
                <div className="font-semibold">Group</div>
                <p className="text-xs text-muted-foreground">Tema escuro executivo.</p>
              </div>
              <div
                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${settings.ui_theme === "custom" ? "border-primary bg-primary/5" : "border-border"}`}
                onClick={() => setSettings({ ...settings, ui_theme: "custom" })}
              >
                <div className="h-20 rounded mb-2 flex items-center justify-center bg-muted border border-dashed border-muted-foreground/30">
                  <FileCode2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="font-semibold">Tema personalizado</div>
                <p className="text-xs text-muted-foreground">Upload de JSON com paleta e opcional tipografia.</p>
              </div>
            </div>
            {/* Upload de tema personalizado (quando "custom" selecionado) — espaçamento claro do grid */}
            {settings.ui_theme === "custom" && (
              <div className="mt-6 rounded-lg border border-border bg-muted/20 p-5 space-y-4">
                <Label className="text-sm font-medium">Arquivo do tema</Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Envie um .json ou <strong>cole o texto</strong> abaixo (ideal para quem gera o tema na IA e copia/cola). Campos: <code className="bg-muted px-1 rounded">name</code>,{" "}
                  <code className="bg-muted px-1 rounded">light</code> e/ou <code className="bg-muted px-1 rounded">dark</code> (HSL, ex: &quot;220 70% 50%&quot;). Opcional: <code className="bg-muted px-1 rounded">font</code> (Google Fonts).
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="/example-custom-theme.json"
                    download="example-custom-theme.json"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar modelo de exemplo
                  </a>
                  <a
                    href="/theme-para-ia.md"
                    download="theme-para-ia.md"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                    title="Envie este arquivo no ChatGPT, Claude ou Gemini para gerar o JSON do tema"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Guia para IA (ChatGPT/Claude/Gemini)
                  </a>
                  <input
                    ref={themeFileRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    aria-label="Selecionar arquivo JSON do tema"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const text = await file.text();
                        const raw = JSON.parse(text) as unknown;
                        const data = parseCustomThemeJson(raw);
                        if (!data) {
                          showError("Tema inválido", "O JSON deve ter pelo menos \"light\" ou \"dark\" com variáveis de cor.");
                          return;
                        }
                        if (!saveCustomThemeToStorage(data)) {
                          showError("Erro", "Não foi possível salvar o tema no navegador.");
                          return;
                        }
                        success("Tema aplicado", data.name || "Tema personalizado");
                        setSettings((s) => ({ ...s, ui_theme: "custom" }));
                        // Persiste escolha no servidor e recarrega para aplicar
                        const token = localStorage.getItem("sgo-token");
                        await fetch("/api/settings", {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                          body: JSON.stringify({
                            category: "general",
                            settings: {
                              orgName: settings.orgName,
                              orgEmail: settings.orgEmail,
                              ui_theme: "custom",
                              ui_layout: settings.ui_layout,
                              logo_format: settings.logo_format,
                              logoFileId: settings.logoFileId,
                              logoDarkFileId: settings.logoDarkFileId,
                            },
                          }),
                        });
                        setTimeout(() => window.location.reload(), 600);
                      } catch (err) {
                        showError("Arquivo inválido", (err as Error).message || "Use um JSON válido.");
                      }
                      e.target.value = "";
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => themeFileRef.current?.click()}>
                    <FileCode2 className="h-4 w-4 mr-1" />
                    Enviar arquivo .json
                  </Button>
                  {loadCustomThemeFromStorage() && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={async () => {
                        clearCustomThemeFromStorage();
                        setSettings((s) => ({ ...s, ui_theme: "default" }));
                        const token = localStorage.getItem("sgo-token");
                        await fetch("/api/settings", {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                          body: JSON.stringify({
                            category: "general",
                            settings: {
                              orgName: settings.orgName,
                              orgEmail: settings.orgEmail,
                              ui_theme: "default",
                              ui_layout: settings.ui_layout,
                              logo_format: settings.logo_format,
                              logoFileId: settings.logoFileId,
                              logoDarkFileId: settings.logoDarkFileId,
                            },
                          }),
                        });
                        success("Tema personalizado removido.");
                        setTimeout(() => window.location.reload(), 600);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remover tema personalizado
                    </Button>
                  )}
                </div>
                {/* Colar JSON em texto puro — acessível para usuários não técnicos */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <Label className="text-sm text-muted-foreground">Ou cole o JSON aqui (copie da IA ou do exemplo)</Label>
                  <textarea
                    value={pastedThemeJson}
                    onChange={(e) => setPastedThemeJson(e.target.value)}
                    placeholder='{"name": "Meu Tema", "light": { "primary": "220 70% 50%", ... }, "dark": { ... }}'
                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Campo para colar o JSON do tema"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!pastedThemeJson.trim()}
                    onClick={async () => {
                      const text = pastedThemeJson.trim();
                      if (!text) return;
                      try {
                        const raw = JSON.parse(text) as unknown;
                        const data = parseCustomThemeJson(raw);
                        if (!data) {
                          showError("Tema inválido", "O JSON deve ter pelo menos \"light\" ou \"dark\" com variáveis de cor.");
                          return;
                        }
                        if (!saveCustomThemeToStorage(data)) {
                          showError("Erro", "Não foi possível salvar o tema no navegador.");
                          return;
                        }
                        success("Tema aplicado", data.name || "Tema personalizado");
                        setSettings((s) => ({ ...s, ui_theme: "custom" }));
                        const token = localStorage.getItem("sgo-token");
                        await fetch("/api/settings", {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                          body: JSON.stringify({
                            category: "general",
                            settings: {
                              orgName: settings.orgName,
                              orgEmail: settings.orgEmail,
                              ui_theme: "custom",
                              ui_layout: settings.ui_layout,
                              logo_format: settings.logo_format,
                              logoFileId: settings.logoFileId,
                              logoDarkFileId: settings.logoDarkFileId,
                            },
                          }),
                        });
                        setPastedThemeJson("");
                        setTimeout(() => window.location.reload(), 600);
                      } catch (err) {
                        showError("JSON inválido", (err as Error).message || "Cole um JSON válido (ex.: gerado pela IA).");
                      }
                    }}
                  >
                    Aplicar tema colado
                  </Button>
                </div>
                {loadCustomThemeFromStorage()?.name && (
                  <p className="text-xs text-muted-foreground">
                    Tema ativo: <strong>{loadCustomThemeFromStorage()?.name}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
          <Separator />
          {/* Formato do logo e upload — alinhado ao design system, grid equilibrado */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Formato do logo</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <div
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${settings.logo_format === "icon" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  onClick={() => setSettings({ ...settings, logo_format: "icon" })}
                >
                  <div className="font-medium">Ícone quadrado</div>
                  <p className="text-xs text-muted-foreground mt-0.5">Proporção 1:1 no header.</p>
                </div>
                <div
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${settings.logo_format === "horizontal" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  onClick={() => setSettings({ ...settings, logo_format: "horizontal" })}
                >
                  <div className="font-medium">Logo horizontal</div>
                  <p className="text-xs text-muted-foreground mt-0.5">Retângulo (largura maior que altura).</p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-3 block">Upload dos logos</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-lg border border-border bg-card p-4 space-y-3 min-h-[140px] flex flex-col">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tema claro</Label>
                  <div className="flex items-center gap-4 flex-1">
                    {(settings.logoFileId || pendingLogoLight) ? (
                      <span className="logo-preview-wrap shrink-0">
                        {pendingLogoLight ? (
                          <img src={URL.createObjectURL(pendingLogoLight)} alt="Preview claro" className="logo-preview-img" />
                        ) : (
                          <img src="/api/public/logo/light" alt="Logo claro" className="logo-preview-img" />
                        )}
                      </span>
                    ) : (
                      <span className="logo-preview-wrap shrink-0 bg-muted/50 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" aria-hidden />
                      </span>
                    )}
                    <div className="min-w-0">
                      <input
                        ref={fileLightRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        aria-label="Selecionar arquivo do logo para tema claro"
                        onChange={(e) => setPendingLogoLight(e.target.files?.[0] ?? null)}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileLightRef.current?.click()} className="w-full sm:w-auto">
                        <ImageIcon className="h-4 w-4 mr-1 shrink-0" />
                        {settings.logoFileId || pendingLogoLight ? "Trocar" : "Enviar"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 space-y-3 min-h-[140px] flex flex-col">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tema escuro</Label>
                  <div className="flex items-center gap-4 flex-1">
                    {(settings.logoDarkFileId || pendingLogoDark) ? (
                      <span className="logo-preview-wrap logo-preview-dark shrink-0">
                        {pendingLogoDark ? (
                          <img src={URL.createObjectURL(pendingLogoDark)} alt="Preview escuro" className="logo-preview-img" />
                        ) : (
                          <img src="/api/public/logo/dark" alt="Logo escuro" className="logo-preview-img" />
                        )}
                      </span>
                    ) : (
                      <span className="logo-preview-wrap shrink-0 bg-muted/50 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" aria-hidden />
                      </span>
                    )}
                    <div className="min-w-0">
                      <input
                        ref={fileDarkRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        aria-label="Selecionar arquivo do logo para tema escuro"
                        onChange={(e) => setPendingLogoDark(e.target.files?.[0] ?? null)}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileDarkRef.current?.click()} className="w-full sm:w-auto">
                        <ImageIcon className="h-4 w-4 mr-1 shrink-0" />
                        {settings.logoDarkFileId || pendingLogoDark ? "Trocar" : "Enviar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Use imagens em SVG ou PNG. Sem logo customizado, o padrão SGO será exibido.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações dos Módulos */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações dos Módulos</CardTitle>
          <CardDescription>
            Ajustes específicos de cada módulo instalado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum módulo com configurações disponíveis.
          </p>
        </CardContent>
      </Card>

      {/* Footer: salvar todas as alterações */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
