/**
 * Conteúdo da LP SGO — Foco 70% cliente final, 30% integrador/dev
 * Linguagem de negócio. ALTRS como parceira, não como protagonista.
 */

export const siteData = {
  siteName: "SGO",
  tagline: "Sistema de Gestão Operacional",
  portalUrl: "https://portal.altrs.net",
  altrsHomeUrl: "https://altrs.com.br",
  githubUrl: "https://github.com/altrsconsult/sgo",

  nav: [
    { label: "Início", path: "/" },
    { label: "Para Integradores", path: "/devs" },
    { label: "Documentação", path: "/docs" },
  ],

  hero: {
    badge: "Seu sistema, sua marca, seus dados — para sempre",
    headline: {
      part1: "SISTEMA",
      part2: "PROFISSIONAL",
      part3: "SEM LOCK-IN"
    },
    subtitle: "Uma plataforma completa de gestão para o seu negócio. Você contrata a implantação, recebe o sistema funcionando e ele fica com você — independente do que aconteça depois.",
    ctaPrimary: "Quero saber mais",
    ctaSecondary: "Como funciona",
  },

  // Card de bifurcação pós-hero — direciona devs/integradores para a página correta
  devCta: {
    eyebrow: "Você é desenvolvedor ou integrador?",
    title: "Adicione o SGO ao seu portfólio de serviços",
    description: "Se você já entrega Chatwoot, agentes de IA ou automações para clientes, o SGO é o sistema de gestão que estava faltando no seu stack. Boilerplate open-source, IA-friendly e pronto para customizar.",
    cta: "Ver como funciona para integradores",
    link: "/devs",
  },

  value: {
    title: "Por que o SGO é diferente?",
    subtitle: "Três princípios que mudam o jogo",
    items: [
      {
        id: "01",
        label: "PROPRIEDADE TOTAL",
        title: "O sistema é seu, não nosso",
        description: "Quando você implanta o SGO, o sistema pertence ao seu negócio. Seus dados ficam no seu servidor, sua marca aparece para seus usuários e você nunca fica refém de uma assinatura para continuar operando.",
        icon: "shield-check"
      },
      {
        id: "02",
        label: "PRONTO PARA OPERAR",
        title: "Da instalação ao uso em dias",
        description: "Não é um protótipo que cresce junto com os problemas. É uma plataforma estável, com autenticação, controle de usuários, permissões e módulos prontos. Você entra operando, não testando.",
        icon: "layers"
      },
      {
        id: "03",
        label: "CRESCE COM VOCÊ",
        title: "Adicione funcionalidades sem reescrever nada",
        description: "Cada nova funcionalidade do seu negócio entra como um módulo independente. Não mexe no que já funciona, não cria retrabalho, não gera custo de refatoração. O sistema acompanha sua operação.",
        icon: "code"
      }
    ]
  },

  howItWorks: {
    title: "Como acontece na prática",
    subtitle: "Da conversa ao sistema rodando",
    steps: [
      {
        number: "01",
        title: "Entendemos sua operação",
        description: "Antes de qualquer código, conversamos sobre como seu negócio funciona: quem usa o sistema, quais informações precisam estar acessíveis, quais processos você quer automatizar. O sistema nasce do seu contexto.",
      },
      {
        number: "02",
        title: "Implantamos e configuramos tudo",
        description: "A ALTRS cuida da instalação no seu servidor, configuração de usuários, permissões e dos módulos que fazem sentido para você agora. Você começa a usar enquanto evoluímos juntos.",
      },
      {
        number: "03",
        title: "Você decide o próximo passo",
        description: "Quer continuar em parceria? Desenvolvemos novos módulos conforme sua operação cresce. Prefere assumir independentemente? O código é aberto e qualquer desenvolvedor consegue continuar. Sem amarras.",
      }
    ]
  },

  modules: {
    title: "Funcionalidades sob medida para o seu negócio",
    subtitle: "Cada operação é diferente",
    description: "O SGO não vem com um pacote fixo de funcionalidades que você usa 30% e paga 100%. Cada módulo é desenvolvido ou ativado de acordo com o que sua operação realmente precisa.",
    examples: [
      { name: "Captura de Leads", desc: "Receba e organize contatos de múltiplas origens em um só lugar", icon: "user-plus" },
      { name: "CRM Simplificado", desc: "Acompanhe clientes e oportunidades sem complexidade desnecessária", icon: "users" },
      { name: "Painel de Indicadores", desc: "Visualize métricas da sua operação em tempo real", icon: "bar-chart" },
      { name: "Automações", desc: "Conecte o SGO com suas ferramentas e elimine trabalho manual", icon: "zap" },
      { name: "Módulo Personalizado", desc: "Desenvolvemos exatamente o que a sua operação precisa", icon: "code-2" },
    ],
    cta: "Saiba como funciona para desenvolvedores"
  },

  nexus: {
    title: "Gestão centralizada para quem opera em escala",
    subtitle: "Opcional — para quem precisa",
    description: "Se você tem mais de uma unidade ou franquia, o Nexus permite gerenciar todas as instâncias do SGO a partir de um painel único. Mas se você tem uma operação só, nem precisa saber que ele existe.",
    features: [
      "Acompanhe o status de cada unidade em tempo real",
      "Instale ou atualize módulos em todas as instâncias de uma vez",
      "Configure whitelabel por cliente ou unidade",
      "Sem necessidade de acesso técnico direto a cada servidor"
    ],
    note: "O SGO funciona 100% de forma independente, sem nenhuma conexão com serviços externos. O Nexus é opcional."
  },

  comparison: {
    title: "O custo real do desenvolvimento tradicional",
    subtitle: "Uma conta que muita gente só fecha tarde demais",
    traditional: {
      title: "Desenvolvimento personalizado do zero",
      items: [
        "6 a 12 meses para ter algo funcional (e ainda em testes)",
        "Custo alto e difícil de prever — cada mudança vira um novo projeto",
        "Você depende do dev que construiu para qualquer alteração",
        "Se ele sair ou aumentar o preço, você está preso",
        "Quando a empresa cresce, o sistema geralmente não acompanha",
        "Manutenção constante e cara para algo que deveria só funcionar",
        "Você paga pelo aprendizado de alguém, não pela solução do seu problema"
      ]
    },
    sgo: {
      title: "SGO com implantação ALTRS",
      items: [
        "Sistema funcionando em dias, não meses",
        "Custo claro desde o início: implantação + módulos + suporte (se quiser)",
        "Qualquer desenvolvedor consegue dar continuidade — o código é aberto",
        "Seus dados no seu servidor, sem dependência de serviços de terceiros",
        "Novos módulos entram sem mexer no que já funciona",
        "Plataforma estável e validada, não um protótipo que cresce com os bugs",
        "Você paga pela solução, não pelo processo de construção"
      ]
    }
  },

  pricing: {
    title: "Como funciona comercialmente",
    subtitle: "Transparente desde o início",
    description: "Não temos assinatura mensal obrigatória para manter o sistema funcionando. O SGO roda no seu servidor e opera de forma independente. O que você contrata é o trabalho de implantação, desenvolvimento e suporte — não o direito de usar.",
    models: [
      {
        id: "modular",
        label: "PROJETO",
        title: "Implantação + Módulos sob demanda",
        items: [
          "Implantação completa da plataforma no seu servidor",
          "Módulos desenvolvidos conforme as necessidades mapeadas",
          "Suporte técnico contínuo (opcional, você escolhe)",
          "Sistema liberado: código aberto, sem custo de saída"
        ],
        highlight: "Para quem quer controle e clareza de custo"
      },
      {
        id: "fullservice",
        label: "PARCERIA",
        title: "Acompanhamento contínuo por 24 meses",
        items: [
          "Implantação completa + desenvolvimento contínuo de módulos",
          "Consultoria estratégica e suporte técnico inclusos",
          "Evolução do sistema conforme sua operação cresce",
          "Ao final do período: sistema 100% seu, sem nenhum custo adicional"
        ],
        highlight: "Para quem quer um parceiro técnico de longo prazo"
      }
    ],
    note: "Em ambos os casos, o sistema é seu. Se você ficar 2 anos em parceria ativa, ele fica liberado ao final do período sem qualquer custo extra."
  },

  cta: {
    title: "Qual é o seu próximo passo?",
    subtitle: "Cada caminho leva ao mesmo resultado: um sistema que é seu",
    options: [
      {
        id: "install",
        title: "Quero implantar o SGO",
        description: "A ALTRS cuida de tudo: instalação, configuração e treinamento. Você começa a operar em dias.",
        cta: "Falar com a ALTRS",
        link: "https://altrs.com.br"
      },
      {
        id: "custom",
        title: "Preciso de módulos específicos",
        description: "Tem um processo que precisa ser digitalizado? Desenvolvemos o módulo certo para a sua operação.",
        cta: "Contar minha necessidade",
        link: "https://altrs.com.br"
      },
      {
        id: "dev",
        title: "Sou desenvolvedor",
        description: "Quer adicionar o SGO ao seu portfólio de serviços? Veja como funciona para integradores.",
        cta: "Ver página de integradores",
        link: "/devs"
      }
    ]
  },

  ctaFinal: {
    title: "Vamos conversar sobre a sua operação?",
    subtitle: "Sem compromisso, sem apresentação de vendas",
    description: "Uma conversa rápida para entender o que você precisa e mostrar como o SGO se encaixa. Se fizer sentido, seguimos. Se não fizer, pelo menos você entende melhor o que está disponível no mercado.",
    benefits: [
      "Entendimento da sua operação atual",
      "Mapeamento das funcionalidades que fazem sentido para você",
      "Proposta com valores claros e sem letras miúdas",
      "Sem pressão para fechar — você decide no seu tempo"
    ],
    cta: "Agendar uma conversa",
    ctaLink: "https://altrs.com.br",
    note: "Respondemos em até 24 horas úteis."
  },

  footer: {
    company: "ALTRS Consultoria",
    description: "SGO — Sistema de Gestão Operacional. Plataforma open-source para operações que precisam crescer sem perder o controle.",
    linkSite: "altrs.com.br",
    contact: "contato@altrs.com.br",
    social: [
      { platform: "GitHub", url: "https://github.com/altrsconsult/sgo", label: "Repositório" },
      { platform: "Docs", url: "/docs", label: "Documentação" }
    ]
  },

  // ─── Página /devs — Para integradores e vibe-coders ────────────────────────

  devs: {
    hero: {
      title: "SGO para integradores",
      subtitle: "Você já entrega ferramentas poderosas para seus clientes. O SGO é o sistema de gestão que fecha o ciclo."
    },

    // O gap que o integrador conhece bem
    problem: {
      title: "Um problema que você provavelmente já viveu",
      subtitle: "O cliente tem tudo — menos um lugar central para gerir",
      items: [
        {
          title: "Você implantou o Chatwoot",
          description: "O atendimento está rodando. Mas o cliente pergunta: 'onde fico de olho nos dados dos meus usuários? Onde configuro quem acessa o quê?'"
        },
        {
          title: "Você configurou os agentes de IA",
          description: "As automações estão funcionando. Mas cada sistema tem seu próprio painel, seu próprio login, e o cliente fica perdido entre abas."
        },
        {
          title: "Você entregou o N8N",
          description: "Os fluxos estão salvando horas por semana. Mas o cliente ainda usa planilha para gerir a operação porque não tem sistema integrado."
        }
      ]
    },

    // O que o SGO resolve para o integrador
    solution: {
      title: "O que muda quando você adiciona o SGO",
      subtitle: "Você entrega um ecossistema completo, não apenas ferramentas isoladas",
      items: [
        {
          title: "A base já está pronta",
          description: "Autenticação, gestão de usuários, grupos, permissões, painel administrativo — tudo funciona antes de você escrever uma linha. Você foca no que é vertical do cliente."
        },
        {
          title: "Cada cliente ganha seu sistema",
          description: "O SGO tem suporte a whitelabel nativo. Cada instância pode ter o nome, logo e cores do cliente. Você entrega um produto, não uma ferramenta genérica."
        },
        {
          title: "Módulos são sua entrega de valor",
          description: "O módulo é onde fica a lógica do negócio do cliente. É o que você desenvolve e cobra. O chassi cuida de tudo que é infraestrutura — você cuida do que é único."
        },
        {
          title: "IA cria módulos por você",
          description: "O repositório tem documentação estruturada para LLMs. Você descreve o módulo para o ChatGPT ou Claude, ele lê o AGENTS.md e gera o boilerplate. Você revisa e entrega."
        }
      ]
    },

    quickStart: {
      title: "Do zero ao módulo rodando",
      steps: [
        "Clone o repositório: git clone https://github.com/altrsconsult/sgo",
        "Suba o chassi local: docker compose up -d",
        "Copie o boilerplate: cp -r modules/boilerplate modules/meu-modulo",
        "Desenvolva: pnpm --filter @sgo/module-meu-modulo dev",
        "O módulo aparece automaticamente no chassi local (porta 3000)"
      ]
    },

    // Como a IA ajuda no desenvolvimento
    aiFriendly: {
      title: "Desenvolvido para trabalhar com IA",
      description: "O repositório tem um AGENTS.md completo — um arquivo de contexto que LLMs como ChatGPT e Claude entendem nativamente. Você aponta o agente para o repositório e ele já sabe como criar um módulo novo, quais padrões seguir e onde cada coisa fica.",
      benefits: [
        "AGENTS.md com toda a arquitetura descrita para IA",
        "Boilerplate comentado linha a linha em português",
        "Padrões de código documentados com exemplos",
        "Guia de criação de módulo que um agente consegue executar sozinho"
      ]
    },

    // CTA final da página devs
    githubCta: {
      title: "Tudo open-source, tudo documentado",
      description: "O repositório está público no GitHub com licença aberta. Você pode usar, contribuir, criar módulos e distribuí-los como quiser. A ALTRS mantém o chassi principal, a comunidade constrói o ecossistema.",
      cta: "Acessar repositório no GitHub",
      ctaLink: "https://github.com/altrsconsult/sgo",
      ctaSecondary: "Ler documentação",
      ctaSecondaryLink: "/docs"
    }
  },

  // ─── Página /docs ──────────────────────────────────────────────────────────

  docs: {
    hero: {
      title: "Documentação Técnica",
      subtitle: "Arquitetura, instalação, API e guias para criar módulos."
    },
    sections: [
      {
        title: "Arquitetura",
        items: [
          "Chassi (Host) + Módulos (Remotes) — Module Federation",
          "Frontend React + Backend Hono/TypeScript",
          "Banco de dados PostgreSQL via Drizzle ORM",
          "Autenticação JWT e controle de permissões por módulo"
        ]
      },
      {
        title: "Instalação",
        items: [
          "Docker Compose para desenvolvimento local",
          "Stack Portainer/Swarm para produção com Traefik",
          "Variáveis de ambiente e configuração inicial",
          "Modo standalone vs. gerenciado via Nexus"
        ]
      },
      {
        title: "Módulos",
        items: [
          "Estrutura do manifest.json",
          "Criando seu primeiro módulo a partir do boilerplate",
          "API de dados do módulo (CRUD via chassi)",
          "Instalação via ZIP ou URL remota"
        ]
      },
      {
        title: "API Reference",
        items: [
          "Endpoints de autenticação (/api/auth/*)",
          "Gestão de módulos (/api/modules/*)",
          "Dados por módulo (/api/module-data/*)",
          "Nexus API para gestão centralizada (/api/nexus/*)"
        ]
      }
    ],
    cta: "Ver repositório completo no GitHub"
  }
} as const;
