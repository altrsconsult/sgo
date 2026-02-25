import React from 'react';
import {
  Users,
  CheckCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MessageSquare,
  Paperclip,
  Check,
  Pencil,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Avatar,
  AvatarFallback,
  Separator,
} from '@sgo/ui';
import metricas from '../data/metricas.json';

/* Mapa de ícones para os cards de métricas */
const iconeMap: Record<string, React.ElementType> = {
  Users,
  CheckCircle,
  TrendingUp,
  Clock,
};

/* Mapa de ícones para o feed de atividades */
const atividadeIconeMap: Record<string, React.ElementType> = {
  create: Plus,
  update: Pencil,
  approve: Check,
  comment: MessageSquare,
  attach: Paperclip,
};

/* Cores do badge de atividade por tipo */
const atividadeCor: Record<string, string> = {
  create:  'bg-green-100 text-green-700',
  update:  'bg-blue-100 text-blue-700',
  approve: 'bg-purple-100 text-purple-700',
  comment: 'bg-yellow-100 text-yellow-700',
  attach:  'bg-gray-100 text-gray-600',
};

/** Página de Dashboard — cards de métricas + feed de atividades */
export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Título da seção */}
      <div>
        <h2 className="text-lg font-semibold">Visão Geral</h2>
        <p className="text-sm text-muted-foreground">Resumo do período atual</p>
      </div>

      {/* Grid de cards de métricas */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricas.cards.map((card, i) => {
          const Icone = iconeMap[card.icone] ?? Users;
          const subindo = card.tendencia === 'up';
          return (
            <Card
              key={card.id}
              className={`animate-fade-in-up stagger-${i + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium uppercase tracking-wide">
                    {card.titulo}
                  </CardDescription>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icone className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.valor}</p>
                <div className="flex items-center gap-1 mt-1">
                  {subindo ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      subindo ? 'text-green-600' : 'text-destructive'
                    }`}
                  >
                    {card.variacao}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {card.descricao}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Linha inferior: progresso + atividades */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Card de progresso geral */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Progresso do Mês
            </CardTitle>
            <CardDescription>Meta: 1.500 registros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Ativos',    valor: 847,  total: 1500, cor: 'bg-primary' },
              { label: 'Pendentes', valor: 37,   total: 100,  cor: 'bg-yellow-400' },
              { label: 'Concluídos',valor: 400,  total: 500,  cor: 'bg-green-500' },
            ].map((item) => {
              const pct = Math.round((item.valor / item.total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">
                      {item.valor} / {item.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.cor} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Feed de atividades recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Atividades Recentes
            </CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {metricas.atividades.map((ativ, idx) => {
              const Icone = atividadeIconeMap[ativ.tipo] ?? Plus;
              const cor = atividadeCor[ativ.tipo] ?? 'bg-gray-100 text-gray-600';
              const iniciais = ativ.usuario
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2);
              return (
                <div key={ativ.id}>
                  <div className="flex items-start gap-3 py-3">
                    {/* Ícone da ação */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cor}`}
                    >
                      <Icone className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ativ.acao}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-[9px]">
                            {iniciais}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {ativ.usuario}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {ativ.tempo}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {ativ.tipo}
                    </Badge>
                  </div>
                  {idx < metricas.atividades.length - 1 && (
                    <Separator />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
