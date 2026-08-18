import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Deliberately not shadcn's Form/FormField/FormItem/FormControl stack — that
 * generator's `form` registry item isn't available for this project's
 * (very new) shadcn style, so every form in this app pairs this with plain
 * react-hook-form `register`/`formState.errors` instead:
 *
 *   <FormField label="Email" htmlFor="email" error={errors.email?.message}>
 *     <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
 *   </FormField>
 */
export function FormField({ label, htmlFor, error, description, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : (
        description && <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
