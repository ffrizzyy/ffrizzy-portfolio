"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server cannot know the visitor's stored theme, so the first paint
  // renders every option unselected. Without this the markup would not match.
  useEffect(() => setMounted(true), []);

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
              "grid size-[34px] cursor-pointer place-items-center rounded-pill transition-colors duration-200 ease-zine",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
              selected ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
            )}
          >
            <input
              type="radio"
              name="color-theme"
              value={option.value}
              checked={selected}
              onChange={() => setTheme(option.value)}
              className="sr-only"
              aria-label={option.label}
            />
            <Icon name={option.icon} size={18} />
          </label>
        );
      })}
    </div>
  );
}
