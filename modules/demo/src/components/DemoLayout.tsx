import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  List,
  FormInput,
  Blocks,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { cn, Button } from '@sgo/ui';

/** Itens de navegação interna do módulo demo */
const navItems = [
  { to: '/',           label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/listagem',   label: 'Listagem',      icon: List },
  { to: '/formulario', label: 'Formulário',    icon: FormInput },
  { to: '/componentes',label: 'Componentes',   icon: Blocks },
];

interface DemoLayoutProps {
  children: React.ReactNode;
}

/** Layout com sub-navegação horizontal para o módulo demo */
export function DemoLayout({ children }: DemoLayoutProps) {
  const location = useLocation();

  /* Detecta se está embarcado no chassi via iframe */
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
  const handleBackToChassis = () => {
    if (isEmbedded && window.parent)
      window.parent.postMessage({ type: 'sgo-navigate-back' }, '*');
  };

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Cabeçalho do módulo */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          {/* Ícone + título */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none">SGO Demo</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showcase de componentes e padrões
              </p>
            </div>
          </div>

          {/* Botão voltar — visível apenas quando embarcado no chassi */}
          {isEmbedded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToChassis}
              aria-label="Voltar ao início"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
          )}
        </div>

        {/* Sub-navegação em tabs */}
        <nav className="flex gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            /* Verifica rota ativa (raiz exige match exato) */
            const isActive =
              to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo da página */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}
