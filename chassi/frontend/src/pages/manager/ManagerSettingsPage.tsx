import { useState, useEffect } from "react";
import { Save, Key, Webhook, Shield, Palette, Copy, Eye, EyeOff, Server, Settings2, Radio, LayoutGrid, PanelLeft } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
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
  Badge,
} from "@sgo/ui";

const DEFAULT_GLOBAL_WEBHOOK_URL = "https://workflow.arelis.online/webhook/global-intake";
const DEFAULT_TICKETS_WEBHOOK_URL = "https://workflow.arelis.online/webhook/tickets-intake";

/**
 * Página de configurações técnicas para o Superadmin (Consultoria).
 * Chaves de API, webhooks, configs de infraestrutura.
 */
export function ManagerSettingsPage() {
  const { success, error: showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    openaiKey: "",
    sendgridKey: "",
    webhookUrl: DEFAULT_GLOBAL_WEBHOOK_URL,
    webhookSecret: "",
    ticketsWebhookUrl: DEFAULT_TICKETS_WEBHOOK_URL,
    ticketsWebhookSecret: "",
  });
  const [theme, setTheme] = useState("default");
  const [layout, setLayout] = useState<"gallery" | "sidebar">("gallery");
  // Reconfigurar instalação (dados do wizard)
  const [installationForm, setInstallationForm] = useState({
    company_name: "",
    public_url: "",
  });
  const [savingInstallation, setSavingInstallation] = useState(false);
  const [sendingPulse, setSendingPulse] = useState(false);

  // Estado para informações da instalação (Nexus)
  const [installation, setInstallation] = useState<{
    installationId: string;
    masterKey: string;
    isDev: boolean;
    message: string;
  } | null>(null);
  const [showMasterKey, setShowMasterKey] = useState(false);

  // Carrega configurações
  useEffect(() => {
    async function loadSettings() {
      try {
        const token = localStorage.getItem("sgo-token");
        
        // Busca todas as configurações
        const res = await fetch("/api/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSettings({
            openaiKey: data.openaiKey || "",
            sendgridKey: data.sendgridKey || "",
            // Mantém defaults oficiais quando ainda não houver valor salvo no banco.
            webhookUrl: data.webhookUrl || DEFAULT_GLOBAL_WEBHOOK_URL,
            webhookSecret: data.webhookSecret || "",
            // Mantém defaults oficiais quando ainda não houver valor salvo no banco.
            ticketsWebhookUrl: data.tickets_webhook_url || DEFAULT_TICKETS_WEBHOOK_URL,
            ticketsWebhookSecret: data.tickets_webhook_secret || "",
          });
          setTheme(data.ui_theme || "default");
          setLayout(data.ui_layout === "sidebar" ? "sidebar" : "gallery");
          setInstallationForm({
            company_name: data.company_name || "",
            public_url: data.public_url || "",
          });
        }

        // Busca informações da instalação (Nexus)
        const resInstall = await fetch("/api/settings/installation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resInstall.ok) {
          const installData = await resInstall.json();
          setInstallation(installData);
        }
      } catch (err) {
        console.error("Erro ao carregar configurações", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Copia texto para área de transferência
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} copiado para a área de transferência!`);
  };

  // Salva configurações
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("sgo-token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // 1. Salva configurações técnicas
      const resTech = await fetch("/api/settings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          category: "technical",
          settings: {
            openaiKey: settings.openaiKey,
            sendgridKey: settings.sendgridKey,
            webhookUrl: settings.webhookUrl,
            webhookSecret: settings.webhookSecret,
            tickets_webhook_url: settings.ticketsWebhookUrl,
            tickets_webhook_secret: settings.ticketsWebhookSecret,
          },
        }),
      });

      if (!resTech.ok) throw new Error("Erro ao salvar configurações técnicas");

      // 2. Salva tema e layout (Aparência)
      const resTheme = await fetch("/api/settings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          category: "appearance",
          settings: { ui_theme: theme, ui_layout: layout },
        }),
      });

      if (!resTheme.ok) throw new Error("Erro ao salvar aparência");
      
      success("Configurações salvas com sucesso!");
      
      // Recarrega para aplicar tema e layout
      setTimeout(() => window.location.reload(), 1000);

    } catch (err) {
      showError("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  // Salva apenas reconfiguração de instalação (nome, URL pública)
  const handleSaveInstallation = async () => {
    setSavingInstallation(true);
    try {
      const token = localStorage.getItem("sgo-token");
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "general",
          settings: {
            company_name: installationForm.company_name.trim(),
            public_url: installationForm.public_url.trim().replace(/\/$/, "") || "",
          },
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      success("Instalação atualizada. A URL pública será usada no próximo pulse para o Nexus.");
    } catch (err) {
      showError("Erro ao salvar reconfiguração.");
    } finally {
      setSavingInstallation(false);
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
        <h1 className="text-2xl font-bold">Configurações Técnicas</h1>
        <p className="text-muted-foreground">
          Ajustes de infraestrutura e integrações (apenas Superadmin).
        </p>
      </div>

      {/* Reconfigurar instalação — protegido por superadmin (rota já exige) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            <CardTitle>Reconfigurar instalação</CardTitle>
          </div>
          <CardDescription>
            Altere nome da empresa e URL pública (para aparecer no Nexus). Não recria superadmin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Nome da empresa / instância</Label>
            <Input
              id="company_name"
              placeholder="Ex: Minha Empresa Ltda"
              value={installationForm.company_name}
              onChange={(e) =>
                setInstallationForm({ ...installationForm, company_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="public_url">URL pública do sistema</Label>
            <Input
              id="public_url"
              type="url"
              placeholder="https://coresgo.altrs.net"
              value={installationForm.public_url}
              onChange={(e) =>
                setInstallationForm({ ...installationForm, public_url: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Usada no pulse para o Nexus. Após salvar, use &quot;Enviar pulse agora&quot; ou reinicie o servidor.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSaveInstallation} disabled={savingInstallation}>
              <Save className="h-4 w-4 mr-2" />
              {savingInstallation ? "Salvando..." : "Salvar reconfiguração"}
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                setSendingPulse(true);
                try {
                  const token = localStorage.getItem("sgo-token");
                  const res = await fetch("/api/settings/send-nexus-pulse", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (data.success) {
                    success("Pulse enviado ao Nexus. Dados atualizados no painel.");
                  } else {
                    showError(data.message || "Falha ao enviar pulse.");
                  }
                } catch {
                  showError("Erro ao enviar pulse ao Nexus.");
                } finally {
                  setSendingPulse(false);
                }
              }}
              disabled={sendingPulse}
            >
              <Radio className="h-4 w-4 mr-2" />
              {sendingPulse ? "Enviando..." : "Enviar pulse agora"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reinstalação assistida */}
      <Card>
        <CardHeader>
          <CardTitle>Reinstalação Assistida</CardTitle>
          <CardDescription>
            Refaça a instalação com escolha de banco e estratégia de dados (manter ou limpar).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Use este fluxo para migração entre SQLite, MySQL e PostgreSQL com backup/restore guiado.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/setup?reinstall=true";
            }}
          >
            Abrir assistente de reinstalação
          </Button>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Aparência</CardTitle>
          </div>
          <CardDescription>
            Personalize o tema visual e o layout de módulos do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Layout: Galeria vs Sidebar */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Layout dos módulos</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all flex items-start gap-3 ${layout === "gallery" ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => setLayout("gallery")}
                >
                  <LayoutGrid className="h-8 w-8 shrink-0 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Galeria</div>
                    <p className="text-xs text-muted-foreground">Módulos em cards na página inicial.</p>
                  </div>
                </div>
                <div
                  className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all flex items-start gap-3 ${layout === "sidebar" ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => setLayout("sidebar")}
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
            <div>
              <Label className="text-sm font-medium mb-2 block">Tema visual</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Default */}
                <div 
                    className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${theme === 'default' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setTheme('default')}
                >
                    <div className="h-20 bg-blue-500 rounded mb-2 opacity-80"></div>
                    <div className="font-semibold">Padrão</div>
                    <p className="text-xs text-muted-foreground">Tema clássico azul.</p>
                </div>
                
                {/* Minimal */}
                <div 
                    className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${theme === 'minimal' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setTheme('minimal')}
                >
                    <div className="h-20 bg-zinc-200 border border-zinc-300 rounded mb-2"></div>
                    <div className="font-semibold">Minimal</div>
                    <p className="text-xs text-muted-foreground">Escala de cinza e alto contraste.</p>
                </div>

                {/* Group */}
                <div 
                    className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${theme === 'group' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setTheme('group')}
                >
                    <div className="h-20 bg-zinc-900 rounded mb-2"></div>
                    <div className="font-semibold">Group</div>
                    <p className="text-xs text-muted-foreground">Tema escuro executivo.</p>
                </div>
            </div>
            </div>
        </CardContent>
      </Card>

      {/* Chaves de API */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Chaves de API</CardTitle>
          </div>
          <CardDescription>
            Configure chaves de serviços externos utilizados pelos módulos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openaiKey">OpenAI API Key</Label>
            <Input
              id="openaiKey"
              type="password"
              placeholder="sk-..."
              value={settings.openaiKey}
              onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Usado para funcionalidades de IA nos módulos.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="sendgridKey">SendGrid API Key</Label>
            <Input
              id="sendgridKey"
              type="password"
              placeholder="SG...."
              value={settings.sendgridKey}
              onChange={(e) => setSettings({ ...settings, sendgridKey: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Usado para envio de e-mails transacionais.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks Globais */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            <CardTitle>Webhooks Globais</CardTitle>
          </div>
          <CardDescription>
            Configure endpoints para receber eventos do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">URL do Webhook</Label>
            <Input
              id="webhookUrl"
              type="url"
              placeholder="https://hooks.zapier.com/..."
              value={settings.webhookUrl}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Secret (opcional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              placeholder="whsec_..."
              value={settings.webhookSecret}
              onChange={(e) => setSettings({ ...settings, webhookSecret: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Webhook de Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            <CardTitle>Webhook de Tickets (Superadmin)</CardTitle>
          </div>
          <CardDescription>
            Recebe eventos de suporte: criação, resposta e mudança de status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticketsWebhookUrl">URL do Webhook de Tickets</Label>
            <Input
              id="ticketsWebhookUrl"
              type="url"
              placeholder="https://seu-endpoint.com/webhooks/tickets"
              value={settings.ticketsWebhookUrl}
              onChange={(e) => setSettings({ ...settings, ticketsWebhookUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticketsWebhookSecret">Secret do Webhook de Tickets (opcional)</Label>
            <Input
              id="ticketsWebhookSecret"
              type="password"
              placeholder="whsec_..."
              value={settings.ticketsWebhookSecret}
              onChange={(e) => setSettings({ ...settings, ticketsWebhookSecret: e.target.value })}
            />
          </div>

          <div className="rounded-md border bg-muted/20 p-3 text-xs space-y-2">
            <p>
              <strong>Tip:</strong> endpoint recomendado para feedback/status:
              <span className="font-mono"> POST /api/tickets/:id/messages</span> e
              <span className="font-mono"> PATCH /api/tickets/:id/status</span>.
            </p>
            <p>
              Payload de entrada enviado para seu webhook:
            </p>
            <pre className="overflow-x-auto rounded bg-background p-2 text-[11px]">
{`{
  "event": "ticket.created | ticket.message_added | ticket.status_changed",
  "timestamp": "2026-02-12T12:34:56.000Z",
  "webhookId": "tickets-global",
  "data": {
    "ticket": { "id": 12, "subject": "..." },
    "actor": { "id": 1, "role": "admin", "name": "..." }
  }
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
      
      {/* Informações da Instalação (Nexus) */}
      {installation && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              <CardTitle>Informações da Instalação</CardTitle>
              {installation.isDev && (
                <Badge variant="secondary">Dev</Badge>
              )}
            </div>
            <CardDescription>
              Identificação única desta instalação para comunicação com o Nexus Central.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Installation ID */}
            <div className="space-y-2">
              <Label>Installation ID</Label>
              <div className="flex gap-2">
                <Input
                  value={installation.installationId}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(installation.installationId, "Installation ID")}
                  title="Copiar"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Identificador único e permanente desta instalação.
              </p>
            </div>

            <Separator />

            {/* Master Key */}
            <div className="space-y-2">
              <Label>Master Key (Nexus M2M)</Label>
              <div className="flex gap-2">
                <Input
                  type={showMasterKey ? "text" : "password"}
                  value={installation.masterKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowMasterKey(!showMasterKey)}
                  title={showMasterKey ? "Ocultar" : "Revelar"}
                >
                  {showMasterKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(installation.masterKey, "Master Key")}
                  title="Copiar"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {installation.message}
              </p>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <strong>Quando usar:</strong> Esta chave é enviada automaticamente para o Nexus Central via Pulse. 
              Use manualmente apenas como backup offline se a comunicação automática falhar.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Segurança */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Segurança</CardTitle>
          </div>
          <CardDescription>
            Configurações de segurança e acesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jwtSecret">JWT Secret</Label>
            <Input
              id="jwtSecret"
              type="password"
              placeholder="••••••••••••••••"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Chave de assinatura dos tokens. Alterar invalida todos os logins.
            </p>
          </div>

          <Button variant="destructive">
            Regenerar JWT Secret
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Todas Configurações"}
        </Button>
      </div>
    </div>
  );
}
