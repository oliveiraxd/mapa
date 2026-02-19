import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useCardNotes(cardId: string) {
    const { user } = useAuth();
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null); // New state

    // Load note from Supabase
    const loadNote = useCallback(async () => {
        if (!user) {
            console.log("useCardNotes: No user found during load");
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("user_card_notes")
                .select("content, updated_at")
                .eq("user_id", user.id)
                .eq("card_id", cardId)
                .maybeSingle();

            if (error) {
                console.error("Error loading note:", error);
                return;
            }

            if (data) {
                setNote(data.content || "");
                if (data.updated_at) {
                    setLastSaved(new Date(data.updated_at));
                }
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

    // Debounce save
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveNote = (newNote: string) => {
        setNote(newNote); // Optimistic update
        setSaving(true);
        setSaveError(null);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (!user) {
                console.error("useCardNotes: Attempted to save but user is null");
                setSaveError("Usuário não autenticado");
                setSaving(false);
                return;
            }

            console.log("Saving note for user:", user.id, "card:", cardId);

            try {
                const now = new Date();
                const { error } = await supabase
                    .from("user_card_notes")
                    .upsert(
                        {
                            user_id: user.id,
                            card_id: cardId,
                            content: newNote,
                            updated_at: now.toISOString(),
                        },
                        { onConflict: "user_id,card_id" }
                    );

                if (error) {
                    console.error("Supabase Error saving note:", error);
                    setSaveError(error.message);
                    setSaving(false);
                } else {
                    console.log("Note saved successfully to Supabase!");
                    setLastSaved(now);
                    setSaving(false);
                }
            } catch (error: any) {
                console.error("Catch Error saving note:", error);
                setSaveError(error.message || "Erro desconhecido");
                setSaving(false);
            }
        }, 1000);
    };

    return { note, saveNote, loading, saving, lastSaved, saveError };
}
