import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@sgo/ui";
import { useLogin } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Logo } from "@/components/Logo";
import { CHASSIS_VERSION } from "@/version";

/**
 * Página de Login unificada.
 * Funciona para todos os tipos de usuário (user, admin, superadmin).
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useLogin();
  const { resolvedTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorativo - Gradiente Sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          {/* Logo */}
          <div className="mx-auto mb-6 flex justify-center transform scale-125">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-base">
            Entre com suas credenciais para acessar o SGO
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de usuário */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="ex: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                autoFocus
                className="h-10"
              />
            </div>

            {/* Campo de senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                {/* Futuro: Link de esqueceu a senha */}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <Shield className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Botão de login */}
            <Button type="submit" className="w-full h-10 text-base shadow-sm" isLoading={isLoading}>
              {!isLoading && <LogIn className="mr-2 h-4 w-4" />}
              Acessar Sistema
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Rodapé neutro: mesma versão exibida no badge do usuário (open source) */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground font-mono">
        SGO {CHASSIS_VERSION}
      </div>
    </div>
  );
}
