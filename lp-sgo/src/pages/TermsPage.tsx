/**
 * Página Termos — Termos de Uso
 */

export function TermsPage() {
  return (
    <div className="sgo-page sgo-legal-page">
      <div className="sgo-page-hero">
        <h1 className="sgo-page-title">Termos de Uso</h1>
        <p className="sgo-page-subtitle">Última atualização: Fevereiro de 2026</p>
      </div>

      <div className="sgo-legal-content">
        <section>
          <h2>1. Licença de Uso</h2>
          <p>
            O SGO ALTRS é fornecido sob licença de uso perpétuo. Uma vez instalado, o cliente tem direito de uso ilimitado do chassi e módulos adquiridos, sem dependência de renovação de assinatura.
          </p>
        </section>

        <section>
          <h2>2. Autonomia e Soberania</h2>
          <p>
            O sistema opera de forma autônoma no servidor do cliente. A ALTRS não tem acesso aos dados ou operação do sistema, exceto quando o cliente ativa o Nexus (gestão remota opcional).
          </p>
        </section>

        <section>
          <h2>3. Suporte e Atualizações</h2>
          <p>
            O suporte técnico e atualizações de módulos são oferecidos mediante contrato de suporte contínuo. Clientes sem contrato ativo podem instalar atualizações manualmente (via ZIP) ou contratar suporte pontual.
          </p>
        </section>

        <section>
          <h2>4. Desenvolvimento de Módulos</h2>
          <p>
            O cliente pode desenvolver módulos próprios utilizando o SDK público. Módulos desenvolvidos pelo cliente são de sua propriedade e podem ser comercializados ou compartilhados livremente.
          </p>
        </section>

        <section>
          <h2>5. Limitação de Responsabilidade</h2>
          <p>
            O SGO é fornecido "como está". A ALTRS não se responsabiliza por:
          </p>
          <ul>
            <li>Perda de dados devido a falhas de infraestrutura do cliente</li>
            <li>Incompatibilidade com sistemas de terceiros</li>
            <li>Módulos desenvolvidos por terceiros (não-ALTRS)</li>
            <li>Uso indevido ou configuração inadequada do sistema</li>
          </ul>
        </section>

        <section>
          <h2>6. Rescisão</h2>
          <p>
            O cliente pode interromper o uso do SGO a qualquer momento. A licença de uso do chassi e módulos adquiridos permanece válida indefinidamente.
          </p>
        </section>

        <section>
          <h2>7. Contato</h2>
          <p>
            Para dúvidas sobre os termos, entre em contato: <a href="mailto:contato@altrs.com.br">contato@altrs.com.br</a>
          </p>
        </section>
      </div>
    </div>
  );
}
