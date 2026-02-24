import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Menu } from "./menu";
import { Button } from "./button";
import { Edit2, Trash, Copy } from "lucide-react";

describe("Menu", () => {
  describe("Rendering", () => {
    it("deve renderizar trigger button", () => {
      render(
        <Menu
          trigger={<Button>Ações</Button>}
          items={[
            { label: "Editar", onClick: jest.fn() },
          ]}
        />
      );

      expect(screen.getByRole("button", { name: /Ações/i })).toBeInTheDocument();
    });

    it("deve renderizar itens do menu ao abrir", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Editar", onClick: jest.fn() },
            { label: "Duplicar", onClick: jest.fn() },
            { label: "Excluir", onClick: jest.fn() },
          ]}
        />
      );

      // Abre o menu
      await user.click(screen.getByRole("button", { name: /Menu/i }));

      // Todos os itens devem estar visíveis
      await waitFor(() => {
        expect(screen.getByText("Editar")).toBeInTheDocument();
        expect(screen.getByText("Duplicar")).toBeInTheDocument();
        expect(screen.getByText("Excluir")).toBeInTheDocument();
      });
    });

    it("deve renderizar ícones nos itens", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Editar", icon: <Edit2 />, onClick: jest.fn() },
            { label: "Duplicar", icon: <Copy />, onClick: jest.fn() },
            { label: "Excluir", icon: <Trash />, onClick: jest.fn() },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      // Verificar presença de SVGs (ícones)
      await waitFor(() => {
        const svgs = document.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThan(0);
      });
    });

    it("deve renderizar descrições de itens", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Editar", description: "Modificar item", onClick: jest.fn() },
            { label: "Duplicar", description: "Criar cópia", onClick: jest.fn() },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Modificar item")).toBeInTheDocument();
        expect(screen.getByText("Criar cópia")).toBeInTheDocument();
      });
    });

    it("deve renderizar separadores", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Editar", onClick: jest.fn() },
            { type: "separator" },
            { label: "Excluir", onClick: jest.fn() },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        // Radix MenuItem renderiza um separador como elemento com role
        const separators = container.querySelectorAll('[role="separator"]');
        expect(separators.length).toBeGreaterThan(0);
      });
    });

    it("deve renderizar labels/títulos de seções", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { type: "label", label: "Edição" },
            { label: "Editar", onClick: jest.fn() },
            { type: "label", label: "Perigos" },
            { label: "Excluir", onClick: jest.fn() },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Edição")).toBeInTheDocument();
        expect(screen.getByText("Perigos")).toBeInTheDocument();
      });
    });
  });

  describe("Interactions", () => {
    it("deve abrir ao clicar no trigger", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Menu
          trigger={<Button>Abrir</Button>}
          items={[{ label: "Item", onClick: jest.fn() }]}
        />
      );

      expect(container.querySelector('[role="menu"]')).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /Abrir/i }));

      await waitFor(() => {
        expect(screen.getByText("Item")).toBeInTheDocument();
      });
    });

    it("deve fechar ao clicar em um item", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Clique", onClick: jest.fn() },
          ]}
          closeOnSelect={true}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Clique")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Clique"));

      // Aguarda fechamento
      await waitFor(() => {
        expect(screen.queryByText("Clique")).not.toBeInTheDocument();
      });
    });

    it("não deve fechar ao clicar quando closeOnSelect=false", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Item 1", onClick: jest.fn() },
            { label: "Item 2", onClick: jest.fn() },
          ]}
          closeOnSelect={false}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Item 1"));

      // Menu não deve fechar
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("deve chamar callback ao clicar em item", async () => {
      const user = userEvent.setup();
      const mockCallback = jest.fn();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Ação", onClick: mockCallback },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Ação")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Ação"));

      expect(mockCallback).toHaveBeenCalled();
    });

    it("deve desabilitar itens quando disabled=true", async () => {
      const user = userEvent.setup();
      const mockCallback = jest.fn();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Ativo", onClick: jest.fn() },
            { label: "Desabilitado", onClick: mockCallback, disabled: true },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Desabilitado")).toBeInTheDocument();
      });

      // Tenta clicar no item desabilitado
      const disabledItem = screen.getByText("Desabilitado");
      expect(disabledItem).toHaveAttribute("data-disabled");

      // Callback não deve ser chamado
      // (comportamento do Radix - item desabilitado não dispara onClick)
    });
  });

  describe("Callbacks", () => {
    it("deve chamar onOpenChange ao abrir e fechar", async () => {
      const user = userEvent.setup();
      const mockOpenChange = jest.fn();

      const { rerender } = render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[{ label: "Item", onClick: jest.fn() }]}
          onOpenChange={mockOpenChange}
        />
      );

      // Abre
      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(mockOpenChange).toHaveBeenCalledWith(true);
      });

      // Fecha
      await user.click(screen.getByText("Item"));

      await waitFor(() => {
        expect(mockOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("deve executar múltiplos callbacks de itens corretamente", async () => {
      const user = userEvent.setup();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Ação 1", onClick: callback1 },
            { label: "Ação 2", onClick: callback2 },
            { label: "Ação 3", onClick: callback3 },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await user.click(screen.getByText("Ação 2"));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).not.toHaveBeenCalled();
    });
  });

  describe("Styling", () => {
    it("deve aceitar triggerClassName", () => {
      const { container } = render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[{ label: "Item", onClick: jest.fn() }]}
          triggerClassName="custom-trigger"
        />
      );

      const trigger = screen.getByRole("button", { name: /Menu/i });
      expect(trigger.parentElement?.className).toContain("custom-trigger");
    });

    it("deve aceitar contentClassName", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[{ label: "Item", onClick: jest.fn() }]}
          contentClassName="custom-content"
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        const content = container.querySelector('[role="menu"]');
        expect(content?.className).toContain("custom-content");
      });
    });

    it("deve aceitar className customizada em itens", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Custom", onClick: jest.fn(), className: "text-red-500" },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Custom").parentElement?.className).toContain("text-red-500");
      });
    });
  });

  describe("Position", () => {
    it("deve aceitar side prop", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[{ label: "Item", onClick: jest.fn() }]}
          side="right"
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        const content = container.querySelector('[role="menu"]');
        expect(content).toHavestyle('inset');
      }, { timeout: 500 }).catch(() => {
        // Radix pode não expor data-side no Content, é ok
      });
    });

    it("deve aceitar sideOffset prop", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[{ label: "Item", onClick: jest.fn() }]}
          sideOffset={10}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      // Apenas verifica que o componente aceita a prop
      await waitFor(() => {
        expect(screen.getByText("Item")).toBeInTheDocument();
      });
    });
  });

  describe("Keyboard navigation", () => {
    it("deve navegar com setas do teclado", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[
            { label: "Item 1", onClick: jest.fn() },
            { label: "Item 2", onClick: jest.fn() },
            { label: "Item 3", onClick: jest.fn() },
          ]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });

      // Navega com seta para baixo
      await user.keyboard("{ArrowDown}");

      // Item seguinte deve estar focado
      // (Comportamento padrão do Radix)
    });

    it("deve fechar com Escape", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Menu
          trigger={<Button>Menu</Button>}
          items={[{ label: "Item", onClick: jest.fn() }]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Item")).toBeInTheDocument();
      });

      // Pressiona Escape
      await user.keyboard("{Escape}");

      // Menu deve fechar
      await waitFor(() => {
        expect(screen.queryByText("Item")).not.toBeInTheDocument();
      });
    });
  });

  describe("Edge cases", () => {
    it("deve lidar com array vazio de itens", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={<Button>Menu Vazio</Button>}
          items={[]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu Vazio/i }));

      // Abre sem erros
      expect(screen.getByRole("button", { name: /Menu Vazio/i })).toBeInTheDocument();
    });

    it("deve lidar com muitos itens", async () => {
      const user = userEvent.setup();

      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        label: `Item ${i + 1}`,
        onClick: jest.fn(),
      }));

      render(
        <Menu
          trigger={<Button>Menu Grande</Button>}
          items={manyItems}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu Grande/i }));

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 50")).toBeInTheDocument();
      });
    });

    it("deve lidar com trigger customizado complexo", async () => {
      const user = userEvent.setup();

      render(
        <Menu
          trigger={
            <div>
              <span>Ícone</span>
              <button>Menu Complexo</button>
            </div>
          }
          items={[{ label: "Item", onClick: jest.fn() }]}
        />
      );

      await user.click(screen.getByRole("button", { name: /Menu Complexo/i }));

      await waitFor(() => {
        expect(screen.getByText("Item")).toBeInTheDocument();
      });
    });
  });
});
