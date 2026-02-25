/**
 * @sgo/ui - Design System do SGO Core 2.0
 * 
 * Este pacote exporta todos os componentes visuais compartilhados
 * entre o Chassi e os Módulos.
 * 
 * @example
 * import { Button, Card, Input } from "@sgo/ui";
 */

// Utilitários
export { cn } from "./lib/utils";

// Componentes — ATOMS
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export { IconButton, iconButtonVariants, type IconButtonProps } from "./components/icon-button";
export { Input, type InputProps } from "./components/input";
export { Label, type LabelProps } from "./components/label";
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
export { Avatar, AvatarImage, AvatarFallback } from "./components/avatar";
export { Separator } from "./components/separator";
export { Skeleton } from "./components/skeleton";
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/sheet";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/dialog";
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./components/alert-dialog";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/select";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/table";
export { EmptyState, type EmptyStateProps } from "./components/empty-state";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/dropdown-menu";
export { Toast, type ToastProps, type ToastAction, type ToastVariant, type ToastPosition } from "./components/toast";
export {
  Menu,
  type MenuProps,
  type MenuItem,
  type MenuItemType,
  type MenuSeparator,
  type MenuLabel,
} from "./components/menu";

// Componentes — MOLECULES
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./components/card";
export { Alert, alertVariants, type AlertProps } from "./components/alert";
export { Modal, type ModalProps } from "./components/modal";

// Componentes — ORGANISMS
export { NavBar, type NavBarProps } from "./components/navbar";
export { Sidebar, useSidebar, type SidebarProps } from "./components/sidebar";
export { DataTable } from "./components/data-table";
