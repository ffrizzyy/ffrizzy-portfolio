"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * React Bits' magnetic control, rebuilt without a dependency.
 *
 * The wrapper is the hit area, the inner element is what moves. The offset is
 * lerped toward the pointer on a single rAF loop and released back to zero on
 * exit, so the movement has a little weight instead of snapping to the cursor.
 * It writes `transform` directly to the node: no state, no re-render, one
 * compositor property.
 *
 * Held to 5px on purpose. A magnetic pull is a hint that the control noticed the
 * cursor; any further and it starts working against the click it is inviting.
 * Everything is off on touch, on coarse pointers, and under reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.16,
  max = 5,
  className,
}: {
  children: ReactNode;
  strength?: number;
  /** Ceiling in px, so the pull never becomes a target that moves away. */
  max?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const inner = innerRef.current;
    if (!host || !inner) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    let frame = 0;
    let running = false;
    const at = { x: 0, y: 0 };
    const to = { x: 0, y: 0 };

    const draw = () => {
      at.x += (to.x - at.x) * 0.2;
      at.y += (to.y - at.y) * 0.2;

      const settled = Math.abs(to.x - at.x) < 0.04 && Math.abs(to.y - at.y) < 0.04;
      if (settled) {
        at.x = to.x;
        at.y = to.y;
      }

      inner.style.transform =
        at.x === 0 && at.y === 0
          ? ""
          : `translate3d(${at.x.toFixed(2)}px, ${at.y.toFixed(2)}px, 0)`;

      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    const onMove = (event: globalThis.PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (event.clientY - (rect.top + rect.height / 2)) * strength;
      to.x = Math.max(-max, Math.min(max, dx));
      to.y = Math.max(-max, Math.min(max, dy));
      wake();
    };

    const release = () => {
      to.x = 0;
      to.y = 0;
      wake();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", release);
    host.addEventListener("blur", release, true);

    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", release);
      host.removeEventListener("blur", release, true);
      inner.style.transform = "";
    };
  }, [strength, max]);

  return (
    <span ref={hostRef} className={`inline-flex ${className ?? ""}`}>
      <span ref={innerRef} className="inline-flex">
        {children}
      </span>
    </span>
  );
}
