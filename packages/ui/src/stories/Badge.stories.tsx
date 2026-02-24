import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "success"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Padrão" },
};

export const Success: Story = {
  args: { children: "Ativo", variant: "success" },
};

export const Destructive: Story = {
  args: { children: "Inativo", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Admin", variant: "outline" },
};

export const Secondary: Story = {
  args: { children: "Pendente", variant: "secondary" },
};

/** Todos os variants lado a lado */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Padrão</Badge>
      <Badge variant="success">Ativo</Badge>
      <Badge variant="secondary">Pendente</Badge>
      <Badge variant="destructive">Erro</Badge>
      <Badge variant="outline">Admin</Badge>
    </div>
  ),
};
