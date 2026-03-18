import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef } from "react";
import { mergeClasses } from "../../utils/mergeClasses";

function getFieldClasses(hasError?: boolean): string {
  return mergeClasses(
    "w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors",
    hasError
      ? "border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
      : "border-slate-300 bg-white text-slate-950 focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
  );
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
}

function FieldLabel({
  label,
  required,
  optional,
}: Pick<FieldProps, "label" | "required" | "optional">) {
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {required ? <span className="text-rose-500">*</span> : null}
      {optional ? <span className="text-xs font-normal text-slate-500">(optional)</span> : null}
    </span>
  );
}

interface InputFieldProps extends FieldProps, InputHTMLAttributes<HTMLInputElement> {}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, error, hint, required, optional, className, id, ...props },
  ref,
) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <FieldLabel label={label} required={required} optional={optional} />
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        className={mergeClasses(getFieldClasses(Boolean(error)), className)}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
});

interface TextareaFieldProps extends FieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    { label, error, hint, required, optional, className, id, ...props },
    ref,
  ) {
    return (
      <label htmlFor={id} className="block space-y-2">
        <FieldLabel label={label} required={required} optional={optional} />
        <textarea
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={mergeClasses(getFieldClasses(Boolean(error)), "min-h-28 resize-y", className)}
          {...props}
        />
        {error ? <span className="text-xs text-rose-600">{error}</span> : null}
        {!error && hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </label>
    );
  },
);

interface SelectFieldProps extends FieldProps, SelectHTMLAttributes<HTMLSelectElement> {}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, hint, required, optional, className, id, children, ...props },
  ref,
) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <FieldLabel label={label} required={required} optional={optional} />
      <select
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        className={mergeClasses(getFieldClasses(Boolean(error)), className)}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
});
