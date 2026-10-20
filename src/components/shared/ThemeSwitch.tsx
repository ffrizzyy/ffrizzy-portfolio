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
 * How long the `theme-switching` class stays on <html>. The fade itself is
 * 200ms in globals.css; the extra 100ms is slack for next-themes to apply the
 * attribute in its effect, so the class is never removed mid-transition.
 */
const THEME_TRANSITION_MS = 300;

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const timer = useRef<number | null>(null);

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

  // The whole-page fade is opted into for the duration of the change rather
  // than left on permanently: a permanent `transition` on every element makes
  // every hover and every filter feel laggy. The class is added before
  // next-themes writes the attribute, so the first frame after the switch is
  // already animating, and removed once the fade has finished.
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      document.documentElement.classList.remove("theme-switching");
    },
    [],
  );

  const changeTheme = useCallback(
    (value: string) => {
      // Written first so the selected segment is already correct when the
      // attribute change repaints, whether or not the CSS fade is available.
      document.documentElement.setAttribute("data-theme-choice", value);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheme(value);
        return;
      }

      document.documentElement.classList.add("theme-switching");
      setTheme(value);

      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-switching");
        timer.current = null;
      }, THEME_TRANSITION_MS);
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
