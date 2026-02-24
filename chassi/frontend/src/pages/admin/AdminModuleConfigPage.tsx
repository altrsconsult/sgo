import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@sgo/ui";

/**
 * Configuração de módulo: o Chassi só redireciona para a rota do próprio módulo.
 * A configuração é sempre contida no módulo (independente e autocontido).
 * Rota do módulo: /app/:moduleSlug/config
 */
export function AdminModuleConfigPage() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (moduleSlug) {
      navigate(`/app/${moduleSlug}/config`, { replace: true });
    }
  }, [moduleSlug, navigate]);

  if (!moduleSlug) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/modules")}>
          Voltar
        </Button>
        <p className="text-muted-foreground">Módulo não identificado.</p>
      </div>
    );
  }

  return <p className="text-muted-foreground text-sm">Redirecionando para a configuração do módulo...</p>;
}
