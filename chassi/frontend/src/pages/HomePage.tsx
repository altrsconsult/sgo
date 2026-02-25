import { useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Skeleton } from "@sgo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useAllowedModules } from "@/hooks/useAllowedModules";
import { getModuleIcon, getModuleColor } from "@/lib/module-icons";

/**
 * Página inicial (Launcher) - Grid de Smart Cards dos módulos.
 * Estilo "Android Launcher" com cards dos módulos disponíveis.
 */
export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Busca módulos da API (hook compartilhado com ShellLayout/sidebar)
  const { data: modules = [], isLoading } = useAllowedModules();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Saudação */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Olá, {user?.name?.split(" ")[0] || "Usuário"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {modules.length > 0
            ? "Selecione um módulo para começar seu trabalho."
            : "Bem-vindo ao seu ambiente de trabalho."}
        </p>
      </div>

      {/* Grid de módulos (Launcher) */}
      {isLoading ? (
        <div className="launcher-grid">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-48">
              <CardHeader className="pb-2">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-5 w-32 mt-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : modules.length === 0 ? (
        <Card className="py-16 text-center border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-background p-4 shadow-sm">
              <Layers className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-semibold">Nenhum módulo disponível</h3>
              <p className="text-muted-foreground">
                {user?.role === "admin"
                  ? "Acesse o painel administrativo para instalar e configurar novos módulos no sistema."
                  : "Você ainda não possui módulos liberados. Entre em contato com seu gestor."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="launcher-grid">
          {modules.map((module) => {
            const Icon = getModuleIcon(module);
            const iconBgColor = getModuleColor(module);

            return (
              <Card
                key={module.id}
                className="group relative cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card"
                onClick={() => navigate(`/app/${module.slug}`)}
              >
                <CardHeader className="pb-2 relative z-10">
                  <div className="flex items-start justify-between">
                    {/* Ícone e cor definidos no manifest do módulo; cor via variável CSS */}
                    <div
                      className="module-card-icon"
                      style={{ ["--module-icon-bg" as string]: iconBgColor }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Badge de versão discreto */}
                    {module.version && (
                      <Badge variant="outline" className="text-[10px] font-mono opacity-50 bg-background/50 backdrop-blur-sm">
                        v{module.version}
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-xl mt-4 font-semibold group-hover:text-primary transition-colors">
                    {module.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 pb-6">
                  <CardDescription className="line-clamp-2 text-sm leading-relaxed mb-4">
                    {module.description || "Módulo de gestão operacional SGO."}
                  </CardDescription>

                  {/* Indicador de ação */}
                  <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Acessar Módulo
                    <Layers className="ml-2 h-4 w-4" />
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
