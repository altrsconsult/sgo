import { useState, useEffect } from "react";
import { Save } from "lucide-react";
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
} from "@sgo/ui";

/**
 * Página de configurações de negócio para o Admin (Cliente).
 * Mostra apenas configs relevantes para o gestor, não técnicas.
 */
export function AdminSettingsPage() {
  const { success, error: showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    orgName: "",
    orgEmail: "",
  });

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

  // Salva configurações
  const handleSave = async () => {
    setSaving(true);
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
          settings: settings,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      
      success("Configurações salvas com sucesso!");
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

          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
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

      {/* Reinstalação assistida */}
      <Card>
        <CardHeader>
          <CardTitle>Reinstalação do Sistema</CardTitle>
          <CardDescription>
            Reconfigure o banco com opção de manter ou limpar dados, incluindo migração entre tipos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Essa operação é sensível. O assistente aplica backup/restore quando a opção de manter dados estiver ativa.
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
    </div>
  );
}
