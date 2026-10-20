"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icon, type IconName } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

/**
 * Spec 2.7 theme switch: a segmented pill with three 34px round icon buttons
 * inside a 2px ink border. Selected is an ink fill with a paper icon.
 *
 * Implemented with native radio inputs, so arrow-key navigation and the
 * radiogroup announcement come from the platform rather than from custom key
 * handling. Spec 2.11 requires it to be a labelled radio group.
 */
const OPTIONS: { value: "system" | "light" | "dark"; label: string; icon: IconName }[] = [
  { value: "system", label: "System", icon: "Monitor" },
  { value: "light", label: "Light", icon: "Sun" },
  { value: "dark", label: "Dark", icon: "Moon" },
];

/**
 * Same-document view transitions. Not in TypeScript's lib.dom everywhere yet,
 * so this is the narrowest possible shape and is feature-detected at runtime.
 */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished?: Promise<unknown> } | undefined;
};

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Monotonic id for view transitions. A second click while the first fade is
  // still running must win: the earlier update callback and its cleanup are
  // ignored so they cannot restore the old theme or remove `.theme-vt` early.
  const transitionId = useRef(0);

  // The server cannot know the visitor's stored theme, so the first paint
  // renders every option unselected. Without this the markup would not match.
  useEffect(() => setMounted(true), []);

  // The selected segment is painted from `data-theme-choice` (see
  // globals.css), which the pre-paint script writes. This keeps that attribute
  // in step when next-themes changes the theme from somewhere else, such as a
  // storage event in another tab.
  useEffect(() => {
    if (mounted && theme) {
      document.documentElement.setAttribute("data-theme-choice", theme);
    }
  }, [mounted, theme]);

  const changeTheme = useCallback(
    (value: string) => {
      const root = document.documentElement;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Resolve the attribute here instead of waiting for next-themes to do it
      // in an effect. next-themes applies `data-theme` after React commits and
      // paints, which used to put the content a frame or two behind the switch.
      // Writing it synchronously puts both in the same paint. setTheme still
      // runs, which keeps the provider, localStorage, and the system listener
      // in sync; it rewrites the same value, so nothing changes twice.
      const resolved =
        value === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : value;

      const apply = () => {
        root.setAttribute("data-theme-choice", value);
        root.setAttribute("data-theme", resolved);
        root.style.colorScheme = resolved;
        setTheme(value);
      };

      if (reduced) {
        apply();
        return;
      }

      // One cross-fade of two compositor snapshots, not a transition on every
      // node. The old approach put `transition` on `html *`, which created
      // around 1,800 simultaneous CSS transitions on this page: the main thread
      // stalled, the switch repainted immediately, and the page colour arrived
      // late. A view transition keeps the old frame on screen and fades the new
      // one in as a single GPU layer, so the switch and the content leave and
      // arrive together.
      const startViewTransition = (document as ViewTransitionDocument).startViewTransition;
      if (startViewTransition) {
        const id = ++transitionId.current;
        try {
          const transition = startViewTransition.call(document, () => {
            if (id !== transitionId.current) return;
            // Existing `transition-colors` utilities would otherwise start
            // hundreds of their own 150ms fades underneath the snapshot, at a
            // different speed from the 200ms cross-fade. Suppressing them inside
            // the update callback means the new snapshot is captured already at
            // rest and the compositor cross-fade is the only motion on screen.
            root.classList.add("theme-vt");
            apply();
          });

          const restore = () => {
            if (id === transitionId.current) root.classList.remove("theme-vt");
          };
          if (transition?.finished) transition.finished.then(restore, restore);
          // Backstop in case `finished` never settles. Long after the 200ms
          // fade, so it cannot cut a running transition short.
          window.setTimeout(restore, 400);
          return;
        } catch {
          // If the browser refuses the transition, still switch, instantly.
          root.classList.remove("theme-vt");
        }
      }

      // Older engines get an instant, consistent switch rather than a partial
      // fade that cannot keep up.
      apply();
    },
    [setTheme],
  );

  const active = mounted ? theme : undefined;

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="inline-flex items-center gap-0.5 rounded-pill border-2 border-ink p-0.5"
    >
      {OPTIONS.map((option) => {
        const selected = active === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "theme-option grid size-[34px] cursor-pointer place-items-center rounded-pill",
              `theme-option-${option.value}`,
              "text-ink-muted transition-[background-color,color,transform] duration-200 ease-zine",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
              "hover:text-ink active:scale-90",
            )}
          >
            <input
              type="radio"
              name="color-theme"
              value={option.value}
              checked={selected}
              onChange={() => changeTheme(option.value)}
              className="sr-only"
              aria-label={option.label}
            />
            <Icon
              name={option.icon}
              size={18}
              className="transition-transform duration-300 ease-zine"
            />
          </label>
        );
      })}
    </div>
  );
}
