import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["text", "email", "password", "number", "date", "file"],
    },
    disabled: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default input
export const Default: Story = {
  args: {
    placeholder: "Type something...",
    type: "text",
  },
};

// With label
export const WithLabel: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

// With error
export const WithError: Story = {
  args: {
    type: "email",
    placeholder: "your@email.com",
    error: "Email is invalid",
  },
};

// Types
export const EmailType: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
  },
};

export const PasswordType: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const NumberType: Story = {
  args: {
    type: "number",
    placeholder: "Enter a number",
    min: "1",
    max: "100",
  },
};

export const DateType: Story = {
  args: {
    type: "date",
  },
};

// States
export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

// Form group with multiple inputs
export const FormExample: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>
    </div>
  ),
};

// Multiple error states
export const ErrorStates: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <Input
        type="email"
        placeholder="Invalid email"
        error="Email format is incorrect"
      />
      <Input
        placeholder="Required field"
        error="This field is required"
      />
      <Input
        type="number"
        placeholder="Out of range"
        error="Value must be between 1 and 100"
      />
    </div>
  ),
};
