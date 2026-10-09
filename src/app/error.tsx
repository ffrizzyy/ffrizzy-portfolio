"use client";

import { Button } from "@/components/ui/Button";
import { LAYOUT } from "@/lib/constants";

/**
 * Spec 5.2: a short explanation, a Try again button, and a link home.
 */
export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className={`${LAYOUT.section} grid min-h-[70dvh] place-items-center`}>
      <div className={`${LAYOUT.container} flex flex-col gap-5`}>
        <p className="num text-xs uppercase tracking-[0.18em] text-ink-muted">Something broke</p>
        <h1 className="text-3xl md:text-5xl">This page did not render.</h1>
        <p className="max-w-[65ch] text-base text-ink-muted">
          Trying again usually works. The rest of the site is unaffected.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-6">
          <Button type="button" variant="primary" size="md" onClick={reset}>
            Try again
          </Button>
          <a
            href="/"
            className="text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            Back home
          </a>
        </div>
      </div>
    </section>
  );
}
