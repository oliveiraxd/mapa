import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SurveyAnswers {
  stage: string;
  previous_attempt: string;
  preferred_format: string;
  whatsapp?: string;
}

export const useSurvey = () => {
  const { user } = useAuth();
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSurveyStatus = async () => {
      if (!user) {
        if (isMounted) {
          setHasCompletedSurvey(false);
          setLoading(false);
        }
        return;
      }

      // Check localStorage first for instant response
      const localStatus = localStorage.getItem(`survey_completed_${user.id}`);
      if (localStatus === "true") {
        if (isMounted) {
          setHasCompletedSurvey(true);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from("user_surveys")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.warn("Survey check warning (table might not exist yet):", error.message);
          if (isMounted) {
            setHasCompletedSurvey(localStatus === "true");
          }
        } else if (data) {
          localStorage.setItem(`survey_completed_${user.id}`, "true");
          if (isMounted) {
            setHasCompletedSurvey(true);
          }
        } else {
          if (isMounted) {
            setHasCompletedSurvey(false);
          }
        }
      } catch (err) {
        console.error("Error checking survey status:", err);
        if (isMounted) {
          setHasCompletedSurvey(localStatus === "true");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSurveyStatus();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const submitSurvey = async (answers: SurveyAnswers): Promise<boolean> => {
    if (!user) return false;

    // Save locally first for instant UI response
    localStorage.setItem(`survey_completed_${user.id}`, "true");
    setHasCompletedSurvey(true);

    try {
      const { error } = await (supabase as any)
        .from("user_surveys")
        .upsert({
          user_id: user.id,
          stage: answers.stage,
          previous_attempt: answers.previous_attempt,
          preferred_format: answers.preferred_format,
          whatsapp: answers.whatsapp || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.warn("Could not save to Supabase table (saved locally):", error.message);
      }

      // Trigger Make Webhook asynchronously
      triggerMakeWebhook(user, answers);

      return true;
    } catch (err) {
      console.error("Error saving survey:", err);
      return true; // Return true because it saved in localStorage
    }
  };

  const triggerMakeWebhook = async (currentUser: any, answers: SurveyAnswers) => {
    const webhookUrl =
      import.meta.env.VITE_MAKE_WEBHOOK_URL ||
      "https://hook.us1.make.com/REPLACE_WITH_YOUR_WEBHOOK_ID"; // O usuário fornecerá a URL do Make

    if (!webhookUrl || webhookUrl.includes("REPLACE_WITH_YOUR_WEBHOOK_ID")) {
      console.log("Make Webhook URL não configurada. Defina VITE_MAKE_WEBHOOK_URL em .env ou informe a URL.");
      return;
    }

    try {
      let fullName = currentUser.user_metadata?.full_name || "";
      let email = currentUser.email || "";

      if (!fullName || !email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profile) {
          fullName = profile.full_name || fullName;
          email = profile.email || email;
        }
      }

      const cleanPhone = (answers.whatsapp || "").replace(/\D/g, "");
      const formattedPhone = cleanPhone ? (cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`) : "";

      const payload = {
        event: "survey_submitted",
        timestamp: new Date().toISOString(),
        user_id: currentUser.id,
        student_name: fullName || "Aluno Guia",
        student_email: email,
        whatsapp: answers.whatsapp || "",
        whatsapp_link: formattedPhone ? `https://wa.me/${formattedPhone}` : "",
        stage: answers.stage,
        previous_attempt: answers.previous_attempt,
        preferred_format: answers.preferred_format,
        admin_email: "prof.oliveiralc@gmail.com",
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Erro ao disparar Make Webhook:", err);
    }
  };

  return {
    hasCompletedSurvey,
    loading,
    submitSurvey,
  };
};

