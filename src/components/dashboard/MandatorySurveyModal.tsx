import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Gift, ArrowRight, ArrowLeft, Sparkles, Download, FileText, ShieldCheck, Phone } from "lucide-react";
import { useSurvey, SurveyAnswers } from "@/hooks/useSurvey";
import { useToast } from "@/hooks/use-toast";

interface MandatorySurveyModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const MandatorySurveyModal: React.FC<MandatorySurveyModalProps> = ({ isOpen, onComplete }) => {
  const { submitSurvey } = useSurvey();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [answers, setAnswers] = useState<SurveyAnswers>({
    stage: "",
    previous_attempt: "",
    preferred_format: "",
    whatsapp: "",
  });

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const handleSelectOption = (field: keyof SurveyAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1 && !answers.stage) {
      toast({ title: "Selecione uma opção", description: "Escolha a opção que melhor descreve seu momento.", variant: "destructive" });
      return;
    }
    if (step === 2 && !answers.previous_attempt) {
      toast({ title: "Selecione uma opção", description: "Escolha uma opção sobre seu histórico.", variant: "destructive" });
      return;
    }
    if (step === 3 && !answers.preferred_format) {
      toast({ title: "Selecione uma opção", description: "Escolha seu formato preferido de estudo.", variant: "destructive" });
      return;
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await submitSurvey(answers);
    setIsSubmitting(false);

    if (success) {
      setIsCompleted(true);
      toast({
        title: "🎁 Bônus Desbloqueado!",
        description: "Seu Template e Checklist da Banca estão liberados.",
      });
    }
  };

  const handleFinishAndEnter = () => {
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-xl w-[92vw] max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl p-6 sm:p-8 [&>button]:hidden">
        {!isCompleted ? (
          <div>
            {/* Header com indicador de bônus e progresso */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/30 flex items-center gap-1 text-xs font-semibold px-3 py-1">
                <Gift className="w-3.5 h-3.5 animate-bounce" />
                Pesquisa Inicial + Bônus Exclusivo
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Passo {step} de {totalSteps}
              </span>
            </div>

            <Progress value={progressPercent} className="h-2 mb-6 bg-secondary" />

            {/* Passo 1: Fase de Preparação */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    Em qual fase da sua preparação para o Mestrado você se encontra hoje? 🎓
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Isso nos ajuda a personalizar as estratégias do seu guia.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 pt-2">
                  {[
                    { id: "descobrindo", label: "Ainda estou descobrindo como funciona o processo seletivo e definindo meu tema.", icon: "🔍", tag: "Fase Inicial" },
                    { id: "projeto_escrevendo", label: "Já tenho o tema, mas estou travado(a) na escrita do Pré-Projeto de Pesquisa.", icon: "✍️", tag: "Foco no Projeto" },
                    { id: "edital_prova", label: "Meu projeto está adiantado, foco em Edital, Prova Escrita e Entrevista.", icon: "📚", tag: "Fase Avançada" },
                    { id: "urgente_edital", label: "Vou disputar o edital nos próximos 30 a 60 dias e preciso de ajuda com urgência!", icon: "🚀", tag: "Urgente / High Priority" },
                  ].map((option) => {
                    const selected = answers.stage === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption("stage", option.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                          selected
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-border bg-background/50 hover:bg-accent hover:border-accent-foreground/20"
                        }`}
                      >
                        <span className="text-2xl leading-none mt-0.5">{option.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm text-foreground leading-snug">{option.label}</p>
                            <Badge variant="outline" className="text-[10px] shrink-0 font-normal">
                              {option.tag}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Passo 2: Histórico */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    Você já prestou alguma seleção de Mestrado anteriormente? 🏛️
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Queremos entender suas experiências passadas para evitar erros repetidos.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 pt-2">
                  {[
                    { id: "primeira_vez", label: "É a minha primeira vez prestando seleção.", icon: "🌱" },
                    { id: "reprovado_projeto", label: "Já prestei e fui reprovado(a) na fase do Pré-Projeto.", icon: "📄" },
                    { id: "reprovado_prova_entrevista", label: "Já prestei e fui reprovado(a) na Prova ou Entrevista.", icon: "🎤" },
                    { id: "tentativa_anterior", label: "Já tentei mais de uma vez e busco uma metodologia definitiva.", icon: "🎯" },
                  ].map((option) => {
                    const selected = answers.previous_attempt === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption("previous_attempt", option.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3.5 ${
                          selected
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-border bg-background/50 hover:bg-accent hover:border-accent-foreground/20"
                        }`}
                      >
                        <span className="text-2xl leading-none">{option.icon}</span>
                        <p className="font-medium text-sm text-foreground flex-1">{option.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Passo 3: Formato Preferido (Escada de Valor) */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    Qual o formato de acompanhamento que mais atende a você hoje? ⚡
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Entendendo suas preferências para indicar o melhor suporte.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 pt-2">
                  {[
                    {
                      id: "autonomo",
                      title: "Estudo Passo a Passo Autônomo",
                      description: "Gosto de seguir guias e materiais práticos no meu próprio ritmo.",
                      icon: "📘",
                    },
                    {
                      id: "analise_projeto",
                      title: "Revisão e Correção do Pré-Projeto",
                      description: "Preciso que um especialista analise e corrija meu projeto antes de enviar.",
                      icon: "📝",
                    },
                    {
                      id: "mentoria_vip",
                      title: "Mentoria Individual & Acompanhamento Completo",
                      description: "Quero orientação 1 a 1 com acompanhamento passo a passo até a aprovação.",
                      icon: "⭐",
                    },
                  ].map((option) => {
                    const selected = answers.preferred_format === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption("preferred_format", option.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                          selected
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-border bg-background/50 hover:bg-accent hover:border-accent-foreground/20"
                        }`}
                      >
                        <span className="text-2xl leading-none mt-0.5">{option.icon}</span>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{option.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Passo 4: WhatsApp Opcional & Finalização */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    Quase pronto! Onde podemos enviar avisos importantes? 📱
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Informe seu WhatsApp para receber atualizações do edital e materiais extras (Opcional).
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-sm font-medium flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      Seu WhatsApp com DDD
                    </Label>
                    <Input
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={answers.whatsapp}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, whatsapp: e.target.value }))}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Ao clicar em <strong>"Liberar Bônus"</strong>, você receberá acesso imediato ao <strong>Template de Pré-Projeto</strong> e ao <strong>Checklist da Banca</strong>.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botoes de Navegação */}
            <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t border-border">
              {step > 1 ? (
                <Button variant="ghost" size="sm" onClick={() => setStep((prev) => prev - 1)} className="gap-1.5 text-xs">
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </Button>
              ) : (
                <div />
              )}

              <Button onClick={handleNextStep} disabled={isSubmitting} className="gap-2 text-sm font-semibold px-6 ml-auto">
                {isSubmitting ? (
                  "Salvando..."
                ) : step === totalSteps ? (
                  <>
                    Liberar Bônus <Sparkles className="w-4 h-4 text-amber-300" />
                  </>
                ) : (
                  <>
                    Próximo <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Tela de Conclusão e Entrega da Isca */
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-400">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 mb-2">
                🎉 Pesquisa Concluída com Sucesso!
              </Badge>
              <h2 className="text-2xl font-extrabold text-foreground">Seu Bônus Exclusivo Foi Liberado!</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Obrigado por responder! Separamos estes materiais essenciais para você começar com o pé direito:
              </p>
            </div>

            {/* Cards com os Bônus (Isca) */}
            <div className="grid gap-3 text-left max-w-md mx-auto">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Template Editável de Pré-Projeto</h4>
                    <p className="text-xs text-muted-foreground">Estrutura formatada ABNT pronta para preencher.</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="shrink-0 gap-1 text-xs" onClick={() => window.open("https://docs.google.com", "_blank")}>
                  <Download className="w-3.5 h-3.5" /> Baixar
                </Button>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Checklist Secreto da Banca</h4>
                    <p className="text-xs text-muted-foreground">Os 10 pontos que a banca avalia antes da aprovação.</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="shrink-0 gap-1 text-xs" onClick={() => window.open("https://docs.google.com", "_blank")}>
                  <Download className="w-3.5 h-3.5" /> Baixar
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button onClick={handleFinishAndEnter} size="lg" className="w-full max-w-md font-bold gap-2 text-base shadow-lg bg-primary hover:bg-primary/90">
                Acessar Meu Guia Completo <Sparkles className="w-5 h-5 text-amber-300" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
