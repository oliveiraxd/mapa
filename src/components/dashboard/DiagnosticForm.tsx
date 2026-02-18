import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DiagnosticFormProps {
  onComplete: () => void;
}

type Level = "fraco" | "medio" | "forte";

interface Criterion {
  id: string;
  name: string;
  options: { value: Level; label: string }[];
}

const CRITERIA: Criterion[] = [
  {
    id: "formacao",
    name: "Formação Acadêmica",
    options: [
      { value: "fraco", label: "Ainda não finalizei a graduação" },
      { value: "medio", label: "Tenho formação, mas sem vínculo com o tema do mestrado" },
      { value: "forte", label: "Tenho formação sólida e coerente com a área" },
    ],
  },
  {
    id: "experiencias",
    name: "Experiências Profissionais",
    options: [
      { value: "fraco", label: "Nunca atuei na área" },
      { value: "medio", label: "Tenho experiência, mas sem relação clara com pesquisa" },
      { value: "forte", label: "Tenho experiências diretamente ligadas ao tema" },
    ],
  },
  {
    id: "producao",
    name: "Produção Científica",
    options: [
      { value: "fraco", label: "Não tenho nenhuma publicação" },
      { value: "medio", label: "Tenho resumos ou trabalhos em eventos" },
      { value: "forte", label: "Tenho artigos publicados em periódicos" },
    ],
  },
  {
    id: "pesquisa",
    name: "Experiência em Pesquisa",
    options: [
      { value: "fraco", label: "Nunca participei de projeto de pesquisa" },
      { value: "medio", label: "Participei de IC ou grupo de pesquisa" },
      { value: "forte", label: "Tenho IC com resultados publicados" },
    ],
  },
  {
    id: "docencia",
    name: "Experiência Docente",
    options: [
      { value: "fraco", label: "Não tenho experiência em ensino" },
      { value: "medio", label: "Fui monitor ou tutor em alguma disciplina" },
      { value: "forte", label: "Tenho experiência sólida em docência" },
    ],
  },
  {
    id: "idiomas",
    name: "Idiomas e Qualificações",
    options: [
      { value: "fraco", label: "Não domino outro idioma" },
      { value: "medio", label: "Tenho nível intermediário em inglês" },
      { value: "forte", label: "Tenho certificação de proficiência" },
    ],
  },
];

const NEXT_STEPS = [
  { id: "lacunas", label: "Identifiquei minhas maiores lacunas" },
  { id: "prioridades", label: "Escolhi 3 prioridades para melhorar" },
  { id: "pronto", label: "Estou pronto(a) para o Construtor" },
];

export function DiagnosticForm({ onComplete }: DiagnosticFormProps) {
  const { user } = useAuth();
  const [responses, setResponses] = useState<Record<string, Level>>({});
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDiagnostic = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("diagnostic_responses")
        .select("responses, next_steps")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setResponses((data.responses as Record<string, Level>) || {});
        setNextSteps((data.next_steps as string[]) || []);
      }
      setLoading(false);
    };

    loadDiagnostic();
  }, [user?.id]);

  const handleResponseChange = (criterionId: string, value: Level) => {
    setResponses((prev) => ({ ...prev, [criterionId]: value }));
  };

  const handleNextStepToggle = (stepId: string) => {
    setNextSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  const calculateScore = () => {
    return Object.values(responses).filter((v) => v === "forte").length;
  };

  const getScoreInfo = () => {
    const score = calculateScore();
    if (score <= 2) {
      return {
        color: "bg-red-500/20 border-red-500/50 text-red-400",
        icon: AlertCircle,
        title: "Currículo Fraco",
        description: "Precisa de fortalecimento significativo",
      };
    }
    if (score <= 4) {
      return {
        color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
        icon: AlertTriangle,
        title: "Currículo Médio",
        description: "Há boas bases, mas precisa evoluir",
      };
    }
    return {
      color: "bg-green-500/20 border-green-500/50 text-green-400",
      icon: CheckCircle2,
      title: "Currículo Forte",
      description: "Você está bem posicionado!",
    };
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("Você precisa estar logado para salvar");
      return;
    }

    setSaving(true);
    const score = calculateScore();

    const { error } = await supabase
      .from("diagnostic_responses")
      .upsert(
        {
          user_id: user.id,
          responses,
          next_steps: nextSteps,
          score,
        },
        { onConflict: "user_id" }
      );

    if (error) {
      toast.error("Erro ao salvar diagnóstico");
      console.error(error);
    } else {
      toast.success("Diagnóstico salvo com sucesso!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const score = calculateScore();
  const scoreInfo = getScoreInfo();
  const ScoreIcon = scoreInfo.icon;
  const allAnswered = Object.keys(responses).length === CRITERIA.length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Avalie honestamente sua situação atual em cada critério. Isso ajudará a
        identificar onde focar seus esforços.
      </p>

      {/* Criteria */}
      <div className="space-y-6">
        {CRITERIA.map((criterion) => (
          <div
            key={criterion.id}
            className="rounded-lg border border-border bg-background/50 p-4"
          >
            <h4 className="font-medium text-foreground mb-3">
              {criterion.name}
            </h4>
            <RadioGroup
              value={responses[criterion.id] || ""}
              onValueChange={(value) =>
                handleResponseChange(criterion.id, value as Level)
              }
              className="space-y-2"
            >
              {criterion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`${criterion.id}-${option.value}`}
                    className={cn(
                      option.value === "forte" && "border-green-500 text-green-500",
                      option.value === "medio" && "border-yellow-500 text-yellow-500",
                      option.value === "fraco" && "border-red-500 text-red-500"
                    )}
                  />
                  <Label
                    htmlFor={`${criterion.id}-${option.value}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      {/* Score Result */}
      {allAnswered && (
        <div
          className={cn(
            "rounded-lg border-2 p-4 flex items-center gap-4",
            scoreInfo.color
          )}
        >
          <ScoreIcon className="w-10 h-10 flex-shrink-0" />
          <div>
            <p className="font-semibold text-lg">
              Resultado: {score}/6 Forte
            </p>
            <p className="font-medium">{scoreInfo.title}</p>
            <p className="text-sm opacity-80">{scoreInfo.description}</p>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="rounded-lg border border-border bg-background/50 p-4">
        <h4 className="font-medium text-foreground mb-3">Próximos Passos</h4>
        <div className="space-y-3">
          {NEXT_STEPS.map((step) => (
            <div key={step.id} className="flex items-center space-x-3">
              <Checkbox
                id={step.id}
                checked={nextSteps.includes(step.id)}
                onCheckedChange={() => handleNextStepToggle(step.id)}
              />
              <Label
                htmlFor={step.id}
                className={cn(
                  "text-sm cursor-pointer",
                  nextSteps.includes(step.id)
                    ? "text-green-400 line-through"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 gradient-gold text-primary-foreground"
        >
          {saving ? "Salvando..." : "Salvar Diagnóstico"}
        </Button>
        <Button
          onClick={onComplete}
          variant="outline"
          className="flex-1"
          disabled={!allAnswered}
        >
          <Check className="w-4 h-4 mr-2" />
          Concluir
        </Button>
      </div>
    </div>
  );
}
