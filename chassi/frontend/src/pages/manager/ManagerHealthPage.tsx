import { useQuery } from "@tanstack/react-query";
import { Activity, Database, HardDrive, CheckCircle, Users, Layers, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
} from "@sgo/ui";

interface HealthData {
  status: "ok" | "error";
  timestamp: string;
}

interface Stats {
  users: number;
  groups: number;
  modules: number;
  activeModules: number;
}

// Busca health check
async function fetchHealth(): Promise<HealthData> {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("Sistema indisponível");
  return res.json();
}

// Busca estatísticas
async function fetchStats(): Promise<Stats> {
  const token = localStorage.getItem("sgo-token");
  
  const [usersRes, groupsRes, modulesRes] = await Promise.all([
    fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } }),
    fetch("/api/groups", { headers: { Authorization: `Bearer ${token}` } }),
    fetch("/api/modules", { headers: { Authorization: `Bearer ${token}` } }),
  ]);

  const users = usersRes.ok ? await usersRes.json() : [];
  const groups = groupsRes.ok ? await groupsRes.json() : [];
  const modules = modulesRes.ok ? await modulesRes.json() : [];

  return {
    users: users.length,
    groups: groups.length,
    modules: modules.length,
    activeModules: modules.filter((m: any) => m.active).length,
  };
}

/**
 * Página de diagnóstico/saúde do sistema para o Superadmin.
 */
export function ManagerHealthPage() {
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 30000, // Atualiza a cada 30s
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const isLoading = healthLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const isHealthy = health?.status === "ok";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Saúde do Sistema</h1>
        <p className="text-muted-foreground">
          Monitore o status e estatísticas da instância.
        </p>
      </div>

      {/* Status geral */}
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isHealthy ? "bg-green-500/10" : "bg-red-500/10"
          }`}>
            <CheckCircle className={`h-6 w-6 ${isHealthy ? "text-green-500" : "text-red-500"}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Sistema</span>
              <Badge variant={isHealthy ? "success" : "destructive"}>
                {isHealthy ? "Operacional" : "Erro"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Última verificação: {health?.timestamp 
                ? new Date(health.timestamp).toLocaleString("pt-BR")
                : "Agora"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Grid de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Usuários */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Usuários</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.users || 0}</p>
            <p className="text-sm text-muted-foreground">cadastrados</p>
          </CardContent>
        </Card>

        {/* Grupos */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Grupos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.groups || 0}</p>
            <p className="text-sm text-muted-foreground">cadastrados</p>
          </CardContent>
        </Card>

        {/* Módulos */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Módulos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.modules || 0}</p>
            <p className="text-sm text-muted-foreground">
              {stats?.activeModules || 0} ativo(s)
            </p>
          </CardContent>
        </Card>

        {/* Banco de Dados */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Banco de Dados</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="success">SQLite</Badge>
            <p className="text-sm text-muted-foreground mt-2">Operacional</p>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Versão do Chassi</span>
              <span className="font-medium">2.0.0</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Ambiente</span>
              <span className="font-medium">Desenvolvimento</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Backend</span>
              <span className="font-medium">Node.js + Express</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Frontend</span>
              <span className="font-medium">React + Vite</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
