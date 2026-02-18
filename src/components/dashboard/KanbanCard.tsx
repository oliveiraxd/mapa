import { KanbanCard as KanbanCardType } from "@/data/kanbanData";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import {
  PlayCircle,
  FileText,
  CheckSquare,
  FormInput,
  ExternalLink,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KanbanCardProps {
  card: KanbanCardType;
  columnColor: string;
  onClick: () => void;
}

const typeIcons = {
  video: PlayCircle,
  text: FileText,
  checklist: CheckSquare,
  form: FormInput,
  link: ExternalLink,
};

const tagColors = {
  purple: "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30",
  pink: "bg-pink-500/20 text-pink-200 hover:bg-pink-500/30",
  red: "bg-red-500/20 text-red-200 hover:bg-red-500/30",
  yellow: "bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30",
  blue: "bg-blue-500/20 text-blue-200 hover:bg-blue-500/30",
  gray: "bg-gray-500/20 text-gray-200 hover:bg-gray-500/30",
  green: "bg-green-500/20 text-green-200 hover:bg-green-500/30",
  orange: "bg-orange-500/20 text-orange-200 hover:bg-orange-500/30",
  brown: "bg-amber-800/20 text-amber-200 hover:bg-amber-800/30",
} as const;

export function KanbanCard({ card, onClick }: KanbanCardProps) {
  const { progress } = useProgress();
  const isCompleted = progress[card.id] || false;
  const Icon = typeIcons[card.type];

  // If card has external URL (type link), we might want to open it directly or show details
  // The requirements say "side panel", so we will just trigger onClick for all.

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200",
        "bg-card border border-border/50 hover:bg-accent/5",
        "hover:shadow-md",
        isCompleted && "opacity-75"
      )}
    >
      {/* Header: Icon + Title */}
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
        <h4 className={cn(
          "font-medium text-sm text-foreground leading-snug",
          isCompleted && "line-through text-muted-foreground"
        )}>
          {card.title}
        </h4>
      </div>

      {/* Checkbox for quick completion status (visual only, or functional?) */}
      {/* Keeping it simple as per Notion style, usually just tags are visible */}

      <div className="flex flex-wrap gap-1.5 mt-2">
        {/* Status Badge */}
        <Badge
          variant="secondary"
          className={cn(
            "h-5 px-1.5 text-[10px] font-bold rounded-sm border-0",
            isCompleted
              ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          )}
        >
          {isCompleted ? "Concluído" : "A Fazer"}
        </Badge>


      </div>

      {/* Completion Indicator (Subtle) */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      )}
    </div>
  );
}
