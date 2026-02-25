# Sustentabilidade e eficiência — SGO

Este documento descreve como o SGO se posiciona em relação a **uso de recursos**, **energia** e **sustentabilidade**, sustentando claims como “software eficiente em recursos”, “self-hosted permite controle de energia/região” e “preparado para mensuração de carbono (SCI)”.

## Stack enxuto

- **Frontend:** React 19, Vite 6, Module Federation. Build otimizado; dependências controladas via pnpm. Design system (@sgo/ui) com Tailwind e componentes Shadcn/Radix — sem runtime pesado adicional.
- **Backend:** Hono (runtime leve), Drizzle ORM, PostgreSQL ou MySQL. Poucas dependências de produção; sem framework monolítico pesado.
- **Infra:** imagens Docker multi-stage (Node Alpine); um único processo Node pode servir API + frontend estático (modo `SERVE_STATIC`), reduzindo número de containers quando desejado.

Requisitos de hardware típicos: servidor ou VPS com 1–2 GB de RAM para instância pequena; escalável conforme carga. Documentação de deploy em [docs/guides/DEPLOY.md](../guides/DEPLOY.md).

## Self-hosted: controle de região e energia

- O SGO é **self-hosted**: quem implanta escolhe onde rodar (região, datacenter, provedor). Isso permite:
  - Escolher regiões com energia mais limpa ou menor intensidade de carbono.
  - Manter dados próximos aos usuários (menos tráfego e latência).
  - Evitar redundância desnecessária: uma instância pode servir vários usuários no mesmo servidor, em vez de múltiplos SaaS separados.

Comparações diretas de “quanto carbono economiza” exigem premissas documentadas (tipo de energia, utilização, etc.) para não caracterizar greenwashing. Este documento não faz afirmações numéricas de redução de emissões sem tais premissas.

## Menos redundância

- Um único sistema (chassi + módulos) pode substituir várias ferramentas (gestão, CRM, tarefas, etc.) em uma única instalação. Menos contas, menos duplicação de infraestrutura e de dados. O benefício depende de como o controlador usa o sistema.

## Mensuração de carbono (SCI)

- A metodologia **Software Carbon Intensity (SCI)** — [Green Software Foundation](https://sci.greensoftware.foundation/), adotada como ISO/IEC 21031:2024 — permite calcular a intensidade de carbono do software (energia, hardware, unidade funcional).
- O SGO **pode ser medido** com SCI quando houver dados de uso (energia E, intensidade de carbono I da eletricidade, unidade funcional R). A equipe pode, em evolução, publicar um valor de referência ou guia de medição com premissas explícitas.
- **Claim “preparado para SCI”:** o sistema é enxuto e self-hosted; os insumos para SCI (uso de CPU/memória, localização do servidor) ficam sob controle de quem hospeda, permitindo aplicar a metodologia quando desejado.

## Aviso sobre comparações

- Qualquer claim comparativo (ex.: “economiza X% de energia em relação a Y”) deve ser baseado em premissas e metodologia documentadas. Este documento limita-se a descrever características do SGO que **suportam** eficiência e mensuração, sem números de economia sem base.

## Checklist interno (opcional)

Para evidência auditável, pode ser mantido [SUSTAINABILITY-CHECKLIST.md](SUSTAINABILITY-CHECKLIST.md) com itens verificáveis (requisitos de hardware documentados, ausência de processos pesados em background por padrão, referência à doc de SCI, etc.).
