import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSafeErrorMessage } from "@/lib/errorMessages";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  GraduationCap, 
  ArrowLeft, 
  UserPlus, 
  Trash2, 
  Loader2, 
  Users, 
  Shield, 
  Activity 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

interface UserWithRole extends UserProfile {
  role?: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", fullName: "" });
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithRole | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
        });
        navigate("/dashboard");
      }
    }
  }, [user, authLoading, adminLoading, isAdmin, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
      });
      setLoading(false);
      return;
    }

    // Fetch roles for each user
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role");

    const usersWithRoles = (profilesData || []).map(profile => ({
      ...profile,
      role: rolesData?.find(r => r.user_id === profile.id)?.role || 'user'
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const recentUsers = users.filter(u => {
    const createdAt = new Date(u.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt > weekAgo;
  }).length;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const { error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        data: {
          full_name: newUser.fullName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: getSafeErrorMessage(error),
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
      });
      setIsDialogOpen(false);
      setNewUser({ email: "", password: "", fullName: "" });
      fetchUsers();
    }
    setCreating(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    // Não permitir excluir a si mesmo
    if (userToDelete.id === user?.id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você não pode excluir seu próprio perfil.",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      return;
    }

    setDeleting(true);

    // Primeiro, deletar o role do usuário
    const { error: roleError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userToDelete.id);

    if (roleError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o role do usuário.",
      });
      setDeleting(false);
      return;
    }

    // Depois, deletar o perfil
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userToDelete.id);

    if (profileError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: getSafeErrorMessage(profileError),
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });
      fetchUsers();
    }

    setDeleting(false);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg">
                    Painel Administrativo
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Gerenciamento de Usuários
                  </p>
                </div>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-gold text-primary-foreground">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, fullName: e.target.value })
                      }
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      required
                      minLength={6}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-gold text-primary-foreground"
                    disabled={creating}
                  >
                    {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Criar Usuário
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                usuários cadastrados
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Administradores
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminCount}</div>
              <p className="text-xs text-muted-foreground">
                com acesso admin
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Novos (7 dias)
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentUsers}</div>
              <p className="text-xs text-muted-foreground">
                cadastros recentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((profile) => (
                  <TableRow key={profile.id} className="border-border">
                    <TableCell className="font-medium">
                      {profile.full_name || "-"}
                    </TableCell>
                    <TableCell>{profile.email || "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        profile.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {profile.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setUserToDelete(profile);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>{userToDelete?.full_name || userToDelete?.email}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleting}
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;