import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProgressContextType {
  progress: Record<string, boolean>;
  loading: boolean;
  toggleProgress: (cardId: string) => Promise<void>;
  getCompletionPercentage: (cardIds: string[]) => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id;

    if (!userId) {
      setProgress({});
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("card_id, completed")
        .eq("user_id", userId);

      if (!error && data) {
        const progressMap = data.reduce((acc, item) => {
          acc[item.card_id] = item.completed ?? false;
          return acc;
        }, {} as Record<string, boolean>);
        setProgress(progressMap);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user?.id]);

  const toggleProgress = async (cardId: string) => {
    const userId = user?.id;
    if (!userId) return;

    const currentValue = progress[cardId] || false;
    const newValue = !currentValue;

    // Optimistic update
    setProgress((prev) => ({ ...prev, [cardId]: newValue }));

    const { error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: userId,
          card_id: cardId,
          completed: newValue,
          completed_at: newValue ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,card_id" }
      );

    if (error) {
      // Revert on error
      setProgress((prev) => ({ ...prev, [cardId]: currentValue }));
      console.error("Error toggling progress:", error);
    }
  };

  const getCompletionPercentage = (cardIds: string[]) => {
    if (cardIds.length === 0) return 0;
    const completed = cardIds.filter((id) => progress[id]).length;
    return Math.round((completed / cardIds.length) * 100);
  };

  return (
    <ProgressContext.Provider value={{ progress, loading, toggleProgress, getCompletionPercentage }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgressContext must be used within a ProgressProvider");
  }
  return context;
}
