import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@sgo/ui";

type AuditItem = {
  id: number;
  user_name: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export function AdminAuditPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    action: "all",
    entityType: "all",
    startDate: "",
    endDate: "",
  });

  async function loadData() {
    setLoading(true);
    try {
      const token = localStorage.getItem("sgo-token");
      const query = new URLSearchParams();
      if (filters.action !== "all") query.set("action", filters.action);
      if (filters.entityType !== "all") query.set("entityType", filters.entityType);
      if (filters.startDate) query.set("startDate", filters.startDate);
      if (filters.endDate) query.set("endDate", filters.endDate);
      query.set("limit", "200");

      const [logsRes, actionsRes, typesRes] = await Promise.all([
        fetch(`/api/audit?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/audit/actions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/audit/entity-types", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (logsRes.ok) {
        const payload = await logsRes.json();
        setLogs(payload.data || []);
      }
      if (actionsRes.ok) {
        setActions(await actionsRes.json());
      }
      if (typesRes.ok) {
        setEntityTypes(await typesRes.json());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Auditoria</h1>
        <p className="text-muted-foreground">Acompanhe logins e ações administrativas do sistema.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine a busca por ação, entidade e período.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Ação</Label>
            <select
              aria-label="Filtro de ação"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.action}
              onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
            >
              <option value="all">Todas</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Entidade</Label>
            <select
              aria-label="Filtro de entidade"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.entityType}
              onChange={(e) => setFilters((prev) => ({ ...prev, entityType: e.target.value }))}
            >
              <option value="all">Todas</option>
              {entityTypes.map((entityType) => (
                <option key={entityType} value={entityType}>
                  {entityType}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Data inicial</Label>
            <Input
              type="datetime-local"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Data final</Label>
            <Input
              type="datetime-local"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <div className="md:col-span-4">
            <Button onClick={loadData}>Aplicar filtros</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros</CardTitle>
          <CardDescription>{loading ? "Carregando..." : `${logs.length} registro(s)`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-md border p-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">{log.action}</span>
                <span className="text-muted-foreground">por {log.user_name || "sistema"}</span>
                <span className="text-muted-foreground">em {new Date(log.created_at).toLocaleString("pt-BR")}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Entidade: {log.entity_type || "-"} | ID: {log.entity_id || "-"}
              </p>
              {log.details ? (
                <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-[11px]">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              ) : null}
            </div>
          ))}
          {!loading && logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
