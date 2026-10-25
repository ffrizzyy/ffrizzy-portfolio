"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP);

/**
 * The hero's entrance, and the only place GSAP runs on this page.
 *
 * Why a timeline rather than the CSS reveal the rest of the page uses: this is
 * ten words, a rule, an eyebrow, a paragraph, two controls, a photograph and
 * three stickers that have to arrive as one gesture. In CSS that is fifteen
 * hand-computed delays that have to be kept in sync with each other by hand. A
 * timeline states the overlaps once, in one place.
 *
 * The words and the marker are separate elements, so each word carries its own
 * highlight up with it rather than sliding out from behind a bar that is already
 * painted.
 *
 * ScrollTrigger has exactly one job here: the portrait drifts up slightly faster
 * than the page as the hero leaves. The rest of the page's scroll motion stays on
 * CSS scroll timelines (spec 2.8), which is why this is scoped to one element
 * rather than becoming a second motion system. It is also the reason ScrollTrigger
 * is here at all: `animation-timeline` is not in the browserslist floor (Chrome
 * 111, Safari 16.4, Firefox 111), so CSS scroll motion is an upgrade, not a
 * guarantee. This one effect is guaranteed everywhere GSAP runs.
 *
 * Reduced motion: the whole timeline lives inside a `no-preference` matchMedia,
 * so the hero is simply already there. The matching CSS only hides the hero
 * inside the same query, which is why nothing can be left invisible.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // fromTo, not from: the start state is already written in CSS so the
        // hero cannot flash before hydration, which means `from` would read
        // opacity 0 as the value to animate *to*. The endpoint has to be stated.
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.fromTo(
          "[data-hero='rule']",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.7 },
          0,
        )
          .fromTo("[data-hero='eyebrow']", { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.06)
          // 42ms between words: enough to read as a wave, short enough that the
          // last word is not still arriving after the paragraph has.
          .fromTo(
            "[data-hero='word']",
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.042 },
            0.14,
          )
          .fromTo(
            "[data-hero='photo']",
            { y: 26, scale: 0.985, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.95 },
            0.3,
          )
          .fromTo("[data-hero='sub']", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.56)
          .fromTo(
            "[data-hero='cta'] > *",
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.07 },
            0.66,
          );
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const portrait = scope.current?.querySelector("[data-hero='portrait']");
        if (!portrait) return;

        // Upward only. A slower-than-scroll drift would push the taped photo into
        // the stats section as the hero leaves; this way it withdraws instead.
        gsap.to(portrait, {
          y: -34,
          ease: "none",
          scrollTrigger: {
            trigger: portrait,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      // Fonts swap after first paint and change the heading's height, which moves
      // the trigger. One refresh once they settle keeps the parallax honest.
      let active = true;
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
          if (active) ScrollTrigger.refresh();
        });
      }

      return () => {
        active = false;
        mm.revert();
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
