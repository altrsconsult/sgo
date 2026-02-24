import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * Modal Root — Wrapper do Dialog Primitive com state management
 */
interface ModalContextType {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within <Modal>");
  }
  return context;
};

export interface ModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * Modal Root — Container da modal
 *
 * @example
 * <Modal isOpen={open} onOpenChange={setOpen}>
 *   <ModalTrigger>Open</ModalTrigger>
 *   <ModalContent>...</ModalContent>
 * </Modal>
 */
const Modal = ({ isOpen, onOpenChange, children }: ModalProps) => {
  const [open, setOpen] = React.useState(isOpen ?? false);

  // Sincroniza estado controlado
  React.useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <ModalContext.Provider value={{ isOpen: open, onOpenChange: handleOpenChange }}>
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        {children}
      </DialogPrimitive.Root>
    </ModalContext.Provider>
  );
};

/**
 * ModalTrigger — Botão/elemento que abre a modal
 */
interface ModalTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const ModalTrigger = React.forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ className, asChild, ...props }, ref) => (
    <DialogPrimitive.Trigger
      ref={ref}
      className={cn(
        asChild ? "" : "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      asChild={asChild}
      {...props}
    />
  )
);
ModalTrigger.displayName = "ModalTrigger";

/**
 * ModalOverlay — Fundo escuro
 */
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

/**
 * ModalContent — Dialog principal (centrado)
 */
const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </DialogPrimitive.Portal>
));
ModalContent.displayName = "ModalContent";

/**
 * ModalHeader — Topo com título e close button
 */
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between space-y-1.5", className)}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

/**
 * ModalTitle — Título da modal
 */
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

/**
 * ModalDescription — Descrição/subtítulo
 */
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

/**
 * ModalBody — Conteúdo principal
 */
const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("overflow-y-auto max-h-[calc(100vh-200px)]", className)}
    {...props}
  />
));
ModalBody.displayName = "ModalBody";

/**
 * ModalFooter — Ações (botões)
 */
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex justify-end gap-2", className)}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";

/**
 * ModalClose — Botão de fechar explícito
 */
const ModalClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 p-0",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Fechar</span>
  </DialogPrimitive.Close>
));
ModalClose.displayName = "ModalClose";

/**
 * Preset: ModalWithCloseButton
 * Combina Header com título e Close button automaticamente
 */
interface ModalWithCloseButtonProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ModalWithCloseButton = React.forwardRef<
  HTMLDivElement,
  ModalWithCloseButtonProps
>(({ title, children, className }, ref) => (
  <ModalContent ref={ref} className={className}>
    <ModalHeader className="flex items-center justify-between">
      <ModalTitle>{title}</ModalTitle>
      <ModalClose />
    </ModalHeader>
    {children}
  </ModalContent>
));
ModalWithCloseButton.displayName = "ModalWithCloseButton";

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
  ModalOverlay,
  ModalWithCloseButton,
};
