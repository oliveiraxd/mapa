import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ChecklistItem {
  item_index: number;
  completed: boolean;
}

interface ChecklistProgressState {
  [cardId: string]: {
    [itemIndex: number]: boolean;
  };
}

export function useChecklistProgress(cardId?: string) {
  const { user } = useAuth();
  const [checklistState, setChecklistState] = useState<ChecklistProgressState>({});
  const [loading, setLoading] = useState(true);

  // Load checklist progress for a specific card or all cards
  const loadProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("user_checklist_progress")
        .select("card_id, item_index, completed")
        .eq("user_id", user.id);

      if (cardId) {
        query = query.eq("card_id", cardId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const newState: ChecklistProgressState = {};
      data?.forEach((item) => {
        if (!newState[item.card_id]) {
          newState[item.card_id] = {};
        }
        newState[item.card_id][item.item_index] = item.completed;
      });

      setChecklistState(newState);
    } catch (error) {
      console.error("Error loading checklist progress:", error);
    } finally {
      setLoading(false);
    }
  }, [user, cardId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Toggle a checklist item with optimistic update
  const toggleChecklistItem = useCallback(
    async (targetCardId: string, itemIndex: number) => {
      if (!user) return;

      const currentValue = checklistState[targetCardId]?.[itemIndex] || false;
      const newValue = !currentValue;

      // Optimistic update
      setChecklistState((prev) => ({
        ...prev,
        [targetCardId]: {
          ...prev[targetCardId],
          [itemIndex]: newValue,
        },
      }));

      try {
        // Check if record exists
        const { data: existing } = await supabase
          .from("user_checklist_progress")
          .select("id")
          .eq("user_id", user.id)
          .eq("card_id", targetCardId)
          .eq("item_index", itemIndex)
          .maybeSingle();

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from("user_checklist_progress")
            .update({ completed: newValue })
            .eq("id", existing.id);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from("user_checklist_progress")
            .insert({
              user_id: user.id,
              card_id: targetCardId,
              item_index: itemIndex,
              completed: newValue,
            });

          if (error) throw error;
        }
      } catch (error) {
        console.error("Error toggling checklist item:", error);
        // Revert on error
        setChecklistState((prev) => ({
          ...prev,
          [targetCardId]: {
            ...prev[targetCardId],
            [itemIndex]: currentValue,
          },
        }));
      }
    },
    [user, checklistState]
  );

  // Get completion stats for a card
  const getCardProgress = useCallback(
    (targetCardId: string, totalItems: number) => {
      const cardState = checklistState[targetCardId] || {};
      const completedCount = Object.values(cardState).filter(Boolean).length;
      return {
        completed: completedCount,
        total: totalItems,
        percentage: totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0,
      };
    },
    [checklistState]
  );

  // Check if specific item is completed
  const isItemCompleted = useCallback(
    (targetCardId: string, itemIndex: number) => {
      return checklistState[targetCardId]?.[itemIndex] || false;
    },
    [checklistState]
  );

  return {
    checklistState,
    loading,
    toggleChecklistItem,
    getCardProgress,
    isItemCompleted,
    refresh: loadProgress,
  };
}
