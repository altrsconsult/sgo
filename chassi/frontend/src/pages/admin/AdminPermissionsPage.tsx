import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Check, X, Users, Layers } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Skeleton,
} from "@sgo/ui";

interface Module {
  id: number;
  slug: string;
  name: string;
}

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface Group {
  id: number;
  name: string;
}

interface PermissionMatrix {
  modules: Module[];
  users: User[];
  groups: Group[];
  permissions: Record<string, number>;
}

// Busca a matriz de permissões
async function fetchPermissionMatrix(): Promise<PermissionMatrix> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/permissions/matrix", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar permissões");
  return res.json();
}

// Atualiza uma permissão
async function updatePermission(data: {
  moduleId: number;
  userId?: number;
  groupId?: number;
  allowed: boolean;
}) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/permissions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar permissão");
  return res.json();
}

/**
 * Página de gerenciamento de permissões.
 * Exibe uma matriz Usuários/Grupos x Módulos.
 */
export function AdminPermissionsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");

  const { data, isLoading, error } = useQuery({
    queryKey: ["permissions-matrix"],
    queryFn: fetchPermissionMatrix,
  });

  const mutation = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions-matrix"] });
    },
  });

  // Toggle de permissão
  const togglePermission = (
    moduleId: number,
    entityId: number,
    entityType: "user" | "group",
    currentValue: boolean
  ) => {
    mutation.mutate({
      moduleId,
      ...(entityType === "user" ? { userId: entityId } : { groupId: entityId }),
      allowed: !currentValue,
    });
  };

  // Verifica se tem permissão
  const hasPermission = (
    moduleId: number,
    entityId: number,
    entityType: "user" | "group"
  ): boolean => {
    if (!data) return false;
    const key = `${entityType}_${entityId}_${moduleId}`;
    return data.permissions[key] === 1;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Erro ao carregar permissões</p>
        </CardContent>
      </Card>
    );
  }

  const entities = activeTab === "users" ? data.users : data.groups;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Permissões
        </h1>
        <p className="text-muted-foreground">
          Defina quem pode acessar cada módulo.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          onClick={() => setActiveTab("users")}
        >
          <Users className="h-4 w-4 mr-2" />
          Por Usuário ({data.users.length})
        </Button>
        <Button
          variant={activeTab === "groups" ? "default" : "outline"}
          onClick={() => setActiveTab("groups")}
        >
          <Users className="h-4 w-4 mr-2" />
          Por Grupo ({data.groups.length})
        </Button>
      </div>

      {/* Aviso se não há módulos */}
      {data.modules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum módulo instalado. Instale módulos para configurar permissões.
            </p>
          </CardContent>
        </Card>
      ) : entities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {activeTab === "users"
                ? "Nenhum usuário cadastrado."
                : "Nenhum grupo cadastrado."}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Matriz de permissões */
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Matriz de Permissões
            </CardTitle>
            <CardDescription>
              Clique para alternar acesso. Admins têm acesso automático a todos os módulos.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium sticky left-0 bg-muted/50">
                    {activeTab === "users" ? "Usuário" : "Grupo"}
                  </th>
                  {data.modules.map((module) => (
                    <th
                      key={module.id}
                      className="text-center p-3 font-medium min-w-[120px]"
                    >
                      {module.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entities.map((entity) => {
                  const isAdmin =
                    activeTab === "users" &&
                    ((entity as User).role === "admin" ||
                      (entity as User).role === "superadmin");

                  return (
                    <tr key={entity.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 sticky left-0 bg-background">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {activeTab === "users"
                              ? (entity as User).name
                              : (entity as Group).name}
                          </span>
                          {isAdmin && (
                            <Badge variant="secondary" className="text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                        {activeTab === "users" && (
                          <span className="text-xs text-muted-foreground">
                            @{(entity as User).username}
                          </span>
                        )}
                      </td>
                      {data.modules.map((module) => {
                        const allowed = hasPermission(
                          module.id,
                          entity.id,
                          activeTab === "users" ? "user" : "group"
                        );

                        // Admins sempre têm acesso
                        if (isAdmin) {
                          return (
                            <td key={module.id} className="text-center p-3">
                              <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-500">
                                <Check className="h-4 w-4" />
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={module.id} className="text-center p-3">
                            <button
                              onClick={() =>
                                togglePermission(
                                  module.id,
                                  entity.id,
                                  activeTab === "users" ? "user" : "group",
                                  allowed
                                )
                              }
                              disabled={mutation.isPending}
                              className={`inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                                allowed
                                  ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {allowed ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
