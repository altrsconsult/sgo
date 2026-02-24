import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Layers, Trash2, RefreshCw, Pencil } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
  Skeleton,
} from "@sgo/ui";

interface Module {
  id: number;
  slug: string;
  name: string;
  description: string;
  version: string;
  entry_url: string;
  path?: string; // URL/caminho do módulo (alternativo a entry_url)
  active: number;
  created_at: string;
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

// Registra módulo. API espera path; formulário usa entry_url.
async function registerModule(data: Partial<Module>) {
  const token = localStorage.getItem("sgo-token");
  const body = {
    slug: data.slug,
    name: data.name,
    description: data.description,
    version: data.version,
    path: (data as any).entry_url ?? (data as any).path ?? null,
  };
  const res = await fetch("/api/modules", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao registrar módulo");
  }
  return res.json();
}

// Atualiza módulo
async function updateModule(id: number, data: Partial<Module>) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/modules/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar módulo");
  return res.json();
}

// Deleta módulo
async function deleteModule(id: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/modules/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao remover módulo");
  return res.json();
}

/**
 * Página de gestão de módulos para o Superadmin (Consultoria).
 */
export function ManagerModulesPage() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    version: "1.0.0",
    entry_url: "",
  });

  // Query
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
  });

  // Mutations
  const registerMutation = useMutation({
    mutationFn: registerModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      success("Módulo registrado com sucesso");
      resetForm();
    },
    onError: (err: Error) => showError("Erro", err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Module> }) => updateModule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      success("Módulo atualizado");
      resetForm();
    },
    onError: () => showError("Erro", "Não foi possível atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      success("Módulo removido");
    },
    onError: () => showError("Erro", "Não foi possível remover"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModule) {
      updateMutation.mutate({ id: editingModule.id, data: formData });
    } else {
      registerMutation.mutate(formData);
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      slug: module.slug,
      name: module.name,
      description: module.description || "",
      version: module.version || "1.0.0",
      entry_url: (module as any).path || module.entry_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = (module: Module) => {
    if (confirm(`Remover módulo "${module.name}"? Esta ação não pode ser desfeita.`)) {
      deleteMutation.mutate(module.id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingModule(null);
    setFormData({ slug: "", name: "", description: "", version: "1.0.0", entry_url: "" });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Módulos</h1>
          <p className="text-muted-foreground">
            Instale, atualize e gerencie módulos da instância.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Upload className="h-4 w-4 mr-2" />
          Registrar Módulo
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingModule ? "Editar Módulo" : "Registrar Novo Módulo"}
            </CardTitle>
            <CardDescription>
              Registre um módulo externo para ser carregado via Module Federation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (identificador único)</Label>
                <Input
                  id="slug"
                  placeholder="ex: leads-intake"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  disabled={!!editingModule}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="ex: Captação de Leads"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Breve descrição do módulo"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Versão</Label>
                <Input
                  id="version"
                  placeholder="1.0.0"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entry_url">URL do remoteEntry.js</Label>
                <Input
                  id="entry_url"
                  placeholder="http://localhost:5001/assets/remoteEntry.js"
                  value={formData.entry_url}
                  onChange={(e) => setFormData({ ...formData, entry_url: e.target.value })}
                />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" disabled={registerMutation.isPending || updateMutation.isPending}>
                  {editingModule ? "Salvar" : "Registrar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Módulos Instalados</CardTitle>
          <CardDescription>
            {modules.length} módulo(s) registrado(s) nesta instância.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {modules.length === 0 ? (
            <div className="py-12 text-center">
              <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum módulo registrado.</p>
            </div>
          ) : (
            <div className="divide-y">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{module.name}</span>
                        <Badge
                          variant={module.active ? "success" : "secondary"}
                          className="text-xs"
                        >
                          {module.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {module.slug} • v{module.version || "N/A"}
                        {(module.path || module.entry_url) && (
                          <span className="ml-2 text-xs">• {module.path || module.entry_url}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEdit(module)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remover módulo"
                      onClick={() => handleDelete(module)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
