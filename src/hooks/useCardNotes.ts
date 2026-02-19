import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useCardNotes(cardId: string) {
    const { user } = useAuth();
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    // Load note from Supabase
    const loadNote = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("user_card_notes")
                .select("content")
                .eq("user_id", user.id)
                .eq("card_id", cardId)
                .maybeSingle();

            if (error) {
                console.error("Error loading note:", error);
                return;
            }

            if (data) {
                setNote(data.content || "");
            }
        } catch (error) {
            console.error("Error loading note:", error);
        } finally {
            setLoading(false);
        }
    }, [user, cardId]);

    useEffect(() => {
        loadNote();
    }, [loadNote]);

    // Save note to Supabase (debounced ideally, but here direct for simplicity first)
    const saveNote = async (newNote: string) => {
        setNote(newNote); // Optimistic update

        if (!user) return;

        try {
            const { error } = await supabase
                .from("user_card_notes")
                .upsert(
                    {
                        user_id: user.id,
                        card_id: cardId,
                        content: newNote,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id,card_id" }
                );

            if (error) {
                console.error("Error saving note:", error);
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    return { note, saveNote, loading };
}
