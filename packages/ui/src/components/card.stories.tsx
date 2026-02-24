import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content area with padding</p>
      </CardContent>
    </Card>
  ),
};

// Card with footer and actions
export const WithActions: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Update your account preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Your preferences are saved automatically</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

// Card with complex content
export const ComplexContent: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Updated 2 hours ago</CardDescription>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Progress</p>
          <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full w-3/4" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">75% complete</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

// Minimal card
export const Minimal: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent className="pt-6">
        <p>Simple content without header or footer</p>
      </CardContent>
    </Card>
  ),
};

// Multiple cards grid
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Card 1</CardTitle>
        </CardHeader>
        <CardContent>Content here</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Card 2</CardTitle>
        </CardHeader>
        <CardContent>Content here</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Card 3</CardTitle>
        </CardHeader>
        <CardContent>Content here</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Card 4</CardTitle>
        </CardHeader>
        <CardContent>Content here</CardContent>
      </Card>
    </div>
  ),
};
