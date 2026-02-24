import type { Meta, StoryObj } from "@storybook/react";
import { Users, Layers, FileText } from "lucide-react";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/button";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "Nenhum item encontrado",
    description: "Adicione um novo item para começar.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Users className="h-8 w-8" />,
    title: "Nenhum usuário cadastrado",
    description: "Crie o primeiro usuário do sistema para começar.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <Layers className="h-8 w-8" />,
    title: "Nenhum módulo instalado",
    description: "Instale módulos para adicionar funcionalidades ao sistema.",
    action: <Button>Instalar Módulo</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <FileText className="h-8 w-8" />,
    title: "Sem resultados",
    description: "Nenhum registro encontrado para o filtro aplicado. Tente outros termos.",
  },
};
