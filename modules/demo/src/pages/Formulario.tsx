import React, { useState } from 'react';
import { Save, RotateCcw, CheckCircle } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Separator,
  Alert,
} from '@sgo/ui';

/* Estado inicial do formulário */
const ESTADO_INICIAL = {
  nome: '',
  email: '',
  telefone: '',
  categoria: '',
  status: '',
  valor: '',
  responsavel: '',
  descricao: '',
  prioridade: '',
  notificar: false,
};

type FormData = typeof ESTADO_INICIAL;
type Erros = Partial<Record<keyof FormData, string>>;

/** Valida os campos obrigatórios */
function validar(dados: FormData): Erros {
  const erros: Erros = {};
  if (!dados.nome.trim()) erros.nome = 'Nome é obrigatório';
  if (!dados.email.trim()) erros.email = 'E-mail é obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email))
    erros.email = 'E-mail inválido';
  if (!dados.categoria) erros.categoria = 'Selecione uma categoria';
  if (!dados.status) erros.status = 'Selecione um status';
  if (dados.valor && isNaN(Number(dados.valor)))
    erros.valor = 'Valor deve ser numérico';
  return erros;
}

/** Página de Formulário — exemplo de form com validação, seções e feedback */
export function Formulario() {
  const [dados, setDados] = useState<FormData>(ESTADO_INICIAL);
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function atualizar(campo: keyof FormData, valor: string | boolean) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    /* Remove erro ao digitar */
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }));
  }

  function resetar() {
    setDados(ESTADO_INICIAL);
    setErros({});
    setEnviado(false);
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const novosErros = validar(dados);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    setEnviando(true);
    /* Simula chamada de API */
    await new Promise((r) => setTimeout(r, 1200));
    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Registro salvo com sucesso!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            O registro de <strong>{dados.nome}</strong> foi criado.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetar}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Novo Registro
          </Button>
          <Button onClick={resetar}>Ver Listagem</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in-up">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-lg font-semibold">Novo Registro</h2>
        <p className="text-sm text-muted-foreground">
          Preencha os dados abaixo. Campos marcados com{' '}
          <span className="text-destructive">*</span> são obrigatórios.
        </p>
      </div>

      <form onSubmit={enviar} noValidate className="space-y-6">
        {/* Seção: Dados Pessoais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              Dados Pessoais
              <Badge variant="outline" className="text-xs font-normal">
                Obrigatório
              </Badge>
            </CardTitle>
            <CardDescription>Informações de identificação do registro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="nome">
                Nome completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Ex.: Ana Beatriz Ferreira"
                value={dados.nome}
                onChange={(e) => atualizar('nome', e.target.value)}
                className={erros.nome ? 'border-destructive' : ''}
              />
              {erros.nome && (
                <p className="text-xs text-destructive">{erros.nome}</p>
              )}
            </div>

            {/* E-mail + Telefone lado a lado */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ana@email.com"
                  value={dados.email}
                  onChange={(e) => atualizar('email', e.target.value)}
                  className={erros.email ? 'border-destructive' : ''}
                />
                {erros.email && (
                  <p className="text-xs text-destructive">{erros.email}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-0000"
                  value={dados.telefone}
                  onChange={(e) => atualizar('telefone', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção: Classificação */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Classificação</CardTitle>
            <CardDescription>Categoria, status e prioridade do registro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Categoria */}
              <div className="space-y-1.5">
                <Label>
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={dados.categoria}
                  onValueChange={(v) => atualizar('categoria', v)}
                >
                  <SelectTrigger className={erros.categoria ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                {erros.categoria && (
                  <p className="text-xs text-destructive">{erros.categoria}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label>
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={dados.status}
                  onValueChange={(v) => atualizar('status', v)}
                >
                  <SelectTrigger className={erros.status ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                {erros.status && (
                  <p className="text-xs text-destructive">{erros.status}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Valor */}
              <div className="space-y-1.5">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={dados.valor}
                  onChange={(e) => atualizar('valor', e.target.value)}
                  className={erros.valor ? 'border-destructive' : ''}
                />
                {erros.valor && (
                  <p className="text-xs text-destructive">{erros.valor}</p>
                )}
              </div>

              {/* Responsável */}
              <div className="space-y-1.5">
                <Label>Responsável</Label>
                <Select
                  value={dados.responsavel}
                  onValueChange={(v) => atualizar('responsavel', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carlos">Carlos M.</SelectItem>
                    <SelectItem value="juliana">Juliana P.</SelectItem>
                    <SelectItem value="fernanda">Fernanda L.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção: Detalhes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Detalhes</CardTitle>
            <CardDescription>Informações complementares</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="descricao">Descrição / Observações</Label>
              <textarea
                id="descricao"
                rows={3}
                placeholder="Adicione observações relevantes sobre este registro..."
                value={dados.descricao}
                onChange={(e) => atualizar('descricao', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Checkbox de notificação */}
            <div className="flex items-center gap-2">
              <input
                id="notificar"
                type="checkbox"
                checked={dados.notificar}
                onChange={(e) => atualizar('notificar', e.target.checked)}
                className="w-4 h-4 rounded border-input accent-primary cursor-pointer"
              />
              <Label htmlFor="notificar" className="cursor-pointer font-normal">
                Notificar responsável por e-mail ao salvar
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Alerta informativo */}
        <Alert
          variant="info"
          title="Dica"
          message="Após salvar, o registro aparecerá na listagem e poderá ser editado a qualquer momento."
        />

        <Separator />

        {/* Botões de ação */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={resetar}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Limpar
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline">
              Salvar Rascunho
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? (
                <>
                  <span className="w-4 h-4 mr-1.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin inline-block" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  Salvar Registro
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
