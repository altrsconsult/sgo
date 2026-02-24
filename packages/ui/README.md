# @sgo/ui — Design System & Components

The complete Design System for SGO Core 2.0. Provides a library of 17 pre-built, accessible React components built with Tailwind CSS and Shadcn/UI patterns.

```
npm install @sgo/ui
```

**Status:** Stable for production
**React Version:** 19.0+
**Tailwind:** 3.4+

---

## Quick Start

### Installation

```bash
# Already included in workspace
# Just import components directly
```

### Basic Usage

```tsx
import { Button, Input, Card, CardContent } from "@sgo/ui";

export function MyComponent() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <Input placeholder="Type something..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Import Tailwind Globals

In your main app file:

```tsx
import "@sgo/ui/globals.css";
```

---

## Component Library (17 Components)

### Basic Components (3)
- **Button** — Primary interactive element with variants and loading state
- **Badge** — Status and label indicator with color variants
- **Label** — Form label for accessibility

### Form Components (2)
- **Input** — Text input with error state support
- **Select** — Dropdown menu with grouping and keyboard navigation

### Layout Components (5)
- **Card** — Container with header, content, footer sub-components
- **Separator** — Visual divider (horizontal/vertical)
- **Avatar** — Profile picture with fallback support
- **Skeleton** — Loading placeholder
- **Table** — Structured data display with headers and footers

### Overlay Components (5)
- **Dialog** — Modal dialog for focused interactions
- **AlertDialog** — High-priority confirmation for destructive actions
- **Sheet** — Side drawer for mobile-friendly navigation
- **DropdownMenu** — Context menu with icons and separators

### Data Display (2)
- **EmptyState** — Placeholder for empty lists with action
- **[Utilities]** — cn() for className merging

**Total: 17 components**

See [COMPONENT-LIBRARY.md](./COMPONENT-LIBRARY.md) for complete reference.

---

## Documentation

| Document | Purpose |
|----------|---------|
| **[COMPONENT-LIBRARY.md](./COMPONENT-LIBRARY.md)** | Complete component catalog with props and examples |
| **[DESIGN-PATTERNS.md](./DESIGN-PATTERNS.md)** | Usage patterns, spacing, forms, accessibility |
| **[COMPONENT-BUILDING.md](./COMPONENT-BUILDING.md)** | Guide for creating new components |

---

## Design Tokens

All components use design tokens from `tailwind.config.ts`:

### Colors
- `primary`, `secondary`, `destructive` — Color schemes
- `foreground`, `muted-foreground` — Text colors
- `background`, `card` — Surface colors
- `border`, `input` — Border colors

### Sizing
- `h-9`, `h-10`, `h-11` — Form control heights
- `text-sm`, `text-base`, `text-lg` — Typography sizes
- `p-3`, `p-4`, `p-6` — Padding increments

### Radius
- `rounded-md` — Medium radius (buttons, inputs)
- `rounded-lg` — Large radius (cards, modals)
- `rounded-full` — Circle/pill (avatar, badge)

**Never use hardcoded colors. Always use tokens.**

---

## Dark Mode

Automatic dark mode support via CSS variables. No additional configuration needed.

Colors and contrast automatically adjust for light and dark themes.

---

## Accessibility

All components meet WCAG AA standards:
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators visible
- ✅ Color contrast 4.5:1 (normal text)
- ✅ Semantic HTML
- ✅ ARIA labels where needed

See [DESIGN-PATTERNS.md#accessibility-guidelines](./DESIGN-PATTERNS.md#accessibility-guidelines) for best practices.

---

## Responsive Design

Mobile-first design with Tailwind breakpoints:

```tsx
// Stack on mobile, 3 columns on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

Breakpoints:
- `sm` — 640px (phone landscape)
- `md` — 768px (tablet)
- `lg` — 1024px (desktop)
- `xl` — 1280px (wide desktop)

---

## Development

### Storybook (Interactive Component Explorer)

```bash
# Browse interactive component stories
pnpm storybook
# Opens http://localhost:6006
```

Features:
- Interactive prop playground
- Accessibility auditing
- Responsive testing
- Source code view

### Build

```bash
# Build TypeScript
pnpm --filter @sgo/ui build

# Lint code
pnpm --filter @sgo/ui lint

# Type check
pnpm --filter @sgo/ui tsc --noEmit
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests for this package only
pnpm --filter @sgo/ui test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

---

## Common Patterns

### Form with Validation

```tsx
import { Card, CardContent, Label, Input, Button } from "@sgo/ui";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("E-mail inválido");
      return;
    }
    setError("");
    // Submit...
  };

  return (
    <Card className="w-96">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="seu@email.com"
            />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Empty State

```tsx
import { EmptyState } from "@sgo/ui";
import { Inbox } from "lucide-react";

<EmptyState
  icon={<Inbox className="w-12 h-12" />}
  title="Nenhuma mensagem"
  description="Você não tem mensagens no momento"
  action={<Button>Enviar primeira mensagem</Button>}
/>
```

### Data Table with Actions

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@sgo/ui";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@sgo/ui";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Ação</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell><Badge>{item.status}</Badge></TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger>⋯</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Styling Guidelines

### Use Tailwind Classes (Not Inline Styles)

```tsx
// ✅ Good
<Button className="bg-primary px-4 py-2">Save</Button>

// ❌ Bad
<Button style={{ backgroundColor: "blue", padding: "8px 16px" }}>Save</Button>
```

### Use Design Tokens (Not Custom Colors)

```tsx
// ✅ Good
<div className="bg-primary text-primary-foreground">Primary</div>

// ❌ Bad
<div className="bg-#3B82F6 text-white">Blue</div>
```

### Organize Spacing

```tsx
// ✅ Good: Consistent spacing
<div className="space-y-4">
  <div>Section 1</div>
  <div>Section 2</div>
  <div>Section 3</div>
</div>

// ❌ Bad: Inconsistent margins
<div>
  <div className="mb-2">Section 1</div>
  <div className="mb-8">Section 2</div>
  <div className="mb-3">Section 3</div>
</div>
```

---

## Troubleshooting

### Components Not Styled

**Problem:** Components render but styles are missing.

**Solution:** Ensure Tailwind globals are imported:
```tsx
// In your main app file (App.tsx, _app.tsx, etc.)
import "@sgo/ui/globals.css";
```

### TypeScript Errors

**Problem:** Props type errors or missing types.

**Solution:** Ensure you're using correct component props interface:
```tsx
import { Button, type ButtonProps } from "@sgo/ui";

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

### Focus Ring Missing

**Problem:** Components lose focus ring in dark mode.

**Solution:** Use `focus-visible:ring-2 focus-visible:ring-ring`:
```tsx
<input className="focus-visible:ring-2 focus-visible:ring-ring" />
```

---

## Contributing

Want to add a new component?

1. Read [COMPONENT-BUILDING.md](./COMPONENT-BUILDING.md)
2. Follow the component template
3. Add TypeScript props
4. Include tests and Storybook stories
5. Update COMPONENT-LIBRARY.md
6. Submit for review

---

## Dependencies

**Peer Dependencies:**
- `react@^19.0.0`
- `react-dom@^19.0.0`

**Production Dependencies:**
- `@radix-ui/*` — Accessible component primitives
- `class-variance-authority` — Type-safe styling
- `clsx` — Conditional className utility
- `tailwind-merge` — Smart Tailwind class merging
- `lucide-react` — Icon library

**Dev Dependencies:**
- `tailwindcss^3.4.17` — Styling framework
- `typescript^5.7.2` — Type checking
- `@storybook/*` — Component documentation

---

## License

Part of SGO Core 2.0. All components are open source and available for use in SGO modules and the Chassis.

---

## Support

**Questions?**
- Check [COMPONENT-LIBRARY.md](./COMPONENT-LIBRARY.md) for component docs
- See [DESIGN-PATTERNS.md](./DESIGN-PATTERNS.md) for usage patterns
- Browse [Storybook](http://localhost:6006) for interactive examples

**Found a bug?**
- Open an issue with component name and reproduction steps
- Include error message and expected behavior

**Want a feature?**
- Propose new component with use case
- Check existing components first (might already exist)

---

**SGO UI v1.0.0** — Production Ready
Last updated: 2026-02-21
