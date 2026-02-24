import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Toast } from "./toast";

describe("Toast", () => {
  describe("Rendering", () => {
    it("deve renderizar mensagem com sucesso", () => {
      render(<Toast message="Sucesso!" variant="success" />);
      expect(screen.getByText("Sucesso!")).toBeInTheDocument();
    });

    it("deve renderizar com cada variante (success, error, warning, info)", () => {
      const variants = ["success", "error", "warning", "info"] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<Toast message={`${variant} message`} variant={variant} />);
        expect(screen.getByText(`${variant} message`)).toBeInTheDocument();
        unmount();
      });
    });

    it("deve renderizar ícone automaticamente quando showIcon=true", () => {
      const { container } = render(
        <Toast message="Com ícone" variant="success" showIcon={true} />
      );
      // Verifica presença de SVG (ícone)
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("não deve renderizar ícone quando showIcon=false", () => {
      const { container } = render(
        <Toast message="Sem ícone" variant="success" showIcon={false} />
      );
      const svgs = container.querySelectorAll("svg");
      // Apenas o X de fechar
      expect(svgs.length).toBeLessThanOrEqual(1);
    });

    it("deve renderizar ação quando fornecida", () => {
      const mockAction = jest.fn();
      render(
        <Toast
          message="Com ação"
          variant="success"
          action={{ label: "Desfazer", onClick: mockAction }}
        />
      );

      const actionButton = screen.getByText("Desfazer");
      expect(actionButton).toBeInTheDocument();
    });

    it("deve renderizar conteúdo ReactNode personalizado", () => {
      render(
        <Toast
          message={<div data-testid="custom-content">Conteúdo customizado</div>}
          variant="info"
        />
      );
      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("deve ter role='status' para acessibilidade", () => {
      const { container } = render(<Toast message="Teste a11y" variant="info" />);
      const toastElement = container.querySelector('[role="status"]');
      expect(toastElement).toBeInTheDocument();
    });

    it("deve ter aria-live='polite' para notificações polidas", () => {
      const { container } = render(<Toast message="Teste a11y" variant="info" />);
      const toastElement = container.querySelector('[aria-live="polite"]');
      expect(toastElement).toBeInTheDocument();
    });

    it("deve ter aria-atomic='true' para anúncios completos", () => {
      const { container } = render(<Toast message="Teste a11y" variant="info" />);
      const toastElement = container.querySelector('[aria-atomic="true"]');
      expect(toastElement).toBeInTheDocument();
    });

    it("botão de fechar deve ter aria-label", () => {
      render(<Toast message="Com fechar" variant="success" />);
      const closeButton = screen.getByLabelText("Fechar notificação");
      expect(closeButton).toBeInTheDocument();
    });

    it("ação deve ter aria-label", () => {
      render(
        <Toast
          message="Com ação"
          variant="success"
          action={{ label: "Tentar", onClick: jest.fn() }}
        />
      );
      const actionButton = screen.getByLabelText("Tentar");
      expect(actionButton).toBeInTheDocument();
    });
  });

  describe("Auto-dismiss", () => {
    it("deve desaparecer após duration (default 4000ms)", async () => {
      jest.useFakeTimers();
      const { container } = render(
        <Toast message="Auto-dismiss" variant="success" duration={1000} />
      );

      expect(container.querySelector('[role="status"]')).toBeInTheDocument();

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it("não deve desaparecer quando duration=0", async () => {
      jest.useFakeTimers();
      const { container } = render(
        <Toast message="Persistente" variant="success" duration={0} />
      );

      jest.advanceTimersByTime(10000);

      expect(container.querySelector('[role="status"]')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it("deve chamar onClose quando auto-dismiss", async () => {
      jest.useFakeTimers();
      const onClose = jest.fn();

      const { container } = render(
        <Toast message="Com callback" variant="success" duration={500} onClose={onClose} />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });

    it("deve usar duration=4000 como padrão", async () => {
      jest.useFakeTimers();
      const onClose = jest.fn();

      render(
        <Toast message="Default duration" variant="success" onClose={onClose} />
      );

      // Avança menos que 4000ms
      jest.advanceTimersByTime(3000);
      expect(onClose).not.toHaveBeenCalled();

      // Completa os 4000ms
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });
  });

  describe("Interactions", () => {
    it("deve chamar callback ao clicar em ação", () => {
      const mockAction = jest.fn();
      render(
        <Toast
          message="Clique em ação"
          variant="success"
          action={{ label: "Ação", onClick: mockAction }}
        />
      );

      const actionButton = screen.getByText("Ação");
      fireEvent.click(actionButton);

      expect(mockAction).toHaveBeenCalled();
    });

    it("deve fechar ao clicar no botão X", () => {
      const onClose = jest.fn();
      const { container } = render(
        <Toast
          message="Clique fechar"
          variant="success"
          duration={0}
          onClose={onClose}
        />
      );

      const closeButton = screen.getByLabelText("Fechar notificação");
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
      expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
    });

    it("deve fechar Toast após ação se duration > 0", async () => {
      jest.useFakeTimers();
      const mockAction = jest.fn();
      const { container } = render(
        <Toast
          message="Com ação e timer"
          variant="success"
          duration={2000}
          action={{ label: "Ação", onClick: mockAction }}
        />
      );

      const actionButton = screen.getByText("Ação");
      fireEvent.click(actionButton);

      expect(mockAction).toHaveBeenCalled();

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it("deve impedir múltiplos cliques no botão fechar", () => {
      const onClose = jest.fn();
      render(
        <Toast
          message="Teste"
          variant="success"
          duration={0}
          onClose={onClose}
        />
      );

      const closeButton = screen.getByLabelText("Fechar notificação");
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      // onClose deve ser chamado apenas uma vez (componente é desmontado)
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling", () => {
    it("deve aplicar classes corretas para cada variante", () => {
      const variants = ["success", "error", "warning", "info"] as const;

      variants.forEach((variant) => {
        const { container, unmount } = render(
          <Toast message="Teste" variant={variant} />
        );

        const toastElement = container.querySelector('[role="status"]');
        const classString = toastElement?.className || "";

        // Verifica presença de cores específicas
        expect(
          classString.includes("bg-") ||
          classString.includes("border-") ||
          classString.includes("text-")
        ).toBe(true);

        unmount();
      });
    });

    it("deve aceitar className customizada", () => {
      const { container } = render(
        <Toast message="Custom" variant="success" className="custom-class" />
      );

      const toastElement = container.querySelector('[role="status"]');
      expect(toastElement?.className).toContain("custom-class");
    });
  });

  describe("Edge cases", () => {
    it("deve lidar com mensagem vazia", () => {
      const { container } = render(<Toast message="" variant="info" />);
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it("deve lidar com onClose undefined", async () => {
      jest.useFakeTimers();
      const { container } = render(
        <Toast message="Sem onClose" variant="success" duration={100} />
      );

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it("deve limpar timeout ao desmontar", () => {
      jest.useFakeTimers();
      const onClose = jest.fn();

      const { unmount } = render(
        <Toast message="Cleanup test" variant="success" duration={5000} onClose={onClose} />
      );

      unmount();

      jest.advanceTimersByTime(5000);

      // onClose não deve ser chamado após desmontar
      expect(onClose).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
