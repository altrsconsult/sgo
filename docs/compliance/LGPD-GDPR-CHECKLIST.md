# Checklist LGPD / GDPR — SGO

Lista de requisitos mínimos para adequação à LGPD (Brasil) e ao GDPR (UE). A coluna **Atendido no SGO** deve ser preenchida com o estado atual; **Onde** indica rota, documento ou comportamento que atende.

| Requisito | LGPD/GDPR | Atendido no SGO | Onde (rota, doc, comportamento) |
|-----------|-----------|-----------------|----------------------------------|
| Base legal e finalidade | Art. 7 LGPD / Art. 6 GDPR | Parcial | Responsabilidade do controlador (quem implanta). O sistema não coleta dados sem contexto; finalidade deve ser definida na política de privacidade do controlador. |
| Minimização de dados | Art. 6 LGPD / Art. 5 GDPR | Sim | Apenas campos necessários no schema (users: nome, email, etc.; module_data por módulo). Sem coleta desnecessária no chassi. |
| Direito de acesso | Art. 18 LGPD / Art. 15 GDPR | Sim | Usuário: dados próprios via sessão e perfil. Admin: GET `/api/users`, GET `/api/users/:id`; módulos: GET `/api/module-data/:slug/:entityType/:entityId`. |
| Direito de correção | Art. 18 LGPD / Art. 16 GDPR | Sim | PUT/PATCH `/api/users/:id` (admin); PATCH em module-data. Usuário pode solicitar correção ao admin. |
| Direito de exclusão | Art. 18 LGPD / Art. 17 GDPR | Sim | DELETE `/api/users/:id` (admin; não exclui a si mesmo). Exclusão de dados por módulo conforme API module-data. |
| Direito de portabilidade | Art. 18 LGPD / Art. 20 GDPR | Parcial | Dados acessíveis via API (GET). Endpoint dedicado de exportação em formato portável (ex.: JSON) pode ser implementado pelo controlador ou como evolução do chassi. |
| Registro de atividades | Art. 37 LGPD / Art. 30 GDPR | Sim | Tabela `audit_logs`; GET `/api/audit` (admin) com filtros por usuário, ação, período. |
| Segurança (medidas técnicas) | Art. 46 LGPD / Art. 32 GDPR | Parcial | Senhas com bcrypt; JWT; HTTPS recomendado em produção. Responsabilidade do controlador: hardening do servidor, backup, acesso. |
| Encarregado / DPO | Art. 41 LGPD / Art. 37 GDPR | N/A (sistema) | N/A no software. O controlador deve designar e informar na política de privacidade. |
| Política de privacidade / transparência | Art. 9 LGPD / Art. 13/14 GDPR | N/A (sistema) | O controlador deve publicar política; o SGO pode exibir link ou texto configurável (whitelabel). |

**Legenda:** Sim = atendido pelo chassi; Parcial = parcialmente ou depende de uso/evolução; N/A = não aplicável ao produto (responsabilidade do controlador).

A **conformidade final** é responsabilidade de quem controla os dados (controlador). O SGO fornece as funcionalidades que suportam o cumprimento; a documentação de adequação está em [ADEQUACAO-PRIVACIDADE.md](ADEQUACAO-PRIVACIDADE.md).
