"use client";

import * as Popover from "@radix-ui/react-popover";

/**
 * Spec 4.2: every stat carries a method and an asOf date, and the reader can
 * open "How is this counted?" to see both.
 *
 * A small client leaf so the rest of the stat grid stays a Server Component,
 * which is the pattern spec 1.3 asks for.
 */
export function CountedPopover({ method, asOf }: { method: string; asOf: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger className="w-fit text-sm text-ink-muted underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-signal">
        How is this counted?
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          collisionPadding={16}
          className="reveal-fade z-[60] max-w-xs border-2 border-ink bg-paper-raised p-4 shadow-hard"
        >
          <p className="text-sm text-ink">{method}</p>
          <p className="num mt-3 text-xs uppercase tracking-[0.14em] text-ink-muted">
            As of {asOf}
          </p>
          <Popover.Arrow className="fill-[var(--ink)]" width={12} height={6} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
