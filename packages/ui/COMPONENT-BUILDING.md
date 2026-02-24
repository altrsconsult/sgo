# Building New Components — SGO Design System

Step-by-step guide for creating new components that integrate seamlessly with the SGO Design System.

---

## Table of Contents

1. [Before You Build](#before-you-build)
2. [Component Template](#component-template)
3. [TypeScript Props](#typescript-props)
4. [Design Tokens Usage](#design-tokens-usage)
5. [Styling with CVA](#styling-with-cva)
6. [Accessibility Checklist](#accessibility-checklist)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)
9. [Storybook Stories](#storybook-stories)
10. [Common Patterns](#common-patterns)

---

## Before You Build

### Step 1: Check for Existing Components

Search `COMPONENT-LIBRARY.md` first. The component you need might already exist.

**Can you compose existing components instead?**

```tsx
// Instead of building custom AlertBox:
// Compose existing Card + Badge + Button
<Card className="border-destructive bg-destructive/5">
  <CardHeader>
    <Badge variant="destructive">Aviso</Badge>
  </CardHeader>
  <CardContent>Sua mensagem aqui</CardContent>
  <CardFooter>
    <Button variant="destructive">Ação</Button>
  </CardFooter>
</Card>
```

### Step 2: Verify Necessity

Ask yourself:
- Will this be used in 2+ different modules/features?
- Is it complex enough to warrant a component?
- Does it follow the Design System style?

If not, use existing components with `className` customization.

### Step 3: Check Dependencies

Before building, identify external libraries:
- Radix UI? (Prefer for complex interactions)
- Custom logic only?
- Hooks needed?

---

## Component Template

### File Structure

Place component in `packages/ui/src/components/{component-name}.tsx`:

```
packages/ui/src/components/
├── button.tsx         (existing)
├── input.tsx          (existing)
├── my-new-component.tsx  (your component)
└── ...
```

### Basic Component Template

```tsx
/**
 * MyComponent — Short description of what it does.
 *
 * Main use case and benefit explained in 1-2 sentences.
 */

import * as React from "react";
import { cn } from "../lib/utils";

// 1. PROPS INTERFACE
export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Brief description of this prop */
  variant?: "default" | "secondary";
  /** Another prop description */
  size?: "sm" | "md" | "lg";
  /** Optional child content description */
  children?: React.ReactNode;
}

// 2. COMPONENT DEFINITION
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md",
          // Variant styles
          variant === "default" && "bg-primary text-primary-foreground",
          variant === "secondary" && "bg-secondary text-secondary-foreground",
          // Size styles
          size === "sm" && "px-2 py-1 text-sm",
          size === "md" && "px-4 py-2 text-base",
          size === "lg" && "px-6 py-3 text-lg",
          // User overrides
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = "MyComponent";

// 3. EXPORT
export { MyComponent };
export type { MyComponentProps };
```

---

## TypeScript Props

### Interface Pattern

```tsx
// For HTML element wrapper components
export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Description of prop */
  variant?: "default" | "secondary";
  /** Is this required? */
  title: string;
  /** Optional prop with default */
  size?: "sm" | "md" | "lg";
  /** Callback functions */
  onAction?: (value: string) => void;
  /** Optional children */
  children?: React.ReactNode;
}

// For button-like components
export interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

// For input-like components
export interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helpText?: string;
}
```

### Variant Union Types

```tsx
type Variant = "primary" | "secondary" | "destructive" | "ghost";
type Size = "sm" | "md" | "lg" | "icon";

// More maintainable than duplicating in interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}
```

---

## Design Tokens Usage

### Color Tokens

Always use design tokens, never hardcoded colors:

```tsx
// ✅ Good: Uses design tokens
const MyComponent = ({ variant }) => {
  const bgColor = variant === "primary"
    ? "bg-primary text-primary-foreground"
    : "bg-secondary text-secondary-foreground";

  return <div className={bgColor}>Content</div>;
};

// ❌ Bad: Hardcoded color
const MyComponent = () => {
  return <div className="bg-blue-500">Content</div>;
};
```

### Available Tokens

**Backgrounds:**
- `bg-primary` — Brand color (blue)
- `bg-secondary` — Alternative
- `bg-destructive` — Error/dangerous
- `bg-background` — Page background
- `bg-muted` — Disabled/placeholder

**Text:**
- `text-foreground` — Primary text (black/white)
- `text-muted-foreground` — Secondary text (gray)
- `text-primary-foreground` — Text on primary bg
- `text-destructive-foreground` — Text on destructive bg

**Borders:**
- `border-border` — General borders
- `border-input` — Form input borders
- `border-destructive` — Error borders

**Spacing (Tailwind):**
- `p-2`, `p-3`, `p-4`, `p-6` — Padding
- `m-2`, `m-4`, `m-6` — Margins
- `gap-2`, `gap-4`, `gap-6` — Flex/grid gaps

**Radius:**
- `rounded-md` — Medium radius (4px)
- `rounded-lg` — Large radius (8px)
- `rounded-full` — Circle/pill shape

---

## Styling with CVA (Class Variance Authority)

For complex variants, use CVA:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

// Define all variants in one place
const myComponentVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      // Optional: styles based on multiple variant combinations
      {
        variant: "outline",
        size: "icon",
        className: "border-input",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Extract props type
export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

// Use in component
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

MyComponent.displayName = "MyComponent";
export { MyComponent, myComponentVariants };
```

**Benefits of CVA:**
- Centralized variant definitions
- Type-safe variant combinations
- No string concatenation errors
- Easy to maintain and extend

---

## Accessibility Checklist

### Semantic HTML

```tsx
// ✅ Good: Use semantic tags
export const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  (props, ref) => {
    return <button ref={ref} {...props} />;
  }
);

// ❌ Bad: Div masquerading as button
export const MyButton = (props) => {
  return <div role="button" {...props} />;
};
```

### Focus Management

```tsx
// ✅ Good: Forward ref for focus control
export const MyInput = React.forwardRef<HTMLInputElement, MyInputProps>(
  ({ error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <input
          ref={ref}
          className={cn(
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          {...props}
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }
);

MyInput.displayName = "MyInput";
```

### ARIA Labels

```tsx
// ✅ Good: Provide aria-label for icon-only buttons
<Button
  size="icon"
  variant="ghost"
  aria-label="Abrir menu"
  onClick={toggleMenu}
>
  <MenuIcon />
</Button>

// ✅ Good: Connect label to input
<label htmlFor="myInput">Seu nome</label>
<input id="myInput" />

// ✅ Good: Describe dialogs
<Dialog aria-label="Confirmar deletação">
  <DialogTitle>Tem certeza?</DialogTitle>
  <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
</Dialog>
```

### Color Contrast

Test contrast ratios with:
- WebAIM Color Contrast Checker
- axe DevTools browser extension
- Storybook accessibility addon

**Minimum ratios:**
- **Normal text:** 4.5:1 (WCAG AA)
- **Large text (18px+):** 3:1 (WCAG AA)
- **Enhanced:** 7:1 (WCAG AAA)

Our design tokens meet AA standards. Don't create custom colors.

### Keyboard Navigation

```tsx
// ✅ Good: Support keyboard interactions
export const MyDropdown = ({ items, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      onSelect(items[selectedIndex]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div onKeyDown={handleKeyDown} role="listbox">
      {/* Dropdown content */}
    </div>
  );
};
```

### ARIA Live Regions

For dynamic content updates:

```tsx
// ✅ Good: Announce form validation errors
<div aria-live="polite" aria-atomic="true">
  {error && <p className="text-destructive">{error}</p>}
</div>

// ✅ Good: Announce loading state
<Button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? "Salvando..." : "Salvar"}
</Button>
```

---

## Testing Requirements

### Unit Tests

Create `{component}.test.tsx` alongside component:

```tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("renders with default variant", () => {
    render(<MyComponent>Default</MyComponent>);
    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it("renders with secondary variant", () => {
    const { container } = render(
      <MyComponent variant="secondary">Secondary</MyComponent>
    );
    expect(container.firstChild).toHaveClass("bg-secondary");
  });

  it("supports className override", () => {
    const { container } = render(
      <MyComponent className="custom-class">Content</MyComponent>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<MyComponent ref={ref}>Content</MyComponent>);
    expect(ref.current).toBeInTheDocument();
  });
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

describe("MyComponent - Accessibility", () => {
  expect.extend(toHaveNoViolations);

  it("has no accessibility violations", async () => {
    const { container } = render(
      <MyComponent>
        <label htmlFor="input">Label</label>
        <input id="input" />
      </MyComponent>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports keyboard navigation", () => {
    const { getByRole } = render(<MyComponent role="button">Click</MyComponent>);
    const element = getByRole("button");
    element.focus();
    expect(element).toHaveFocus();
  });
});
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests for specific component
pnpm test my-component

# Run tests with coverage
pnpm test --coverage

# Watch mode (during development)
pnpm test --watch
```

---

## Documentation

### JSDoc Comments

Document your component in the code:

```tsx
/**
 * MyComponent — Short, clear description.
 *
 * Longer explanation of what it does and when to use it.
 * Explain the main use case in 2-3 sentences.
 *
 * @example
 * ```tsx
 * <MyComponent variant="primary">Content</MyComponent>
 * ```
 *
 * @example
 * ```tsx
 * <MyComponent size="lg" onClick={handleClick}>
 *   Large component
 * </MyComponent>
 * ```
 */
export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  // Implementation...
);
```

### Props Documentation

```tsx
export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual style variant.
   * - primary: Main brand color
   * - secondary: Alternative style
   *
   * @default "primary"
   */
  variant?: "primary" | "secondary";

  /**
   * Component size.
   * Affects padding and text size.
   *
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Error message to display.
   * If provided, component enters error state.
   */
  error?: string;

  /**
   * Called when user performs primary action.
   */
  onAction?: (value: string) => void;
}
```

### Update COMPONENT-LIBRARY.md

Add your component to the library documentation:

1. Find appropriate category
2. Add entry with:
   - Component name
   - Props list
   - Usage examples
   - Design token usage
   - Do's and Don'ts

---

## Storybook Stories

Create `{component}.stories.tsx` alongside component:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./my-component";

const meta = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: "Click me",
    variant: "primary",
    size: "md",
  },
};

// Variant story
export const Secondary: Story = {
  args: {
    children: "Secondary variant",
    variant: "secondary",
  },
};

// Size variations
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

// Interactive state
export const WithLoading: Story = {
  args: {
    children: "Loading",
    isLoading: true,
  },
};

// Error state
export const WithError: Story = {
  args: {
    error: "Something went wrong",
  },
};

// All variants together
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <MyComponent variant="primary">Primary</MyComponent>
      <MyComponent variant="secondary">Secondary</MyComponent>
    </div>
  ),
};
```

**Storybook Features:**
- Interactive prop playground
- Accessibility auditing (addon-a11y)
- Responsive testing
- Code visibility (with `autodocs`)

---

## Common Patterns

### Composite Component Pattern

For complex components with multiple sub-parts:

```tsx
// Root component
const Accordion = ({ children, ...props }) => {
  const [open, setOpen] = useState(null);
  return (
    <AccordionContext.Provider value={{ open, setOpen }}>
      <div {...props}>{children}</div>
    </AccordionContext.Provider>
  );
};

// Sub-components
const AccordionItem = ({ children, value }) => {
  const { open } = useContext(AccordionContext);
  return <div>{children}</div>;
};

const AccordionTrigger = ({ children, value }) => {
  const { open, setOpen } = useContext(AccordionContext);
  return (
    <button onClick={() => setOpen(open === value ? null : value)}>
      {children}
    </button>
  );
};

const AccordionContent = ({ children, value }) => {
  const { open } = useContext(AccordionContext);
  return open === value ? children : null;
};

// Export all
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```

Usage:
```tsx
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content here</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Slot Pattern (for customization)

Use Radix's `Slot` component for flexible customization:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * If true, render as child element (merge props).
   * Allows custom elements to use button styling.
   */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} {...props} />;
  }
);
```

Usage:
```tsx
// Normal button
<Button>Click</Button>

// Custom element with button styling
<Button asChild>
  <a href="/next-page">Click to navigate</a>
</Button>
```

---

## Quality Checklist

Before submitting component:

- [ ] TypeScript props fully documented
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Forwards ref correctly (if applicable)
- [ ] Supports className override
- [ ] Accessibility checklist passed
- [ ] Unit tests written and passing
- [ ] Storybook stories created
- [ ] JSDoc comments added
- [ ] Responsive (mobile-first)
- [ ] Dark mode compatible
- [ ] Added to COMPONENT-LIBRARY.md
- [ ] Added to `packages/ui/src/index.ts`

---

## Review Process

1. **Create component** with all documentation
2. **Run tests:** `pnpm test`
3. **Check Storybook:** `pnpm storybook`
4. **Lint check:** `pnpm lint`
5. **TypeScript check:** `pnpm --filter @sgo/ui build`
6. **Submit for review** with before/after examples

---

## Examples in Codebase

Reference these existing components for patterns:

- **Simple component:** `button.tsx` (variants, CVA)
- **Composed:** `card.tsx` (sub-components)
- **Input-based:** `input.tsx` (error handling, props)
- **Complex:** `dialog.tsx` (Radix UI integration)

---

Last updated: 2026-02-21
