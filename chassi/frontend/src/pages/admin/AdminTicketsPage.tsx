import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, ArrowLeft, Save } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Skeleton,
  Input,
  Label,
} from "@sgo/ui";

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  user_name: string;
  created_at: string;
  updated_at: string;
  last_response?: string;
}

// Busca tickets
async function fetchTickets() {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/tickets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar tickets");
  return res.json();
}

// Cria ticket
async function createTicket(data: { subject: string; description: string; priority: string }) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar ticket");
  return res.json();
}

const statusConfig = {
  open: { label: "Aberto", color: "warning" as const, icon: AlertCircle },
  pending: { label: "Aguardando", color: "secondary" as const, icon: Clock },
  closed: { label: "Fechado", color: "success" as const, icon: CheckCircle },
};

const priorityConfig = {
  low: { label: "Baixa", color: "secondary" as const },
  medium: { label: "Média", color: "default" as const },
  high: { label: "Alta", color: "destructive" as const },
};

/**
 * Página de tickets do Admin.
 */
export function AdminTicketsPage() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const { success, error: showError } = useNotification();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      success("Ticket criado com sucesso!");
      setShowNewTicket(false);
      setFormData({ subject: "", description: "", priority: "medium" });
    },
    onError: () => {
      showError("Erro ao criar ticket.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
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

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Erro ao carregar tickets</p>
        </CardContent>
      </Card>
    );
  }

  const tickets: Ticket[] = data?.data || [];

  // Formulário de Novo Ticket
  if (showNewTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setShowNewTicket(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Novo Ticket</h1>
            <p className="text-muted-foreground">
              Descreva o problema ou solicitação.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  required
                  placeholder="Resumo do problema"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <select
                  id="priority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Detalhada</Label>
                <textarea
                  id="description"
                  required
                  placeholder="Descreva o que aconteceu..."
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowNewTicket(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {createMutation.isPending ? "Enviando..." : "Criar Ticket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Tickets de Suporte
          </h1>
          <p className="text-muted-foreground">
            Abra tickets para a equipe de suporte técnico.
          </p>
        </div>
        <Button onClick={() => setShowNewTicket(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      {/* Lista de tickets */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum ticket aberto. Clique em "Novo Ticket" para abrir um chamado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const status = statusConfig[ticket.status];
            const priority = priorityConfig[ticket.priority];
            const StatusIcon = status.icon;

            return (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">
                        #{ticket.id} - {ticket.subject}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={status.color}>{status.label}</Badge>
                      <Badge variant={priority.color}>{priority.label}</Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {ticket.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Aberto em {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
                    </span>
                    {ticket.last_response && (
                      <span>
                        Última resposta: {new Date(ticket.updated_at).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
