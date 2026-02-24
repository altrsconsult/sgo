import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Database, Palette } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@sgo/ui";

export function SetupPage() {
  const navigate = useNavigate();
  const isReinstall = new URLSearchParams(window.location.search).get("reinstall") === "true";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Database Config State
  const [dbConfig, setDbConfig] = useState({
    type: "sqlite", // sqlite | mysql | postgres
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "sgo_core"
  });
  const [reinstallOptions, setReinstallOptions] = useState({
    preserveData: true,
    migrateAcrossTypes: true,
  });

  // Form Data
  const [formData, setFormData] = useState({
    companyName: "",
    publicUrl: "", // URL pública — preenchida na instalação para o Nexus
    theme: "default", // default | minimal | group
  });

  // Verificar se já está instalado
  useEffect(() => {
    // Permite visualização em modo demo via query param ?demo=true
    const isDemo = new URLSearchParams(window.location.search).get("demo") === "true";
    
    if (isDemo) return;

    fetch("/api/setup/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.installed && !isReinstall) {
          navigate("/login");
        }
      })
      .catch((err) => console.error("Erro ao verificar status:", err));
  }, [navigate, isReinstall]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDbConfig({ ...dbConfig, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    setError(null);

    // Passo 1: Configuração de Banco de Dados
    if (step === 1) {
      if (dbConfig.type === 'mysql' || dbConfig.type === 'postgres') {
          if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
              setError("Preencha os campos obrigatórios do banco de dados.");
              return;
          }
      }

      setLoading(true);
      try {
          const endpoint = isReinstall ? "/api/setup/reinstall" : "/api/setup/database";
          const token = localStorage.getItem("sgo-token");
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };
          if (isReinstall && token) {
            headers.Authorization = `Bearer ${token}`;
          }
          const res = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify({
              ...dbConfig,
              preserveData: reinstallOptions.preserveData,
              migrateAcrossTypes: reinstallOptions.migrateAcrossTypes,
            }),
          });
          
          if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || "Falha ao configurar banco de dados");
          }
          
          setStep(step + 1);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
      return;
    }

    // Passo 2: Empresa
    if (step === 2 && !formData.companyName) {
      setError("O nome da empresa é obrigatório.");
      return;
    }

    if (step === 2) {
      // Em reinstalação, finalizamos aqui e voltamos ao login.
      if (isReinstall) {
        setStep(4);
        setTimeout(() => navigate("/login"), 2500);
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/setup/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro na instalação");
      }

      // Sucesso!
      setStep(4); // Tela de sucesso
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-primary/20">
        <CardHeader className="text-center border-b bg-muted/20 pb-8">
          <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
            S
          </div>
          <CardTitle className="text-2xl">Assistente de Instalação</CardTitle>
          <CardDescription>Configure seu ambiente SGO Core v1.0.0</CardDescription>
          
          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((i) => (
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
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Banco de Dados</h3>
                  <p className="text-sm text-muted-foreground">Escolha onde os dados serão armazenados.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${dbConfig.type === 'sqlite' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  onClick={() => setDbConfig({...dbConfig, type: 'sqlite'})}
                >
                  <div className="font-semibold mb-1">SQLite</div>
                  <div className="text-xs text-muted-foreground">Arquivo local (Simples)</div>
                </div>
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${dbConfig.type === 'mysql' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  onClick={() => setDbConfig({...dbConfig, type: 'mysql', port: '3306', user: 'root'})}
                >
                  <div className="font-semibold mb-1">MySQL</div>
                  <div className="text-xs text-muted-foreground">Servidor externo (Robusto)</div>
                </div>
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${dbConfig.type === 'postgres' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  onClick={() => setDbConfig({...dbConfig, type: 'postgres', port: '5432', user: 'postgres'})}
                >
                  <div className="font-semibold mb-1">PostgreSQL</div>
                  <div className="text-xs text-muted-foreground">Enterprise & Scalable</div>
                </div>
              </div>

              {(dbConfig.type === 'mysql' || dbConfig.type === 'postgres') && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label htmlFor="host">Host</Label>
                      <Input id="host" name="host" value={dbConfig.host} onChange={handleDbChange} placeholder="localhost" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="port">Porta</Label>
                      <Input id="port" name="port" value={dbConfig.port} onChange={handleDbChange} placeholder={dbConfig.type === 'postgres' ? "5432" : "3306"} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="database">Nome do Banco</Label>
                    <Input id="database" name="database" value={dbConfig.database} onChange={handleDbChange} placeholder="sgo_core" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="user">Usuário</Label>
                      <Input id="user" name="user" value={dbConfig.user} onChange={handleDbChange} placeholder={dbConfig.type === 'postgres' ? "postgres" : "root"} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" name="password" type="password" value={dbConfig.password} onChange={handleDbChange} placeholder="******" />
                    </div>
                  </div>
                </div>
              )}

              {isReinstall && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                  <p className="text-sm font-medium">Opções de reinstalação</p>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={reinstallOptions.preserveData}
                      onChange={(e) =>
                        setReinstallOptions((prev) => ({ ...prev, preserveData: e.target.checked }))
                      }
                    />
                    Manter dados atuais (backup/restore)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={reinstallOptions.migrateAcrossTypes}
                      onChange={(e) =>
                        setReinstallOptions((prev) => ({ ...prev, migrateAcrossTypes: e.target.checked }))
                      }
                    />
                    Permitir migração entre tipos de banco
                  </label>
                </div>
              )}

              <Button onClick={handleNext} className="w-full mt-4" disabled={loading}>
                {loading ? "Configurando..." : "Continuar"} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Palette className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Identidade & Instância</h3>
                  <p className="text-sm text-muted-foreground">Personalize a aparência e dados da empresa.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa / Instância</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Ex: Minha Empresa Ltda"
                  value={formData.companyName}
                  onChange={handleChange}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicUrl">URL pública do sistema</Label>
                <Input
                  id="publicUrl"
                  name="publicUrl"
                  placeholder="https://seu-dominio.com"
                  value={formData.publicUrl}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Para esta instalação aparecer no Nexus (Torre de Controle). Ex.: https://coresgo.altrs.net
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Tema Visual</Label>
                <div className="grid grid-cols-3 gap-3">
                    <div 
                      className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.theme === 'default' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}`}
                      onClick={() => setFormData({...formData, theme: 'default'})}
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-500 mx-auto mb-2 border-2 border-white shadow-sm"></div>
                      <div className="font-medium text-sm">Padrão</div>
                      <div className="text-[10px] text-muted-foreground">Azul SGO</div>
                    </div>
                    
                    <div 
                      className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.theme === 'minimal' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}`}
                      onClick={() => setFormData({...formData, theme: 'minimal'})}
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-100 mx-auto mb-2 border-2 border-gray-400 shadow-sm"></div>
                      <div className="font-medium text-sm">Minimal</div>
                      <div className="text-[10px] text-muted-foreground">Clean & Foco</div>
                    </div>

                    <div 
                      className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.theme === 'group' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}`}
                      onClick={() => setFormData({...formData, theme: 'group'})}
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-900 mx-auto mb-2 border-2 border-gray-700 shadow-sm"></div>
                      <div className="font-medium text-sm">Group</div>
                      <div className="text-[10px] text-muted-foreground">Executive</div>
                    </div>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full mt-4">
                Continuar <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 3 && !isReinstall && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h3 className="font-semibold">Confirmar instalação</h3>
                  <p className="text-sm text-muted-foreground">
                    As credenciais padrão serão criadas automaticamente no banco.
                  </p>
                </div>
              </div>
              <div className="space-y-3 rounded-md border bg-muted/20 p-4 text-sm">
                <p className="font-medium">Credenciais padrão aplicadas:</p>
                <p>Superadmin: superadmin / superadmin@altrs.net / @Altrsconsult1234</p>
                <p>Admin: admin / admin@altrs.net / @Admin1234</p>
              </div>
              <form onSubmit={handleSubmit}>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Instalando..." : "Concluir Instalação"}
                </Button>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-green-700">Sucesso!</h2>
              <p className="text-muted-foreground">
                {isReinstall ? "Reinstalação concluída com sucesso." : "O SGO Core foi instalado corretamente."}<br/>
                Redirecionando para o login...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
