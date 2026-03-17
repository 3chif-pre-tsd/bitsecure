import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { mergeClasses } from "../../utils/mergeClasses";

function getFieldClasses(hasError?: boolean): string {
  return mergeClasses(
    "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
    hasError
      ? "border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
      : "border-slate-200 bg-slate-50 text-slate-950 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100",
  );
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
}

interface InputFieldProps extends FieldProps, InputHTMLAttributes<HTMLInputElement> {}

export function InputField({ label, error, hint, className, id, ...props }: InputFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={mergeClasses(getFieldClasses(Boolean(error)), className)}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

interface TextareaFieldProps extends FieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextareaField({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={mergeClasses(getFieldClasses(Boolean(error)), "min-h-32 resize-y", className)}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

interface SelectFieldProps extends FieldProps, SelectHTMLAttributes<HTMLSelectElement> {}

export function SelectField({
  label,
  error,
  hint,
  className,
  id,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
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
}
