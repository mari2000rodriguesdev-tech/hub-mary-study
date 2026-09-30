// Dados iniciais e estrutura de estudo para o StudyMarys Hub
const DEFAULT_STUDY_DATA = {
  profile: {
    name: "Maria Rodrigues",
    nickname: "Mary",
    title: "Estudante Universitária & Concurseira",
    bio: "Unindo foco e tecnologia para conquistar aprovações em concursos públicos, excelência acadêmica na faculdade e expandir novos horizontes em tecnologia e hobbies criativos.",
    avatar: "assets/images/avatar-maria.jpg",
    heroImage: "assets/images/maria-rodrigues.jpg",
    gradImage: "assets/images/graduation-character.jpg",
    workspaceImage: "assets/images/workspace-banner.jpg",
    stats: {
      studyHours: 248,
      activeSubjects: 18,
      streakDays: 16,
      completionRate: 92,
      pomodorosCompleted: 142
    },
    quote: "A consistência diária vence o talento sem disciplina."
  },

  areas: [
    {
      id: "faculdade",
      name: "Faculdade",
      icon: "fa-graduation-cap",
      badge: "Graduação",
      color: "#8b5cf6",
      desc: "Disciplinas do semestre acadêmico, artigos, TCC e avaliações",
      totalTopics: 28,
      completedTopics: 24,
      progress: 86
    },
    {
      id: "concursos",
      name: "Concursos",
      icon: "fa-scale-balanced",
      badge: "Carreira Pública",
      color: "#3b82f6",
      desc: "Direito Constitucional, Administrativo, Raciocínio Lógico e questões",
      totalTopics: 45,
      completedTopics: 39,
      progress: 87
    },
    {
      id: "habilidades",
      name: "Novas Habilidades",
      icon: "fa-laptop-code",
      badge: "Tech & Future",
      color: "#06b6d4",
      desc: "Python para automação, análise de dados, IA para produtividade e UI/UX",
      totalTopics: 22,
      completedTopics: 17,
      progress: 77
    },
    {
      id: "hobbies",
      name: "Hobbies & Idiomas",
      icon: "fa-palette",
      badge: "Vida & Bem-estar",
      color: "#ec4899",
      desc: "Inglês avançado, Francês iniciante, Clube do Livro e Violão",
      totalTopics: 16,
      completedTopics: 14,
      progress: 88
    }
  ],

  subjects: [
    // Faculdade
    {
      id: "fac-1",
      area: "faculdade",
      name: "Direito Civil & Obrigações",
      icon: "fa-book-bookmark",
      progress: 92,
      level: "Avançado",
      hours: 42,
      nextTask: "Revisar inadimplemento e mora",
      color: "#8b5cf6"
    },
    {
      id: "fac-2",
      area: "faculdade",
      name: "Teoria Geral do Processo",
      icon: "fa-gavel",
      progress: 85,
      level: "Avançado",
      hours: 36,
      nextTask: "Esquematizar competência e prazos",
      color: "#a855f7"
    },
    {
      id: "fac-3",
      area: "faculdade",
      name: "Metodologia Científica & TCC",
      icon: "fa-file-lines",
      progress: 78,
      level: "Intermediário",
      hours: 24,
      nextTask: "Finalizar introdução do artigo preliminar",
      color: "#c084fc"
    },
    {
      id: "fac-4",
      area: "faculdade",
      name: "Economia Política",
      icon: "fa-chart-line",
      progress: 90,
      level: "Avançado",
      hours: 30,
      nextTask: "Simulado de microeconomia",
      color: "#7c3aed"
    },

    // Concursos
    {
      id: "conc-1",
      area: "concursos",
      name: "Direito Constitucional",
      icon: "fa-landmark",
      progress: 94,
      level: "Mestre",
      hours: 68,
      nextTask: "Art. 5º da CF e Remédios Constitucionais",
      color: "#3b82f6"
    },
    {
      id: "conc-2",
      area: "concursos",
      name: "Direito Administrativo",
      icon: "fa-building-columns",
      progress: 88,
      level: "Avançado",
      hours: 54,
      nextTask: "Atos Administrativos & Poder de Polícia",
      color: "#2563eb"
    },
    {
      id: "conc-3",
      area: "concursos",
      name: "Língua Portuguesa p/ Bancas",
      icon: "fa-spell-check",
      progress: 95,
      level: "Mestre",
      hours: 48,
      nextTask: "Crase e Regência Verbal Cebraspe",
      color: "#60a5fa"
    },
    {
      id: "conc-4",
      area: "concursos",
      name: "Raciocínio Lógico & Mat.",
      icon: "fa-brain",
      progress: 76,
      level: "Intermediário",
      hours: 32,
      nextTask: "Tabela Verdade e Equivalências Lógicas",
      color: "#1d4ed8"
    },

    // Novas Habilidades
    {
      id: "hab-1",
      area: "habilidades",
      name: "Python para Automação",
      icon: "fa-code",
      progress: 82,
      level: "Avançado",
      hours: 38,
      nextTask: "Script de extração de questões e prazos",
      color: "#06b6d4"
    },
    {
      id: "hab-2",
      area: "habilidades",
      name: "Inteligência Artificial & Prompts",
      icon: "fa-robot",
      progress: 90,
      level: "Avançado",
      hours: 28,
      nextTask: "Criação de resumos e mapas mentais automáticos",
      color: "#0891b2"
    },
    {
      id: "hab-3",
      area: "habilidades",
      name: "UI/UX Design & Prototipagem",
      icon: "fa-bezier-curve",
      progress: 72,
      level: "Intermediário",
      hours: 26,
      nextTask: "Criar layout no Figma do Caderno Digital",
      color: "#22d3ee"
    },
    {
      id: "hab-4",
      area: "habilidades",
      name: "Gestão Ágil & Notion Avançado",
      icon: "fa-table-columns",
      progress: 96,
      level: "Mestre",
      hours: 34,
      nextTask: "Otimizar fórmulas de repetição espaçada",
      color: "#14b8a6"
    },

    // Hobbies
    {
      id: "hob-1",
      area: "hobbies",
      name: "Inglês Fluente (Nível C1)",
      icon: "fa-comments",
      progress: 92,
      level: "Fluente",
      hours: 65,
      nextTask: "Leitura de paper acadêmico internacional",
      color: "#ec4899"
    },
    {
      id: "hob-2",
      area: "hobbies",
      name: "Clube do Livro & Não-Ficção",
      icon: "fa-book-open-reader",
      progress: 85,
      level: "14 Livros lidos",
      hours: 40,
      nextTask: "Capítulo 7 de 'Hábitos Atômicos'",
      color: "#f43f5e"
    },
    {
      id: "hob-3",
      area: "hobbies",
      name: "Francês para Iniciantes",
      icon: "fa-earth-europe",
      progress: 45,
      level: "Iniciante A1",
      hours: 18,
      nextTask: "Vocabulário de rotina e saudações",
      color: "#fb7185"
    },
    {
      id: "hob-4",
      area: "hobbies",
      name: "Música & Violão Acústico",
      icon: "fa-guitar",
      progress: 68,
      level: "Intermediário",
      hours: 22,
      nextTask: "Dedilhado e acordes menores da música favorita",
      color: "#e11d48"
    }
  ],

  certifications: [
    {
      id: "cert-1",
      title: "1ª Fase OAB / Simulado TRF",
      issuer: "Simulado Nacional Cebraspe",
      date: "Jan 2026",
      status: "Aprovada",
      icon: "fa-award",
      area: "Concursos",
      color: "#3b82f6"
    },
    {
      id: "cert-2",
      title: "Python 3: Do Básico à Automação",
      issuer: "Coursera & Michigan Univ.",
      date: "Nov 2025",
      status: "Certificada",
      icon: "fa-laptop-code",
      area: "Tech",
      color: "#06b6d4"
    },
    {
      id: "cert-3",
      title: "Certificado C1 Advanced English",
      issuer: "Cambridge Assessment English",
      date: "Ago 2025",
      status: "Fluente",
      icon: "fa-globe",
      area: "Idiomas",
      color: "#ec4899"
    },
    {
      id: "cert-4",
      title: "Direito Constitucional & Teoria",
      issuer: "Escola Nacional de Governo (ENAP)",
      date: "Mar 2026",
      status: "Certificada",
      icon: "fa-landmark",
      area: "Faculdade",
      color: "#8b5cf6"
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "Vade Mecum Digital Interativo",
      category: "Faculdade & Concursos",
      desc: "Compilação de artigos, súmulas e jurisprudência comentada com pesquisa rápida por palavras-chave.",
      tags: ["Direito", "Constituição", "Súmulas STF"],
      progress: 90,
      status: "Em Uso",
      color: "#8b5cf6",
      icon: "fa-book-atlas"
    },
    {
      id: "proj-2",
      title: "Sprint Reta Final Concursos 2026",
      category: "Concursos",
      desc: "Ciclo de 60 dias focado em resolução de 1.500 questões Cebraspe com controle estatístico de acertos.",
      tags: ["Cebraspe", "Simulados", "Questões"],
      progress: 75,
      status: "Ativo",
      color: "#3b82f6",
      icon: "fa-fire"
    },
    {
      id: "proj-3",
      title: "Dev Learning & Hub de Scripts",
      category: "Novas Habilidades",
      desc: "Desenvolvimento de robôs em Python que baixam editais e organizam cronogramas de estudo automaticamente.",
      tags: ["Python", "Automação", "APIs"],
      progress: 80,
      status: "Em Andamento",
      color: "#06b6d4",
      icon: "fa-microchip"
    },
    {
      id: "proj-4",
      title: "Clube de Leitura & Resenhas 2026",
      category: "Hobbies",
      desc: "Meta de 18 livros no ano: resenhas ativas, anotações de insights no Notion e expansão de vocabulário.",
      tags: ["Leitura", "Mindset", "Idiomas"],
      progress: 65,
      status: "Em Andamento",
      color: "#ec4899",
      icon: "fa-feather-pointed"
    }
  ],

  flashcards: [
    {
      id: "fc-1",
      area: "concursos",
      question: "Qual o princípio fundamental insculpido no Art. 1º, inciso III da CF/88?",
      answer: "A Dignidade da Pessoa Humana — núcleo axiológico do ordenamento jurídico brasileiro.",
      tags: ["Constitucional", "Art. 1º"]
    },
    {
      id: "fc-2",
      area: "concursos",
      question: "Quais são os atributos essenciais dos atos administrativos? (Mnemônico)",
      answer: "PATI: Presunção de Legitimidade, Autoexecutoriedade, Tipicidade e Imperatividade.",
      tags: ["Administrativo", "Atos"]
    },
    {
      id: "fc-3",
      area: "habilidades",
      question: "Para que serve uma List Comprehension em linguagem Python?",
      answer: "Permite criar novas listas de maneira compacta e legível: [expressao for item in iteravel if condicao].",
      tags: ["Python", "Sintaxe"]
    },
    {
      id: "fc-4",
      area: "faculdade",
      question: "O que distingue a Obrigação de Meio da Obrigação de Resultado?",
      answer: "Na de MEIO, o devedor se obriga a agir com prudência e zelo (ex: advogado). Na de RESULTADO, obriga-se a atingir o fim almejado.",
      tags: ["Direito Civil", "Obrigações"]
    },
    {
      id: "fc-5",
      area: "hobbies",
      question: "Qual o sentido da expressão idiomática em inglês 'Hit the books'?",
      answer: "'To hit the books' significa começar a estudar intensamente, meter a cara nos livros!",
      tags: ["Inglês", "Idioms"]
    },
    {
      id: "fc-6",
      area: "concursos",
      question: "Quem tem legitimidade para propor Ação Direta de Inconstitucionalidade (ADI)?",
      answer: "Art. 103 da CF: Presidente, Mesas do Senado/Câmara/Assembleias, PGR, OAB Federal, partido político c/ representação no CN e confederações sindicais/entidades de classe de âmbito nacional.",
      tags: ["Constitucional", "Controle"]
    }
  ],

  tasks: [
    {
      id: "task-1",
      title: "Resolver 35 questões de Controle de Constitucionalidade (Cebraspe)",
      area: "concursos",
      status: "todo",
      priority: "high",
      date: "Hoje, 19:00"
    },
    {
      id: "task-2",
      title: "Fazer fichamento do artigo de Teoria do Processo Civil",
      area: "faculdade",
      status: "in-progress",
      priority: "medium",
      date: "Hoje, 21:00"
    },
    {
      id: "task-3",
      title: "Praticar 20 minutos de conversação em Inglês no Cambly/Podcast",
      area: "hobbies",
      status: "in-progress",
      priority: "low",
      date: "Amanhã"
    },
    {
      id: "task-4",
      title: "Codificar script em Python para cronometrar sessões no terminal",
      area: "habilidades",
      status: "todo",
      priority: "medium",
      date: "Quinta-feira"
    },
    {
      id: "task-5",
      title: "Revisão dos Flashcards de Atos Administrativos (Spaced Repetition)",
      area: "concursos",
      status: "done",
      priority: "high",
      date: "Concluído hoje"
    },
    {
      id: "task-6",
      title: "Leitura do Capítulo 3 de Economia Política",
      area: "faculdade",
      status: "done",
      priority: "medium",
      date: "Concluído ontem"
    }
  ]
};
