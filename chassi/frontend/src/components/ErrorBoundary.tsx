import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button, Card, CardContent } from "@sgo/ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary global para capturar erros de renderização React.
 * Mostra uma UI amigável em vez de uma tela branca.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log para debug/monitoramento
    console.error("ErrorBoundary capturou erro:", error);
    console.error("Informações do erro:", errorInfo);

    // TODO: Enviar para serviço de monitoramento (Sentry, etc)
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Se foi fornecido um fallback customizado, usa ele
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI padrão de erro
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-lg w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {/* Ícone */}
                <div className="rounded-full bg-destructive/10 p-4 mb-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                {/* Título */}
                <h1 className="text-xl font-semibold mb-2">
                  Ops! Algo deu errado
                </h1>

                {/* Descrição */}
                <p className="text-muted-foreground mb-6">
                  Ocorreu um erro inesperado. Tente recarregar a página ou voltar para o início.
                </p>

                {/* Ações */}
                <div className="flex gap-3">
                  <Button onClick={this.handleReload}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recarregar
                  </Button>
                  <Button variant="outline" onClick={this.handleGoHome}>
                    <Home className="h-4 w-4 mr-2" />
                    Ir para o Início
                  </Button>
                </div>

                {/* Detalhes do erro (apenas em desenvolvimento) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-6 w-full text-left">
                    <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      Detalhes técnicos (desenvolvimento)
                    </summary>
                    <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Componente de fallback simples para módulos.
 */
export function ModuleErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="font-semibold mb-2">Erro ao carregar conteúdo</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {error?.message || "Ocorreu um erro inesperado."}
      </p>
      {resetError && (
        <Button variant="outline" size="sm" onClick={resetError}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
