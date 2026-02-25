# Branch Protection e Code Review (Scorecard)

Para melhorar o **OpenSSF Scorecard** (checks Branch-Protection e Code-Review), configure uma regra de proteção para a branch padrão no GitHub. Leva cerca de 2 minutos.

## Passos (uma vez por repositório)

1. No repositório **altrsconsult/sgo**, vá em **Settings** → **Branches**.
2. Em **Branch protection rules**, clique em **Add rule** (ou **Add branch protection rule**).
3. Em **Branch name pattern**, informe: `master` (ou `main`, conforme a branch padrão do repo).
4. Marque pelo menos:
   - **Require a pull request before merging**
     - **Require approvals**: 1 (ou mais, se preferir).
   - **Require status checks to pass before merging** (opcional mas recomendado): selecione os status checks que o repo já usa (ex.: Security, Testes).
5. Se quiser evitar push direto mesmo por admins: marque **Do not allow bypassing the above settings** (opcional).
6. Clique em **Create** (ou **Save changes**).

A partir daí, merges em `master` passam por PR e (pelo menos) uma aprovação. O Scorecard passa a reconhecer Branch-Protection e Code-Review quando rodar de novo.

## Referência

- [GitHub: Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-a-branch-protection-rule)
