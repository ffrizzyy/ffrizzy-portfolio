import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Spec 2.7 buttons. One shape rule: controls are pills. The primary variant is
 * the only place the hard offset shadow appears on a control.
 */
export const buttonVariants = cva(
  [
    "inline-flex select-none items-center justify-center gap-2 rounded-pill border-2 border-ink",
    "font-medium tracking-tight whitespace-nowrap",
    "transition-[box-shadow,transform,background-color,color] duration-200 ease-zine",
    "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Dark mode swaps the shadow to signal through --shadow-color.
        primary: [
          "bg-signal text-on-signal shadow-hard",
          "hover:shadow-[6px_6px_0_0_var(--shadow-color)]",
          "active:translate-y-px active:scale-[0.98] active:shadow-none",
        ].join(" "),
        secondary: [
          "bg-transparent text-ink",
          "hover:bg-paper-sunken",
          "active:translate-y-px active:scale-[0.98]",
        ].join(" "),
        // Spec 2.7: text links are ink with a thick signal underline.
        link: [
          "border-0 bg-transparent p-0 text-ink underline decoration-signal decoration-2 underline-offset-4",
          "hover:decoration-4",
        ].join(" "),
      },
      size: {
        md: "h-11 px-6 text-[0.95rem]",
        sm: "h-9 px-4 text-sm",
        none: "h-auto p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
