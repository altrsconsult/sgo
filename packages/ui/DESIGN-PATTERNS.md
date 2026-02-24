# SGO Design Patterns & Best Practices

How to use SGO components together following design patterns and accessibility guidelines.

---

## Table of Contents

1. [Spacing Patterns](#spacing-patterns)
2. [Color & Typography](#color--typography)
3. [Form Patterns](#form-patterns)
4. [Modal & Dialog Patterns](#modal--dialog-patterns)
5. [Data Display Patterns](#data-display-patterns)
6. [Navigation Patterns](#navigation-patterns)
7. [Loading & Empty States](#loading--empty-states)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Responsive Design](#responsive-design)
10. [Dark Mode Support](#dark-mode-support)

---

## Spacing Patterns

### Consistent Margins Between Sections

Use Tailwind spacing classes to create visual hierarchy and breathing room:

```tsx
import { Card, CardHeader, CardContent, CardTitle, Separator } from "@sgo/ui";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo de volta</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seção 1</CardTitle>
          </CardHeader>
          <CardContent>Conteúdo aqui</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seção 2</CardTitle>
          </CardHeader>
          <CardContent>Conteúdo aqui</CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Spacing Scale:**
- `space-y-1` — Very tight (4px)
- `space-y-2` — Tight (8px)
- `space-y-3` — Comfortable (12px)
- `space-y-4` — Relaxed (16px)
- `space-y-6` — Spacious (24px)
- `space-y-8` — Very spacious (32px)

### Card Spacing

Cards already have `p-6` padding internally. Don't add extra padding:

```tsx
// ✅ Good: Content directly in CardContent
<Card>
  <CardContent>
    <Input placeholder="Nome" />
  </CardContent>
</Card>

// ❌ Bad: Extra padding around content
<Card>
  <CardContent className="p-4">
    <div className="p-4">
      <Input placeholder="Nome" />
    </div>
  </CardContent>
</Card>
```

### Layout Grid Spacing

Use consistent gaps between grid items:

```tsx
// ✅ Consistent gap
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Smaller cards = smaller gap
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
</div>
```

---

## Color & Typography

### Color Usage by Component

**Primary (Brand Blue):**
- Main buttons
- Links
- Active states
- Focus rings

```tsx
<Button>Salvar</Button>
<Button variant="ghost">Mais opções</Button>
```

**Secondary (Softer variant):**
- Alternative buttons
- Subtle backgrounds
- Complementary elements

```tsx
<Button variant="secondary">Enviar</Button>
<Badge variant="secondary">Em progresso</Badge>
```

**Destructive (Red):**
- Delete/remove actions
- Error messages
- Critical alerts

```tsx
<Button variant="destructive">Excluir</Button>
<Badge variant="destructive">Erro</Badge>
<Input error="Campo obrigatório" />
```

**Success/Warning (Additional states):**
- Status indicators
- Success messages
- Warnings

```tsx
<Badge variant="success">Completo</Badge>
<Badge variant="warning">Pendente</Badge>
```

### Typography Hierarchy

**Page Title (h1):**
- `text-3xl font-bold` — Main heading
- Used once per page

```tsx
<h1 className="text-3xl font-bold">Página Principal</h1>
```

**Section Heading (h2/h3):**
- `text-2xl font-semibold` — Card titles, section breaks
- Use `<CardTitle>` component

```tsx
<CardTitle>Configurações de Conta</CardTitle>
```

**Subsection (h3/h4):**
- `text-lg font-semibold` — Subsection headings

```tsx
<h3 className="text-lg font-semibold">Preferências Gerais</h3>
```

**Body Text:**
- `text-base` — Default paragraph text (most common)
- `text-sm` — Secondary information, labels, form help text

```tsx
<p className="text-base">Descrição padrão do conteúdo.</p>
<p className="text-sm text-muted-foreground">Texto secundário</p>
```

**Label Text:**
- `text-sm font-medium` — Form labels
- Use `<Label>` component

```tsx
<Label htmlFor="email">E-mail</Label>
```

### Emphasis & Font Weight

```tsx
// Regular (default)
<p>Texto normal</p>

// Medium emphasis (labels, buttons)
<Label className="font-medium">Rótulo</Label>

// Strong emphasis (titles, important info)
<h3 className="font-semibold">Título Importante</h3>

// Bold (rarely needed)
<span className="font-bold">Muito importante</span>
```

---

## Form Patterns

### Basic Form Layout

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@sgo/ui";
import { Input, Label, Button } from "@sgo/ui";

export function FormExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            placeholder="João Silva"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="joao@example.com"
          />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar</Button>
      </CardFooter>
    </Card>
  );
}
```

**Key Points:**
- `space-y-4` on CardContent for field separation
- `space-y-2` on each field for label-input spacing
- `gap-2` on CardFooter for button spacing
- `htmlFor` on Labels for accessibility

### Form with Select Dropdown

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@sgo/ui";

<div className="space-y-2">
  <Label htmlFor="status">Status</Label>
  <Select>
    <SelectTrigger id="status">
      <SelectValue placeholder="Escolha uma opção" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Ativo</SelectItem>
      <SelectItem value="inactive">Inativo</SelectItem>
      <SelectItem value="pending">Pendente</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Form with Validation

```tsx
import { useState } from "react";

export function ValidatedForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("E-mail inválido");
    } else {
      setError("");
      // Submit form...
    }
  };

  return (
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
      <Button type="submit">Enviar</Button>
    </form>
  );
}
```

**Error Handling:**
- Pass error message to `Input` component
- Error text displays automatically in red
- Clear error when user fixes input

### Inline Form Actions

```tsx
<div className="flex gap-2 items-end">
  <div className="flex-1 space-y-2">
    <Label htmlFor="search">Buscar</Label>
    <Input id="search" placeholder="Digite para buscar..." />
  </div>
  <Button>Buscar</Button>
</div>
```

---

## Modal & Dialog Patterns

### Confirmation Dialog

```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@sgo/ui";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Excluir Conta</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Excluir Conta?</AlertDialogTitle>
    <AlertDialogDescription>
      Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente.
    </AlertDialogDescription>
    <div className="flex gap-2 justify-end">
      <AlertDialogCancel>Manter Conta</AlertDialogCancel>
      <AlertDialogAction>Excluir Permanentemente</AlertDialogAction>
    </div>
  </AlertDialogContent>
</AlertDialog>
```

### Form Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@sgo/ui";

<Dialog>
  <DialogTrigger asChild>
    <Button>Adicionar Item</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Novo Item</DialogTitle>
    </DialogHeader>
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="itemName">Nome</Label>
        <Input id="itemName" placeholder="Nome do item" />
      </div>
      <Button type="submit" className="w-full">Criar</Button>
    </form>
  </DialogContent>
</Dialog>
```

### Side Sheet (Mobile Navigation)

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@sgo/ui";

<Sheet>
  <SheetTrigger>☰ Menu</SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Navegação</SheetTitle>
    </SheetHeader>
    <nav className="space-y-2 mt-4">
      <Button variant="ghost" className="w-full justify-start">Home</Button>
      <Button variant="ghost" className="w-full justify-start">Produtos</Button>
      <Button variant="ghost" className="w-full justify-start">Sobre</Button>
    </nav>
  </SheetContent>
</Sheet>
```

---

## Data Display Patterns

### Table with Actions

```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@sgo/ui";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@sgo/ui";
import { MoreVertical } from "lucide-react";

export function UsersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem>Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Empty State in List

```tsx
import { EmptyState } from "@sgo/ui";
import { Plus, Inbox } from "lucide-react";

export function UsersList() {
  const [users, setUsers] = useState([]);

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="w-12 h-12" />}
        title="Nenhum usuário"
        description="Comece adicionando seu primeiro usuário"
        action={<Button><Plus className="w-4 h-4 mr-2" /> Novo Usuário</Button>}
      />
    );
  }

  return <UsersTable />;
}
```

### Loading Skeleton

```tsx
import { Skeleton } from "@sgo/ui";

export function CardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Navigation Patterns

### Desktop Navigation (Buttons in Header)

```tsx
<header className="border-b bg-background">
  <div className="flex items-center justify-between p-4">
    <div className="text-xl font-bold">Logo</div>
    <nav className="flex gap-2">
      <Button variant="ghost">Home</Button>
      <Button variant="ghost">Produtos</Button>
      <Button variant="ghost">Sobre</Button>
      <Button>Entrar</Button>
    </nav>
  </div>
</header>
```

### Mobile Navigation (Sheet Menu)

```tsx
<header className="border-b bg-background md:hidden">
  <div className="flex items-center justify-between p-4">
    <div className="text-xl font-bold">Logo</div>
    <Sheet>
      <SheetTrigger>☰</SheetTrigger>
      <SheetContent side="right">
        <nav className="space-y-2 mt-4">
          <Button variant="ghost" className="w-full justify-start">Home</Button>
          <Button variant="ghost" className="w-full justify-start">Produtos</Button>
          <Button variant="ghost" className="w-full justify-start">Sobre</Button>
        </nav>
      </SheetContent>
    </Sheet>
  </div>
</header>
```

### Breadcrumb Navigation

```tsx
<nav className="flex items-center gap-2 text-sm">
  <Button variant="link" className="p-0">Home</Button>
  <span>/</span>
  <Button variant="link" className="p-0">Produtos</Button>
  <span>/</span>
  <span className="text-muted-foreground">Detalhes</span>
</nav>
```

---

## Loading & Empty States

### Loading Spinner Button

```tsx
const [loading, setLoading] = useState(false);

<Button
  isLoading={loading}
  onClick={async () => {
    setLoading(true);
    await submitForm();
    setLoading(false);
  }}
>
  {loading ? "Salvando..." : "Salvar"}
</Button>
```

### Page Loading State

```tsx
import { Skeleton } from "@sgo/ui";

export function PageLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />
      <div className="grid gap-6">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    </div>
  );
}
```

### Error State

```tsx
<div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
  <p className="font-semibold text-destructive">Erro ao carregar dados</p>
  <p className="text-sm text-destructive/80 mt-1">
    Tente novamente em alguns momentos.
  </p>
  <Button variant="destructive" size="sm" className="mt-3">
    Tentar Novamente
  </Button>
</div>
```

---

## Accessibility Guidelines

### Keyboard Navigation

All interactive components support keyboard:
- **Tab** — Move focus to next element
- **Shift+Tab** — Move focus to previous element
- **Enter/Space** — Activate button/click link
- **Escape** — Close modals/dropdowns
- **Arrow keys** — Navigate select options, menu items

**Test your forms:**
```bash
# Tab through entire form with keyboard only
# All elements should be reachable and functional
```

### Focus Indicators

Every interactive element shows a focus ring when using keyboard:

```tsx
// ✅ Built-in for all components
<Button>Sempre com foco visível</Button>

// Customize if needed
<button className="focus-visible:ring-2 focus-visible:ring-ring">
  Custom Focus
</button>
```

### Color Contrast

All text meets WCAG AA standards:
- **Normal text:** 4.5:1 contrast ratio minimum
- **Large text (18px+):** 3:1 contrast ratio minimum

Our color palette is pre-tested. Don't create custom color combinations.

### Semantic HTML

Use semantic elements for accessibility:

```tsx
// ✅ Good: Semantic buttons
<Button>Salvar</Button>
<Link href="/sobre">Sobre</Link>

// ❌ Bad: Divs as buttons
<div onClick={...} className="cursor-pointer">Clique aqui</div>

// ✅ Good: Semantic headings
<h1>Título da Página</h1>
<h2>Seção Principal</h2>

// ❌ Bad: Unstyled divs
<div className="text-2xl font-bold">Título</div>
```

### Form Labels

Always pair inputs with labels:

```tsx
// ✅ Good: Label connected to input
<Label htmlFor="email">E-mail</Label>
<Input id="email" type="email" />

// ❌ Bad: No label
<Input placeholder="E-mail" />

// ✅ Good: Required indicator
<Label htmlFor="name">
  Nome <span className="text-destructive">*</span>
</Label>
<Input id="name" required />
```

### Alt Text for Images

```tsx
// ✅ Good: Meaningful alt text
<Avatar>
  <AvatarImage src="/user.jpg" alt="João Silva, usuário ativo" />
  <AvatarFallback>JS</AvatarFallback>
</Avatar>

// ❌ Bad: Generic or missing
<Avatar>
  <AvatarImage src="/user.jpg" alt="imagem" />
  <AvatarFallback>JS</AvatarFallback>
</Avatar>
```

### Screen Reader Testing

Test with:
- **Windows:** NVDA (free, open source)
- **macOS:** VoiceOver (built-in)
- **Mobile:** TalkBack (Android), VoiceOver (iOS)

---

## Responsive Design

### Mobile-First Approach

Always design for mobile first, then add breakpoints:

```tsx
// ✅ Mobile-first: single column by default
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Breakpoints:
// sm: 640px
// md: 768px (tablet)
// lg: 1024px (desktop)
// xl: 1280px (wide desktop)
```

### Responsive Typography

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Título que cresce com tela
</h1>
```

### Responsive Spacing

```tsx
// Space that adjusts to screen size
<div className="p-4 md:p-6 lg:p-8">
  Conteúdo com padding responsivo
</div>
```

### Mobile Navigation

```tsx
// Show menu icon on mobile, hide on desktop
<nav className="hidden md:flex gap-2">
  <Button>Home</Button>
  <Button>Produtos</Button>
</nav>

// Show hamburger on mobile
<Sheet className="md:hidden">
  <SheetTrigger>☰</SheetTrigger>
  {/* Mobile menu */}
</Sheet>
```

---

## Dark Mode Support

Our Design System supports dark mode automatically. No additional work needed:

```tsx
// Uses CSS variables that adapt to light/dark mode
<Button>Automatically dark-mode friendly</Button>
<Input placeholder="Works in both modes" />
<Card>Dark mode ready</Card>
```

**Token colors automatically adjust:**
- `bg-background` → white (light) / near-black (dark)
- `text-foreground` → black (light) / white (dark)
- `border-border` → light gray (light) / dark gray (dark)

---

## Common Pitfalls to Avoid

### ❌ Don't: Inline Styling

```tsx
// Bad
<Button style={{ backgroundColor: "blue", padding: "10px" }}>Click</Button>

// Good
<Button className="bg-primary px-4">Click</Button>
```

### ❌ Don't: Custom Colors Outside Design Tokens

```tsx
// Bad
<div className="bg-#FF5733">Custom Color</div>

// Good
<div className="bg-primary">Token Color</div>
```

### ❌ Don't: Over-Nest Components

```tsx
// Bad
<Card>
  <Card>
    <Card>
      Conteúdo
    </Card>
  </Card>
</Card>

// Good
<Card>
  <CardContent>
    Conteúdo organizado
  </CardContent>
</Card>
```

### ❌ Don't: Skip Accessibility

```tsx
// Bad
<div onClick={() => alert("clicked")}>Clique aqui</div>

// Good
<Button onClick={() => alert("clicked")}>Clique aqui</Button>
```

---

## Additional Resources

- **COMPONENT-LIBRARY.md** — Individual component documentation
- **COMPONENT-BUILDING.md** — Guide to creating new components
- **Storybook** — Interactive component explorer (`pnpm storybook`)
- **Tailwind Docs** — https://tailwindcss.com/docs

---

Last updated: 2026-02-21
