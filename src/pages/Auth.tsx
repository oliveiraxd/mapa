import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getSafeErrorMessage } from "@/lib/errorMessages";
import { Mail, Lock, Loader2 } from "lucide-react";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso."
        });
        navigate("/dashboard");
      } else {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Conta criada!",
          description: "Você já pode acessar a plataforma."
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: getSafeErrorMessage(error)
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="w-full max-w-md animate-fade-in">
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
          <img src="/profile.jpg" alt="Prof. Dr. Luã Oliveira" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Mapa da aprovação no mestrado
        </h1>
        <p className="text-muted-foreground">
          Transforme seu histórico em um currículo competitivo para banca de mestrado
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input id="fullName" type="text" placeholder="Seu nome" value={fullName} onChange={e => setFullName(e.target.value)} required={!isLogin} className="bg-secondary border-border" />
          </div>}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-secondary border-border pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="bg-secondary border-border pl-10" />
            </div>
          </div>

          {isLogin && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Lembrar de mim
              </Label>
            </div>
            <button type="button" className="text-sm text-primary hover:underline" onClick={() => toast({
              title: "Em breve",
              description: "Funcionalidade disponível em breve."
            })}>
              Esqueci minha senha
            </button>
          </div>}

          <Button type="submit" className="w-full gradient-gold text-primary-foreground font-semibold h-12" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isLogin ? "Acessar Plataforma" : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 text-center">

        </div>
      </div>
    </div>
  </div>;
};
export default Auth;