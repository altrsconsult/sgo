import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectField } from "./select-field";

const OPTIONS = [
  { value: "opt1", label: "Opção 1" },
  { value: "opt2", label: "Opção 2" },
  { value: "opt3", label: "Opção 3", disabled: true },
];

describe("SelectField", () => {
  // 1. Renderiza label
  it("renderiza label do select", () => {
    render(
      <SelectField label="Categoria" options={OPTIONS} />
    );
    expect(screen.getByText("Categoria")).toBeInTheDocument();
  });

  // 2. Renderiza trigger com placeholder
  it("renderiza trigger com placeholder padrão", () => {
    render(
      <SelectField label="Escolha" options={OPTIONS} />
    );
    expect(screen.getByText("Selecione...")).toBeInTheDocument();
  });

  // 3. Placeholder customizado
  it("aceita placeholder customizado", () => {
    render(
      <SelectField
        label="Escolha"
        options={OPTIONS}
        placeholder="Escolha uma opção..."
      />
    );
    expect(screen.getByText("Escolha uma opção...")).toBeInTheDocument();
  });

  // 4. Abre dropdown ao clicar
  it("abre dropdown de opções ao clicar no trigger", async () => {
    const user = userEvent.setup();
    render(
      <SelectField label="Categoria" options={OPTIONS} />
    );
    const trigger = screen.getByText("Selecione...");
    await user.click(trigger);
    expect(screen.getByText("Opção 1")).toBeInTheDocument();
    expect(screen.getByText("Opção 2")).toBeInTheDocument();
  });

  // 5. Seleciona opção
  it("seleciona opção ao clicar", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        onChange={onChange}
      />
    );
    await user.click(screen.getByText("Selecione..."));
    await user.click(screen.getByText("Opção 1"));
    expect(onChange).toHaveBeenCalledWith("opt1");
  });

  // 6. Exibe valor selecionado
  it("exibe valor selecionado no trigger", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <SelectField label="Categoria" options={OPTIONS} />
    );
    await user.click(screen.getByText("Selecione..."));
    await user.click(screen.getByText("Opção 2"));

    rerender(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        value="opt2"
      />
    );
    expect(screen.getByText("Opção 2")).toBeInTheDocument();
  });

  // 7. Desabilita opções específicas
  it("desabilita opção quando disabled=true", async () => {
    const user = userEvent.setup();
    render(
      <SelectField label="Categoria" options={OPTIONS} />
    );
    await user.click(screen.getByText("Selecione..."));
    const opt3 = screen.getByText("Opção 3").closest("div");
    expect(opt3).toHaveAttribute("data-disabled");
  });

  // 7b. Não permite selecionar opção desabilitada
  it("não permite selecionar opção desabilitada", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        onChange={onChange}
      />
    );
    await user.click(screen.getByText("Selecione..."));
    const disabledOption = screen.getByText("Opção 3");
    await user.click(disabledOption);
    // Não deve chamar onChange para opção desabilitada
    expect(onChange).not.toHaveBeenCalledWith("opt3");
  });

  // 8. Exibe mensagem de erro
  it("exibe mensagem de erro quando fornecida", () => {
    render(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        error="Categoria obrigatória"
      />
    );
    expect(screen.getByText("Categoria obrigatória")).toBeInTheDocument();
  });

  // 9. Exibe helper text
  it("exibe helper text quando fornecido", () => {
    render(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        helperText="Escolha a categoria do produto"
      />
    );
    expect(screen.getByText("Escolha a categoria do produto")).toBeInTheDocument();
  });

  // 10. Erro tem prioridade
  it("mostra erro em vez de helper text quando ambos existem", () => {
    render(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        error="Obrigatório"
        helperText="Escolha uma opção"
      />
    );
    expect(screen.getByText("Obrigatório")).toBeInTheDocument();
    expect(screen.queryByText("Escolha uma opção")).not.toBeInTheDocument();
  });

  // 11. Marca como obrigatório
  it("exibe asterisco quando required=true", () => {
    const { container } = render(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        required
      />
    );
    const asterisk = container.querySelector(".text-destructive");
    expect(asterisk?.textContent).toBe("*");
  });

  // 12. Desabilita select
  it("desabilita select quando disabled=true", () => {
    const { container } = render(
      <SelectField
        label="Categoria"
        options={OPTIONS}
        disabled
      />
    );
    const trigger = container.querySelector("[role='button']");
    expect(trigger).toHaveAttribute("data-disabled");
  });
});
