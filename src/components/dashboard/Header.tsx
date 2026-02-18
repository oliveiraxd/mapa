import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useProgress } from "@/hooks/useProgress";
import { kanbanColumns } from "@/data/kanbanData";
import { GraduationCap, BarChart3, HelpCircle, LogOut, Settings } from "lucide-react";
export function Header() {
  const {
    signOut,
    user
  } = useAuth();
  const {
    isAdmin
  } = useAdminRole();
  const {
    getCompletionPercentage
  } = useProgress();
  const navigate = useNavigate();
  const allCardIds = kanbanColumns.flatMap(col => col.cards.map(card => card.id));
  const overallProgress = getCompletionPercentage(allCardIds);
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  return <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">
              Mapa da aprovação no mestrado
            </h1>
            <p className="text-xs text-muted-foreground">Desenvolvido pelo Prof. Dr. Luã Oliveira</p>
            <p className="text-xs text-muted-foreground">Todos os Direitos Reservados</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span>Progresso</span>
          </div>
          <div className="flex-1">
            <Progress value={overallProgress} className="h-2" />
          </div>
          <span className="text-sm font-medium text-primary">{overallProgress}%</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ajuda</span>
          </Button>

          {isAdmin && <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/admin")}>
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Admin</span>
          </Button>}

          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden mt-3 flex items-center gap-3">
        <Progress value={overallProgress} className="h-2 flex-1" />
        <span className="text-sm font-medium text-primary">{overallProgress}%</span>
      </div>
    </div>
  </header>;
}