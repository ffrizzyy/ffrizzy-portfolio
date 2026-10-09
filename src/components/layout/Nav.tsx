"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/shared/Icon";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import { LAYOUT, NAV_LINKS, SITE } from "@/lib/constants";

/**
 * Spec 2.7 nav: wordmark left, five anchor links, theme switch right, 64px
 * tall with a hairline bottom border, and deliberately not sticky. Below md a
 * hamburger opens a full-height sheet with large links.
 */
export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-line bg-paper">
      <div className={`${LAYOUT.container} flex h-16 items-center justify-between gap-6`}>
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-ink"
          aria-label={`${SITE.shortName}, home`}
        >
          {SITE.wordmark}
        </Link>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-ink-muted underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-ink hover:decoration-signal"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeSwitch />
          </div>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="grid size-10 place-items-center border-2 border-ink text-ink md:hidden"
              >
                <Icon name="List" size={20} />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
              <Dialog.Content className="fixed inset-0 z-50 flex h-dvh flex-col bg-paper p-6">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl font-extrabold">Menu</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="grid size-10 place-items-center border-2 border-ink"
                    >
                      <Icon name="X" size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                <Dialog.Description className="sr-only">
                  Jump to a section of the portfolio.
                </Dialog.Description>

                <nav aria-label="Sections" className="mt-10 flex-1">
                  <ul className="flex flex-col gap-2">
                    {NAV_LINKS.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 font-display text-3xl font-extrabold tracking-tight text-ink"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="flex items-center justify-between border-t border-line pt-6">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                    Theme
                  </span>
                  <ThemeSwitch />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
