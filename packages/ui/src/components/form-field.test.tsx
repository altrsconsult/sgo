import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./form-field";
import { Input } from "./input";

describe("FormField", () => {
  // 1. Renderização básica
  it("renderiza label e input", () => {
    render(
      <FormField label="E-mail" input={<Input type="email" />} />
    );
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  // 2. Conecta label com input via htmlFor/id
  it("conecta label ao input via atributo htmlFor", () => {
    const { container } = render(
      <FormField label="Nome" input={<Input />} />
    );
    const label = container.querySelector("label");
    const input = container.querySelector("input");
    expect(label?.htmlFor).toBeDefined();
    expect(input?.id).toBeDefined();
    expect(label?.htmlFor).toBe(input?.id);
  });

  // 3. Exibe mensagem de erro
  it("exibe mensagem de erro quando erro é fornecido", () => {
    render(
      <FormField
        label="Senha"
        input={<Input type="password" />}
        error="Senha deve ter no mínimo 8 caracteres"
      />
    );
    expect(screen.getByText("Senha deve ter no mínimo 8 caracteres")).toBeInTheDocument();
  });

  // 4. Exibe helper text
  it("exibe helper text quando fornecido", () => {
    render(
      <FormField
        label="E-mail"
        input={<Input type="email" />}
        helperText="Não compartilharemos seu e-mail"
      />
    );
    expect(screen.getByText("Não compartilharemos seu e-mail")).toBeInTheDocument();
  });

  // 5. Erro tem prioridade sobre helper text
  it("mostra erro em vez de helper text quando ambos existem", () => {
    render(
      <FormField
        label="E-mail"
        input={<Input type="email" />}
        error="E-mail inválido"
        helperText="Digite um e-mail válido"
      />
    );
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(screen.queryByText("Digite um e-mail válido")).not.toBeInTheDocument();
  });

  // 6. Marca como obrigatório com asterisco
  it("exibe asterisco quando required=true", () => {
    const { container } = render(
      <FormField label="Nome" input={<Input />} required />
    );
    const asterisk = container.querySelector(".text-destructive");
    expect(asterisk?.textContent).toBe("*");
  });

  // 7. Desabilita campo
  it("desabilita input quando disabled=true", () => {
    render(
      <FormField label="Nome" input={<Input />} disabled />
    );
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  // 8. Aplica classe de desabilitação no label
  it("aplica classe opacity-50 no label quando disabled", () => {
    const { container } = render(
      <FormField label="Nome" input={<Input />} disabled />
    );
    const label = container.querySelector("label");
    expect(label?.className).toContain("opacity-50");
  });

  // 9. Passa aria-invalid para input
  it("passa aria-invalid=true ao input quando há erro", () => {
    render(
      <FormField
        label="E-mail"
        input={<Input type="email" />}
        error="Obrigatório"
      />
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  // 10. Define aria-describedby corretamente
  it("conecta aria-describedby quando há erro", () => {
    const { container } = render(
      <FormField
        label="E-mail"
        input={<Input />}
        error="Erro"
      />
    );
    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-describedby")).toBeDefined();
  });

  // 11. Aceita className customizado
  it("aceita e aplica className customizado", () => {
    const { container } = render(
      <FormField
        label="Nome"
        input={<Input />}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  // 12. Preserva props do input passado
  it("preserva propriedades do Input passado", () => {
    render(
      <FormField
        label="E-mail"
        input={<Input type="email" placeholder="seu@email.com" />}
      />
    );
    const input = screen.getByPlaceholderText("seu@email.com");
    expect(input).toHaveAttribute("type", "email");
  });
});
