"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ReactNode } from "react";

import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

/**
 * Spec 2.7 accordion: hairline rows, a mono + that rotates 45 degrees when
 * open, hover fills with signal, the open row is --paper-sunken with an ink
 * border, and content fades up in 350ms. Skills allow one open row at a time,
 * which is why `type` is single and collapsible.
 *
 * `className` exists for the one place the accordion is not a free-standing
 * list: inside the skills stem it sits flush in a bordered panel, so the row
 * rules that would double up against the panel's own border come off.
 */
export function Accordion({
  items,
  ariaLabel,
  defaultValue,
  className,
}: {
  items: { id: string; title: ReactNode; content: ReactNode }[];
  ariaLabel: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultValue}
      aria-label={ariaLabel}
      className={cn("border-t border-line", className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="border-b border-line data-[state=open]:border-ink data-[state=open]:bg-paper-sunken"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-ink transition-colors hover:bg-signal hover:text-on-signal data-[state=open]:bg-paper-sunken data-[state=open]:text-ink">
              <span className="text-base font-medium">{item.title}</span>
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center transition-transform duration-300 ease-zine group-data-[state=open]:rotate-45"
              >
                <Icon name="Plus" size={18} />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden">
            <div className="reveal-fade px-4 pb-5 pt-1">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
