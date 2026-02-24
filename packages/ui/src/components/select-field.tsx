import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * SelectField: Wrapper completo de Select com Label + Error + HelperText
 * Usa Radix UI Select primitivos para máxima customização
 */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Label do campo */
  label: string;
  /** Opções do select */
  options: SelectOption[];
  /** Valor selecionado */
  value?: string;
  /** Callback ao mudar (string value, não React.ChangeEvent) */
  onChange?: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Mensagem de erro */
  error?: string;
  /** Texto auxiliar */
  helperText?: string;
  /** Marca como obrigatório */
  required?: boolean;
  /** Desabilita */
  disabled?: boolean;
}

/**
 * SelectField — Select com suporte completo de formulário
 *
 * @example
 * <SelectField
 *   label="Categoria"
 *   options={[
 *     { value: "cat1", label: "Categoria 1" },
 *     { value: "cat2", label: "Categoria 2" },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 *   required
 * />
 */
const SelectField = React.forwardRef<HTMLDivElement, SelectFieldProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      placeholder = "Selecione...",
      error,
      helperText,
      required,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const fieldId = React.useId();

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 w-full", className)}
        {...props}
      >
        {/* Label */}
        <label
          htmlFor={fieldId}
          className={cn(
            "text-sm font-medium leading-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>

        {/* Select Trigger */}
        <SelectPrimitive.Root
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            id={fieldId}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive",
              "[&>span]:line-clamp-1"
            )}
            aria-invalid={!!error}
            aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          {/* Dropdown Content */}
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              )}
            >
              <SelectPrimitive.ScrollUpButton className="flex cursor-pointer items-center justify-center py-1">
                <ChevronUp className="h-4 w-4" />
              </SelectPrimitive.ScrollUpButton>

              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      "hover:bg-accent/50"
                    )}
                  >
                    <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-current" />
                    </SelectPrimitive.ItemIndicator>
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="flex cursor-pointer items-center justify-center py-1">
                <ChevronDown className="h-4 w-4" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {/* Erro ou Helper Text */}
        {error && (
          <p
            id={`${fieldId}-description`}
            className="text-sm text-destructive font-medium"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${fieldId}-description`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export { SelectField };
