import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "secondary", "destructive", "outline", "success", "warning"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default badge
export const Default: Story = {
  args: {
    children: "New",
    variant: "default",
  },
};

// Variants
export const Secondary: Story = {
  args: {
    children: "In Progress",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Error",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Draft",
    variant: "outline",
  },
};

export const Success: Story = {
  args: {
    children: "Completed",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Pending",
    variant: "warning",
  },
};

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
};

// Status badges
export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Order Status:</span>
        <Badge variant="success">Shipped</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Payment:</span>
        <Badge variant="warning">Pending</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Return:</span>
        <Badge variant="destructive">Rejected</Badge>
      </div>
    </div>
  ),
};

// Tag list
export const TagList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <Badge variant="outline">React</Badge>
      <Badge variant="outline">TypeScript</Badge>
      <Badge variant="outline">Tailwind</Badge>
      <Badge variant="outline">Storybook</Badge>
      <Badge variant="outline">Accessibility</Badge>
    </div>
  ),
};

// With count badges
export const WithCounts: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span>Comments</span>
        <Badge>12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Likes</span>
        <Badge variant="secondary">45</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Shares</span>
        <Badge variant="success">8</Badge>
      </div>
    </div>
  ),
};
