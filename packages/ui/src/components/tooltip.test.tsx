import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Tooltip, TooltipProvider } from "./tooltip";
import { Button } from "./button";

/**
 * Wrapper para testes com Tooltip (requer TooltipProvider).
 */
const TooltipWithProvider = ({ content, children, ...props }: any) => (
  <TooltipProvider>
    <Tooltip content={content} {...props}>
      {children}
    </Tooltip>
  </TooltipProvider>
);

describe("Tooltip", () => {
  describe("Rendering", () => {
    it("deve renderizar elemento trigger", () => {
      render(
        <TooltipWithProvider content="Ajuda">
          <button>Botão com dúvida</button>
        </TooltipWithProvider>
      );

      expect(screen.getByRole("button", { name: /Botão com dúvida/i })).toBeInTheDocument();
    });

    it("deve renderizar conteúdo de tooltip ao hover", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider content="Este é o tooltip">
          <button>Hover aqui</button>
        </TooltipWithProvider>
      );

      const trigger = screen.getByRole("button", { name: /Hover aqui/i });

      // Dispara hover
      await user.hover(trigger);

      // Aguarda tooltip aparecer (delay default 200ms)
      await waitFor(
        () => {
          expect(screen.getByText("Este é o tooltip")).toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });

    it("deve renderizar conteúdo ReactNode", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider
          content={
            <div data-testid="tooltip-content">
              <strong>Título</strong>
              <p>Descrição</p>
            </div>
          }
        >
          <button>Hover</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      await waitFor(
        () => {
          expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });
  });

  describe("Accessibility", () => {
    it("trigger deve ter role apropriado", () => {
      render(
        <TooltipWithProvider content="Ajuda">
          <button>Clique aqui</button>
        </TooltipWithProvider>
      );

      const trigger = screen.getByRole("button", { name: /Clique aqui/i });
      expect(trigger).toBeInTheDocument();
    });

    it("tooltip content deve ter role='tooltip'", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TooltipWithProvider content="Ajuda">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      await waitFor(() => {
        const tooltip = container.querySelector('[role="tooltip"]');
        expect(tooltip).toBeInTheDocument();
      }, { timeout: 300 });
    });

    it("deve ter suporte a navegação por teclado (Tab)", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider content="Ajuda teclado">
          <button>Foco aqui</button>
        </TooltipWithProvider>
      );

      const trigger = screen.getByRole("button");

      // Tab para focar
      await user.tab();

      expect(trigger).toHaveFocus();
    });
  });

  describe("Side/Position", () => {
    it("deve renderizar tooltip no lado top (padrão)", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TooltipWithProvider content="Top" side="top">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      await waitFor(() => {
        // Verificar data-side do Radix
        const tooltip = container.querySelector('[data-side="top"]');
        expect(tooltip).toBeInTheDocument();
      }, { timeout: 300 });
    });

    it("deve renderizar tooltip em cada lado (top, right, bottom, left)", async () => {
      const user = userEvent.setup();
      const sides = ["top", "right", "bottom", "left"] as const;

      for (const side of sides) {
        const { container, unmount } = render(
          <TooltipWithProvider content={`Lado: ${side}`} side={side}>
            <button>Trigger</button>
          </TooltipWithProvider>
        );

        await user.hover(screen.getByRole("button"));

        await waitFor(() => {
          const tooltip = container.querySelector(`[data-side="${side}"]`);
          expect(tooltip).toBeInTheDocument();
        }, { timeout: 300 });

        unmount();
      }
    });
  });

  describe("Delay", () => {
    it("deve usar delay padrão de 200ms", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();

      render(
        <TooltipWithProvider content="Delay test">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      // Antes de 200ms, não deve aparecer
      jest.advanceTimersByTime(100);
      expect(screen.queryByText("Delay test")).not.toBeInTheDocument();

      // Depois de 200ms, deve aparecer
      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText("Delay test")).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it("deve respeitar delay customizado", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();

      render(
        <TooltipWithProvider content="Custom delay" delay={500}>
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      jest.advanceTimersByTime(400);
      expect(screen.queryByText("Custom delay")).not.toBeInTheDocument();

      jest.advanceTimersByTime(100);
      expect(screen.getByText("Custom delay")).toBeInTheDocument();

      jest.useRealTimers();
    });

    it("deve usar delay=0 para mostrar instantaneamente", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider content="Instant" delay={0}>
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      // Com delay=0, deve aparecer quase imediatamente
      await waitFor(() => {
        expect(screen.getByText("Instant")).toBeInTheDocument();
      }, { timeout: 50 });
    });
  });

  describe("Disabled state", () => {
    it("não deve mostrar tooltip quando disabled=true", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider content="Desabilitado" disabled>
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      // Aguarda delay + um pouco mais
      await new Promise((r) => setTimeout(r, 300));

      expect(screen.queryByText("Desabilitado")).not.toBeInTheDocument();
    });
  });

  describe("Variant styling", () => {
    it("deve aplicar classe dark para variant='dark'", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TooltipWithProvider content="Dark tooltip" variant="dark">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      await waitFor(() => {
        const content = container.querySelector('[role="tooltip"]');
        expect(content?.className).toContain("bg-slate-900");
      }, { timeout: 300 });
    });

    it("deve aplicar classe light para variant='light'", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TooltipWithProvider content="Light tooltip" variant="light">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      await waitFor(() => {
        const content = container.querySelector('[role="tooltip"]');
        // Light tem border
        expect(content?.className).toContain("border");
      }, { timeout: 300 });
    });
  });

  describe("Interactions", () => {
    it("deve esconder tooltip ao sair do hover", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider content="Hide on unhover">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      const trigger = screen.getByRole("button");

      // Hover
      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.getByText("Hide on unhover")).toBeInTheDocument();
      }, { timeout: 300 });

      // Unhover
      await user.unhover(trigger);

      // Tooltip deve desaparecer
      await waitFor(() => {
        expect(screen.queryByText("Hide on unhover")).not.toBeInTheDocument();
      });
    });

    it("deve funcionar com trigger que é um ReactElement customizado", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider content="Custom trigger">
          <span data-testid="custom-trigger">?</span>
        </TooltipWithProvider>
      );

      const trigger = screen.getByTestId("custom-trigger");

      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.getByText("Custom trigger")).toBeInTheDocument();
      }, { timeout: 300 });
    });
  });

  describe("Edge cases", () => {
    it("deve lidar com conteúdo vazio", async () => {
      const user = userEvent.setup();

      render(
        <TooltipWithProvider content="">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      // Não deve quebrar, mas pode não exibir nada
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("deve lidar com remontagem do trigger", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <TooltipWithProvider content="Before">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.hover(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Before")).toBeInTheDocument();
      }, { timeout: 300 });

      // Remonta com novo conteúdo
      rerender(
        <TooltipWithProvider content="After">
          <button>Trigger</button>
        </TooltipWithProvider>
      );

      await user.unhover(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.queryByText("Before")).not.toBeInTheDocument();
      });
    });
  });
});
