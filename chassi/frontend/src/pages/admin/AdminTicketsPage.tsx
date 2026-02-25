import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, ArrowLeft, Save, Send } from "lucide-react";
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
  Skeleton,
  Input,
  Label,
} from "@sgo/ui";

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "normal" | "high";
  userId?: number;
  user_name?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  lastResponse?: string;
  last_response?: string;
}

interface TicketMessage {
  id: number;
  ticketId: number;
  userId: number | null;
  message: string;
  createdAt: string | null;
  created_at?: string | null;
}

interface TicketDetail extends Ticket {
  messages: TicketMessage[];
}

// Busca lista de tickets
async function fetchTickets(): Promise<Ticket[]> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/tickets", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Erro ao carregar tickets");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.data ?? [];
}

// Busca um ticket com mensagens
async function fetchTicketDetail(id: number): Promise<TicketDetail> {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/tickets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Erro ao carregar ticket");
  return res.json();
}

// Cria ticket
async function createTicket(data: { subject: string; description: string; priority: string }) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar ticket");
  return res.json();
}

// Adiciona resposta ao ticket
async function addTicketMessage(ticketId: number, message: string) {
  const token = localStorage.getItem("sgo-token");
  const res = await fetch(`/api/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Erro ao enviar resposta");
  return res.json();
}

const statusConfig: Record<string, { label: string; color: "warning" | "secondary" | "success"; icon: typeof AlertCircle }> = {
  open: { label: "Aberto", color: "warning", icon: AlertCircle },
  in_progress: { label: "Aguardando", color: "secondary", icon: Clock },
  closed: { label: "Fechado", color: "success", icon: CheckCircle },
};

const priorityConfig: Record<string, { label: string; color: "secondary" | "default" | "destructive" }> = {
  low: { label: "Baixa", color: "secondary" },
  normal: { label: "Média", color: "default" },
  high: { label: "Alta", color: "destructive" },
};

/**
 * Página de tickets do Admin.
 * Lista de tickets; ao clicar abre detalhe com thread de mensagens e campo para responder (se não fechado).
 */
export function AdminTicketsPage() {
  const { user } = useAuth();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const { success, error: showError } = useNotification();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "normal",
  });

  const { data: ticketsData, isLoading, error } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });

  const { data: ticketDetail, isLoading: loadingDetail } = useQuery({
    queryKey: ["ticket", selectedTicketId],
    queryFn: () => fetchTicketDetail(selectedTicketId!),
    enabled: selectedTicketId != null,
  });

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      success("Ticket criado com sucesso!");
      setShowNewTicket(false);
      setFormData({ subject: "", description: "", priority: "normal" });
    },
    onError: () => showError("Erro ao criar ticket."),
  });

  const addReplyMutation = useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: number; message: string }) => addTicketMessage(ticketId, message),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      success("Resposta enviada.");
      setReplyText("");
    },
    onError: () => showError("Erro ao enviar resposta."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyText.trim()) return;
    addReplyMutation.mutate({ ticketId: selectedTicketId, message: replyText.trim() });
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

  const tickets: Ticket[] = ticketsData ?? [];

  // Detalhe do ticket: conversa + resposta (se aberto)
  if (selectedTicketId != null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedTicketId(null); setReplyText(""); }}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">Ticket #{selectedTicketId}</h1>
            <p className="text-muted-foreground">Acompanhamento e respostas</p>
          </div>
        </div>

        {loadingDetail || !ticketDetail ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">{ticketDetail.subject}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={statusConfig[ticketDetail.status]?.color ?? "secondary"}>
                    {statusConfig[ticketDetail.status]?.label ?? ticketDetail.status}
                  </Badge>
                  <Badge variant={priorityConfig[ticketDetail.priority]?.color ?? "default"}>
                    {priorityConfig[ticketDetail.priority]?.label ?? ticketDetail.priority}
                  </Badge>
                </div>
              </div>
              <CardDescription className="mt-1">
                Aberto em {new Date((ticketDetail.createdAt ?? ticketDetail.created_at) ?? "").toLocaleString("pt-BR")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Descrição inicial como primeiro bloco */}
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Sua solicitação</p>
                <p className="text-sm whitespace-pre-wrap">{ticketDetail.description || "—"}</p>
              </div>

              {/* Thread de mensagens */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Conversa</p>
                {(ticketDetail.messages ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma resposta ainda. A equipe responderá em breve.</p>
                ) : (
                  <ul className="space-y-3">
                    {(ticketDetail.messages ?? []).map((msg) => {
                      const isOwn = msg.userId === user?.id;
                      return (
                        <li
                          key={msg.id}
                          className={`rounded-lg p-3 ${isOwn ? "bg-primary/10 ml-4" : "bg-muted/50 mr-4"}`}
                        >
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {isOwn ? "Você" : "Suporte"} · {new Date((msg.createdAt ?? msg.created_at) ?? "").toLocaleString("pt-BR")}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Enviar resposta — só se ticket não estiver fechado */}
              {ticketDetail.status !== "closed" && (
                <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t">
                  <Label htmlFor="reply">Adicionar resposta</Label>
                  <textarea
                    id="reply"
                    placeholder="Escreva sua mensagem..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button type="submit" disabled={addReplyMutation.isPending || !replyText.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    {addReplyMutation.isPending ? "Enviando…" : "Enviar resposta"}
                  </Button>
                </form>
              )}
              {ticketDetail.status === "closed" && (
                <p className="text-sm text-muted-foreground pt-2 border-t">
                  Este ticket foi fechado. Para nova demanda, abra um novo ticket.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

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
                  aria-label="Prioridade do ticket"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Baixa</option>
                  <option value="normal">Média</option>
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
            const status = statusConfig[ticket.status] ?? statusConfig.open;
            const priority = priorityConfig[ticket.priority] ?? priorityConfig.normal;
            const StatusIcon = status.icon;

            return (
              <Card
                key={ticket.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTicketId(ticket.id)}
              >
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
                      Aberto em {new Date((ticket.createdAt ?? ticket.created_at) ?? "").toLocaleDateString("pt-BR")}
                    </span>
                    {(ticket.lastResponse ?? ticket.last_response) && (
                      <span>
                        Última resposta: {new Date((ticket.updatedAt ?? ticket.updated_at) ?? "").toLocaleDateString("pt-BR")}
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
