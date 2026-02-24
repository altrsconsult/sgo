import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, UserCheck, UserX, Key, LogIn, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Avatar,
  AvatarFallback,
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

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "user";
  active: number;
  created_at: string;
}

// Busca usuários da API
async function fetchUsers(): Promise<User[]> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar usuários");
  return res.json();
}

// Cria usuário
async function createUser(data: Partial<User> & { password: string }) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao criar usuário");
  }
  return res.json();
}

// Atualiza usuário
async function updateUser(id: number, data: Partial<User>) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar usuário");
  return res.json();
}

// Deleta usuário
async function deleteUser(id: number) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao remover usuário");
  return res.json();
}

/**
 * Página de gestão de usuários para o Admin.
 */
export function AdminUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isSuperAdmin, impersonate, user: currentUser } = useAuth();
  const { success, error: showError } = useNotification();
  
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Controla qual usuário está aguardando confirmação de exclusão
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "user" as User["role"],
  });

  // Query de usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      success("Usuário criado com sucesso");
      resetForm();
    },
    onError: (err: Error) => showError("Erro", err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      success("Usuário atualizado");
      resetForm();
    },
    onError: () => showError("Erro", "Não foi possível atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      success("Usuário removido");
    },
    onError: () => showError("Erro", "Não foi possível remover"),
  });

  // Handlers
  const handleImpersonate = async (userId: number) => {
    const ok = await impersonate(userId);
    if (ok) navigate("/");
  };

  const handleToggleActive = (user: User) => {
    updateMutation.mutate({
      id: user.id,
      data: { active: user.active ? 0 : 1 } as any,
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowForm(true);
  };

  // Abre o AlertDialog em vez do confirm() bloqueante
  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Atualiza
      const data: any = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) data.password = formData.password;
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      // Cria
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ username: "", name: "", email: "", password: "", role: "user" });
  };

  // Filtra usuários
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  // Iniciais do nome
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
      {/* AlertDialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário <strong>{deleteTarget?.name}</strong> será removido permanentemente. Esta ação não pode ser desfeita.
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
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Senha {editingUser && "(deixe vazio para manter)"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="user">Operador</option>
                  <option value="admin">Admin</option>
                  {isSuperAdmin && <option value="superadmin">Superadmin</option>}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingUser ? "Salvar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {filteredUsers.length} usuário(s)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      <Badge variant={user.active ? "success" : "secondary"} className="text-xs">
                        {user.active ? "Ativo" : "Inativo"}
                      </Badge>
                      {user.role === "superadmin" && (
                        <Badge variant="destructive" className="text-xs">Superadmin</Badge>
                      )}
                      {user.role === "admin" && (
                        <Badge variant="outline" className="text-xs">Admin</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email} • @{user.username}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Impersonate */}
                  {isSuperAdmin && user.role !== "superadmin" && user.id !== currentUser?.id && (
                    <Button variant="ghost" size="icon" title="Logar como" onClick={() => handleImpersonate(user.id)}>
                      <LogIn className="h-4 w-4" />
                    </Button>
                  )}
                  {/* Editar */}
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEdit(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {/* Ativar/Desativar */}
                  {user.id !== currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title={user.active ? "Desativar" : "Ativar"}
                      onClick={() => handleToggleActive(user)}
                    >
                      {user.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                  )}
                  {/* Deletar */}
                  {user.role !== "superadmin" && user.id !== currentUser?.id && (
                    <Button variant="ghost" size="icon" title="Remover" onClick={() => handleDelete(user)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
