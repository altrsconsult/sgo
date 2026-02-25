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

## 7. Onde encaixar na LP

- **Página /docs:** adicionar uma seção "Confiança e conformidade" (ou "Por que confiar") com os seis blocos acima, cada um com título, 1–2 frases e link para o doc no GitHub.
- **Footer:** link "Segurança e privacidade" → SECURITY.md ou página que agrupe segurança + LGPD/GDPR.
- **Página Para Integradores (/devs):** reforçar "build verificável", "processos documentados" e "preparado para LGPD/GDPR" com os links.
- **Propostas comerciais:** usar os mesmos textos e links como anexo ou seção "Evidências e documentação".

---

## 8. Badges (se quiser exibir na LP)

- **Licença MIT:** https://img.shields.io/badge/License-MIT-yellow.svg (link: https://opensource.org/licenses/MIT)
- **Build (GitHub Actions):** https://github.com/altrsconsult/sgo/actions/workflows/docker.yml/badge.svg (link: para o workflow)
- **OpenSSF Best Practices:** após registro em bestpractices.dev, usar o badge gerado pelo site.

Copie e cole os textos acima na LP (siteData, seções de docs ou nova página de "Confiança") conforme a estrutura do site.
