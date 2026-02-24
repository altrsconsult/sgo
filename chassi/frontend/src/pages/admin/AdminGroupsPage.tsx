import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Users, Pencil, Trash2, UserPlus } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Label,
  Skeleton,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@sgo/ui";

interface Group {
  id: number;
  name: string;
  description: string;
  created_at: string;
  member_count?: number;
}

interface User {
  id: number;
  name: string;
  username: string;
}

// Busca grupos
async function fetchGroups(): Promise<Group[]> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/groups", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar grupos");
  return res.json();
}

// Busca usuários para adicionar ao grupo
async function fetchUsers(): Promise<User[]> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar usuários");
  return res.json();
}

// Cria grupo
async function createGroup(data: { name: string; description: string }) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar grupo");
  return res.json();
}

// Atualiza grupo
async function updateGroup(id: number, data: { name: string; description: string }) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/groups/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar grupo");
  return res.json();
}

// Deleta grupo
async function deleteGroup(id: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/groups/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao remover grupo");
  return res.json();
}

// Busca membros de um grupo
async function fetchGroupMembers(groupId: number): Promise<User[]> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/groups/${groupId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

// Adiciona membro
async function addMember(groupId: number, userId: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Erro ao adicionar membro");
  return res.json();
}

// Remove membro
async function removeMember(groupId: number, userId: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao remover membro");
  return res.json();
}

/**
 * Página de gestão de grupos.
 */
export function AdminGroupsPage() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [managingGroup, setManagingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  // Controla qual grupo está aguardando confirmação de exclusão
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);

  // Queries
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["group-members", managingGroup?.id],
    queryFn: () => (managingGroup ? fetchGroupMembers(managingGroup.id) : Promise.resolve([])),
    enabled: !!managingGroup,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      success("Grupo criado com sucesso");
      resetForm();
    },
    onError: () => showError("Erro", "Não foi possível criar o grupo"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description: string } }) =>
      updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      success("Grupo atualizado");
      resetForm();
    },
    onError: () => showError("Erro", "Não foi possível atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      success("Grupo removido");
    },
    onError: () => showError("Erro", "Não foi possível remover"),
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      addMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-members", managingGroup?.id] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      success("Membro adicionado");
    },
    onError: () => showError("Erro", "Não foi possível adicionar"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      removeMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-members", managingGroup?.id] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      success("Membro removido");
    },
    onError: () => showError("Erro", "Não foi possível remover"),
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({ name: group.name, description: group.description || "" });
    setShowForm(true);
  };

  // Abre o AlertDialog em vez do confirm() bloqueante
  const handleDelete = (group: Group) => {
    setDeleteTarget(group);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingGroup(null);
    setFormData({ name: "", description: "" });
  };

  // Usuários que não estão no grupo
  const memberIds = members.map((m) => m.id);
  const availableUsers = allUsers.filter((u) => !memberIds.includes(u.id));

  // Filtra grupos
  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.description || "").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AlertDialog de confirmação de exclusão de grupo */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              O grupo <strong>{deleteTarget?.name}</strong> será removido permanentemente, incluindo todos os membros associados. Esta ação não pode ser desfeita.
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
          <h1 className="text-2xl font-bold">Grupos</h1>
          <p className="text-muted-foreground">
            Organize usuários em grupos para facilitar a gestão de permissões.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Grupo
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingGroup ? "Editar Grupo" : "Novo Grupo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingGroup ? "Salvar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Gerenciar membros */}
      {managingGroup && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Membros de "{managingGroup.name}"
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setManagingGroup(null)}>
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar membro */}
            {availableUsers.length > 0 && (
              <div className="flex gap-2">
                <select
                  id="add-member"
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue=""
                  onChange={(e) => {
                    const userId = parseInt(e.target.value);
                    if (userId) {
                      addMemberMutation.mutate({ groupId: managingGroup.id, userId });
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="" disabled>Adicionar usuário...</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} (@{u.username})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Lista de membros */}
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum membro neste grupo.</p>
            ) : (
              <div className="divide-y rounded-md border">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3">
                    <span className="text-sm">{member.name} (@{member.username})</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMemberMutation.mutate({ groupId: managingGroup.id, userId: member.id })}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar grupos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid de grupos */}
      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum grupo cadastrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEdit(group)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Remover" onClick={() => handleDelete(group)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {group.description || "Sem descrição"}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {group.member_count || 0} membro(s)
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setManagingGroup(group)}>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Membros
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
