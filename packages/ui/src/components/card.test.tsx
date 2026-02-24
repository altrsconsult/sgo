import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

describe("Card (Molecule)", () => {
  // 1. Renderiza Card com conteúdo
  it("renderiza Card container", () => {
    const { container } = render(
      <Card>Conteúdo do card</Card>
    );
    expect(screen.getByText("Conteúdo do card")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  // 2. Variante default
  it("aplica variante default por padrão", () => {
    const { container } = render(<Card>Teste</Card>);
    expect(container.firstChild).toHaveClass("border");
    expect(container.firstChild).toHaveClass("shadow-sm");
  });

  // 3. Variante elevated
  it("aplica variante elevated com shadow-lg", () => {
    const { container } = render(
      <Card variant="elevated">Teste</Card>
    );
    expect(container.firstChild).toHaveClass("shadow-lg");
    expect(container.firstChild).not.toHaveClass("border");
  });

  // 4. Variante outlined
  it("aplica variante outlined com border-2", () => {
    const { container } = render(
      <Card variant="outlined">Teste</Card>
    );
    expect(container.firstChild).toHaveClass("border-2");
  });

  // 5. Variante ghost
  it("aplica variante ghost sem sombra/borda", () => {
    const { container } = render(
      <Card variant="ghost">Teste</Card>
    );
    expect(container.firstChild).not.toHaveClass("border");
    expect(container.firstChild).not.toHaveClass("shadow");
  });

  // 6. Padding none
  it("aplica padding=none sem padding", () => {
    const { container } = render(
      <Card padding="none">Teste</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.style.padding || card.className).not.toContain("p-");
  });

  // 7. Padding sm
  it("aplica padding=sm com p-4", () => {
    const { container } = render(
      <Card padding="sm">Teste</Card>
    );
    expect(container.firstChild).toHaveClass("p-4");
  });

  // 8. Padding md (padrão)
  it("aplica padding=md por padrão", () => {
    const { container } = render(<Card>Teste</Card>);
    expect(container.firstChild).toHaveClass("p-6");
  });

  // 9. Padding lg
  it("aplica padding=lg com p-8", () => {
    const { container } = render(
      <Card padding="lg">Teste</Card>
    );
    expect(container.firstChild).toHaveClass("p-8");
  });

  // 10. CardHeader com espaçamento
  it("renderiza CardHeader com espaçamento", () => {
    const { container } = render(
      <CardHeader>Cabeçalho</CardHeader>
    );
    expect(screen.getByText("Cabeçalho")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("flex-col");
  });

  // 11. CardTitle com semântica h3
  it("renderiza CardTitle como <h3>", () => {
    const { container } = render(
      <CardTitle>Meu Título</CardTitle>
    );
    expect(container.querySelector("h3")).toHaveTextContent("Meu Título");
  });

  // 12. CardDescription com cor muted
  it("renderiza CardDescription com cor muted-foreground", () => {
    const { container } = render(
      <CardDescription>Descrição</CardDescription>
    );
    expect(container.firstChild).toHaveClass("text-muted-foreground");
  });

  // 13. CardContent com padding top reset
  it("renderiza CardContent com pt-0", () => {
    const { container } = render(
      <CardContent>Conteúdo</CardContent>
    );
    expect(container.firstChild).toHaveClass("pt-0");
  });

  // 14. CardFooter para ações
  it("renderiza CardFooter com flex items-center", () => {
    const { container } = render(
      <CardFooter>Ações</CardFooter>
    );
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("items-center");
  });

  // 15. Composição completa
  it("renderiza Card completo com Header/Title/Description/Content/Footer", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título do Card</CardTitle>
          <CardDescription>Subtítulo descritivo</CardDescription>
        </CardHeader>
        <CardContent>Conteúdo principal aqui</CardContent>
        <CardFooter>Botões de ação</CardFooter>
      </Card>
    );
    expect(screen.getByText("Título do Card")).toBeInTheDocument();
    expect(screen.getByText("Subtítulo descritivo")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo principal aqui")).toBeInTheDocument();
    expect(screen.getByText("Botões de ação")).toBeInTheDocument();
  });

  // 16. Aceita className customizado
  it("aceita className customizado no Card", () => {
    const { container } = render(
      <Card className="custom-class">Teste</Card>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
