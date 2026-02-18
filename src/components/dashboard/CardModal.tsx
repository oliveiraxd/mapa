import { KanbanCard } from "@/data/kanbanData";
import { useProgress } from "@/hooks/useProgress";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Check, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DiagnosticForm } from "./DiagnosticForm";

interface CardModalProps {
  card: KanbanCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CardModal({ card, isOpen, onClose }: CardModalProps) {
  const { progress, toggleProgress } = useProgress();
  const { isItemCompleted, toggleChecklistItem, getCardProgress } = useChecklistProgress();

  if (!card) return null;

  const isCompleted = progress[card.id] || false;

  const handleMarkComplete = () => {
    toggleProgress(card.id);
  };

  // Helper to extract checklist items from content
  const extractChecklistItems = (content: string) => {
    return content.split("\n").filter((line) => line.trim().startsWith("- ["));
  };

  // Helper to check if content has checklist items
  const hasChecklistItems = (content: string) => {
    return extractChecklistItems(content).length > 0;
  };

  // Render interactive checklist
  const renderChecklist = (items: string[]) => {
    const progress = getCardProgress(card.id, items.length);
    
    return (
      <div className="space-y-4">
        {progress.total > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span>{progress.completed}/{progress.total} concluídos</span>
          </div>
        )}
        <div className="space-y-3">
          {items.map((line, idx) => {
            const text = line.replace(/- \[[ x]\] /, "").trim();
            const isChecked = isItemCompleted(card.id, idx);

            return (
              <div key={idx} className="flex items-start gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleChecklistItem(card.id, idx)}
                  className="mt-0.5"
                />
                <span className={cn(
                  "text-sm",
                  isChecked && "line-through text-muted-foreground"
                )}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // Diagnostic form
    if (card.content === "diagnostic-form") {
      return <DiagnosticForm onComplete={handleMarkComplete} />;
    }

    // Pure checklist type
    if (card.type === "checklist" && card.content) {
      const items = extractChecklistItems(card.content);
      return renderChecklist(items);
    }

    // Text content that may contain checklists
    if (card.content && hasChecklistItems(card.content)) {
      // Split content into sections - before checklist, checklist, after checklist
      const lines = card.content.split("\n");
      const sections: { type: "text" | "checklist"; content: string; items?: string[] }[] = [];
      let currentText: string[] = [];
      let checklistItems: string[] = [];
      let inChecklist = false;

      lines.forEach((line) => {
        const isChecklistLine = line.trim().startsWith("- [");
        
        if (isChecklistLine) {
          if (!inChecklist && currentText.length > 0) {
            sections.push({ type: "text", content: currentText.join("\n") });
            currentText = [];
          }
          inChecklist = true;
          checklistItems.push(line);
        } else {
          if (inChecklist && checklistItems.length > 0) {
            sections.push({ type: "checklist", content: "", items: checklistItems });
            checklistItems = [];
          }
          inChecklist = false;
          currentText.push(line);
        }
      });

      // Push remaining content
      if (currentText.length > 0) {
        sections.push({ type: "text", content: currentText.join("\n") });
      }
      if (checklistItems.length > 0) {
        sections.push({ type: "checklist", content: "", items: checklistItems });
      }

      return (
        <div className="space-y-4">
          {sections.map((section, idx) => {
            if (section.type === "checklist" && section.items) {
              return <div key={idx}>{renderChecklist(section.items)}</div>;
            }
            return (
              <div key={idx} className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            );
          })}
        </div>
      );
    }

    if (card.type === "link" && card.externalUrl) {
      return (
        <div className="text-center py-8">
          <ExternalLink className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Este conteúdo abrirá em uma nova aba
          </p>
          <Button
            onClick={() => window.open(card.externalUrl, "_blank")}
            className="gradient-gold text-primary-foreground"
          >
            Abrir Link Externo
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );
    }

    if (card.content) {
      return (
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{card.content}</ReactMarkdown>
        </div>
      );
    }

    return <p className="text-muted-foreground">Conteúdo em desenvolvimento...</p>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border p-0">
        {/* Banner */}
        {card.banner && (
          <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
            <img
              src={card.banner}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          </div>
        )}
        
        <div className={cn("px-6", card.banner ? "pt-0 -mt-12 relative z-10" : "pt-6")}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl pr-8">
              {card.title}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </DialogHeader>

          <div className="mt-4">{renderContent()}</div>

          <div className="mt-6 pt-4 pb-6 border-t border-border flex items-center justify-between">
            <Button
              variant={isCompleted ? "outline" : "default"}
              onClick={handleMarkComplete}
              className={cn(
                !isCompleted && "gradient-green text-accent-foreground"
              )}
            >
              {isCompleted ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Concluído
                </>
              ) : (
                "Marcar como concluído"
              )}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
