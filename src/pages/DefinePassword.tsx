import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSafeErrorMessage } from "@/lib/errorMessages";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

const DefinePassword = () => {
  const { user, loading: authLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha precisa ter no mínimo 6 caracteres.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "A confirmação de senha precisa ser idêntica à nova senha.",
      });
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Senha cadastrada!",
        description: "Sua senha foi cadastrada com sucesso.",
      });

      // Redirect to dashboard after a short delay to allow the user to see the success state
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar senha",
        description: getSafeErrorMessage(error),
      });
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there's no user in the session, the link is likely invalid, expired, or the user accessed it directly.
  if (!user && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
              <img src="/profile.jpg" alt="Prof. Dr. Luã Oliveira" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Convite Expirado ou Inválido
            </h1>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg border border-border text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-destructive animate-pulse" />
            </div>
            <p className="text-muted-foreground mb-6">
              Não encontramos uma sessão de convite ativa. O link que você clicou pode ter expirado ou já ter sido utilizado.
            </p>
            <Button 
              onClick={() => navigate("/auth")} 
              className="w-full gradient-gold text-primary-foreground font-semibold h-12"
            >
              Ir para o Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
            <img src="/profile.jpg" alt="Prof. Dr. Luã Oliveira" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Configure sua Conta
          </h1>
          <p className="text-muted-foreground">
            Defina uma senha segura para ter acesso à sua plataforma de estudos.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Senha Definida!</h2>
              <p className="text-muted-foreground text-sm">
                Tudo pronto! Você será redirecionado para a plataforma em alguns instantes...
              </p>
              <div className="flex justify-center pt-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-secondary border-border pl-10"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  A senha deve conter no mínimo 6 caracteres.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-secondary border-border pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-gold text-primary-foreground font-semibold h-12"
                disabled={updating}
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Cadastrar Senha e Entrar
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefinePassword;
