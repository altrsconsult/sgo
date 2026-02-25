# Build verificável e proveniência

Os artefatos oficiais do SGO (imagens Docker do chassi) são buildados no **GitHub Actions** com **attestation de proveniência**. Isso permite que qualquer pessoa verifique de onde veio a imagem, com qual commit e em qual workflow ela foi gerada.

## O que é attestation

Uma attestation é um registro criptograficamente assinado que associa um artefato (ex.: imagem `ghcr.io/altrsconsult/chassi-backend:sha-xxx`) a metadados do build:

- Repositório e organização
- Commit SHA e branch
- Workflow e job que geraram o artefato
- (Opcional) SBOM ou outros anexos

O GitHub usa **Sigstore** para assinatura; o registro é público e auditável.

## Como verificar

Com o [GitHub CLI](https://cli.github.com/) instalado e autenticado:

```bash
# Verificar attestation de uma imagem (ex.: após pull)
gh attestation verify ghcr.io/altrsconsult/chassi-backend@sha256:<digest>
```

Se a attestation for válida, o comando confirma a proveniência. Para verificação offline, consulte a [documentação do GitHub](https://docs.github.com/en/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds).

## Onde são geradas

- **Workflow:** [.github/workflows/docker.yml](../../.github/workflows/docker.yml)
- **Artefatos attestados:** imagens `chassi-backend` e `chassi-frontend` no GitHub Container Registry (`ghcr.io/altrsconsult/`).

Cada push na branch principal que altere chassi ou packages dispara o build; as imagens são publicadas com tags `latest` e `sha-<commit>` e recebem attestation de proveniência.

## SBOM (lista de componentes)

A lista de dependências (SBOM) do projeto é gerada no CI e publicada como artefato do workflow de segurança. Formato: CycloneDX ou SPDX. Localização: artefatos do job correspondente no GitHub Actions (Actions → workflow run → Artifacts).

Consultar o SBOM permite auditar a cadeia de suprimentos e verificar vulnerabilidades em dependências de forma padronizada.
