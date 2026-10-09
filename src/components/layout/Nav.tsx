"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Icon } from "@/components/shared/Icon";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import { LAYOUT, NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Floating glass navigation.
 *
 * Spec 2.7 originally specified a 64px bar that scrolls away, and listed a
 * sticky header as a later addition. This is that later addition: a fixed,
 * rounded, translucent bar that follows the reader, thickens once content is
 * passing underneath, and marks which section is currently in view.
 *
 * It reads no scroll position. The compact state comes from an
 * IntersectionObserver on a sentinel at the top of the document, and the active
 * section from an IntersectionObserver over the nav targets, so spec 2.8's ban
 * on scroll listeners still holds and nothing runs per frame.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  // "Has the page moved at all?" A one-pixel sentinel answers that without a
  // scroll handler.
  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Which nav target is in the reading band. The negative root margin shrinks
  // the viewport to a strip around the middle, so a section becomes current
  // when it reaches the centre of the screen rather than the moment it appears.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }

    const targets = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (first) setActive(first.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className={cn(LAYOUT.container, "nav-drop")}>
        <div
          className={cn(
            "glass relative flex items-center justify-between gap-3 rounded-pill px-3 transition-[height,box-shadow,background-color] duration-300 ease-zine md:px-5",
            scrolled ? "glass-scrolled h-12 shadow-[0_12px_34px_-16px_rgba(0,0,0,0.4)]" : "h-14",
          )}
        >
          <Link
            href="/"
            aria-label={`${SITE.shortName}, home`}
            className="group flex items-baseline gap-2 rounded-pill px-1 py-1"
          >
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              {SITE.wordmark}
            </span>
            {/* A live status dot. The only perpetual motion is the tools strip,
                so this is a static mark rather than a pulse. */}
            <span aria-hidden className="size-1.5 rounded-pill bg-signal" />
          </Link>

          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative block rounded-pill px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-zine",
                        isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-pill bg-signal transition-transform duration-300 ease-zine",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeSwitch />
            </div>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid size-9 place-items-center rounded-pill border-2 border-ink text-ink transition-colors hover:bg-signal hover:text-on-signal md:hidden"
                >
                  <Icon name="List" size={18} />
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm" />
                <Dialog.Content className="glass fixed inset-3 z-50 flex flex-col rounded-[24px] p-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="font-display text-lg font-extrabold">
                      {SITE.wordmark}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="grid size-9 place-items-center rounded-pill border-2 border-ink text-ink"
                      >
                        <Icon name="X" size={18} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <Dialog.Description className="sr-only">
                    Jump to a section of the portfolio.
                  </Dialog.Description>

                  <nav aria-label="Sections" className="mt-10 flex-1">
                    <ul className="flex flex-col gap-1">
                      {NAV_LINKS.map((link, index) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="flex items-baseline gap-3 rounded-[14px] px-3 py-2.5 transition-colors hover:bg-paper-sunken"
                          >
                            <span className="num text-xs text-ink-muted">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="font-display text-3xl font-extrabold tracking-tight text-ink">
                              {link.label}
                            </span>
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

          {/* Scroll progress. Driven by a CSS scroll timeline, so it costs no
              JavaScript at all. */}
          <span
            aria-hidden
            className="scroll-progress absolute inset-x-4 bottom-0 h-0.5 rounded-pill bg-signal"
          />
        </div>
      </div>
    </header>
  );
}
