# Textos para LP e marketing — claims e links

Este documento reúne **textos prontos** e **links** para usar na landing page (sgo.altrs.net) e em materiais comerciais. Cada claim aponta para a documentação no repositório que o sustenta.

**Repositório:** https://github.com/altrsconsult/sgo

---

## 1. Build verificável / integridade

**Claim curto:** Build verificável; artefatos com proveniência assinada.

**Texto sugerido (LP/comercial):**  
"Os artefatos oficiais do SGO são buildados no GitHub Actions com attestation de proveniência. Você pode verificar a origem e a integridade das imagens e do processo de build."

**Link:** https://github.com/altrsconsult/sgo/blob/main/docs/security/BUILD-AND-PROVENANCE.md

---

## 2. Preparado para LGPD / GDPR

**Claim curto:** Sistema preparado para LGPD e GDPR; suporte aos direitos do titular.

**Texto sugerido (LP/comercial):**  
"O SGO oferece as funcionalidades que suportam a adequação à LGPD e ao GDPR: acesso, correção, exclusão e registro de atividades sobre dados pessoais. A conformidade final é responsabilidade de quem controla os dados; a documentação de adequação está no repositório."

**Links:**  
- Adequação: https://github.com/altrsconsult/sgo/blob/main/docs/compliance/ADEQUACAO-PRIVACIDADE.md  
- Checklist: https://github.com/altrsconsult/sgo/blob/main/docs/compliance/LGPD-GDPR-CHECKLIST.md

---

## 3. Processos documentados (ISO-ready)

**Claim curto:** Processos documentados; base para certificação (ISO-ready).

**Texto sugerido (LP/comercial):**  
"Desenvolvimento, release, segurança e privacidade estão documentados no repositório. Processos claros e evidências (CI, checklists) permitem auditoria e preparação para certificações."

**Link:** https://github.com/altrsconsult/sgo/tree/main/docs/processes

---

## 4. Segurança no desenvolvimento

**Claim curto:** Código limpo, seguindo boas práticas de segurança.

**Texto sugerido (LP/comercial):**  
"Todo PR passa por auditoria de dependências, scan de secrets e revisão. Imagens Docker são escaneadas; build com attestation e SBOM disponível. Política de reporte de vulnerabilidades publicada."

**Links:**  
- Política de segurança: https://github.com/altrsconsult/sgo/blob/main/docs/security/SECURITY.md  
- Processo de desenvolvimento seguro: https://github.com/altrsconsult/sgo/blob/main/docs/security/DEVELOPMENT-SECURITY.md

---

## 5. Acessibilidade (WCAG)

**Claim curto:** Critérios de acessibilidade considerados; preparado para WCAG.

**Texto sugerido (LP/comercial):**  
"O design system e o chassi seguem critérios de acessibilidade (WCAG 2.1 AA). Checklist documentado no repositório; o CI executa checagem automática com axe."

**Link:** https://github.com/altrsconsult/sgo/blob/main/docs/ux/ACCESSIBILITY-CHECKLIST.md

---

## 6. Sustentabilidade e eficiência (ESG)

**Claim curto:** Software eficiente em recursos; self-hosted; preparado para mensuração de carbono (SCI).

**Texto sugerido (LP/comercial):**  
"Stack enxuto, self-hosted: você escolhe região e provedor. Menos redundância, controle sobre energia e dados. Documentação de sustentabilidade e referência à metodologia SCI (Green Software Foundation) no repositório."

**Link:** https://github.com/altrsconsult/sgo/blob/main/docs/sustainability/SUSTAINABILITY.md

---

## 6a. Certificação OpenSSF Best Practices (destaque marketing)

**Claim curto:** Certificado OpenSSF Best Practices (Baseline 3); melhores práticas de segurança open source verificáveis.

**Texto sugerido (LP/comercial):**  
"O SGO é um dos projetos que aderiram voluntariamente ao programa de melhores práticas da Open Source Security Foundation (OpenSSF). Alcançamos o selo **Baseline 3**, o que atesta que o projeto atende a critérios verificáveis de documentação, segurança, build reproduzível, SBOM e governança. Não é autodeclaração: a certificação é conferida pelo bestpractices.dev e pode ser consultada por qualquer pessoa. Um diferencial para quem escolhe software open source com seriedade."

**Links:**  
- Certificação (ver selo e critérios): https://www.bestpractices.dev/projects/12038  
- Mapeamento de critérios no repo: https://github.com/altrsconsult/sgo/blob/main/docs/standards/OPENSSF-BEST-PRACTICES.md

**Badges para incorporar (Markdown):**
```markdown
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12038/badge)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Baseline 1](https://www.bestpractices.dev/projects/12038/baseline-1)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Baseline 2](https://www.bestpractices.dev/projects/12038/baseline-2)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Baseline 3](https://www.bestpractices.dev/projects/12038/baseline-3)](https://www.bestpractices.dev/projects/12038)
```

**Onde encaixar na LP:** Destaque no topo da seção "Por que confiar" ou em um bloco "Certificações e selos"; hero ou sidebar na página Para Integradores (/devs); footer "Segurança e certificações".

---

## 6b. Conforto visual / conforto ocular

**Claim curto:** Temas pensados para conforto ocular; claro, escuro e personalizável; contraste WCAG.

**Texto sugerido (LP/comercial):**  
"O SGO oferece tema claro e escuro e suporte a temas personalizáveis. Contraste em conformidade com WCAG 2.1 AA, reduzindo fadiga visual em uso prolongado. Ideal para equipes que passam horas no sistema."

**Links:**  
- Conforto visual: https://github.com/altrsconsult/sgo/blob/main/docs/ux/CONFORTO-VISUAL.md  
- Acessibilidade (contraste): https://github.com/altrsconsult/sgo/blob/main/docs/ux/ACCESSIBILITY-CHECKLIST.md  
- Tema custom: https://github.com/altrsconsult/sgo/blob/main/docs/guides/CUSTOM-THEME-SCHEMA.md

---

## 7. Onde encaixar na LP

- **Certificação OpenSSF:** destaque no topo da seção "Por que confiar" (bloco com selo + texto + link para bestpractices.dev); opcional na página /devs e no footer ("Certificações").
- **Página /docs:** adicionar uma seção "Confiança e conformidade" (ou "Por que confiar") com os blocos acima, cada um com título, 1–2 frases e link para o doc no GitHub.
- **Footer:** link "Segurança e privacidade" → SECURITY.md ou página que agrupe segurança + LGPD/GDPR.
- **Página Para Integradores (/devs):** reforçar **OpenSSF**, "build verificável", "processos documentados" e "preparado para LGPD/GDPR" com os links.
- **Propostas comerciais:** usar os mesmos textos e links como anexo ou seção "Evidências e documentação"; incluir print ou link do selo OpenSSF.

---

## 8. Badges (se quiser exibir na LP)

- **Licença MIT:** https://img.shields.io/badge/License-MIT-yellow.svg (link: https://opensource.org/licenses/MIT)
- **Build (GitHub Actions):** https://github.com/altrsconsult/sgo/actions/workflows/docker.yml/badge.svg (link: para o workflow)
- **OpenSSF Best Practices:** após registro em bestpractices.dev, usar o badge gerado pelo site.
- **Maintained:** https://img.shields.io/badge/Maintained-yes-green
- **Node 20:** https://img.shields.io/badge/node-%3E%3D20-brightgreen
- **TypeScript:** https://img.shields.io/badge/TypeScript-5.x-blue
- **ESG / Sustentabilidade:** https://img.shields.io/badge/ESG-ready-informational (link: docs/sustainability/SUSTAINABILITY.md)
- **Conforto ocular:** https://img.shields.io/badge/Conforto%20ocular-temas%20light%20%7C%20dark-informational (link: docs/ux/CONFORTO-VISUAL.md)

---

## 9. Seção "Por que confiar" / "Conformidade" (pronta para colar na LP)

Use na LP (página principal, /docs ou página dedicada). Cada bloco tem título, texto comercial e link para o doc no GitHub.

**Título sugerido da seção:** *Por que confiar no SGO* ou *Confiança e conformidade*

**Intro (opcional):**  
"O SGO é desenvolvido com processos documentados, build verificável e foco em privacidade, acessibilidade e sustentabilidade. Abaixo, os pontos que sustentam nossa proposta para empresas e integradores."

| # | Título | Texto (1–2 frases) | Link |
|---|--------|---------------------|------|
| 1 | **Build verificável** | Os artefatos oficiais são buildados no GitHub Actions com attestation de proveniência. Você pode verificar a origem e a integridade das imagens e do processo de build. | [BUILD-AND-PROVENANCE.md](https://github.com/altrsconsult/sgo/blob/main/docs/security/BUILD-AND-PROVENANCE.md) |
| 2 | **Preparado para LGPD e GDPR** | O SGO oferece funcionalidades que suportam adequação à LGPD e ao GDPR: acesso, correção, exclusão e registro de atividades sobre dados pessoais. A documentação de adequação está no repositório. | [ADEQUACAO-PRIVACIDADE.md](https://github.com/altrsconsult/sgo/blob/main/docs/compliance/ADEQUACAO-PRIVACIDADE.md) · [Checklist](https://github.com/altrsconsult/sgo/blob/main/docs/compliance/LGPD-GDPR-CHECKLIST.md) |
| 3 | **Processos documentados (ISO-ready)** | Desenvolvimento, release, segurança e privacidade estão documentados no repositório. Processos claros e evidências (CI, checklists) permitem auditoria e preparação para certificações. | [docs/processes](https://github.com/altrsconsult/sgo/tree/main/docs/processes) |
| 4 | **Segurança no desenvolvimento** | Todo PR passa por auditoria de dependências, scan de secrets e revisão. Imagens Docker são escaneadas; build com attestation e SBOM disponível. Política de reporte de vulnerabilidades publicada. | [SECURITY.md](https://github.com/altrsconsult/sgo/blob/main/docs/security/SECURITY.md) · [DEVELOPMENT-SECURITY.md](https://github.com/altrsconsult/sgo/blob/main/docs/security/DEVELOPMENT-SECURITY.md) |
| 5 | **Acessibilidade (WCAG 2.1 AA)** | O design system e o chassi seguem critérios de acessibilidade. Checklist documentado no repositório; o CI executa checagem automática com axe. | [ACCESSIBILITY-CHECKLIST.md](https://github.com/altrsconsult/sgo/blob/main/docs/ux/ACCESSIBILITY-CHECKLIST.md) |
| 6 | **Sustentabilidade e eficiência** | Stack enxuto, self-hosted: você escolhe região e provedor. Menos redundância, controle sobre energia e dados. Documentação de sustentabilidade e referência à metodologia SCI (Green Software Foundation) no repositório. | [SUSTAINABILITY.md](https://github.com/altrsconsult/sgo/blob/main/docs/sustainability/SUSTAINABILITY.md) |

**Footer da seção (opcional):**  
"Evidências e documentação técnica: [repositório no GitHub](https://github.com/altrsconsult/sgo)."

---

Copie e cole os textos acima na LP (siteData, seções de docs ou nova página de "Confiança") conforme a estrutura do site.
