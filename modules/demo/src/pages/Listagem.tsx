import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  FileX,
} from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Skeleton,
} from '@sgo/ui';
import registros from '../data/registros.json';

type StatusType = 'ativo' | 'pendente' | 'inativo';
type SortField = 'nome' | 'valor' | 'data' | 'progresso';
type SortDir = 'asc' | 'desc';

/* Configuração visual dos badges de status */
const statusConfig: Record<StatusType, { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  ativo:    { label: 'Ativo',    variant: 'success' },
  pendente: { label: 'Pendente', variant: 'warning' },
  inativo:  { label: 'Inativo',  variant: 'secondary' },
};

/** Página de Listagem — tabela com busca, filtro por status e ordenação */
export function Listagem() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [carregando] = useState(false);

  /* Aplica filtros e ordenação nos dados */
  const dadosFiltrados = useMemo(() => {
    let resultado = [...registros];

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(
        (r) =>
          r.nome.toLowerCase().includes(termo) ||
          r.email.toLowerCase().includes(termo) ||
          r.responsavel.toLowerCase().includes(termo)
      );
    }

    if (filtroStatus !== 'todos') {
      resultado = resultado.filter((r) => r.status === filtroStatus);
    }

    resultado.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'nome') cmp = a.nome.localeCompare(b.nome);
      else if (sortField === 'valor') cmp = a.valor - b.valor;
      else if (sortField === 'data') cmp = a.data.localeCompare(b.data);
      else if (sortField === 'progresso') cmp = a.progresso - b.progresso;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return resultado;
  }, [busca, filtroStatus, sortField, sortDir]);

  /* Alterna ordenação ao clicar no cabeçalho */
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  /* Ícone de ordenação */
  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-lg font-semibold">Registros</h2>
        <p className="text-sm text-muted-foreground">
          {dadosFiltrados.length} resultado{dadosFiltrados.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail ou responsável..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          {carregando ? (
            /* Skeleton de carregamento */
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : dadosFiltrados.length === 0 ? (
            <EmptyState
              icon={<FileX className="w-8 h-8" />}
              title="Nenhum resultado encontrado"
              description="Tente ajustar os filtros ou o termo de busca."
              action={
                <Button variant="outline" size="sm" onClick={() => { setBusca(''); setFiltroStatus('todos'); }}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => toggleSort('nome')}
                      >
                        Nome <SortIcon field="nome" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Categoria
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => toggleSort('valor')}
                      >
                        Valor <SortIcon field="valor" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => toggleSort('progresso')}
                      >
                        Progresso <SortIcon field="progresso" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Responsável
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.map((reg, idx) => {
                    const status = statusConfig[reg.status as StatusType];
                    const iniciais = reg.nome.split(' ').map((p) => p[0]).join('').slice(0, 2);
                    return (
                      <tr
                        key={reg.id}
                        className={`border-b border-border last:border-0 hover:bg-accent/50 transition-colors ${
                          idx % 2 === 0 ? '' : 'bg-muted/20'
                        }`}
                      >
                        {/* Nome + email */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {iniciais}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium leading-none">{reg.nome}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{reg.email}</p>
                            </div>
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        {/* Categoria */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm">{reg.categoria}</span>
                        </td>
                        {/* Valor */}
                        <td className="px-4 py-3 hidden lg:table-cell font-medium">
                          {reg.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        {/* Progresso */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${reg.progresso}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{reg.progresso}%</span>
                          </div>
                        </td>
                        {/* Responsável */}
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                          {reg.responsavel}
                        </td>
                        {/* Ações */}
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" /> Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
