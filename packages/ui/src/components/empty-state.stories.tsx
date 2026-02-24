import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { Button } from "./button";
import { Inbox, Frown, Package, Search } from "lucide-react";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic empty state
export const Default: Story = {
  args: {
    icon: <Inbox className="w-12 h-12" />,
    title: "No messages",
    description: "You don't have any messages yet",
  },
};

// With action
export const WithAction: Story = {
  args: {
    icon: <Inbox className="w-12 h-12" />,
    title: "No messages",
    description: "You don't have any messages yet",
    action: <Button>Send first message</Button>,
  },
};

// No results
export const NoResults: Story = {
  render: () => (
    <EmptyState
      icon={<Search className="w-12 h-12" />}
      title="No results found"
      description="Try adjusting your search terms or filters"
      action={<Button variant="outline">Clear filters</Button>}
    />
  ),
};

// No items
export const NoItems: Story = {
  render: () => (
    <EmptyState
      icon={<Package className="w-12 h-12" />}
      title="No items"
      description="Add your first item to get started"
      action={<Button>Create item</Button>}
    />
  ),
};

// Error state
export const ErrorState: Story = {
  render: () => (
    <EmptyState
      icon={<Frown className="w-12 h-12" />}
      title="Something went wrong"
      description="We couldn't load your data. Please try again."
      action={<Button variant="destructive">Try again</Button>}
    />
  ),
};

// Minimal (no action)
export const Minimal: Story = {
  render: () => (
    <EmptyState
      title="Empty"
      description="Nothing to show here"
    />
  ),
};

// Without description
export const NoDescription: Story = {
  render: () => (
    <EmptyState
      icon={<Inbox className="w-12 h-12" />}
      title="No data available"
      action={<Button>Load data</Button>}
    />
  ),
};

// List context
export const InListContext: Story = {
  render: () => (
    <div className="w-full max-w-2xl border rounded-lg">
      <div className="p-4 border-b bg-muted">
        <h2 className="font-semibold">Messages</h2>
      </div>
      <EmptyState
        icon={<Inbox className="w-12 h-12" />}
        title="No messages"
        description="You're all caught up!"
        action={<Button size="sm">Refresh</Button>}
      />
    </div>
  ),
};
