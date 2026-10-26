"use client";

import { useEffect, useState } from "react";

import SlingButton from "@/components/reactbits/SlingButton";
import { cn } from "@/lib/utils";

/**
 * The go-up control, built on the React Bits sling.
 *
 * It appears once the reader has left the top of the page. That is read from the
 * one-pixel sentinel the nav already uses, through an IntersectionObserver, so
 * no scroll listener is added and nothing runs per frame.
 *
 * The control is the registry component with the site's palette: paper pad,
 * ink ring, signal accent. Pulling it and letting go is the same gesture the
 * component was designed for, and a plain click still sends, so nothing is
 * hidden behind a drag. The wrapper owns the fixed position and the appearance
 * transition; the button inside owns the gesture.
 *
 * Under reduced motion the page jumps instead of scrolling and the registry
 * component suppresses its own flight path.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => setShown(entries[0]?.isIntersecting === false),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const toTop = () => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  };

  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      className={cn(
        // Clears the fixed mobile bar; from md up there is no bar under it.
        "fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(var(--mobile-nav-h,64px)_+_0.75rem)] z-40",
        "md:right-8 md:bottom-8",
        "print:hidden leading-none",
        "transition-[opacity,transform] duration-200 ease-zine",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <SlingButton
        onSend={toTop}
        axis="vertical"
        size={52}
        particles={9}
        padColor="var(--paper-raised)"
        iconColor="var(--ink)"
        accentColor="var(--signal)"
        wellColor="var(--ink)"
        bandColor="var(--ink-muted)"
        ariaLabel="Back to top"
        hint="Press Enter to scroll to the top, or drag and release."
        className="sling-control"
      />
    </div>
  );
}
