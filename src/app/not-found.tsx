import Link from "next/link";

import { Sticker } from "@/components/shared/decor";
import { LAYOUT } from "@/lib/constants";

/**
 * Spec 5.2: a composed 404 with one sticker and a link home, with the title in
 * the display font.
 */
export default function NotFound() {
  return (
    <section className={`${LAYOUT.section} grid min-h-[70dvh] place-items-center`}>
      <div className={`${LAYOUT.container} flex flex-col items-center gap-6 text-center`}>
        <Sticker label="ffrizzy" spin={-6} className="size-20">
          <span className="font-display text-2xl font-extrabold tracking-tight">F</span>
        </Sticker>

        <p className="num text-xs uppercase tracking-[0.18em] text-ink-muted">Error 404</p>
        <h1 className="text-4xl md:text-6xl">Nothing on this page.</h1>
        <p className="max-w-[65ch] text-base text-ink-muted">
          The link may be old, or the project slug may have changed. The work list has everything.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/"
            className="text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            Back home
          </Link>
          <Link
            href="/#all"
            className="text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            See all work
          </Link>
        </div>
      </div>
    </section>
  );
}
