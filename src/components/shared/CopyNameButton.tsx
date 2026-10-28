"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

type Status = "idle" | "copied" | "error";

/**
 * Spec 2.7: controls are pills, and this is an icon-only one, so it carries an
 * accessible name rather than relying on the glyph.
 *
 * The clipboard API only exists on a secure origin. A CV opened over plain http
 * on a LAN, or the site's own preview build, would silently do nothing, so the
 * deprecated textarea path stays as the fallback.
 */
function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  // Off-screen rather than display:none, which cannot be selected.
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "-9999px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    area.remove();
  }
  return ok;
}

/**
 * The CV header's copy control. The name is spelled out on screen already, but
 * it is long and hyphenated, so anyone pasting it into an email or a form wants
 * it verbatim rather than retyped.
 *
 * After a copy the icon swaps to a check and a small "Copied" tag rises above
 * the button, both of which revert after two seconds. The state also lives in a
 * polite live region, because a purely visual confirmation is no confirmation at
 * all for a screen reader.
 */
export function CopyNameButton({ name, className }: { name: string; className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | undefined>(undefined);

  // A second click restarts the confirmation instead of stacking timers, which
  // would otherwise clear the newer state early.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(name);
      ok = true;
    } catch {
      ok = legacyCopy(name);
    }

    setStatus(ok ? "copied" : "error");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2000);
  }, [name]);

  const failed = status === "error";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy full name: ${name}`}
        title={`Copy full name: ${name}`}
        className={cn(
          "grid size-11 place-items-center rounded-pill border-2 border-ink bg-paper text-ink",
          "transition-[background-color,transform,box-shadow,color] duration-200 ease-zine",
          "hover:-translate-y-0.5 hover:bg-paper-sunken hover:shadow-hard",
          "active:translate-y-0 active:shadow-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          status !== "idle" && "bg-paper-sunken",
          failed && "text-ink-muted",
          className,
        )}
      >
        {/* Keyed on the state so the swap remounts the glyph and replays the
            pop. The check is the same size as the copy mark, so the pill does
            not resize when the icon changes. */}
        <Icon
          key={status}
          name={failed ? "X" : status === "copied" ? "Check" : "Copy"}
          size={18}
          className="copy-icon"
        />
      </button>

      {/* Decorative duplicate of the live-region message: sighted users get the
          tag, assistive tech gets the sentence below. The outer span centres it
          and the inner one animates, so the pop cannot fight the centring. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+8px)] left-0 right-0 flex justify-center",
          status === "idle" && "hidden",
        )}
      >
        <span
          key={status}
          className="copy-tip whitespace-nowrap rounded-pill border-2 border-ink bg-ink px-2.5 py-1 num text-xs uppercase tracking-[0.12em] text-paper"
        >
          {failed ? "Copy failed" : "Copied"}
        </span>
      </span>

      <span role="status" aria-live="polite" className="sr-only">
        {status === "idle"
          ? ""
          : failed
            ? "Could not copy the name. Select it and copy manually."
            : "Full name copied to clipboard"}
      </span>
    </span>
  );
}
