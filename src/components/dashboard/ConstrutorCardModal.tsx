import { KanbanCard } from "@/data/kanbanData";
import { useProgress } from "@/hooks/useProgress";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, Copy, Lightbulb, GraduationCap, Briefcase, FileText, Users, FlaskConical, Heart } from "lucide-react";
import { toast } from "sonner";

// Icon mapping for different card types
const cardIcons: Record<string, React.ReactNode> = {
  "build-1": <GraduationCap className="w-7 h-7" />,
  "build-2": <Briefcase className="w-7 h-7" />,
  "build-3": <FileText className="w-7 h-7" />,
  "build-4": <Users className="w-7 h-7" />,
  "build-5": <FlaskConical className="w-7 h-7" />,
  "build-6": <Heart className="w-7 h-7" />,
};

// Subtitles for each card
const cardSubtitles: Record<string, string> = {
  "build-1": "Como apresentar sua formação de forma estratégica para a banca de mestrado",
  "build-2": "Transforme suas experiências em pontos valiosos para a seleção",
  "build-3": "Organize e destaque sua produção científica de forma estratégica",
  "build-4": "Valorize suas experiências de ensino e mentoria acadêmica",
  "build-5": "Demonstre seu engajamento com a pesquisa científica",
  "build-6": "Mostre seu compromisso social e aplicação prática do conhecimento",
};

// Data structure for construtor cards
export interface ConstrutorCardData {
  checklistItems: string[];
  textModel: {
    title: string;
    content: string;
    caption: string;
  };
  tip: string;
}

// Extract data from markdown content
function parseConstrutorContent(content: string): ConstrutorCardData {
  const checklistItems: string[] = [];
  let textModelContent = "";
  let tipContent = "";
  
  const lines = content.split("\n");
  let inChecklist = false;
  let inTextModel = false;
  let inTip = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Detect checklist section
    if (trimmedLine.includes("✅") || trimmedLine.toLowerCase().includes("checklist")) {
      inChecklist = true;
      inTextModel = false;
      inTip = false;
      continue;
    }
    
    // Detect text model section
    if (trimmedLine.includes("📝") || trimmedLine.toLowerCase().includes("modelo")) {
      inChecklist = false;
      inTextModel = true;
      inTip = false;
      continue;
    }
    
    // Detect tip section
    if (trimmedLine.includes("💡") || trimmedLine.toLowerCase().includes("dica")) {
      inChecklist = false;
      inTextModel = false;
      inTip = true;
      continue;
    }
    
    // Collect content
    if (inChecklist && trimmedLine.startsWith("- [")) {
      const itemText = trimmedLine.replace(/- \[[ x]\] /, "").trim();
      if (itemText) checklistItems.push(itemText);
    }
    
    if (inTextModel && trimmedLine.startsWith(">")) {
      const modelText = trimmedLine.replace(/^>\s*/, "").trim();
      if (modelText) {
        textModelContent += (textModelContent ? "\n\n" : "") + modelText;
      }
    }
    
    if (inTip && trimmedLine && !trimmedLine.startsWith("#") && !trimmedLine.startsWith("-")) {
      tipContent = trimmedLine;
    }
  }
  
  return {
    checklistItems,
    textModel: {
      title: "Texto sugerido pela banca",
      content: textModelContent || "Graduado em [Curso] pela [Instituição] ([Ano]). Durante o curso, desenvolvi [projeto/trabalho] com foco em [tema relacionado ao mestrado].",
      caption: "Copie o texto e adapte para a sua realidade.",
    },
    tip: tipContent || "Cada seção do Currículo Aprovado possui modelos prontos para evitar erros comuns e aumentar sua pontuação.",
  };
}

interface ConstrutorCardModalProps {
  card: KanbanCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConstrutorCardModal({ card, isOpen, onClose }: ConstrutorCardModalProps) {
  const { progress, toggleProgress } = useProgress();
  const { isItemCompleted, toggleChecklistItem, getCardProgress } = useChecklistProgress();

  if (!card || !card.content) return null;

  const isCompleted = progress[card.id] || false;
  const cardData = parseConstrutorContent(card.content);
  const cardProgress = getCardProgress(card.id, cardData.checklistItems.length);
  const icon = cardIcons[card.id] || <GraduationCap className="w-7 h-7" />;
  const subtitle = cardSubtitles[card.id] || card.description;

  const handleMarkComplete = () => {
    toggleProgress(card.id);
  };

  const handleCopyText = async () => {
    try {
      // Clean markdown formatting for copy
      const cleanText = cardData.textModel.content
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/\[([^\]]+)\]/g, "[$1]");
      
      await navigator.clipboard.writeText(cleanText);
      toast.success("Texto copiado!", {
        description: "Cole e adapte para sua realidade.",
      });
    } catch {
      toast.error("Erro ao copiar", {
        description: "Tente selecionar e copiar manualmente.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border p-0 gap-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {card.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <Progress 
              value={cardProgress.percentage} 
              className="h-2 flex-1 bg-muted"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {cardProgress.completed}/{cardProgress.total} concluídos
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Checklist Block */}
          <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-foreground">
                Critérios mínimos para pontuar bem
              </h3>
            </div>
            
            <div className="space-y-3">
              {cardData.checklistItems.map((item, idx) => {
                const isChecked = isItemCompleted(card.id, idx);
                
                return (
                  <label
                    key={idx}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleChecklistItem(card.id, idx)}
                      className="mt-0.5 h-5 w-5 border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <span className={cn(
                      "text-sm leading-relaxed transition-colors",
                      isChecked 
                        ? "line-through text-muted-foreground" 
                        : "text-foreground group-hover:text-primary"
                    )}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Text Model Block */}
          <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-lg">✍️</span>
                <h3 className="font-semibold text-foreground text-sm">
                  {cardData.textModel.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyText}
                className="h-8 px-3 text-xs hover:bg-primary/10 hover:text-primary"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copiar
              </Button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-foreground/90 leading-relaxed font-mono whitespace-pre-wrap">
                {cardData.textModel.content}
              </p>
              <p className="text-xs text-muted-foreground mt-3 italic">
                {cardData.textModel.caption}
              </p>
            </div>
          </div>

          {/* Tip Callout */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/90 leading-relaxed">
              {cardData.tip}
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={handleMarkComplete}
            className={cn(
              "flex-1 sm:flex-none h-11 px-6 font-medium",
              isCompleted 
                ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
                : "gradient-green text-accent-foreground"
            )}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Etapa Concluída
              </>
            ) : (
              "Marcar etapa como concluída"
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-11 text-muted-foreground hover:text-foreground"
          >
            Voltar ao painel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
