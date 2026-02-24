# SGO UI Component Library

Complete reference guide for all components in the SGO Design System. Use this guide to understand component capabilities, props, and best practices.

---

## Quick Navigation

- [Basic Components](#basic-components) (3)
- [Form Components](#form-components) (2)
- [Layout Components](#layout-components) (5)
- [Overlay Components](#overlay-components) (5)
- [Data Display](#data-display) (2)

**Total: 17 components**

---

## Basic Components

### Button

Versatile button component with multiple variants and sizes.

**Props:**
- `variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"` — Button style
- `size?: "default" | "sm" | "lg" | "icon"` — Button size
- `isLoading?: boolean` — Shows spinner and disables button
- All standard `<button>` HTML attributes

**Usage:**
```tsx
import { Button } from "@sgo/ui";

// Default button
<Button>Salvar</Button>

// Variants
<Button variant="destructive">Excluir</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Mais opções</Button>

// Sizes
<Button size="sm">Pequeno</Button>
<Button size="lg">Grande</Button>
<Button size="icon">✓</Button>

// With loading state
<Button isLoading>Processando...</Button>
```

**Design Token Usage:**
- Colors: `primary`, `destructive`, `secondary`, `accent`, `foreground`, `background`
- Sizing: `h-10`, `h-9`, `h-11` (fixed heights)
- Spacing: `px-4`, `px-3`, `px-8` (internal padding)
- Radius: `rounded-md` (Tailwind medium radius)

**Do's & Don'ts:**
- ✅ Use `variant="outline"` for secondary actions
- ✅ Use `variant="ghost"` for subtle actions
- ✅ Always provide loading feedback for async operations
- ❌ Don't create custom button variants — use existing ones
- ❌ Don't disable without clear reason (accessibility issue)

---

### Badge

Small label component for status, tags, or counters.

**Props:**
- `variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"` — Badge style
- All standard `<div>` HTML attributes

**Usage:**
```tsx
import { Badge } from "@sgo/ui";

<Badge>Novo</Badge>
<Badge variant="success">Ativo</Badge>
<Badge variant="destructive">Erro</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="outline">Rascunho</Badge>
```

**Design Token Usage:**
- Color scheme auto-applied per variant
- `rounded-full` (circular pill shape)
- `text-xs` (small text)
- `px-2.5 py-0.5` (compact padding)

**Do's & Don'ts:**
- ✅ Use for status indicators
- ✅ Use for tags or categories
- ✅ Keep text short (2-3 words max)
- ❌ Don't use for interactive states
- ❌ Don't overcrowd with too many badges

---

### Label

Form label paired with form inputs.

**Props:**
- All standard `<label>` HTML attributes

**Usage:**
```tsx
import { Label, Input } from "@sgo/ui";

<div>
  <Label htmlFor="email">E-mail</Label>
  <Input id="email" type="email" />
</div>
```

**Design Token Usage:**
- `text-sm` (readable size)
- `font-medium` (clear hierarchy)
- `text-foreground` (primary text color)

**Accessibility:**
- Always pair with `<input>` using `htmlFor` attribute
- Improves click area on form controls
- Screen readers announce label with input

---

## Form Components

### Input

Text input field with optional error message support.

**Props:**
- `type?: string` — HTML input type (text, email, password, number, etc.)
- `error?: string` — Error message to display below input
- All standard `<input>` HTML attributes

**Usage:**
```tsx
import { Input } from "@sgo/ui";

// Basic input
<Input placeholder="Digite seu e-mail" type="email" />

// With error
<Input
  type="email"
  error="E-mail inválido"
  placeholder="seu@email.com"
/>

// Password with custom validation
<Input type="password" placeholder="Senha" />

// Number input
<Input type="number" min="1" max="100" />
```

**Design Token Usage:**
- Border: `border-input` (subtle gray)
- Focus: `focus-visible:ring-2 focus-visible:ring-ring` (blue ring)
- Error: `border-destructive` (red border when error prop set)
- Background: `bg-background` (white/light)
- Padding: `px-3 py-2` (comfortable spacing)

**Do's & Don'ts:**
- ✅ Pair with `<Label>` for accessibility
- ✅ Show error message in red below input
- ✅ Use appropriate `type` attribute for mobile keyboards
- ❌ Don't hide labels — always provide label
- ❌ Don't use error prop without explaining the issue

---

### Select

Dropdown select component with groups and icons support.

**Props (Composed of sub-components):**
- `Select` — Root wrapper
- `SelectTrigger` — Button that opens dropdown
- `SelectContent` — Dropdown menu container
- `SelectItem` — Individual option
- `SelectGroup` — Group of options
- `SelectLabel` — Group label
- `SelectValue` — Currently selected value placeholder
- `SelectSeparator` — Visual divider

**Usage:**
```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@sgo/ui";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Escolha uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Opções</SelectLabel>
      <SelectItem value="option1">Opção 1</SelectItem>
      <SelectItem value="option2">Opção 2</SelectItem>
      <SelectItem value="option3">Opção 3</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

**Design Token Usage:**
- Trigger button styling same as input
- Focus states match input focus ring
- Content background: `bg-popover`
- Hover item: `bg-accent`

**Do's & Don'ts:**
- ✅ Group related options with `SelectGroup`
- ✅ Provide `placeholder` in `SelectValue`
- ✅ Use for more than 5 options (otherwise use radio buttons)
- ❌ Don't mix SelectGroup with ungrouped items
- ❌ Don't forget placeholder text

---

## Layout Components

### Card

Container for grouping related content with consistent styling.

**Sub-components:**
- `Card` — Main container
- `CardHeader` — Top section for title/description
- `CardTitle` — Card heading
- `CardDescription` — Subtitle or helper text
- `CardContent` — Main content area
- `CardFooter` — Bottom section for actions

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@sgo/ui";

<Card>
  <CardHeader>
    <CardTitle>Configurações</CardTitle>
    <CardDescription>Ajuste as preferências da sua conta</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Form or other content */}
  </CardContent>
  <CardFooter>
    <Button>Salvar</Button>
  </CardFooter>
</Card>
```

**Design Token Usage:**
- Background: `bg-card` (white/light surface)
- Border: `border` (subtle gray)
- Radius: `rounded-lg` (smooth corners)
- Shadow: `shadow-sm` (subtle elevation)
- Padding: `p-6` (generous internal spacing)

**Do's & Don'ts:**
- ✅ Use as primary content container
- ✅ Group related content inside single card
- ✅ Use CardHeader for titles and descriptions
- ❌ Don't nest cards excessively (max 2 levels)
- ❌ Don't use Card for page layout — use CSS grid/flex

---

### Separator

Visual divider between content sections.

**Props:**
- `orientation?: "horizontal" | "vertical"` — Divider direction
- All standard `<div>` HTML attributes

**Usage:**
```tsx
import { Separator } from "@sgo/ui";

<div>
  <h2>Seção 1</h2>
  <Separator className="my-4" />
  <h2>Seção 2</h2>
</div>

// Vertical separator
<div className="flex">
  <div>Esquerda</div>
  <Separator orientation="vertical" className="mx-4" />
  <div>Direita</div>
</div>
```

**Design Token Usage:**
- Color: `bg-border` (light gray)
- Height: `h-[1px]` (single pixel)
- Margin: Apply via className

**Do's & Don'ts:**
- ✅ Use to break up long content sections
- ✅ Apply margin via Tailwind (my-4, mx-2, etc.)
- ✅ Use vertical for column layouts
- ❌ Don't use as page divider (use whitespace instead)
- ❌ Don't style inline — use className

---

### Avatar

Profile picture component with fallback support.

**Sub-components:**
- `Avatar` — Container
- `AvatarImage` — User image element
- `AvatarFallback` — Fallback if image fails to load

**Usage:**
```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@sgo/ui";

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="João Silva" />
  <AvatarFallback>JS</AvatarFallback>
</Avatar>

// With initials fallback
<Avatar>
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

**Design Token Usage:**
- Size: `h-10 w-10` (default, can override)
- Border radius: `rounded-full` (circular)
- Background: `bg-secondary` (fallback background)

**Do's & Don'ts:**
- ✅ Always provide meaningful alt text
- ✅ Use initials for fallback (first + last name)
- ✅ Lazy load images for performance
- ❌ Don't skip alt text
- ❌ Don't use without fallback

---

### Skeleton

Loading placeholder matching component dimensions.

**Props:**
- All standard `<div>` HTML attributes
- Apply Tailwind sizing classes (w-full, h-12, etc.)

**Usage:**
```tsx
import { Skeleton } from "@sgo/ui";

// Loading list
<div className="space-y-3">
  <Skeleton className="h-12 rounded-md" />
  <Skeleton className="h-12 rounded-md" />
  <Skeleton className="h-12 rounded-md" />
</div>

// Loading card
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-40" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-40 w-full rounded-md" />
  </CardContent>
</Card>
```

**Design Token Usage:**
- Background: `bg-muted` (light gray)
- Animation: `animate-pulse` (subtle fade)
- Radius: Apply via className

**Do's & Don'ts:**
- ✅ Match actual component dimensions
- ✅ Use for progressive loading
- ✅ Apply appropriate radius for rounded elements
- ❌ Don't forget to remove skeleton when content loads
- ❌ Don't use for errors — use EmptyState instead

---

## Overlay Components

### Dialog

Modal dialog for focused interactions with a backdrop.

**Sub-components:**
- `Dialog` — Root wrapper
- `DialogTrigger` — Button/element that opens dialog
- `DialogContent` — Modal content container
- `DialogHeader/Footer` — Content organization
- `DialogTitle/Description` — Accessibility labels
- `DialogClose` — Close button
- `DialogOverlay` — Backdrop (optional)
- `DialogPortal` — Portal target (optional)

**Usage:**
```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@sgo/ui";

<Dialog>
  <DialogTrigger>Abrir Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Dialog</DialogTitle>
      <DialogDescription>Descrição ou instrução</DialogDescription>
    </DialogHeader>
    {/* Form or content */}
  </DialogContent>
</Dialog>
```

**Design Token Usage:**
- Content background: `bg-background`
- Overlay: `bg-black/50` (semi-transparent)
- Border radius: `rounded-lg`
- Shadow: Elevated shadow for prominence

**Do's & Don'ts:**
- ✅ Use for important confirmations or forms
- ✅ Always provide DialogTitle for accessibility
- ✅ Show overlay to focus user attention
- ❌ Don't use for navigation or simple messages
- ❌ Don't forget DialogDescription for context

---

### AlertDialog

High-priority confirmation dialog for destructive actions.

**Sub-components:**
- `AlertDialog` — Root wrapper
- `AlertDialogTrigger` — Trigger button
- `AlertDialogContent` — Modal content
- `AlertDialogTitle/Description` — Alert text
- `AlertDialogAction` — Confirm button (destructive style)
- `AlertDialogCancel` — Cancel button

**Usage:**
```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@sgo/ui";

<AlertDialog>
  <AlertDialogTrigger>Excluir Conta</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
    <AlertDialogDescription>
      Esta ação não pode ser desfeita.
    </AlertDialogDescription>
    <AlertDialogCancel>Cancelar</AlertDialogCancel>
    <AlertDialogAction>Excluir Permanentemente</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

**Design Token Usage:**
- Action button: `variant="destructive"`
- Cancel button: `variant="outline"`
- Content: Centered, smaller than Dialog

**Do's & Don'ts:**
- ✅ Use only for destructive or critical actions
- ✅ Always explain consequences
- ✅ Make cancel button easily accessible
- ❌ Don't use for confirmation of non-destructive actions
- ❌ Don't bury cancel button in small text

---

### Sheet

Side drawer for off-canvas content (mobile-friendly).

**Sub-components:**
- `Sheet` — Root wrapper
- `SheetTrigger` — Button that opens sheet
- `SheetContent` — Side drawer content
- `SheetHeader/Footer` — Content organization
- `SheetTitle/Description` — Accessibility labels
- `SheetClose` — Close button
- Similar sub-components to Dialog

**Usage:**
```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@sgo/ui";

<Sheet>
  <SheetTrigger>Abrir Menu</SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Menu de Navegação</SheetTitle>
    </SheetHeader>
    {/* Navigation items */}
  </SheetContent>
</Sheet>
```

**Design Token Usage:**
- Position: slides from side (left/right/top/bottom)
- Overlay: Semi-transparent backdrop
- Width: Responsive (full width on mobile, fixed on desktop)

**Do's & Don'ts:**
- ✅ Use for mobile navigation menus
- ✅ Use for filters, settings on mobile
- ✅ Close when user taps overlay
- ❌ Don't use for forms on desktop (use Dialog)
- ❌ Don't prevent user from closing easily

---

### DropdownMenu

Menu that opens below trigger element.

**Sub-components:**
- `DropdownMenu` — Root wrapper
- `DropdownMenuTrigger` — Button that opens menu
- `DropdownMenuContent` — Menu items container
- `DropdownMenuItem` — Individual menu item
- `DropdownMenuCheckboxItem` — Selectable menu item
- `DropdownMenuRadioItem` — Radio group item
- `DropdownMenuLabel` — Section header
- `DropdownMenuSeparator` — Visual divider
- `DropdownMenuShortcut` — Keyboard hint
- `DropdownMenuGroup` — Item grouping
- `DropdownMenuSub` — Submenu

**Usage:**
```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@sgo/ui";

<DropdownMenu>
  <DropdownMenuTrigger>Mais opções</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Ações</DropdownMenuLabel>
    <DropdownMenuItem>Editar</DropdownMenuItem>
    <DropdownMenuItem>Duplicar</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Excluir</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Design Token Usage:**
- Content: `bg-popover` (floating surface)
- Hover item: `bg-accent`
- Separator: `border-border`

**Do's & Don'ts:**
- ✅ Use for contextual actions (3-7 items)
- ✅ Group related items with separators
- ✅ Provide keyboard shortcuts for power users
- ❌ Don't use for more than 10 items (use submenu)
- ❌ Don't use for primary navigation

---

## Data Display

### Table

Structured data display component with header, body, footer support.

**Sub-components:**
- `Table` — Root table element
- `TableHeader` — Header row group
- `TableBody` — Content rows group
- `TableFooter` — Footer row group
- `TableRow` — Individual row
- `TableHead` — Header cell
- `TableCell` — Data cell
- `TableCaption` — Table description (accessibility)

**Usage:**
```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@sgo/ui";

<Table>
  <TableCaption>Lista de usuários</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>E-mail</TableHead>
      <TableHead>Ação</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(user => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Editar</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Design Token Usage:**
- Border: `border-b` (row separators)
- Padding: `p-3` (cell content spacing)
- Background: Alternating rows via CSS classes
- Header: `font-medium text-sm`

**Do's & Don'ts:**
- ✅ Use for structured tabular data
- ✅ Make table responsive (horizontal scroll on mobile)
- ✅ Provide sorting/filtering for large datasets
- ❌ Don't use for layout (use CSS Grid instead)
- ❌ Don't mix dense and spacious rows

---

### EmptyState

Placeholder for empty lists or no-data states.

**Props:**
- `icon?: ReactNode` — Illustrative icon (Lucide recommended)
- `title: string` — Main message
- `description?: string` — Additional context
- `action?: ReactNode` — CTA button or link

**Usage:**
```tsx
import { EmptyState } from "@sgo/ui";
import { Inbox } from "lucide-react";

<EmptyState
  icon={<Inbox className="w-12 h-12" />}
  title="Nenhuma mensagem"
  description="Você não tem mensagens no momento."
  action={<Button>Enviar primeira mensagem</Button>}
/>

// Without action
<EmptyState
  title="Lista vazia"
  description="Nenhum resultado encontrado"
/>
```

**Design Token Usage:**
- Icon background: `bg-muted` with `p-4`
- Title: `text-base font-semibold`
- Description: `text-sm text-muted-foreground`
- Spacing: `py-12 px-4` (centered vertically/horizontally)

**Do's & Don'ts:**
- ✅ Use for empty lists or no data scenarios
- ✅ Provide icon for visual interest
- ✅ Suggest action (create, search, etc.)
- ✅ Use Lucide icons for consistency
- ❌ Don't use for errors (use AlertDialog instead)
- ❌ Don't make description too long

---

## Design Tokens Reference

### Colors

Tokens are defined in your `tailwind.config.ts` and prefixed with Tailwind classes:

- **`bg-primary`** — Main brand color (blue)
- **`bg-secondary`** — Secondary color
- **`bg-destructive`** — Error/delete color (red)
- **`bg-accent`** — Interactive hover color
- **`bg-muted`** — Disabled/placeholder background
- **`text-foreground`** — Primary text color
- **`text-muted-foreground`** — Secondary text color
- **`border-input`** — Form input border
- **`border-border`** — General borders

### Sizing

- **Heights:** `h-9`, `h-10`, `h-11` (form controls)
- **Widths:** Apply with Tailwind (w-full, w-48, etc.)
- **Padding:** `p-3`, `p-4`, `p-6` (standard increments)
- **Gap:** `gap-2`, `gap-4`, `gap-6` (component spacing)

### Typography

- **`text-sm`** — Form labels, helpers, secondary text
- **`text-base`** — Body text, default
- **`text-lg`** — Section headings
- **`text-2xl`** — Card titles
- **`font-semibold`** — Headers, titles
- **`font-medium`** — Labels, strong emphasis

### Spacing (Tailwind CSS)

- **`mb-2`, `my-4`** — Margin utilities
- **`px-3`, `py-2`** — Padding utilities
- **`gap-2`** — Flex/grid gaps
- **`space-y-2`** — Vertical spacing between children

### Radius

- **`rounded-md`** — Button, input default
- **`rounded-lg`** — Card default
- **`rounded-full`** — Avatar, badge

---

## Accessibility Checklist

For each component you use, ensure:

- [ ] Labels provided for form inputs (`<Label htmlFor="...">`)
- [ ] Buttons have descriptive text (not just icons)
- [ ] Color not the only way to convey meaning (use icons + text)
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Alt text for images in Avatar
- [ ] Semantic HTML (`<button>` not `<div>`)

---

## Importing Components

**From workspace:**
```tsx
import { Button, Input, Card } from "@sgo/ui";
```

**All available exports:**
See `packages/ui/src/index.ts` for complete list.

---

## Versioning

Current version: **1.0.0**
Status: **Stable for production use**

---

## Support & Contribution

- Found a bug? File an issue
- Want to add a component? See `COMPONENT-BUILDING.md`
- Questions? Check `DESIGN-PATTERNS.md` for common patterns
