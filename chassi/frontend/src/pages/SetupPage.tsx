/**
 * Setup SGO 4.0 — apenas para primeira instalação (produção).
 * SGO 4.0 usa somente PostgreSQL (Docker/ambiente). Sem MySQL/SQLite.
 * Em modo dev o sistema arranca sem setup; login com admin / admin123.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Palette } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@sgo/ui";

export function SetupPage() {
  const navigate = useNavigate();
  const isReinstall = new URLSearchParams(window.location.search).get("reinstall") === "true";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    appName: "",
    companyName: "",
    publicUrl: "",
    theme: "default",
    adminUsername: "admin",
    adminPassword: "",
    adminEmail: "admin@example.com",
    adminName: "Administrador",
  });

  useEffect(() => {
    const isDemo = new URLSearchParams(window.location.search).get("demo") === "true";
    if (isDemo) return;
    fetch("/api/setup/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.installed && !isReinstall) navigate("/login");
      })
      .catch((err) => console.error("Erro ao verificar status:", err));
  }, [navigate, isReinstall]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.adminUsername || !formData.adminPassword) {
        setError("Usuário e senha do administrador são obrigatórios.");
        return;
      }
      if (!formData.appName.trim()) formData.appName = formData.companyName || "SGO";
      setStep(2);
      return;
    }
    setStep(step + 1);
  };

  const handleReinstall = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("sgo-token");
      const res = await fetch("/api/setup/reinstall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha na reinstalação");
      }
      setStep(3);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao reinstalar");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/setup/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUsername: formData.adminUsername,
          adminPassword: formData.adminPassword,
          adminEmail: formData.adminEmail || `${formData.adminUsername}@example.com`,
          adminName: formData.adminName || "Administrador",
          appName: formData.appName || formData.companyName || "SGO",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro na instalação");
      }
      setStep(3);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro na instalação");
    } finally {
      setLoading(false);
    }
  };

  if (isReinstall) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl border-primary/20">
          <CardHeader className="text-center border-b bg-muted/20 pb-6">
            <CardTitle className="text-xl">Reinstalação (desenvolvimento)</CardTitle>
            <CardDescription>
              Reseta o sistema e aplica seed de desenvolvimento. Use apenas em dev.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            {step === 1 && (
              <Button onClick={handleReinstall} className="w-full" disabled={loading}>
                {loading ? "Reinstalando..." : "Reinstalar e ir para o login"}
              </Button>
            )}
            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8" />
                </div>
                <p className="text-muted-foreground">Reinstalação concluída. Redirecionando para o login...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-primary/20">
        <CardHeader className="text-center border-b bg-muted/20 pb-8">
          <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
            S
          </div>
          <CardTitle className="text-2xl">Assistente de Instalação</CardTitle>
          <CardDescription>SGO 4.0 — PostgreSQL (configurado via ambiente)</CardDescription>
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2].map((i) => (
              <div key={i} className={`h-2 w-8 rounded-full ${step >= i ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Palette className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Identidade e primeiro administrador</h3>
                  <p className="text-sm text-muted-foreground">Nome da instância e conta admin.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appName">Nome da aplicação</Label>
                <Input
                  id="appName"
                  name="appName"
                  placeholder="Ex: SGO"
                  value={formData.appName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da empresa (opcional)</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Ex: Minha Empresa Ltda"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminUsername">Usuário do administrador</Label>
                <Input
                  id="adminUsername"
                  name="adminUsername"
                  placeholder="admin"
                  value={formData.adminUsername}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Senha do administrador</Label>
                <Input
                  id="adminPassword"
                  name="adminPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.adminPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">E-mail</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminName">Nome completo</Label>
                  <Input
                    id="adminName"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full mt-4">
                Continuar <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Confirmar instalação</h3>
              <div className="rounded-md border bg-muted/20 p-4 text-sm space-y-1">
                <p><strong>App:</strong> {formData.appName || formData.companyName || "SGO"}</p>
                <p><strong>Admin:</strong> {formData.adminUsername} / {formData.adminEmail}</p>
              </div>
              <form onSubmit={handleSubmit}>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? "Instalando..." : "Concluir instalação"}
                </Button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-green-700">Sucesso!</h2>
              <p className="text-muted-foreground">
                O SGO 4.0 foi instalado. Redirecionando para o login...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
