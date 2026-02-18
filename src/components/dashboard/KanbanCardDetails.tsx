import { useState, useRef, useEffect } from "react";
import { KanbanCard } from "@/data/kanbanData";
import { useProgress } from "@/hooks/useProgress";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, Calendar, User, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DiagnosticForm } from "./DiagnosticForm";

interface KanbanCardDetailsProps {
    card: KanbanCard;
    onClose: () => void;
}

export function KanbanCardDetails({ card, onClose }: KanbanCardDetailsProps) {
    const { progress, toggleProgress } = useProgress();
    const { isItemCompleted, toggleChecklistItem, getCardProgress } = useChecklistProgress();

    const [hasRead, setHasRead] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const isCompleted = progress[card.id] || false;

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            // Check if user is near bottom (within 50px)
            if (scrollHeight - scrollTop - clientHeight < 50) {
                setHasRead(true);
            }
        }
    };

    useEffect(() => {
        // Reset read state when card changes
        setHasRead(false);

        // If content is short enough to not scroll, mark as read immediately
        if (contentRef.current) {
            const { scrollHeight, clientHeight } = contentRef.current;
            if (scrollHeight <= clientHeight + 50) {
                setHasRead(true);
            }
        }
    }, [card]);

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
    const renderChecklist = (items: string[], offset: number = 0) => {
        // Calculate local progress for this section specifically
        // We filter the global state to count only items in this section's range
        const cardState = isItemCompleted(card.id, -1) ? {} : {}; // trigger dependency? No, need direct access
        // We can't access checklistState directly here easily without exposing it from hook or refactoring hook.
        // But the hook exposes `checklistState`.
        // Let's iterate items to count completed based on isItemCompleted
        let completedInThisSection = 0;
        items.forEach((_, idx) => {
            if (isItemCompleted(card.id, idx + offset)) {
                completedInThisSection++;
            }
        });

        // Use local progress for the bar
        const progress = {
            completed: completedInThisSection,
            total: items.length,
            percentage: items.length > 0 ? Math.round((completedInThisSection / items.length) * 100) : 0
        };

        return (
            <div className="space-y-4 my-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                {progress.total > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                        <span>{progress.completed}/{progress.total}</span>
                    </div>
                )}
                <div className="space-y-6">
                    {items.map((line, idx) => {
                        const text = line.replace(/- \[[ x]\] /, "").trim();
                        const globalIdx = idx + offset;
                        const isChecked = isItemCompleted(card.id, globalIdx);

                        return (
                            <div key={idx} className="flex items-start gap-3 group">
                                <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => toggleChecklistItem(card.id, globalIdx)}
                                    className="mt-0.5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                                <span className={cn(
                                    "text-sm transition-colors",
                                    isChecked ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"
                                )}>
                                    <span className="inline"><ReactMarkdown components={{ p: "span" }}>{text}</ReactMarkdown></span>
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

            let currentChecklistIndex = 0;

            return (
                <div className="space-y-6">
                    {sections.map((section, idx) => {
                        if (section.type === "checklist" && section.items) {
                            const offset = currentChecklistIndex;
                            currentChecklistIndex += section.items.length;
                            return <div key={idx}>{renderChecklist(section.items, offset)}</div>;
                        }
                        return (
                            <div key={idx} className="prose prose-invert max-w-none text-foreground/90">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (card.type === "link" && card.externalUrl) {
            return (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                    <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-6">
                        Este conteúdo é externo
                    </p>
                    <Button
                        onClick={() => window.open(card.externalUrl, "_blank")}
                        className="gradient-gold text-primary-foreground font-semibold"
                    >
                        Abrir Link
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            );
        }

        if (card.content) {
            return (
                <div className="prose prose-invert max-w-none text-foreground/90">
                    <ReactMarkdown>{card.content}</ReactMarkdown>
                </div>
            );
        }

        return <p className="text-muted-foreground italic">Sem conteúdo adicional.</p>;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Cover Image (reduced height) */}
            {card.banner && (
                <div className="h-24 w-full -mx-6 -mt-6 mb-4 overflow-hidden relative group shrink-0">
                    <img
                        src={card.banner}
                        alt="Cover"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>
            )}

            {/* Header - Very Compact */}
            <div className="space-y-3 mb-4 shrink-0">
                <h2 className="text-lg font-display font-bold text-foreground leading-tight">
                    {card.title}
                </h2>

                {/* Compact Properties Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">

                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <Badge variant={isCompleted ? "default" : "outline"} className={cn(
                            "h-4 px-1.5 text-[9px] font-normal",
                            isCompleted ? "bg-green-500 hover:bg-green-600" : "text-muted-foreground border-border"
                        )}>
                            {isCompleted ? "Concluído" : "A Fazer"}
                        </Badge>
                    </div>



                    {/* Tags */}
                    {card.tags && card.tags.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <div className="flex flex-wrap gap-1">
                                {card.tags.map(tag => (
                                    <span key={tag.label} className="px-1 py-0 rounded bg-muted text-muted-foreground text-[10px]">
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assignee */}
                    <div className="flex items-center gap-1.5 ml-auto">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] text-primary font-bold">
                            EU
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border/50 w-full mb-4 shrink-0" />

            {/* Main Content */}
            <div
                ref={contentRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
            >
                <div className="prose prose-invert prose-lg max-w-none text-foreground leading-loose
                    prose-headings:font-bold prose-headings:text-primary prose-headings:mb-6 prose-headings:mt-10
                    prose-p:leading-loose prose-p:mb-8
                    prose-li:my-4 prose-li:leading-loose
                    prose-hr:my-10 prose-hr:border-border
                    prose-strong:text-foreground prose-strong:font-bold">
                    {renderContent()}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 mt-4 border-t border-border flex justify-end gap-3">
                {!isCompleted && (
                    <Button
                        onClick={handleMarkComplete}
                        disabled={card.id === "inst-1" && !hasRead}
                        className={cn(
                            "font-semibold transition-all",
                            card.id === "inst-1" && !hasRead
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "gradient-green text-white"
                        )}
                    >
                        {card.id === "inst-1" && !hasRead ? (
                            "Leia até o final para concluir"
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Marcar como Concluído
                            </>
                        )}
                    </Button>
                )}
                {isCompleted && (
                    <Button
                        variant="outline"
                        onClick={handleMarkComplete}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Reabrir Item
                    </Button>
                )}
            </div>
        </div>
    );
}
