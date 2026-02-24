import * as React from "react";
import { cn } from "../lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label do campo */
  label: string;
  /** Elemento Input a ser renderizado */
  input: React.ReactElement;
  /** Mensagem de erro (se houver) */
  error?: string;
  /** Texto auxiliar/hint */
  helperText?: string;
  /** Marca campo como obrigatório */
  required?: boolean;
  /** Desabilita o campo */
  disabled?: boolean;
}

/**
 * Molecule: FormField
 * Composição de Label + Input + Error + HelperText.
 * Padroniza a experiência de formulários no SGO.
 *
 * @example
 * <FormField
 *   label="E-mail"
 *   input={<Input type="email" placeholder="seu@email.com" />}
 *   helperText="Usaremos para comunicações"
 *   required
 * />
 */
const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, input, error, helperText, required, disabled, className, ...props }, ref) => {
    // Gera ID único para conectar label e input
    const fieldId = React.useId();

    // Clona o input para adicionar atributos (id, disabled, aria-invalid)
    // Casting necessário pois input.props pode ser unknown
    const inputProps = input.props as Record<string, unknown> || {};
    const inputElement = React.cloneElement(input, {
      id: fieldId,
      disabled: disabled || inputProps.disabled,
      "aria-invalid": !!error,
      "aria-describedby": error || helperText ? `${fieldId}-description` : undefined,
    } as React.InputHTMLAttributes<HTMLInputElement>);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 w-full", className)}
        {...props}
      >
        {/* Label com indicador de obrigatório */}
        <label
          htmlFor={fieldId}
          className={cn(
            "text-sm font-medium leading-none",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>

        {/* Input */}
        {inputElement}

        {/* Mensagem de erro (prioridade sobre helper text) */}
        {error && (
          <p
            id={`${fieldId}-description`}
            className="text-sm text-destructive font-medium"
          >
            {error}
          </p>
        )}

        {/* Helper text (apenas se não há erro) */}
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
FormField.displayName = "FormField";

export { FormField };
