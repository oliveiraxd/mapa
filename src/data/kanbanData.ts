import bannerInstrucoes from "@/assets/banner_instrucoes.png";
import comeceAquiImg from "@/assets/semaforo_comece_aqui.png";
import formacaoAcademicaImg from "@/assets/formacao-academica.png";

export interface KanbanTag {
  label: string;
  color: "purple" | "pink" | "red" | "yellow" | "blue" | "gray" | "green" | "orange" | "brown";
}

export type Priority = "Baixa" | "Média" | "Alta" | "Urgente";

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  type: "video" | "text" | "checklist" | "form" | "link";
  content?: string;
  externalUrl?: string;
  thumbnail?: string;
  banner?: string;
  tags?: KanbanTag[];
  priority?: Priority;
  assignee?: string;
  dueDate?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  icon?: string;
  cards: KanbanCard[];
}

// Placeholder images temáticas para cada seção
const PLACEHOLDERS = {
  instructions: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=225&fit=crop",
  diagnostic: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
  builder: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=225&fit=crop",
  evidence: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=225&fit=crop",
  plan: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=225&fit=crop",
  phrases: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=225&fit=crop",
  bonus: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=225&fit=crop",
};

export const kanbanColumns: KanbanColumn[] = [
  {
    id: "instructions",
    title: "Como usar o Mapa da Aprovação",
    color: "kanban-instructions",
    icon: "🧭",
    cards: [
      {
        id: "inst-1",
        title: "Instruções de uso",
        description: "Veja como aproveitar ao máximo a plataforma",
        type: "text",
        thumbnail: comeceAquiImg,
        banner: comeceAquiImg,
        tags: [{ label: "Leitura Obrigatória", color: "blue" }],
        priority: "Alta",
        content: `# **🗺️ O Mapa Tático da Aprovação**

---

A maioria dos candidatos comete um erro fatal: acredita na ilusão de que "basta estudar pelo edital para passar". É por isso que excelentes profissionais reprovam todos os anos.

---

Para se tornar um candidato notável desde o primeiro contato, você precisa de estratégia. Este quadro é o seu mapa tático. Ele traz o meu Plano Inteligente de Aprovação, destilado apenas naquilo que você precisa executar, sem enrolação teórica.

---

Siga as regras abaixo para maximizar suas chances:

## **Regra 1:** Respeite a Ordem Cronológica
Não pule etapas. A escolha do orientador, por exemplo, define 50% da sua aprovação. Se o orientador não tem vaga, não orienta seu perfil ou não se alinha com você, você já perdeu antes mesmo da prova começar. Avance card a card, coluna por coluna.

---

## **Regra 2:** Ação e Conclusão
Cada cartão deste quadro é uma tarefa prática. Abra o cartão, leia a instrução, execute a ação e, ao finalizar, clique em **"Marcar como Concluído"**.

---

## O que você vai executar aqui:

🎯 **Fase 1 — Escolha do PPG:** Como identificar o orientador ideal avaliando afinidade acadêmica, disponibilidade e histórico.

---

🔍 **Fase 2 — Diagnóstico:** Como mapear sua situação real e criar o alinhamento perfeito.

---

⚔️ **Fase 3 — Estratégia Central:** O passo a passo integrado para dominar seu Projeto, Prova Escrita e Entrevista.

---

⏳ **Fase 4 — Rotina Mínima:** Como manter a constância e adaptar os estudos à sua realidade, mesmo que você trabalhe o dia todo.

---

**O poder agora inverteu:** você não vai implorar por uma vaga, você vai se posicionar para ser escolhido.

👉 **Leia até o final e clique no botão abaixo para liberar o acesso: "Marcar como Concluído".**`,
      },
    ],
  },
  {
    id: "diagnostic",
    title: "Escolha do Programa de Pós-graduação",
    color: "kanban-diagnostic",
    icon: "🎯",
    cards: [
      {
        id: "ppg-concept",
        title: "1. Primeiros Passos",
        description: "O que é, por que fazer e resultado esperado",
        type: "text",
        thumbnail: PLACEHOLDERS.diagnostic,
        banner: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=300&fit=crop",
        tags: [{ label: "Conceito", color: "purple" }],
        priority: "Alta",
        content: `
## **🎯 O que fazer:**
Alinhar seus objetivos profissionais, interesses particulares e o programa de pós-graduação certo para potencializar sua carreira.

## **💡 Por que fazer:**
Escolher o programa errado significa desperdiçar tempo, dinheiro e energia em uma seleção que não vai te levar aonde você quer. 

A escolha certa aumenta suas chances de aprovação e garante que o mestrado realmente vai impactar sua carreira.

## **🏆 Resultados esperados:**
Programa de pós-graduação escolhido de forma **estratégica**, alinhado aos seus objetivos profissionais e com alta compatibilidade com seu perfil e rotina.`,
      },
      {
        id: "ppg-tasks",
        title: "2. Tarefas",
        description: "Passo a passo para definir seu programa",
        type: "checklist",
        thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=300&fit=crop",
        tags: [],
        priority: "Urgente",
        content: `# 📝 Tarefas

Siga estes passos para garantir a melhor decisão:

- [ ] Definir objetivos profissionais
  *Onde você quer chegar com esse mestrado?*

- [ ] Identificar áreas de interesse
  *Quais temas você ama estudar?*

- [ ] Mapear programas compatíveis com o seu perfil
  *Liste PPGs que ofertam o que você busca.*

- [ ] Analisar viabilidade de cursar
  *Horários, custos, deslocamento, bolsas.*

- [ ] Analisar possíveis orientadores
  *Pesquise o corpo docente das linhas de interesse.*

- [ ] Entrevistar estudantes e ex-alunos dos programas
  *Descubra a realidade "não dita" do curso.*`,
      },
      {
        id: "ppg-advisor",
        title: "🎯 BÔNUS: Escolha do Orientador",
        description: "Cuidado crítico na escolha",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=300&fit=crop",
        tags: [{ label: "Alerta", color: "red" }],
        priority: "Urgente",
        content: `Escolher o orientador errado vai afundar sua aprovação antes mesmo de o edital sair. Para mapear o terreno com segurança, execute estas três tarefas agora:

---

- [ ] 🔬 **Raio-X do Lattes:** Não olhe apenas os artigos. Olhe o que ele está orientando hoje. A linha de pesquisa atual dele tem conexão real com a sua bagagem?

- [ ] 🕵️ **Investigação de Bastidores:** Converse com os orientandos atuais. Eles são a melhor (e única) fonte sem filtros. Descubra o estilo de orientação e se há vagas reais surgindo.

- [ ] 🧩 **Mapeamento de Afinidade:** Avalie o histórico dele. Ele costuma aceitar perfis com a sua formação? Ele prefere alunos que já têm experiência prévia?

---

## **⚠️ O ALERTA:**

Fazer essa análise é o básico. O problema é o que você faz depois dela.

---

A grande maioria dos candidatos pega essas informações e manda um e-mail genérico, implorando por uma vaga ou pedindo para o professor ler um pré-projeto do zero. Isso é comportamento de amador.

---

No nosso clube, nós não pedimos favores. Nós nos posicionamos como Candidatos Notáveis.

---

Um Notável entende que a verdadeira aprovação acontece antes do jogo oficial começar. Em vez de torcer para ser aceito, ele gera uma inversão de poder.

---

Se você quer dominar essa etapa e se diferenciar da multidão, conheça as estratégias que criam desejo no orientador, fazendo ele te convidar, e não o contrário.

---

Acesse os bastidores de como mapear pontos de conexão precisos, redigir um contato profissional irrecusável e fazer o follow-up inteligente sem parecer desesperado.

[🔗 CLIQUE AQUI E ACESSE A ESTRATÉGIA DE COMUNICAÇÃO DO CANDIDATO NOTÁVEL](#)`,
      },
    ],
  },
  {
    id: "builder",
    title: "Diagnóstico",
    color: "kanban-builder",
    icon: "🧱",
    cards: [
      {
        id: "diag-step1",
        title: "1. Primeiros Passos",
        description: "Entenda seu ponto de partida",
        type: "text",
        thumbnail: formacaoAcademicaImg,
        banner: formacaoAcademicaImg,
        tags: [],
        priority: "Alta",
        content: `
## **🎯 O que fazer:**
Avaliar honestamente seu nível atual de preparação e identificar gaps que precisam ser preenchidos antes da seleção.

## **💡 Por que fazer:**
A maioria dos candidatos falha porque superestima sua preparação ou subestima as exigências do processo seletivo. O diagnóstico evita surpresas desagradáveis e permite criar um plano de ação focado nas suas reais necessidades.

## **🏆 Resultados esperados:**
Diagnóstico honesto da sua situação atual + plano de ação realista focado nos desafios que realmente impedem sua aprovação.`,
      },
      {
        id: "diag-tasks",
        title: "2. Tarefas",
        description: "Checklist de auditoria curricular",
        type: "checklist",
        thumbnail: PLACEHOLDERS.builder,
        banner: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=300&fit=crop",
        tags: [],
        priority: "Média",
        content: `# 📝 Tarefas

Para ter um diagnóstico preciso, você precisa reunir as provas materiais da sua trajetória:

- [ ] Avaliar seu nível de conhecimento sobre o processo seletivo

- [ ] Analisar seu currículo Lattes

- [ ] Identificar suas forças e fraquezas

- [ ] Definir metas realistas de preparação`,
      },
      {
        id: "diag-bonus",
        title: "🎯 Bônus: Currículo Turbinado",
        description: "Como pontuar sem ter artigos",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1532153955177-f59af40d6472?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1532153955177-f59af40d6472?w=800&h=300&fit=crop",
        tags: [],
        priority: "Alta",
        content: `A maioria dos candidatos foge do diagnóstico com medo de descobrir que o currículo está fraco. Mas o candidato estratégico usa essa etapa para mapear exatamente as armas que tem nas mãos antes de encarar o edital de frente.

Para saber o seu real ponto de partida, execute estas três tarefas agora:

- [ ] 📊 **Auditoria Fria do Lattes:** Levante absolutamente tudo o que você já fez. Suas experiências profissionais contam muito se forem bem direcionadas, não apenas o seu histórico acadêmico.

- [ ] 🕳️ **Mapeamento de Lacunas:** Olhe para o barema (tabela de pontuação) do último edital e identifique friamente onde você perderia pontos hoje.

- [ ] 🎯 **A Conexão de Ouro:** Cruze a sua maior experiência (sua força principal) com a linha de pesquisa que você escolheu. Qual é a ponte que liga a sua história ao que o programa busca?

---

## ⚠️ O ALERTA:

Fazer esse raio-x é apenas o começo. O problema é a armadilha que vem logo depois.

---

A grande maioria dos candidatos olha para o próprio diagnóstico e entra em desespero por não ter artigos publicados. Eles acreditam na velha lenda de que precisam de anos em um laboratório coletando dados para conseguir uma publicação de peso. Isso é crença de amador.

---

No nosso clube, nós não aceitamos um Lattes em branco, nem perdemos meses escrevendo do zero. Um Candidato Notável joga o jogo da produtividade acadêmica inteligente.

---

Se você quer parar de perder no currículo e se diferenciar da multidão, conheça os bastidores para transformar a sua trajetória em um ímã de pontuação.

---

Você vai descobrir o método exato para publicar artigos científicos sem precisar de um único dado experimental, publicando de forma 100% gratuita, e utilizando o poder de uma Inteligência Artificial validada que acelera absurdamente a sua escrita enquanto blinda o seu texto contra qualquer risco de plágio.

[🔗 CLIQUE AQUI E ACESSE A ESTRATÉGIA DO CURRÍCULO TURBINADO](#)`,
      },
    ],
  },
  {
    id: "evidence",
    title: "Estratégia central",
    color: "kanban-evidence",
    icon: "📁",
    cards: [
      {
        id: "central-1",
        title: "1. Primeiros Passos",
        description: "Estrutura para seus arquivos",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=800&h=300&fit=crop",
        tags: [{ label: "Organização", color: "yellow" }],
        priority: "Baixa",
        content: `Aqui, dependendo do seu edital, você vai construir os pilares da sua aprovação: Projeto de Pesquisa, Prova Escrita, Entrevista e Currículo Lattes.

---

🛑 **Filtro de Ouro:** A partir daqui, sua rota é personalizada: acesse apenas os módulos que estão no seu edital. Mapeie seu edital: se ele pede Projeto + Currículo, vá direto para esses cards.`,
      },
      {
        id: "central-2",
        title: "Currículo",
        description: "Transformar Lattes em ferramenta de aprovação",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=300&fit=crop",
        tags: [{ label: "Estratégia", color: "purple" }],
        priority: "Alta",
        content: `## **🛠️ O que fazer**
Transformar o Currículo Lattes em uma ferramenta estratégica de aprovação

---

## **🧠 Porque fazer**
O Lattes é uma etapa classificatória que pode eliminar ou aprovar candidatos

- A banca não avalia apenas quantidade, mas coerência: um currículo que demonstra foco, progressão e relação direta com o projeto
- Um Lattes desalinhado reduz drasticamente a pontuação, mesmo que o projeto seja bom
- É o espelho da sua trajetória acadêmica: a banca quer ver que você já tem perfil de pesquisador
- Candidatos com Lattes estratégico se diferenciam de 80% dos concorrentes que apenas "preenchem" o currículo

---

## **🚀 Resultados esperados**

- Banca identifica imediatamente que você tem maturidade acadêmica e está preparado para o mestrado
- Currículo se torna um diferencial competitivo, não apenas um requisito burocrático

---

## **✅ Tarefas**

- [ ] Atualizar o Currículo Lattes com todos os comprovantes dos últimos 5 anos
- [ ] Transformar o resumo em um destaque para ser aprovado
- [ ] Alinhar a escrita do Lattes com o pré-projeto
- [ ] Fortalecer em até 45 dias`,
      },
      {
        id: "central-3",
        title: "Projeto de Pesquisa",
        description: "Transformar Lattes em ferramenta de aprovação",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=300&fit=crop",
        tags: [{ label: "Estratégia", color: "purple" }],
        priority: "Alta",
        content: `## **🛠️ O que fazer**
Estruturar um pré-projeto de pesquisa alinhado com orientador e PPG para alcançar a nota mais alta possível.

---

## **🧠 Porque fazer**
O projeto é o coração da seleção. Um projeto desalinhado, genérico ou mal estruturado reprova mesmo candidatos qualificados. O projeto certo mostra que você entende o que é pesquisa acadêmica e que está pronto para o mestrado.

---

## **🚀 Resultados esperados**

- Pré-projeto de pesquisa estruturado, alinhado com orientador e linha de pesquisa, pronto para submissão com alta chance de aprovação.

---

## **✅ Tarefas**

- [ ] Definir o objetivo do projeto
- [ ] Identificar áreas de interesse dentro das linhas de pesquisa
- [ ] Alinhar interesses do candidato ao do orientador desejado
- [ ] Ajustar metodologia para maximizar a viabilidade do projeto.`,
      },
      {
        id: "central-4",
        title: "Entrevista",
        description: "Transformar Lattes em ferramenta de aprovação",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=300&fit=crop",
        tags: [{ label: "Estratégia", color: "purple" }],
        priority: "Alta",
        content: `## **🛠️ O que fazer**
Preparar uma defesa estruturada do pré-projeto, antecipando as principais objeções e perguntas da banca

---

## **🧠 Porque fazer**
A entrevista é o momento em que a banca testa se você realmente entende o que escreveu no projeto ou se apenas copiou modelos prontos. É onde aparecem as fragilidades: candidatos que não sabem explicar a metodologia, que não conhecem os autores que citaram, ou que não conseguem justificar a relevância da pesquisa. A banca não quer apenas um projeto bem escrito, quer ter certeza de que você é capaz de executá-lo nos próximos 2 anos. Uma entrevista mal preparada pode reprovar até projetos excelentes.

---

## **🚀 Resultados esperados**

- Você transmite confiança e domínio do tema, respondendo com clareza e sem gaguejar ou "enrolar".
- A banca percebe que você tem maturidade para conduzir a pesquisa de forma autônoma. 
- Reduz drasticamente o risco de reprovação por "falta de clareza" ou "insegurança na defesa".
- Aumenta as chances de aprovação mesmo com um projeto mediano, porque a banca vê potencial real de execução.
- Candidatos bem preparados para a entrevista conseguem reverter objeções e transformar críticas em oportunidades de demonstrar conhecimento.

---

## **✅ Tarefas**

- [ ] Antecipar as perguntas mais comuns da banca sobre o projeto
- [ ] Treinar a apresentação oral do projeto de forma clara e objetiva
- [ ] Dominar completamente a justificativa e a metodologia do pré-projeto
- [ ] Simular a entrevista para identificar pontos fracos na argumentação
- [ ] Preparar respostas para objeções sobre viabilidade, tempo e recursos
- [ ] Ajustar linguagem corporal e tom de voz para transmitir segurança
- [ ] Estudar o perfil dos avaliadores e suas linhas de pesquisa
- [ ] Revisar os principais autores e conceitos citados no projeto`,
      },
      {
        id: "central-5",
        title: "Defesa de Memorial",
        description: "Transformar Lattes em ferramenta de aprovação",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=300&fit=crop",
        tags: [{ label: "Estratégia", color: "purple" }],
        priority: "Alta",
        content: `## **🛠️ O que fazer**
Construir um memorial descritivo que conecta sua trajetória profissional e acadêmica ao projeto de mestrado, demonstrando coerência e evolução

---

## **🧠 Porque fazer**
Muitos programas de mestrado, especialmente os mais concorridos, exigem memorial descritivo como parte da avaliação curricular. A banca usa o memorial para entender não apenas "o que você fez", mas "quem você é como pesquisador em formação". Um memorial bem construído humaniza o Lattes, mostra maturidade reflexiva e demonstra que você tem consciência do seu percurso acadêmico. Candidatos que tratam o memorial como mera formalidade perdem pontos preciosos, enquanto aqueles que constroem uma narrativa coerente se destacam imediatamente. O memorial é sua chance de mostrar que sua trajetória não foi aleatória, mas sim uma construção intencional rumo ao mestrado.

---

## **🚀 Resultados esperados**

- A banca identifica uma trajetória coerente e intencional, não apenas uma lista de experiências desconectadas.
- Você se diferencia de candidatos que entregam memoriais genéricos ou burocráticos.
- Aumenta a percepção de maturidade acadêmica e capacidade reflexiva, critérios valorizados em processos seletivos.
- O memorial fortalece a pontuação curricular e pode ser decisivo em casos de empate técnico.
- Reduz objeções sobre sua capacidade de conduzir pesquisa, porque a banca vê que você tem consciência do seu próprio desenvolvimento como pesquisador.

---

## **✅ Tarefas**

- [ ] Mapear toda a trajetória acadêmica e profissional relevante
- [ ] Selecionar apenas experiências que se conectam ao projeto de mestrado
- [ ] Organizar os fatos de forma cronológica ou temática
- [ ] Construir uma narrativa coerente que mostre evolução e foco
- [ ] Conectar cada experiência ao desenvolvimento do interesse de pesquisa
- [ ] Demonstrar reflexão crítica sobre a própria trajetória
- [ ] Incluir formações, produções, eventos e experiências acadêmicas
- [ ] Alinhar o memorial com o tom e linguagem do pré-projeto
- [ ] Revisar para garantir coerência entre memorial, Lattes e projeto
- [ ] Preparar defesa oral do memorial caso seja solicitada pela banca`,
      },
      {
        id: "central-6",
        title: "Proeficiência",
        description: "Transformar Lattes em ferramenta de aprovação",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=300&fit=crop",
        tags: [{ label: "Estratégia", color: "purple" }],
        priority: "Alta",
        content: `## **🛠️ O que fazer**
Preparar-se para o exame de proficiência em língua estrangeira (geralmente inglês, mas pode ser espanhol, francês ou italiano) exigido pelo programa de mestrado. A prova normalmente avalia leitura e tradução de textos acadêmicos da sua área de pesquisa, com ou sem dicionário, dependendo do edital. É preciso treinar a leitura instrumental, dominar vocabulário técnico da sua área, praticar tradução de abstracts e artigos científicos, e conhecer o formato específico da prova do programa escolhido. Alguns programas aceitam certificações internacionais (TOEFL, IELTS, DELE), enquanto outros aplicam prova própria no dia da seleção.

---

## **🧠 Porque fazer**
A proficiência em língua estrangeira é requisito obrigatório na maioria dos programas de mestrado e pode ser eliminatória. Mesmo que você tenha um projeto excelente e um Lattes competitivo, a reprovação na prova de idioma elimina sua candidatura imediatamente. A banca exige proficiência porque você precisará ler bibliografia internacional, acompanhar publicações recentes da sua área e, eventualmente, publicar em periódicos estrangeiros. Candidatos que subestimam essa etapa e deixam para estudar em cima da hora frequentemente são eliminados, desperdiçando meses de preparação nas outras etapas. A proficiência não é apenas uma formalidade burocrática, é uma competência essencial para o desenvolvimento da pesquisa.

---

## **🚀 Resultados esperados**

- Você atinge a nota mínima exigida pelo edital e evita eliminação por proficiência.
- Demonstra capacidade real de acessar bibliografia internacional e acompanhar produções acadêmicas estrangeiras.
- Reduz drasticamente o risco de reprovação por uma etapa que é tecnicamente treinável e previsível.
- Aumenta a confiança da banca de que você conseguirá conduzir revisão bibliográfica adequada durante o mestrado.
- Candidatos aprovados na proficiência com folga transmitem seriedade e preparo completo, não apenas foco no projeto.

---

## **✅ Tarefas**

- [ ] Identificar qual idioma é exigido pelo programa (inglês, espanhol, francês ou italiano)
- [ ] Verificar no edital se aceita certificação internacional ou se aplica prova própria
- [ ] Mapear o formato da prova (tradução, questões de interpretação, com ou sem dicionário)
- [ ] Treinar leitura instrumental de textos acadêmicos da sua área
- [ ] Dominar vocabulário técnico específico do seu campo de pesquisa
- [ ] Praticar tradução de abstracts e artigos científicos
- [ ] Estudar estruturas gramaticais comuns em textos acadêmicos
- [ ] Fazer provas anteriores do programa para entender o nível de exigência
- [ ] Preparar glossário personalizado com termos recorrentes da sua área
- [ ] Simular a prova no tempo real exigido pelo edital`,
      },

    ],
  },
  {
    id: "plan",
    title: "Rotina Viável",
    color: "kanban-plan",
    icon: "📅",
    cards: [
      {
        id: "plan-1",
        title: "1. Primeiros Passos",
        description: "Organize sua rotina de estudos",
        type: "text",
        thumbnail: PLACEHOLDERS.plan,
        banner: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=300&fit=crop",
        tags: [{ label: "Planejamento", color: "purple" }],
        priority: "Alta",
        content: `## **🛠️ O que fazer**
Criar uma rotina realista (1h30 a 2h diárias) que não dependa de "tempo livre", mas de blocos protegidos. Use técnicas como Pomodoro e distribua tarefas (leitura, escrita, revisão) semanalmente. O segredo é a **consistência** diária, não maratonas esporádicas.

---

## **🧠 Porque fazer**
A falta de consistência é a maior causa de reprovação. Sem rotina, você vira refém da motivação e da ansiedade. Uma rotina estruturada transforma o estudo em hábito automático, garantindo que você chegue ao edital com o projeto pronto e confiante, enquanto a concorrência corre atrás do prejuízo.

---

## **🚀 Resultados esperados**

- Avanço constante sem "maratonas" de última hora.
- Preparação sem ansiedade, tornando-se parte natural do dia.
- Fim da procrastinação e aumento da qualidade do projeto.
- Chegar pronto ao edital enquanto 80% ainda estão começando.`,
      },
      {
        id: "plan-2",
        title: "2. Tarefas",
        description: "O passo a passo da aprovação",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=300&fit=crop",
        tags: [{ label: "Execução", color: "red" }],
        priority: "Urgente",
        content: `- [ ] Definir horário fixo diário para estudar (1h30 a 2h)
- [ ] Organizar cronograma semanal com tarefas específicas por dia
- [ ] Distribuir atividades: leitura, escrita, treino de questões, revisão de idioma
- [ ] Usar blocos de tempo focado (Pomodoro ou técnicas similares)
- [ ] Proteger o horário de estudo de interrupções e distrações
- [ ] Acompanhar progresso semanal para ajustar o ritmo
- [ ] Criar checklist de tarefas para não perder o foco
- [ ] Revisar o cronograma mensalmente conforme o edital se aproxima
- [ ] Manter a rotina mesmo em semanas "corridas" (consistência > volume)`,
      },

    ],
  },

  {
    id: "monitoring",
    title: "Acompanhamento e correção",
    color: "kanban-phrases",
    icon: "📈",
    cards: [
      {
        id: "monitor-1",
        title: "1. Primeiros Passos",
        description: "Visão geral do acompanhamento",
        type: "text",
        thumbnail: PLACEHOLDERS.plan,
        banner: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=300&fit=crop",
        tags: [{ label: "Planejamento", color: "purple" }],
        priority: "Alta",
        content: `## **🛠️ O que fazer**
Implementar revisão contínua. Revisar o pré-projeto semanalmente, buscar feedback qualificado (mentores/orientadores) e realizar simulados de prova e entrevista. O foco é corrigir erros antes que se tornem fatais.

---

## **🧠 Porque fazer**
A "cegueira" de quem estuda sozinho é fatal. O feedback externo atua como controle de qualidade, revelando falhas invisíveis para você. Sem isso, você navega às cegas; com acompanhamento, tem um GPS.

---

## **🚀 Resultados esperados**

- Identificação antecipada de erros críticos.
- Eliminação da falsa sensação de preparo com simulados.
- Aumento de 3x nas chances de aprovação ao corrigir a rota a tempo.`,
      },
      {
        id: "monitor-2",
        title: "2. Tarefas",
        description: "Checklist de acompanhamento",
        type: "checklist",
        thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=225&fit=crop",
        banner: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=300&fit=crop",
        tags: [{ label: "Execução", color: "green" }],
        priority: "Alta",
        content: `- [ ] Revisar semanalmente o pré-projeto para identificar pontos fracos
- [ ] Buscar feedback do orientador sobre o andamento do projeto
- [ ] Solicitar correções de mentor ou especialista na área
- [ ] Ajustar metodologia, justificativa e objetivos com base no feedback
- [ ] Aplicar simulados de prova escrita para testar domínio da bibliografia
- [ ] Simular entrevista gravando respostas e identificando falhas na argumentação
- [ ] Usar IA para simular avaliação da banca e antecipar objeções
- [ ] Revisar Lattes e memorial para garantir coerência com o projeto
- [ ] Fazer validação final completa 15 dias antes da inscrição
- [ ] Corrigir últimos detalhes e submeter com confiança`,
      },
    ],
  },

];