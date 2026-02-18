import { KanbanColumn as KanbanColumnType } from "@/data/kanbanData";
import { KanbanCard } from "./KanbanCard";
import { useProgress } from "@/hooks/useProgress";

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCardClick: (cardId: string) => void;
  isLocked?: boolean;
}

import { Lock } from "lucide-react";

export function KanbanColumn({ column, onCardClick, isLocked = false }: KanbanColumnProps) {
  const { getCompletionPercentage } = useProgress();
  const cardIds = column.cards.map((card) => card.id);
  const columnProgress = getCompletionPercentage(cardIds);

  return (
    <div className={`flex-shrink-0 w-80 h-full flex flex-col ${isLocked ? "opacity-75 select-none" : ""}`}>
      {/* Column Header - Always visible */}
      <div
        className={`flex-shrink-0 rounded-t-lg p-3 mb-2 transition-colors ${isLocked ? "bg-muted text-muted-foreground" : ""
          }`}
        style={!isLocked ? { backgroundColor: `hsl(var(--${column.color}))` } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLocked ? <Lock className="w-4 h-4" /> : column.icon && <span className="text-lg">{column.icon}</span>}
            <h3 className={`font-display font-semibold text-sm ${isLocked ? "text-muted-foreground" : "text-background"}`}>
              {column.title}
            </h3>
          </div>
          {!isLocked && (
            <span className="text-xs text-background/80 font-medium bg-background/20 px-2 py-0.5 rounded-full">
              {columnProgress}%
            </span>
          )}
        </div>

        {/* Mini progress bar (only if unlocked) */}
        {!isLocked && (
          <div className="mt-2 h-1 bg-background/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-background/60 transition-all duration-300"
              style={{ width: `${columnProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Cards Container - Internal scroll */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1 kanban-column-scroll relative">
        {isLocked && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex flex-col items-center justify-start pt-10 text-center p-4">
            <div className="bg-background rounded-full p-3 shadow-lg mb-3">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Módulo Bloqueado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Conclua o módulo anterior para liberar.
            </p>
          </div>
        )}

        {column.cards.map((card) => (
          <div key={card.id} className={isLocked ? "pointer-events-none filter blur-[2px]" : ""}>
            <KanbanCard
              card={card}
              columnColor={column.color}
              onClick={() => !isLocked && onCardClick(card.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
