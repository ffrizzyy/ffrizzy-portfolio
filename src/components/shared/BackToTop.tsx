"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

/**
 * The go-up control, with a sling.
 *
 * It appears once the reader has left the top of the page. That is read from the
 * one-pixel sentinel the nav already uses, through an IntersectionObserver, so
 * no scroll listener is added and nothing runs per frame.
 *
 * Pressing it squashes the pill, throws the arrow up, and settles while the page
 * scrolls home. The animation is a class rather than state held across frames,
 * and the class is removed on `animationend`. Under reduced motion the page
 * jumps and the control does not move at all.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  const [arming, setArming] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => setShown(entries[0]?.isIntersecting === false),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const toTop = () => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });

    if (calm) return;
    setArming(true);
    // Belt and braces: animationend fires on the pill, but a browser that
    // skips the animation would leave the class on for good.
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setArming(false), 900);
  };

  return (
    <button
      type="button"
      onClick={toTop}
      onAnimationEnd={() => setArming(false)}
      aria-label="Back to top"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={cn(
        // Clears the fixed mobile bar; from md up there is no bar under it.
        "fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(var(--mobile-nav-h,64px)_+_0.75rem)] z-40",
        "md:right-8 md:bottom-8",
        "grid size-11 place-items-center rounded-pill border-2 border-ink bg-paper-raised text-ink shadow-hard print:hidden",
        "transition-[opacity,transform,box-shadow,background-color] duration-200 ease-zine",
        "hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--shadow-color)] hover:bg-signal hover:text-on-signal",
        "active:translate-y-0 active:scale-95 active:shadow-none",
        shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        arming && "sling-armed",
      )}
    >
      <Icon name="ArrowUp" size={20} className="sling-arrow" />
    </button>
  );
}
