import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./alert";

describe("Alert", () => {
  // 1. Renderiza com mensagem
  it("renderiza alerta com mensagem", () => {
    render(<Alert variant="info" message="Operação bem-sucedida" />);
    expect(screen.getByText("Operação bem-sucedida")).toBeInTheDocument();
  });

  // 2. Renderiza título + mensagem
  it("renderiza título quando fornecido", () => {
    render(
      <Alert
        variant="success"
        title="Sucesso"
        message="Operação concluída"
      />
    );
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText("Operação concluída")).toBeInTheDocument();
  });

  // 3. Variante success tem role correto
  it("usa role='status' para alerts de info/success", () => {
    const { container } = render(
      <Alert variant="success" message="Sucesso" />
    );
    expect(container.firstChild).toHaveAttribute("role", "status");
  });

  // 4. Variante error tem role alert
  it("usa role='alert' para alerts de error", () => {
    const { container } = render(
      <Alert variant="error" message="Erro" />
    );
    expect(container.firstChild).toHaveAttribute("role", "alert");
  });

  // 5. Variante warning tem role alert
  it("usa role='alert' para alerts de warning", () => {
    const { container } = render(
      <Alert variant="warning" message="Atenção" />
    );
    expect(container.firstChild).toHaveAttribute("role", "alert");
  });

  // 6. aria-live assertive para error
  it("usa aria-live='assertive' para error", () => {
    const { container } = render(
      <Alert variant="error" message="Erro crítico" />
    );
    expect(container.firstChild).toHaveAttribute("aria-live", "assertive");
  });

  // 7. aria-live polite para info
  it("usa aria-live='polite' para info", () => {
    const { container } = render(
      <Alert variant="info" message="Info" />
    );
    expect(container.firstChild).toHaveAttribute("aria-live", "polite");
  });

  // 8. Botão fechar quando closable=true
  it("renderiza botão fechar quando closable=true", () => {
    render(
      <Alert
        variant="info"
        message="Feche-me"
        closable
      />
    );
    expect(screen.getByLabelText("Fechar alerta")).toBeInTheDocument();
  });

  // 9. Chama onClose ao clicar fechar
  it("chama onClose ao clicar no botão fechar", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert
        variant="info"
        message="Teste"
        closable
        onClose={onClose}
      />
    );
    await user.click(screen.getByLabelText("Fechar alerta"));
    expect(onClose).toHaveBeenCalled();
  });

  // 10. Desaparece após fechar
  it("remove alert do DOM após fechar", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Alert
        variant="info"
        message="Teste"
        closable
      />
    );
    expect(screen.getByText("Teste")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Fechar alerta"));
    expect(screen.queryByText("Teste")).not.toBeInTheDocument();
  });

  // 11. Aceita role customizado
  it("permite sobrescrever role com prop", () => {
    const { container } = render(
      <Alert
        variant="info"
        message="Teste"
        role="region"
      />
    );
    expect(container.firstChild).toHaveAttribute("role", "region");
  });

  // 12. Renderiza ícone correto por variante
  it("renderiza ícone de sucesso para variant=success", () => {
    const { container } = render(
      <Alert variant="success" message="Sucesso" />
    );
    // Procura por SVG dentro do alert
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
