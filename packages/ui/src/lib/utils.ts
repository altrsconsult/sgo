import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para combinar classes CSS com suporte a condicionais e merge de Tailwind.
 * Evita conflitos de classes (ex: p-2 e p-4 juntos).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
