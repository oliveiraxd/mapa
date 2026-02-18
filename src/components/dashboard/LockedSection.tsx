import { Lock, Sparkles, Star, Users, FileCheck, Calendar, Bot, Rocket, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const lockedFeatures = [
  {
    icon: Bot,
    title: "Acesso aos 4 Robôs de Aprovação",
    description: "IAs especialistas em Projeto, Lattes, Prova e Entrevista",
  },
  {
    icon: FileText,
    title: "Leitura de Projeto Personalizada",
    description: "Análise completa do seu projeto por especialistas",
  },
  {
    icon: Star,
    title: "Banco de Templates Aprovados",
    description: "Modelos reais de quem passou na USP, UFRJ e UFMG",
  },
  {
    icon: Rocket,
    title: "Método Passo a Passo",
    description: "Plano prático do zero à aprovação",
  },
  {
    icon: MessageCircle,
    title: "Suporte Tira-Dúvidas",
    description: "Orientação direta na plataforma",
  },
];

export function LockedSection() {
  return (
    <div className="flex-shrink-0 w-96 h-full flex flex-col">
      {/* Column Header - Matching Kanban style */}
      <div className="flex-shrink-0 rounded-t-lg p-3 mb-2 bg-gradient-to-r from-primary/80 to-primary">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-background" />
          <h3 className="font-display font-semibold text-sm text-background">
            Recursos Avançados
          </h3>
        </div>
        <p className="text-xs text-background/70 mt-1">
          Exclusivo do Método Passo a Passo
        </p>
      </div>

      {/* Content - Internal scroll */}
      <div className="flex-1 overflow-y-auto kanban-column-scroll pr-1">
        <div className="bg-gradient-to-br from-card to-secondary/50 rounded-xl p-4 border border-border relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />

          <div className="relative z-10 space-y-3">
            {/* Features List */}
            {lockedFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-background/50 rounded-lg p-3 border border-border/50 relative group"
              >
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-start gap-3">
                  <feature.icon className="w-6 h-6 text-primary/50 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm text-foreground/70">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="pt-2">
              <Button
                size="sm"
                className="w-full gradient-gold text-primary-foreground font-semibold glow-gold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Conhecer o Mestrado Passo a Passo
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Acesso a todos os recursos premium
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}