import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, X, Sparkles } from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  Skeleton,
  Alert,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Toast,
  type ToastVariant,
} from '@sgo/ui';

/** Seção com título e descrição para organizar o showcase */
function Secao({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">{titulo}</h3>
        {descricao && (
          <p className="text-xs text-muted-foreground mt-0.5">{descricao}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

/** Página de Componentes — galeria de todos os componentes do @sgo/ui */
export function Componentes() {
  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastVariant, setToastVariant] = useState<ToastVariant>('info');

  function mostrarToast(variant: ToastVariant) {
    setToastVariant(variant);
    setToastVisivel(true);
    setTimeout(() => setToastVisivel(false), 3000);
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Galeria de Componentes</h2>
          <p className="text-sm text-muted-foreground">
            Todos os componentes disponíveis no <code className="text-xs bg-muted px-1 py-0.5 rounded">@sgo/ui</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ── Botões ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Botões</CardTitle>
            <CardDescription>Variantes e tamanhos disponíveis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Secao titulo="Variantes">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </Secao>
            <Separator />
            <Secao titulo="Tamanhos">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </Secao>
            <Separator />
            <Secao titulo="Estados">
              <div className="flex flex-wrap gap-2">
                <Button disabled>Desabilitado</Button>
                <Button>
                  <span className="w-3.5 h-3.5 mr-1.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin inline-block" />
                  Carregando
                </Button>
              </div>
            </Secao>
          </CardContent>
        </Card>

        {/* ── Badges ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Badges</CardTitle>
            <CardDescription>Rótulos de status e categorias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Secao titulo="Variantes">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Sucesso</Badge>
                <Badge variant="warning">Atenção</Badge>
                <Badge variant="destructive">Erro</Badge>
              </div>
            </Secao>
            <Separator />
            <Secao titulo="Uso em contexto">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Ativo</span>
                  <Badge variant="success">847</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm">Pendente</span>
                  <Badge variant="warning">37</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="text-sm">Inativo</span>
                  <Badge variant="secondary">400</Badge>
                </div>
              </div>
            </Secao>
          </CardContent>
        </Card>

        {/* ── Inputs ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Inputs & Selects</CardTitle>
            <CardDescription>Campos de formulário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Input padrão</Label>
              <Input placeholder="Digite algo..." />
            </div>
            <div className="space-y-1.5">
              <Label>Input com erro</Label>
              <Input placeholder="Campo inválido" className="border-destructive" />
              <p className="text-xs text-destructive">Este campo é obrigatório</p>
            </div>
            <div className="space-y-1.5">
              <Label>Input desabilitado</Label>
              <Input placeholder="Não editável" disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Opção A</SelectItem>
                  <SelectItem value="b">Opção B</SelectItem>
                  <SelectItem value="c">Opção C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ── Avatares e Skeleton ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Avatares & Skeleton</CardTitle>
            <CardDescription>Representação de usuários e carregamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Secao titulo="Avatares">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">AB</AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-green-100 text-green-700">RS</AvatarFallback>
                </Avatar>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">MC</AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-[10px]">LA</AvatarFallback>
                </Avatar>
              </div>
            </Secao>
            <Separator />
            <Secao titulo="Skeleton (estado de carregamento)">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </Secao>
          </CardContent>
        </Card>

        {/* ── Alertas ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Alertas</CardTitle>
            <CardDescription>Mensagens de feedback inline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert
              variant="info"
              title="Informação"
              message="Mensagem informativa para o usuário."
            />
            <Alert
              variant="success"
              title="Sucesso"
              message="Operação concluída com sucesso."
            />
            <Alert
              variant="warning"
              title="Atenção"
              message="Verifique os dados antes de continuar."
            />
            <Alert
              variant="error"
              title="Erro"
              message="Algo deu errado. Tente novamente."
              closable
            />
          </CardContent>
        </Card>

        {/* ── Toast ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Toast Notifications</CardTitle>
            <CardDescription>Notificações temporárias flutuantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => mostrarToast('info')}>
                <Bell className="w-3.5 h-3.5 mr-1.5" />
                Info
              </Button>
              <Button size="sm" variant="outline" onClick={() => mostrarToast('success')}>
                <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                Sucesso
              </Button>
              <Button size="sm" variant="outline" onClick={() => mostrarToast('warning')}>
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-yellow-600" />
                Atenção
              </Button>
              <Button size="sm" variant="outline" onClick={() => mostrarToast('error')}>
                <X className="w-3.5 h-3.5 mr-1.5 text-destructive" />
                Erro
              </Button>
            </div>
            {toastVisivel && (
              <Toast
                variant={toastVariant}
                message={
                  toastVariant === 'success' ? 'Operação concluída com sucesso!' :
                  toastVariant === 'error' ? 'Ocorreu um erro. Tente novamente.' :
                  toastVariant === 'warning' ? 'Atenção: verifique os dados.' :
                  'Esta é uma notificação informativa do SGO.'
                }
                onClose={() => setToastVisivel(false)}
                duration={3000}
              />
            )}
          </CardContent>
        </Card>

        {/* ── Dialog ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Dialog & Sheet</CardTitle>
            <CardDescription>Modais e painéis laterais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Secao titulo="Dialog (modal centralizado)">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Abrir Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar ação</DialogTitle>
                    <DialogDescription>
                      Esta é uma janela de confirmação. Use para ações que precisam
                      de confirmação explícita do usuário.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Conteúdo adicional pode ser colocado aqui — formulários,
                      detalhes, ou qualquer outro componente.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button>Confirmar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Secao>
            <Separator />
            <Secao titulo="Sheet (painel lateral)">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">Abrir Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Painel de Detalhes</SheetTitle>
                    <SheetDescription>
                      Use o Sheet para exibir detalhes ou formulários sem sair da página.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-3">
                    <div className="space-y-1.5">
                      <Label>Nome</Label>
                      <Input placeholder="Nome do registro" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Fechar</Button>
                    </SheetClose>
                    <Button>Salvar</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </Secao>
          </CardContent>
        </Card>

        {/* ── Dropdown ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Dropdown Menu</CardTitle>
            <CardDescription>Menus contextuais e de ações</CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Abrir Menu ▾</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Ações do Registro</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Aprovar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Notificar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* ── Empty State ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Empty State</CardTitle>
            <CardDescription>
              Tela de estado vazio — use quando não há dados para exibir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-dashed border-border rounded-lg">
              <EmptyState
                icon={<Sparkles className="w-8 h-8" />}
                title="Nenhum item encontrado"
                description="Quando não houver dados para exibir, use este componente para orientar o usuário sobre o próximo passo."
                action={
                  <Button size="sm">
                    Criar primeiro item
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
