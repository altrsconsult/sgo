import * as React from "react";
import { FormField } from "./form-field";
import { Input } from "./input";
import { cn } from "../lib/utils";

export interface FormConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "textarea" | "select" | "checkbox" | "radio";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  help?: string;
  options?: Array<{ value: string | number; label: string }>;
}

export interface FormCompleteProps extends React.FormHTMLAttributes<HTMLFormElement> {
  fields: FormConfig[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onChange?: (data: Record<string, any>) => void;
  layout?: "vertical" | "horizontal";
}

const FormComplete = React.forwardRef<HTMLFormElement, FormCompleteProps>(
  (
    {
      className,
      fields,
      onSubmit,
      submitLabel = "Enviar",
      isSubmitting = false,
      onChange,
      layout = "vertical",
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = React.useState<Record<string, any>>(() => {
      const initial: Record<string, any> = {};
      fields.forEach((field) => {
        initial[field.name] = field.type === "checkbox" ? false : "";
      });
      return initial;
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleChange = (name: string, value: any) => {
      const newData = { ...formData, [name]: value };
      setFormData(newData);
      onChange?.(newData);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Form error:", error);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("w-full", className)}
        noValidate
        {...props}
      >
        <div className={cn("space-y-4", layout === "horizontal" && "grid grid-cols-2 gap-4")}>
          {fields.map((field) => (
            <FormFieldRenderer
              key={field.name}
              config={field}
              value={formData[field.name]}
              error={errors[field.name]}
              onChange={(value) => handleChange(field.name, value)}
            />
          ))}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium",
              "hover:bg-primary/90 disabled:opacity-50"
            )}
          >
            {isSubmitting ? "Processando..." : submitLabel}
          </button>
        </div>
      </form>
    );
  }
);
FormComplete.displayName = "FormComplete";

interface FormFieldRendererProps {
  config: FormConfig;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

const FormFieldRenderer = React.forwardRef<HTMLDivElement, FormFieldRendererProps>(
  ({ config, value, error, onChange }, ref) => {
    let inputElement: React.ReactElement;

    if (["text", "email", "password", "number", "tel"].includes(config.type || "text")) {
      inputElement = (
        <Input
          type={config.type || "text"}
          placeholder={config.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={config.disabled}
        />
      );
    } else if (config.type === "textarea") {
      inputElement = (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          disabled={config.disabled}
          rows={4}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm font-normal",
            "bg-background border-input placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
      );
    } else if (config.type === "select") {
      inputElement = (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={config.disabled}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm font-normal",
            "bg-background border-input",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <option value="">Selecione...</option>
          {config.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    } else if (config.type === "checkbox") {
      return (
        <div ref={ref} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            disabled={config.disabled}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <label className="text-sm font-medium cursor-pointer">
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      );
    } else {
      inputElement = <Input placeholder={config.placeholder} />;
    }

    return (
      <FormField
        ref={ref}
        label={config.label}
        input={inputElement}
        error={error}
        helperText={config.help}
        required={config.required}
        disabled={config.disabled}
      />
    );
  }
);
FormFieldRenderer.displayName = "FormFieldRenderer";

export { FormComplete, FormFieldRenderer };
