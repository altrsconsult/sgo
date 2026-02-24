import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../components/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Botão",
    variant: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "Remover",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Cancelar",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="h-4 w-4 mr-2" />
        Novo Item
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: "ghost",
    size: "icon",
    children: <Trash2 className="h-4 w-4" />,
    "aria-label": "Remover item",
  },
};

export const Disabled: Story = {
  args: {
    children: "Desabilitado",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Salvando...",
    disabled: true,
  },
};
