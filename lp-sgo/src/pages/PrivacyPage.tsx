/**
 * Página Privacidade — Política de Privacidade
 */

export function PrivacyPage() {
  return (
    <div className="sgo-page sgo-legal-page">
      <div className="sgo-page-hero">
        <h1 className="sgo-page-title">Política de Privacidade</h1>
        <p className="sgo-page-subtitle">Última atualização: Fevereiro de 2026</p>
      </div>

      <div className="sgo-legal-content">
        <section>
          <h2>1. Coleta de Dados</h2>
          <p>
            O SGO ALTRS é um sistema autônomo instalado no servidor do cliente. Não coletamos dados de uso, navegação ou operação do sistema. Todos os dados gerados e processados permanecem no ambiente do cliente.
          </p>
        </section>

        <section>
          <h2>2. Nexus (Opcional)</h2>
          <p>
            Caso o cliente opte por ativar o Nexus (gestão remota), o sistema envia pulses periódicos contendo:
          </p>
          <ul>
            <li>ID da instalação (UUID anônimo)</li>
            <li>Versão do chassi e módulos instalados</li>
            <li>Status de saúde (uptime, memória, DB)</li>
          </ul>
          <p>
            Esses dados são utilizados exclusivamente para fins de monitoramento e suporte técnico. O cliente pode desativar o Nexus a qualquer momento sem perda de funcionalidade.
          </p>
        </section>

        <section>
          <h2>3. Cookies e Armazenamento Local</h2>
          <p>
            O SGO utiliza localStorage para armazenar preferências de usuário (tema, idioma) e tokens de autenticação (JWT). Esses dados não são compartilhados com terceiros.
          </p>
        </section>

        <section>
          <h2>4. Segurança</h2>
          <p>
            A segurança dos dados é responsabilidade do cliente, uma vez que o sistema opera em sua infraestrutura. Recomendamos:
          </p>
          <ul>
            <li>HTTPS obrigatório em produção</li>
            <li>Backups regulares do banco de dados</li>
            <li>Controle de acesso via grupos e permissões</li>
            <li>Master Key armazenada de forma segura</li>
          </ul>
        </section>

        <section>
          <h2>5. Contato</h2>
          <p>
            Para dúvidas sobre privacidade, entre em contato: <a href="mailto:contato@altrs.com.br">contato@altrs.com.br</a>
          </p>
        </section>
      </div>
    </div>
  );
}
