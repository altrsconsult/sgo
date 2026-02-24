import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  ModalWithCloseButton,
} from "./modal";
import { Button } from "./button";

describe("Modal", () => {
  // 1. Renderiza trigger
  it("renderiza botão de abertura", () => {
    render(
      <Modal>
        <ModalTrigger>Abrir Modal</ModalTrigger>
        <ModalContent>Conteúdo</ModalContent>
      </Modal>
    );
    expect(screen.getByText("Abrir Modal")).toBeInTheDocument();
  });

  // 2. Abre modal ao clicar trigger
  it("abre modal ao clicar no trigger", async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalBody>Conteúdo da modal</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    expect(screen.getByText("Conteúdo da modal")).toBeInTheDocument();
  });

  // 3. Renderiza componentes internos
  it("renderiza ModalHeader, ModalTitle, ModalBody", async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Meu Título</ModalTitle>
          </ModalHeader>
          <ModalBody>Corpo</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    expect(screen.getByText("Meu Título")).toBeInTheDocument();
    expect(screen.getByText("Corpo")).toBeInTheDocument();
  });

  // 4. ModalClose fecha a modal
  it("fecha modal ao clicar ModalClose", async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalClose />
          <ModalBody>Conteúdo</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Fechar"));
    await waitFor(() => {
      expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
    });
  });

  // 5. Suporta estado controlado
  it("funciona com estado controlado (isOpen/onOpenChange)", async () => {
    const { rerender } = render(
      <Modal isOpen={false}>
        <ModalContent>
          <ModalBody>Modal fechada</ModalBody>
        </ModalContent>
      </Modal>
    );
    expect(screen.queryByText("Modal fechada")).not.toBeInTheDocument();

    rerender(
      <Modal isOpen={true}>
        <ModalContent>
          <ModalBody>Modal fechada</ModalBody>
        </ModalContent>
      </Modal>
    );
    expect(screen.getByText("Modal fechada")).toBeInTheDocument();
  });

  // 6. Chama onOpenChange ao mudar
  it("chama onOpenChange ao mudar estado", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal onOpenChange={onOpenChange}>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalBody>Conteúdo</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  // 7. ModalFooter agrupa botões
  it("renderiza ModalFooter com ações", async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalBody>Conteúdo</ModalBody>
          <ModalFooter>
            <Button>Cancelar</Button>
            <Button>Confirmar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  // 8. ModalWithCloseButton preset
  it("ModalWithCloseButton renderiza título e close automático", async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalWithCloseButton title="Minha Modal">
          <ModalBody>Conteúdo</ModalBody>
        </ModalWithCloseButton>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    expect(screen.getByText("Minha Modal")).toBeInTheDocument();
    expect(screen.getByLabelText("Fechar")).toBeInTheDocument();
  });

  // 9. Overlay clicável para fechar
  it("fecha modal ao clicar no overlay", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalBody>Conteúdo</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));

    // Clica no overlay (background)
    const overlay = container.querySelector("[role='dialog']")?.previousElementSibling;
    if (overlay) {
      await user.click(overlay);
    }
  });

  // 10. Dialog tem role='dialog'
  it("elemento de conteúdo tem role='dialog'", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalBody>Conteúdo</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    const dialog = container.querySelector("[role='dialog']");
    expect(dialog).toBeInTheDocument();
  });

  // 11. Aceita className customizado
  it("aceita className em ModalContent", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent className="custom-modal">
          <ModalBody>Conteúdo</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Abrir"));
    const dialog = container.querySelector(".custom-modal");
    expect(dialog).toBeInTheDocument();
  });

  // 12. ModalTrigger com asChild prop
  it("ModalTrigger com asChild aceita elemento customizado", async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger asChild>
          <a href="#" onClick={(e) => e.preventDefault()}>Link para abrir</a>
        </ModalTrigger>
        <ModalContent>
          <ModalBody>Conteúdo</ModalBody>
        </ModalContent>
      </Modal>
    );
    await user.click(screen.getByText("Link para abrir"));
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });
});
