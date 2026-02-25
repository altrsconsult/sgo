# Adequação à privacidade (LGPD / GDPR)

Este documento descreve **como o SGO oferece suporte** aos requisitos de privacidade e proteção de dados (LGPD e GDPR). A conformidade legal é de responsabilidade do **controlador** (quem implanta e decide sobre os dados); o SGO fornece as ferramentas técnicas e organizacionais que ajudam a atender às leis.

## Dados pessoais no SGO

- **Usuários do sistema:** nome, e-mail, nome de usuário, senha (hash), avatar, role (admin/user). Armazenados na tabela `users` e acessíveis via API `/api/users` (com autenticação e, quando aplicável, restrição por role).
- **Dados por módulo:** armazenados em `module_data` (por slug e entityType). O conteúdo é definido por cada módulo; o chassi não impõe estrutura além de chaves e metadados.
- **Logs de auditoria:** ações de usuários (quem, o quê, quando) em `audit_logs`, consultáveis por admin em `/api/audit`.
- **Configurações e arquivos:** `system_settings`, `module_config`, `storage_files` (metadados de uploads). Dados em disco (uploads) ficam sob controle de quem hospeda a instância.

## Direitos do titular e onde o SGO suporta

| Direito | Suporte no SGO |
|---------|----------------|
| **Acesso** | Dados do usuário podem ser consultados via API (perfil, dados de módulos). Admin pode listar e visualizar usuários e dados de módulos. |
| **Correção** | Atualização de usuário (PUT/PATCH `/api/users/:id`); atualização de registros em module-data. |
| **Exclusão** | Exclusão de usuário (DELETE `/api/users/:id`); exclusão de registros em module-data. O controlador deve definir política de exclusão em cascata (ex.: dados de módulo ao excluir usuário) conforme necessidade. |
| **Portabilidade** | Dados acessíveis via API em formato estruturado (JSON). Um endpoint de exportação “todos os meus dados” pode ser implementado pelo controlador ou como evolução do produto. |
| **Registro de atividades** | Log de auditoria (audit_logs) permite demonstrar quem acessou ou alterou o quê e quando, suportando prestação de contas (accountability). |

## Base legal e finalidade

O SGO não define a base legal nem a finalidade do tratamento — isso é definido pelo controlador na sua política de privacidade e nos termos de uso. O sistema permite que os dados sejam usados apenas no âmbito da instância (self-hosted); o controlador decide quais dados coletar e para quê.

## Medidas de segurança (técnicas)

- Autenticação por senha (hash bcrypt) e sessão JWT.
- Controle de acesso por role (admin/user) e permissões por módulo.
- Recomendação de uso em produção com HTTPS e variáveis de ambiente seguras (JWT_SECRET, DATABASE_URL).
- Logs de auditoria para ações relevantes.

A segurança do ambiente (rede, servidor, backup) é responsabilidade de quem hospeda a instância.

## Encarregado (DPO) e transparência

A indicação de encarregado e a publicação da política de privacidade são obrigações do **controlador**. O SGO permite whitelabel (nome, logo, configurações) onde o controlador pode incluir link para política de privacidade ou informações de contato do encarregado.

## Resumo

O SGO está **preparado** para suportar a adequação à LGPD e ao GDPR na medida em que oferece: acesso, correção, exclusão e registro de atividades sobre dados pessoais sob controle da instância. A conformidade completa depende das políticas e dos processos adotados pelo controlador. Para um checklist detalhado, veja [LGPD-GDPR-CHECKLIST.md](LGPD-GDPR-CHECKLIST.md).
