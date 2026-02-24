import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layers, Settings, Users, ToggleLeft, ToggleRight, ExternalLink, Upload, Trash2, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
  Skeleton,
  Input,
  Label,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@sgo/ui";

interface Module {
  id: number;
  slug: string;
  name: string;
  description: string;
  version: string;
  entry_url: string;
  active: number;
  created_at: string;
  /** Ordem na tela inicial (Admin); menor número aparece primeiro */
  sort_order?: number | null;
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

// Ativa/desativa módulo (API: PATCH /api/modules/:id/toggle-active)
async function toggleModuleActive(id: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/modules/${id}/toggle-active`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao atualizar módulo");
  return res.json();
}

// Atualiza ordem na tela inicial (PATCH /api/modules/:id)
async function updateModuleSortOrder(id: number, sort_order: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/modules/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sort_order }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar ordem");
  return res.json();
}

// Remove módulo (apenas superadmin)
async function deleteModule(id: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/modules/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao remover módulo");
  }
  return res.json();
}

// Instala módulo via link (URL + código de compra). Valida no Nexus e baixa zip protegido.
async function installFromLink(url: string, code: string) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/install-from-link", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url.trim(), code: code.trim() }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Erro ao instalar por link");
  }
  return res.json();
}

/**
 * Página de gestão de módulos para o Admin.
 */
export function AdminModulesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();
  const { isSuperAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [linkUrl, setLinkUrl] = useState("");
  const [linkCode, setLinkCode] = useState("");
  // Controla qual módulo está aguardando confirmação de remoção
  const [deleteTarget, setDeleteTarget] = useState<Module | null>(null);

  // Query
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => toggleModuleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      success("Módulo atualizado");
    },
    onError: () => showError("Erro", "Não foi possível atualizar"),
  });

  const updateSortOrderMutation = useMutation({
    mutationFn: ({ id, sort_order }: { id: number; sort_order: number }) => updateModuleSortOrder(id, sort_order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["allowed-modules"] });
      success("Ordem atualizada");
    },
    onError: () => showError("Erro", "Não foi possível atualizar a ordem"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      success("Módulo removido");
    },
    onError: (err: Error) => showError("Erro", err.message),
  });

  const installFromLinkMutation = useMutation({
    mutationFn: ({ url, code }: { url: string; code: string }) => installFromLink(url, code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      success("Sucesso", data.message || "Módulo instalado");
      setLinkUrl("");
      setLinkCode("");
    },
    onError: (err: Error) => showError("Erro", err.message),
  });

  const handleToggle = (module: Module) => {
    toggleMutation.mutate(module.id);
  };

  // Abre o AlertDialog em vez do confirm() bloqueante
  const handleRemove = (module: Module) => {
    setDeleteTarget(module);
  };

  const handleInstallFromLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim() || !linkCode.trim()) return;
    installFromLinkMutation.mutate({ url: linkUrl, code: linkCode });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      showError("Erro", "Por favor, envie um arquivo .zip");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("sgo-token");
      const res = await fetch("/api/upload-module", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err.error || "Erro no upload";
        // 401 = token expirado/inválido; 403 = sem permissão (admin/superadmin)
        if (res.status === 401) {
          localStorage.removeItem("sgo-token");
          window.location.href = "/login?from=upload";
          return;
        }
        throw new Error(msg);
      }

      const data = await res.json();
      success("Sucesso", data.message);
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    } catch (err: any) {
      showError("Erro", err.message || "Erro ao fazer upload do módulo");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AlertDialog de confirmação de remoção de módulo */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover módulo?</AlertDialogTitle>
            <AlertDialogDescription>
              O módulo <strong>{deleteTarget?.name}</strong> será removido do banco de dados. Os arquivos em{" "}
              <code className="text-xs bg-muted px-1 rounded">modules_storage</code> continuarão no servidor.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Módulos</h1>
          <p className="text-muted-foreground">
            Gerencie os módulos instalados e suas permissões.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".zip"
            onChange={handleFileChange}
            aria-label="Selecionar arquivo .zip do módulo"
          />
          <Button
            variant="outline"
            onClick={handleUploadClick}
            title="Envie um .zip do módulo. Se o módulo já existir (mesmo slug), será atualizado sem perder dados."
          >
            <Upload className="h-4 w-4 mr-2" />
            Instalar / Atualizar Módulo
          </Button>
        </div>
      </div>

      {/* Instalar por link (URL + código de compra) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link className="h-4 w-4" />
            Instalar por link
          </CardTitle>
          <CardDescription>
            Cole o link do módulo (ex.: do Nexus/marketplace) e o código de compra. O sistema validará e instalará automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInstallFromLink} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="link-url">URL do módulo</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://nexus.exemplo.com/api/modules/file/leads-intake/1.0.0"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-code">Código de compra</Label>
              <Input
                id="link-code"
                placeholder="XXXX-XXXX-XXXX"
                value={linkCode}
                onChange={(e) => setLinkCode(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={installFromLinkMutation.isPending || !linkUrl.trim() || !linkCode.trim()}>
                {installFromLinkMutation.isPending ? "Instalando…" : "Instalar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de módulos */}
      {modules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum módulo instalado.
              Use \"Instalar / Atualizar Módulo\" (zip) ou \"Instalar por link\" (URL + código).
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {module.name}
                        <Badge variant={module.active ? "success" : "secondary"}>
                          {module.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{module.description || "Sem descrição"}</CardDescription>
                    </div>
                  </div>

                  {/* Toggle de ativação */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggle(module)}
                    title={module.active ? "Desativar módulo" : "Ativar módulo"}
                    disabled={toggleMutation.isPending}
                  >
                    {module.active ? (
                      <ToggleRight className="h-6 w-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`sort-${module.id}`} className="text-muted-foreground whitespace-nowrap">
                      Ordem na tela inicial
                    </Label>
                    <Input
                      id={`sort-${module.id}`}
                      type="number"
                      min={0}
                      className="w-20 h-8"
                      defaultValue={module.sort_order ?? 0}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v) && v >= 0) {
                          updateSortOrderMutation.mutate({ id: module.id, sort_order: v });
                        }
                      }}
                      aria-label={`Ordem do módulo ${module.name}`}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>Slug: {module.slug}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Versão: {module.version || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm">
                  <div className="flex gap-2">
                    {module.active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/app/${module.slug}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Abrir
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/app/${module.slug}/config`)}
                      title="Configuração do módulo (abre dentro do próprio módulo)"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configuração
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/admin/permissions")}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Permissões
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemove(module)}
                        disabled={deleteMutation.isPending}
                        title="Remover módulo do sistema"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
