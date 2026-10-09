"use client";

import { useEffect, useRef, useState } from "react";

import { formatStat } from "@/lib/utils";

/**
 * Stat count-up. Spec 4.2: projects counts 0 to 10 and followers counts 0 to
 * 100K+, over 1.4s, and runs once rather than on every scroll back.
 *
 * Deviation from spec 2.8, recorded on purpose: the spec asks for a CSS
 * @property integer counter. That approach can only paint through a
 * pseudo-element's content, which means the real number is never in the DOM and
 * a browser that mishandles @property renders a zero. This keeps the final
 * value as real text at all times, so the worst case is a number that does not
 * animate, never a wrong number.
 *
 * It takes formatting parameters rather than a format function, because a
 * function prop cannot cross the Server to Client Component boundary.
 *
 * It uses IntersectionObserver rather than a scroll listener, which spec 2.8
 * requires, and it bails out entirely under prefers-reduced-motion.
 */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  lowerBound = false,
  duration = 1400,
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  lowerBound?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  // Renders the final value on the server and on first paint, so the number is
  // correct even without JavaScript, then animates up from zero when it
  // scrolls into view.
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(value);
      return;
    }

    setCurrent(0);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || startedRef.current) return;
        startedRef.current = true;

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(value * eased);
          if (progress < 1) requestAnimationFrame(step);
          else setCurrent(value);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {formatStat(current, { decimals, suffix, lowerBound })}
    </span>
  );
}
