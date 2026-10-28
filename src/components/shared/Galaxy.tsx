"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import GalaxyField from "@/components/reactbits/Galaxy";

/**
 * The galaxy behind the page, using the React Bits shader.
 *
 * The registry component is kept as-is in `components/reactbits`; this wrapper
 * only supplies the site's palette and the theme switch. Both palettes are the
 * one ink/paper pair the rest of the page uses, so the sky never introduces a
 * colour that the content does not already carry, and the signal accent stays
 * reserved for controls and marks.
 *
 * The field is mounted only after hydration. `next-themes` cannot resolve the
 * theme on the server, and starting with the wrong palette would paint a dark
 * sky for a light reader before correcting itself. The static paper background
 * is what a reader sees for that first frame, which is the same surface the
 * canvas sits on anyway.
 *
 * `clickWarp` is off: the canvas is behind every link on the page and warping
 * the sky when a reader clicks a control would read as the page reacting to the
 * wrong thing. Mouse repulsion stays, so the field still answers the pointer.
 *
 * A software rasterizer (SwiftShader, llvmpipe, the Windows basic driver) never
 * gets the field. Compiling this shader there occupies the main thread for long
 * enough that the rest of the page never finishes hydrating, and this layer is
 * decoration, so the paper background is the better answer. Hardware rendering
 * is unaffected.
 *
 * The field is a slow drift, so it runs at one canvas pixel per CSS pixel and
 * 30 frames a second. At the registry defaults it repainted a full-viewport
 * shader on every display frame and held the whole page near 30fps on integrated
 * graphics; see 13.14 in the build spec for the numbers. Half resolution kept
 * that budget but softened the stars, and the sky is the one place on the page
 * where a soft edge shows.
 *
 * The light star tone is a mid grey, not ink. In light mode the shader draws the
 * sky as ink coverage, and that coverage scales with the star's own luminance,
 * so an ink-coloured star lands almost invisible on paper. A mid grey keeps the
 * marks the same ink colour but gives them enough coverage to read.
 */
let softwareField: boolean | null = null;

function isSoftwareRenderer() {
  if (softwareField !== null) return softwareField;

  try {
    const probe = document.createElement("canvas").getContext("webgl");
    if (!probe) {
      softwareField = true;
      return softwareField;
    }

    const info = probe.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(probe.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    probe.getExtension("WEBGL_lose_context")?.loseContext();
    softwareField = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    softwareField = true;
  }

  return softwareField;
}

export function Galaxy() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    setEnabled(!isSoftwareRenderer());
  }, [mounted, resolvedTheme]);

  if (!mounted || !resolvedTheme || !enabled) {
    return <div aria-hidden className="galaxy-frame" />;
  }

  const light = resolvedTheme === "light";

  return (
    <div aria-hidden className="galaxy-frame">
      <GalaxyField
        lightMode={light}
        transparent
        starColors={light ? ["#b3b8bf"] : ["#e9eaea"]}
        backgroundColor={light ? "#eceded" : "#0f1012"}
        clickWarp={false}
        mouseInteraction
        mouseRepulsion
        repulsionStrength={1.6}
        density={0.75}
        starSpeed={0.35}
        speed={0.55}
        rotationSpeed={0.06}
        glowIntensity={0.26}
        flareIntensity={1}
        twinkleIntensity={0.26}
        starSize={0.9}
        layers={2}
        saturation={0}
        hueShift={0}
        dpr={1}
        maxFps={30}
      />
    </div>
  );
}
