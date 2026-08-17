import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSafeErrorMessage } from "@/lib/errorMessages";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Activity,
  ClipboardList,
  FileSpreadsheet,
  Search,
  Phone,
  Filter,
  CheckCircle2
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

interface SurveyResponse {
  id: string;
  user_id: string;
  stage: string;
  previous_attempt: string;
  preferred_format: string;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("surveys");

  // Filter & Search states for surveys
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");

  // Create & Delete User dialog states
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
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    setSurveysLoading(true);

    // 1. Fetch profiles
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
      setSurveysLoading(false);
      return;
    }

    const profiles = profilesData || [];

    // 2. Fetch roles
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role");

    const usersWithRoles = profiles.map((profile) => ({
      ...profile,
      role: rolesData?.find((r) => r.user_id === profile.id)?.role || "user",
    }));

    setUsers(usersWithRoles);
    setLoading(false);

    // 3. Fetch surveys
    try {
      const { data: surveysData, error: surveysError } = await (supabase as any)
        .from("user_surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (surveysError) {
        console.warn("Aviso ao carregar pesquisas:", surveysError.message);
      } else if (surveysData) {
        const enrichedSurveys: SurveyResponse[] = surveysData.map((survey: any) => ({
          ...survey,
          user: profiles.find((p) => p.id === survey.user_id),
        }));
        setSurveys(enrichedSurveys);
      }
    } catch (err) {
      console.error("Erro ao buscar respostas da pesquisa:", err);
    } finally {
      setSurveysLoading(false);
    }
  };

  const recentUsers = users.filter((u) => {
    const createdAt = new Date(u.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt > weekAgo;
  }).length;

  const whatsappCount = surveys.filter((s) => Boolean(s.whatsapp && s.whatsapp.trim())).length;

  // Filtered surveys logic
  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const name = survey.user?.full_name?.toLowerCase() || "";
      const email = survey.user?.email?.toLowerCase() || "";
      const phone = survey.whatsapp?.toLowerCase() || "";
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query);

      const matchesStage =
        selectedStage === "all" || survey.stage === selectedStage;

      return matchesSearch && matchesStage;
    });
  }, [surveys, searchQuery, selectedStage]);

  // Unique stage options for filter
  const stageOptions = useMemo(() => {
    const set = new Set<string>();
    surveys.forEach((s) => {
      if (s.stage) set.add(s.stage);
    });
    return Array.from(set);
  }, [surveys]);

  // Export CSV function
  const handleExportCSV = () => {
    if (filteredSurveys.length === 0) {
      toast({
        title: "Nenhum dado",
        description: "Não há respostas para exportar com os filtros atuais.",
      });
      return;
    }

    const headers = [
      "Nome",
      "Email",
      "WhatsApp",
      "Estágio Atual",
      "Tentativa Anterior",
      "Formato Preferido",
      "Data da Pesquisa",
    ];

    const rows = filteredSurveys.map((s) => [
      `"${s.user?.full_name || "N/A"}"`,
      `"${s.user?.email || "N/A"}"`,
      `"${s.whatsapp || "N/A"}"`,
      `"${(s.stage || "").replace(/"/g, '""')}"`,
      `"${(s.previous_attempt || "").replace(/"/g, '""')}"`,
      `"${(s.preferred_format || "").replace(/"/g, '""')}"`,
      `"${new Date(s.created_at).toLocaleString("pt-BR")}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `respostas_pesquisa_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportado com sucesso",
      description: `${filteredSurveys.length} respostas foram exportadas para CSV.`,
    });
  };

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
        emailRedirectTo: `${window.location.origin}/definir-senha`,
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
      fetchData();
    }
    setCreating(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

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
      fetchData();
    }

    setDeleting(false);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Format WhatsApp Link
  const getWhatsAppLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const formatted = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${formatted}`;
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Guia
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
                    Gestão de Alunos & Pesquisa Inicial
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                cadastrados na plataforma
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pesquisas Respondidas
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{surveys.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.length > 0
                  ? `${Math.round((surveys.length / users.length) * 100)}% de taxa de preenchimento`
                  : "respostas coletadas"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contatos com WhatsApp
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{whatsappCount}</div>
              <p className="text-xs text-muted-foreground">
                leads qualificados para contato
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cadastros (7 dias)
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentUsers}</div>
              <p className="text-xs text-muted-foreground">
                novos alunos nesta semana
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="surveys" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList className="bg-secondary border border-border">
              <TabsTrigger value="surveys" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                Respostas da Pesquisa ({surveys.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Usuários ({users.length})
              </TabsTrigger>
            </TabsList>

            {activeTab === "surveys" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="gap-2 border-border"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                Exportar para CSV
              </Button>
            )}
          </div>

          {/* TAB 1: SURVEY RESPONSES */}
          <TabsContent value="surveys" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou WhatsApp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border w-full"
                />
              </div>

              {stageOptions.length > 0 && (
                <div className="w-full sm:w-64 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Select value={selectedStage} onValueChange={setSelectedStage}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Filtrar por Fase" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all">Todas as Fases</SelectItem>
                      {stageOptions.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              {surveysLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-secondary/50">
                      <TableHead>Aluno</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Estágio Atual</TableHead>
                      <TableHead>Tentativa Anterior</TableHead>
                      <TableHead>Formato Preferido</TableHead>
                      <TableHead className="w-32">Respondido Em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSurveys.map((survey) => (
                      <TableRow key={survey.id} className="border-border">
                        <TableCell>
                          <div className="font-medium">
                            {survey.user?.full_name || "Sem Nome"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {survey.user?.email || "Sem Email"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {survey.whatsapp ? (
                            <a
                              href={getWhatsAppLink(survey.whatsapp)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-mono"
                            >
                              <Phone className="w-3 h-3" />
                              {survey.whatsapp}
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Não informado
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs max-w-xs truncate font-normal">
                            {survey.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs">
                          {survey.previous_attempt}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs">
                          {survey.preferred_format}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(survey.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredSurveys.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                        >
                          Nenhuma resposta de pesquisa encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: USERS MANAGEMENT */}
          <TabsContent value="users" className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-secondary/50">
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Permissão</TableHead>
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
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              profile.role === "admin"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {profile.role === "admin" ? "Admin" : "Usuário"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
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
                        <TableCell
                          colSpan={5}
                          className="text-center py-12 text-muted-foreground"
                        >
                          Nenhum usuário cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
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