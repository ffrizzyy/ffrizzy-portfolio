"use client";

import { useEffect, useRef } from "react";

type Star = {
  /** Normalised position, so a resize does not have to re-seed the field. */
  x: number;
  y: number;
  /** Parallax depth: near stars drift further per second than far ones. */
  z: number;
  radius: number;
  alpha: number;
  phase: number;
  twinkle: number;
};

/** `#rrggbb` plus an alpha, because canvas wants rgba and the tokens are hex. */
function wash(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * The galaxy behind the page.
 *
 * A canvas rather than a WebGL scene: a few hundred points and two radial
 * washes are cheap, need no dependency, and this page's content already asks the
 * browser for enough. Stars carry their own depth and twinkle phase, and drift
 * sideways over time, so the field never repeats visibly.
 *
 * The palette is the site's own. In dark mode the stars are paper-coloured with
 * two signal-coloured nebula washes. In light mode they are ink at a lower
 * alpha, which reads as dust in the paper rather than as a second design. No new
 * hue enters the page either way.
 *
 * Restraint: the loop pauses when the tab is hidden, the layer is
 * `pointer-events: none`, and under reduced motion it paints one static frame and
 * never starts a loop at all. There is no scroll listener.
 */
export function Galaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let dark = document.documentElement.dataset.theme === "dark";
    let raf = 0;
    let stopped = true;

    const seed = () => {
      const count = Math.round(Math.min(280, Math.max(90, (width * height) / 11000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.2 + Math.random() * 0.8,
        radius: 0.4 + Math.random() * 1.5,
        alpha: 0.25 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.15 + Math.random() * 0.4,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Positions are normalised, so a resize scales the same field. Re-seeding
      // here would make the stars jump every time a phone collapses its URL bar.
      if (stars.length === 0) seed();
      draw(performance.now() / 1000);
    };

    const draw = (seconds: number) => {
      ctx.clearRect(0, 0, width, height);

      // Two soft washes, signal only. In light mode they are almost nothing: the
      // point there is the dust, not a second colour on the paper.
      const span = Math.max(width, height);
      const clouds = [
        { x: width * 0.2, y: height * 0.16, r: span * 0.52, a: dark ? 0.15 : 0.055 },
        { x: width * 0.84, y: height * 0.68, r: span * 0.46, a: dark ? 0.1 : 0.04 },
      ];

      for (const cloud of clouds) {
        const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r);
        gradient.addColorStop(0, wash("#e2683a", cloud.a));
        gradient.addColorStop(1, wash("#e2683a", 0));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      const tint = dark ? "#e9eaea" : "#111214";
      const scale = dark ? 1 : 0.55;

      for (const star of stars) {
        // Wrap rather than clamp, so a star that leaves the right edge re-enters
        // on the left instead of piling up on the seam.
        const x = (star.x * width + seconds * star.z * 3.2) % width;
        const y = star.y * height + Math.sin(seconds * 0.22 + star.phase) * 2.6;
        const flicker = 0.55 + 0.45 * Math.sin(seconds * star.twinkle + star.phase);

        ctx.beginPath();
        ctx.arc(x, y, star.radius * (dark ? 1 : 0.8), 0, Math.PI * 2);
        ctx.fillStyle = wash(tint, Math.max(0, star.alpha * flicker) * scale);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      draw(now / 1000);
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (stopped) return;
      if (calm.matches) return;
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const sync = () => {
      stop();
      stopped = false;
      resize();
      if (!calm.matches && !document.hidden) start();
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
        return;
      }
      draw(performance.now() / 1000);
      start();
    };

    const onTheme = () => {
      const next = document.documentElement.dataset.theme === "dark";
      if (next === dark) return;
      dark = next;
      draw(performance.now() / 1000);
    };

    const onMotion = () => {
      stop();
      if (calm.matches) {
        draw(0);
      } else if (!document.hidden) {
        start();
      }
    };

    const themeObserver = new MutationObserver(onTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("resize", sync);
    document.addEventListener("visibilitychange", onVisibility);
    calm.addEventListener("change", onMotion);

    sync();

    return () => {
      stopped = true;
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      calm.removeEventListener("change", onMotion);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="galaxy-layer" />;
}
