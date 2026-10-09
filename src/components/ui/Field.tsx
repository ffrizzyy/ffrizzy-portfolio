import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Spec 4.10 inputs: label above the field, 1.5px ink border on --paper-raised,
 * radius 0, focus outline 2px signal with a 2px offset. There is no
 * placeholder-as-label path: a label is always rendered.
 */

const controlClasses = [
  "w-full rounded-none border-[1.5px] border-ink bg-paper-raised px-3 py-2.5 text-ink",
  "placeholder:text-ink-muted",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  "aria-[invalid=true]:border-danger",
  "disabled:opacity-50",
].join(" ");

type FieldShellProps = {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
};

export function Field({ label, error, hint, children }: FieldShellProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClasses, "resize-y", className)} {...props} />;
}

export function NativeSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClasses, "appearance-none pr-10", className)} {...props} />;
}
