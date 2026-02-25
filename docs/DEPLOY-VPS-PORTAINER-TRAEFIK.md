# Implantar Chassi SGO 4.0 na VPS (Portainer + Traefik)

Este guia descreve como colocar o chassi em **produção ou staging** em um servidor real, usando **Portainer** e **Traefik** já instalados. Quando você tiver uma stack de exemplo de referência, encaixamos o chassi no mesmo padrão.

---

## 1. Pré-requisitos na VPS

- **Portainer** e **Traefik** já configurados (você enviará uma stack de exemplo para seguirmos).
- Acesso ao Portainer (UI) para criar stack e variáveis.
- Domínio (ou subdomínio) apontando para o servidor, ex.: `sgo.seudominio.com.br`.
- Certificado TLS: Traefik normalmente cuida disso (Let's Encrypt).

---

## 2. O que o Chassi precisa

| Componente        | Porta interna | Observação                                      |
|-------------------|---------------|--------------------------------------------------|
| **chassi-frontend** | 80 (nginx)  | Servido atrás do Traefik; rota principal (/)     |
| **chassi-backend**  | 3001        | API; rota `/api` deve ser proxy para o backend   |
| **PostgreSQL**      | 5432        | Banco; só acessível na rede interna do Docker    |

O frontend (nginx) no Docker **já faz proxy** de `/api` e `/modules-assets/` para o backend quando ambos estão na mesma rede. Ou seja: o usuário acessa um único host (ex. `https://sgo.seudominio.com.br`) e o Traefik encaminha todo o tráfego para o **frontend**; o nginx dentro do frontend repassa `/api` ao backend.

---

## 3. Variáveis de ambiente (produção)

Ajuste estes valores para produção (não use os de desenvolvimento):

| Variável      | Exemplo (produção)                    | Descrição                |
|---------------|----------------------------------------|--------------------------|
| `DATABASE_URL`| `postgresql://sgo:SENHA_FORTE@chassi-db:5432/sgo` | Connection string do Postgres |
| `JWT_SECRET`  | string longa e aleatória               | Segredo para tokens JWT  |
| `NODE_ENV`    | `production`                           | Ambiente                 |
| `PORT`        | `3001`                                 | Porta do backend        |

---

## 4. Build e tags (já feitos para 4.0.0)

Na máquina de desenvolvimento (ou CI):

```powershell
# Raiz do repositório
pnpm build:chassi
docker compose build
```

Imagens geradas (com tag **4.0.0**):

- `sgo/chassi-frontend:4.0.0`
- `sgo/chassi-backend:4.0.0`

Para subir no Docker Desktop e testar localmente:

```powershell
docker compose up -d
# Frontend: http://localhost:3000
# Backend (direto): http://localhost:3001
```

---

## 5. Próximo passo: stack de exemplo (Portainer + Traefik)

Você vai enviar uma **stack de exemplo** (YAML do Portainer) que já usa Traefik na sua VPS. Com ela, vamos:

1. **Adaptar os nomes dos serviços** e redes ao padrão que você usa.
2. **Definir labels do Traefik** (Host, TLS, etc.) para o frontend (e, se necessário, para o backend quando exposto diretamente).
3. **Incluir o PostgreSQL** na stack ou usar um banco já existente (connection string).
4. **Definir volumes** para `chassi-db-data`, `chassi-modules`, `chassi-uploads`.

Assim que você enviar a stack de referência, montamos a versão final para o chassi limpo na VPS.

---

## 6. Checklist rápido antes de produção

- [ ] `JWT_SECRET` forte e único.
- [ ] `DATABASE_URL` com senha forte; Postgres só na rede interna.
- [ ] HTTPS via Traefik (Let's Encrypt).
- [ ] Volumes persistentes para DB, módulos e uploads.
- [ ] Healthcheck do backend (já existe no Dockerfile) e, se quiser, do frontend.
