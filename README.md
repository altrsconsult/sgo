<div align="center">

<!-- BANNER ─────────────────────────────────────────────────────────────────
  Adicione docs/assets/banner.png para ativar o cabeçalho visual.
  Dimensões ideais: 1280 × 400 px | Ferramentas: Canva, Figma, screenshot do sistema.
  Quando o arquivo estiver pronto, descomente a linha abaixo:
  <img src="docs/assets/banner.png" alt="SGO — Sistema de Gestão Operacional" width="100%"/>
──────────────────────────────────────────────────────────────────────────── -->

<h1>SGO — Sistema de Gestão Operacional</h1>

<p><em>Seu sistema. Sua marca. Seus dados. Para sempre.</em></p>

<p>
  Plataforma <strong>open-source</strong> de gestão com chassi pronto.<br/>
  Autenticação, usuários, permissões e painel admin funcionam no primeiro deploy.<br/>
  Você encaixa módulos; o cliente recebe o sistema — <strong>sem lock-in, sem assinatura obrigatória.</strong>
</p>

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12038/badge)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Baseline](https://www.bestpractices.dev/projects/12038/baseline)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/altrsconsult/sgo/badge)](https://scorecard.dev/viewer/?uri=github.com/altrsconsult/sgo)
[![Security](https://github.com/altrsconsult/sgo/actions/workflows/security.yml/badge.svg)](https://github.com/altrsconsult/sgo/actions/workflows/security.yml)
[![Maintained](https://img.shields.io/badge/Maintained-yes-green)](https://github.com/altrsconsult/sgo)
[![Issues](https://img.shields.io/github/issues/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/issues)
[![Release](https://img.shields.io/github/v/release/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p>
  <a href="https://sgo.altrs.net">🌐 Site Oficial</a> &nbsp;·&nbsp;
  <a href="https://sgo.altrs.net/devs">Para Integradores</a> &nbsp;·&nbsp;
  <a href="docs/AGENTS.md">Docs para IA</a> &nbsp;·&nbsp;
  <a href="https://github.com/altrsconsult/sgo/stargazers">⭐ Deixe uma estrela</a>
</p>

</div>

---

## Por que o SGO existe

O mercado de sistemas de gestão cobra assinatura mensal pelo **direito de usar** — quando você para de pagar, o sistema some junto com os dados. O SGO inverte essa lógica:

> **Você contrata o trabalho de implantação. O sistema fica com o cliente, para sempre — independente do que aconteça depois.**

**Três princípios que guiam o projeto:**

| # | Princípio | O que significa |
|---|-----------|-----------------|
| 01 | **Propriedade Total** | Após a implantação, sistema e dados pertencem ao negócio do cliente. Sem dependência de terceiros. |
| 02 | **Pronto para Operar** | Autenticação, usuários, permissões e painel admin funcionam antes de escrever uma linha de módulo. O integrador foca no que é vertical do cliente. |
| 03 | **Cresce Sem Reescrever** | Cada funcionalidade nova entra como módulo independente via Module Federation. O que já funciona continua intacto — sem refatoração cara. |

---

## Screenshots & Demo

<!-- ═══════════════════════════════════════════════════════════════════════
  SCREENSHOTS: adicione imagens reais quando disponíveis.
  Sugestão de capturas: painel principal, módulo ativo, tela mobile, dark mode.

  Para vídeo demo no YouTube, substitua VIDEO_ID e descomente:
  [![Demo SGO](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

  Para galeria de imagens 2×2, descomente e preencha:
  <table>
    <tr>
      <td><img src="docs/assets/screen-dashboard.png" alt="Dashboard" width="400"/></td>
      <td><img src="docs/assets/screen-module.png" alt="Módulo ativo" width="400"/></td>
    </tr>
    <tr>
      <td><img src="docs/assets/screen-mobile.png" alt="Mobile" width="400"/></td>
      <td><img src="docs/assets/screen-darkmode.png" alt="Dark Mode" width="400"/></td>
    </tr>
  </table>
════════════════════════════════════════════════════════════════════════ -->

> 📸 **Screenshots em breve** — UI em finalização. [Acompanhe o repositório](https://github.com/altrsconsult/sgo/stargazers) para ser notificado quando os assets forem publicados.

---

## Para quem é o SGO?

<table>
<tr>
<td width="50%" valign="top">

### 🧩 Integradores e Devs

Você já entrega sistemas open-source ao cliente — omnichannel, automação, agentes de IA — mas cada ferramenta tem seu painel. O SGO é a **camada de gestão central** que faltava.

**O que você ganha:**
- Base pronta: não escreva auth nem controle de acesso do zero
- Whitelabel nativo: cada cliente com nome, logo e cores próprias
- Module Federation: seus módulos entram sem tocar no chassi
- IA-friendly: [`AGENTS.md`](docs/AGENTS.md) descreve a arquitetura para LLMs; o agente gera o boilerplate, você revisa e entrega

</td>
<td width="50%" valign="top">

### 🏢 Empresas e Implantadores

Sistema profissional e validado, que passa a pertencer ao cliente após a implantação. Documentação de conformidade (LGPD/GDPR, acessibilidade, processos) pronta para apoiar vendas e auditorias corporativas.

**O que o cliente recebe:**
- Sistema rodando no servidor dele
- Dados sob controle próprio
- Sem assinatura mensal obrigatória para continuar usando
- Módulos novos entram sem reescrever o que já funciona

</td>
</tr>
</table>

---

## Quick Start

```bash
git clone https://github.com/altrsconsult/sgo.git
cd sgo
pnpm install
docker compose up -d
```

Acesse `http://localhost:3000` — o wizard de instalação aparece no primeiro acesso.

| O que fazer a seguir | Link |
|---|---|
| Criar seu primeiro módulo | [docs/guides/CREATE-MODULE.md](docs/guides/CREATE-MODULE.md) |
| Deploy em produção | [docs/guides/DEPLOY.md](docs/guides/DEPLOY.md) |
| Visão geral da arquitetura | [docs/architecture/SYSTEM-OVERVIEW.md](docs/architecture/SYSTEM-OVERVIEW.md) |

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 · Vite 6 · Module Federation · Tailwind CSS · Shadcn UI (`@sgo/ui`) |
| **Backend** | Hono · Drizzle ORM · PostgreSQL (ou MySQL) |
| **Infra** | Docker · Docker Swarm · Traefik · GitHub Actions |
| **Imagens** | `ghcr.io/altrsconsult/` — build com attestation Sigstore |

---

## Selos & Certificações

> **[OpenSSF Best Practices: Passing + Baseline 3](https://www.bestpractices.dev/projects/12038)** e **[OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/altrsconsult/sgo)** — duas certificações independentes que avaliam segurança, build, processos e governança com critérios rigorosos da indústria. SGO está em roadmap para **Silver (89%)**. [Ver certificação Best Practices →](https://www.bestpractices.dev/projects/12038)

### 🔐 Segurança & Conformidade

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12038/badge)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Baseline](https://www.bestpractices.dev/projects/12038/baseline)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/altrsconsult/sgo/badge)](https://scorecard.dev/viewer/?uri=github.com/altrsconsult/sgo)
[![LGPD | GDPR](https://img.shields.io/badge/LGPD%20%7C%20GDPR-ready-blue)](docs/compliance/ADEQUACAO-PRIVACIDADE.md)
[![Build attestation](https://img.shields.io/badge/Build-attested-blue)](docs/security/BUILD-AND-PROVENANCE.md)
[![SBOM](https://img.shields.io/badge/SBOM-available-blue)](https://github.com/altrsconsult/sgo/actions/workflows/security.yml)
[![Processes](https://img.shields.io/badge/Processes-documented-blue)](docs/processes/README.md)

### ⚙️ CI/CD & Qualidade

[![Docker Build](https://github.com/altrsconsult/sgo/actions/workflows/docker.yml/badge.svg)](https://github.com/altrsconsult/sgo/actions/workflows/docker.yml)
[![Security](https://github.com/altrsconsult/sgo/actions/workflows/security.yml/badge.svg)](https://github.com/altrsconsult/sgo/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

### 🎨 UX, ESG & Acessibilidade

[![WCAG 2.1](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-informational)](docs/ux/ACCESSIBILITY-CHECKLIST.md)
[![Conforto ocular](https://img.shields.io/badge/Conforto%20ocular-temas%20light%20%7C%20dark-informational)](docs/ux/CONFORTO-VISUAL.md)
[![Self-hosted](https://img.shields.io/badge/Self--hosted-yes-green)](docs/sustainability/SUSTAINABILITY.md)
[![ESG](https://img.shields.io/badge/ESG-ready-informational)](docs/sustainability/SUSTAINABILITY.md)

### 📊 Status do Projeto

[![Maintained](https://img.shields.io/badge/Maintained-yes-green)](https://github.com/altrsconsult/sgo)
[![Release](https://img.shields.io/github/v/release/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/releases)
[![Last commit](https://img.shields.io/github/last-commit/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/commits)
[![Issues](https://img.shields.io/github/issues/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/issues)
[![Language](https://img.shields.io/github/languages/top/altrsconsult/sgo)](https://github.com/altrsconsult/sgo)

---

## Documentação

| Tópico | Link |
|--------|------|
| Visão geral e contexto para agentes de IA | [docs/AGENTS.md](docs/AGENTS.md) |
| Criar um módulo | [docs/guides/CREATE-MODULE.md](docs/guides/CREATE-MODULE.md) |
| Deploy (Docker, Portainer, Node) | [docs/guides/DEPLOY.md](docs/guides/DEPLOY.md) |
| Schema do manifest de módulos | [docs/standards/MODULE-MANIFEST-SCHEMA.md](docs/standards/MODULE-MANIFEST-SCHEMA.md) |
| Segurança e proveniência de build | [docs/security/SECURITY.md](docs/security/SECURITY.md) · [BUILD-AND-PROVENANCE.md](docs/security/BUILD-AND-PROVENANCE.md) |
| Adequação LGPD/GDPR | [docs/compliance/ADEQUACAO-PRIVACIDADE.md](docs/compliance/ADEQUACAO-PRIVACIDADE.md) |
| Processos (desenvolvimento, release) | [docs/processes/README.md](docs/processes/README.md) |
| Governança e política de testes | [docs/governance/README.md](docs/governance/README.md) |
| Acessibilidade WCAG | [docs/ux/ACCESSIBILITY-CHECKLIST.md](docs/ux/ACCESSIBILITY-CHECKLIST.md) |
| Conforto visual / temas | [docs/ux/CONFORTO-VISUAL.md](docs/ux/CONFORTO-VISUAL.md) |
| Sustentabilidade (ESG/SCI) | [docs/sustainability/SUSTAINABILITY.md](docs/sustainability/SUSTAINABILITY.md) |
| OpenSSF Best Practices — mapeamento | [docs/standards/OPENSSF-BEST-PRACTICES.md](docs/standards/OPENSSF-BEST-PRACTICES.md) |
| Textos de marketing (claims e evidências) | [docs/marketing/TEXTOS-LP-CLAIMS.md](docs/marketing/TEXTOS-LP-CLAIMS.md) |

---

## Confiança e Conformidade

- **[OpenSSF Best Practices: Passing + Baseline 3](https://www.bestpractices.dev/projects/12038)** — certificação independente de documentação, segurança, build e governança; 89% para Silver. [Mapeamento completo no repo](docs/standards/OPENSSF-BEST-PRACTICES.md).
- **[OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/altrsconsult/sgo)** — análise contínua e automatizada de práticas de segurança do repositório (branch protection, dependências, CI/CD).
- **Build verificável** — imagens Docker com attestation Sigstore, SBOM disponível; [proveniência](docs/security/BUILD-AND-PROVENANCE.md).
- **Preparado para LGPD/GDPR** — [checklist](docs/compliance/LGPD-GDPR-CHECKLIST.md) e [adequação](docs/compliance/ADEQUACAO-PRIVACIDADE.md) documentadas.
- **Processos documentados** — [desenvolvimento, release, segurança](docs/processes/README.md) e [governança](docs/governance/README.md).
- **Acessibilidade** — [WCAG 2.1 AA](docs/ux/ACCESSIBILITY-CHECKLIST.md); checagem `axe` no CI.
- **Conforto ocular** — [temas claro/escuro e personalizáveis](docs/ux/CONFORTO-VISUAL.md), contraste WCAG.
- **Sustentabilidade (ESG)** — [stack enxuto, self-hosted, metodologia SCI](docs/sustainability/SUSTAINABILITY.md).
- **Política de testes** — [TESTING-POLICY](docs/governance/TESTING-POLICY.md); testes no CI.

---

## Contribuições

O SGO é construído pela comunidade. Quer participar?

- 🐛 **Bugs e melhorias** — [abra uma issue](https://github.com/altrsconsult/sgo/issues)
- 🧩 **Módulos e chassi** — veja [CONTRIBUTING.md](CONTRIBUTING.md)
- ⭐ **Se o SGO te ajudou** — [deixe uma estrela](https://github.com/altrsconsult/sgo/stargazers); ajuda outros devs a descobrirem o projeto

Ambiente inclusivo e respeitoso.

---

## Licença

**MIT** — uso comercial permitido; mantenha o aviso de copyright.

- Texto oficial (inglês): [LICENSE](LICENSE)
- Tradução informacional (PT-BR): [docs/legal/LICENSE-pt-BR.md](docs/legal/LICENSE-pt-BR.md)

---

<div align="center">

**[ALTRS Consultoria](https://altrs.com.br)** &nbsp;·&nbsp; [sgo.altrs.net](https://sgo.altrs.net) &nbsp;·&nbsp; [contato@altrs.com.br](mailto:contato@altrs.com.br)

*Feito com propósito. Código aberto. Sistema seu, para sempre.*

</div>
