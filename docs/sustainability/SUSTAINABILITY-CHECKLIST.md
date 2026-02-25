# Checklist de sustentabilidade (interno)

Itens verificáveis que sustentam os claims de eficiência e sustentabilidade do SGO. Marcar conforme o estado atual.

| Item | Verificado | Onde / observação |
|------|------------|--------------------|
| Requisitos mínimos de hardware documentados | Sim | [docs/guides/DEPLOY.md](../guides/DEPLOY.md); stack enxuto em [SUSTAINABILITY.md](SUSTAINABILITY.md) |
| Sem processos pesados em background por padrão | Sim | Backend sob demanda (Hono); jobs em background não são padrão no chassi |
| Doc de SCI / referência à metodologia disponível | Sim | [SUSTAINABILITY.md](SUSTAINABILITY.md) — link para GSF e ISO/IEC 21031 |
| Imagens Docker otimizadas (multi-stage, Alpine) | Sim | chassi/Dockerfile.backend e Dockerfile.frontend |
| Modo single-process (menos containers) disponível | Sim | SERVE_STATIC; documentado em DEPLOY |
| Self-hosted: controle de região e provedor pelo cliente | Sim | Característica do produto; doc em DEPLOY e SUSTAINABILITY |

Este checklist pode ser usado em revisões internas ou por auditores para verificar a base dos claims de sustentabilidade.
