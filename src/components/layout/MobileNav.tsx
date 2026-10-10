"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { LAYOUT, NAV_LINKS } from "@/lib/constants";

/**
 * The mobile section bar.
 *
 * Home is one page about 17,000px tall on a 390px phone, and until now the only
 * way to reach a section was the floating pill at the top, which means scrolling
 * all the way back up. This is a fixed bar pinned to the bottom edge, shown below
 * md and removed at md and above, so the desktop experience is untouched.
 *
 * Two details are deliberate:
 *
 * - The first entry is #work rather than the desktop nav's #all. The bar carries
 *   the five section anchors, and on a phone the "selected work" bento is the
 *   section a visitor is looking for; see the note on MOBILE_ENTRIES below.
 * - It reads no scroll position. The active entry comes from an
 *   IntersectionObserver over the same section ids the desktop nav watches, so
 *   nothing runs per frame and spec 2.8's ban on scroll listeners still holds.
 *
 * Smooth scrolling is not implemented here. `html { scroll-behavior: smooth }`
 * and `scroll-padding-top: 104px` already live in globals.css, so a plain
 * fragment jump lands the heading clear of the top bar and animates without
 * JavaScript, and the existing reduced-motion block sets both back to auto. The
 * offset is LAYOUT.anchorOffset: the stylesheet spells the same figure out
 * because a stylesheet cannot read a TypeScript constant, so this is the one
 * place the two are tied together.
 */
type MobileEntry = { label: string; id: string };

/**
 * The five main sections, taken straight from NAV_LINKS.
 *
 * It was briefly retargeted so that "Work" opened #work, the bento, on the
 * grounds that NAV_LINKS points the same label at #all. That was reverted: a
 * label has to mean one thing, and "Work" opening a different section depending
 * on the width of the window is a trap, particularly for someone who rotates a
 * phone or sends a link. If the bento deserves its own entry it should get one in
 * NAV_LINKS, so both bars change together.
 */
const MOBILE_ENTRIES: MobileEntry[] = NAV_LINKS.map((link) => ({
  label: link.label,
  id: link.href.slice(1),
}));

export function MobileNav() {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }

    const targets = MOBILE_ENTRIES.map((entry) => document.getElementById(entry.id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (targets.length === 0) return;

    // Ids currently inside the reading band. Keeping the set, rather than just
    // writing the newest intersection, is what lets the bar clear itself when
    // the reader reaches the end of the last section instead of freezing on it.
    const inBand = new Set<string>();

    // The negative root margin shrinks the viewport to a strip around the
    // middle, matching Nav's observer so both bars agree on which section is
    // current. The topmost intersecting section wins, again as in Nav.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }

        if (inBand.size === 0) {
          setActive(null);
          return;
        }

        const topmost = targets
          .filter((target) => inBand.has(target.id))
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];

        setActive(topmost ? topmost.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <nav
      aria-label="Sections"
      // Publishes the anchor offset this bar relies on, so the number in the
      // stylesheet and LAYOUT.anchorOffset can be checked against each other in
      // the DOM rather than by reading two files.
      data-anchor-offset={LAYOUT.anchorOffset}
      className={cn(
        // z-40 is Z.nav, the tier the floating header already owns. The two
        // never overlap: one is pinned to the top edge at md and up, this one to
        // the bottom edge below md.
        "fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper md:hidden",
        // The bar occupies LAYOUT.mobileNavHeight (64px) including its 2px top
        // border, which is why the links are 62px rather than 64: the page
        // reserves exactly that figure in globals.css, so the footer cannot end
        // up underneath the bar. The safe-area inset keeps the labels clear of
        // the iPhone home indicator and is reserved on the page to match.
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className="mx-auto flex w-full max-w-7xl items-stretch">
        {MOBILE_ENTRIES.map((entry) => {
          const isActive = active === entry.id;
          return (
            <li key={entry.id} className="flex-1">
              <a
                href={onHome ? `#${entry.id}` : `/#${entry.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex min-h-[3.875rem] items-center justify-center px-1 text-center",
                  "font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors duration-200 ease-zine",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {entry.label}
                {/* The same signal rule the desktop bar marks its active entry
                    with, mirrored to the top edge because the active weight
                    belongs against the page above the bar. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 top-0 h-0.5 origin-left rounded-pill bg-signal transition-transform duration-300 ease-zine",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
