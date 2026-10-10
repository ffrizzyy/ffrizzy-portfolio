"use client";

import { useEffect } from "react";

/**
 * The opening freeze. The page frosts over and clears once, on first load.
 *
 * The component renders nothing. It only writes `data-frost` onto the document
 * element, and the stylesheet does the rest: a fixed overlay that frosts and
 * clears, and a short blur on `#main` that eases back to zero. The whole effect
 * is CSS, so there is no library and no animation frame loop, and the only
 * JavaScript is one attribute write and one timer.
 *
 * It deliberately does not gate the content. Nothing is hidden, delayed, or
 * measured: the text and images paint on the first frame, the blur is small
 * enough to read through, and the overlay never takes pointer events.
 *
 * The attribute is set from an effect, which runs before the browser paints the
 * first frame, and removed the moment the animation is over. Removing it takes
 * the overlay out of the layout entirely, so nothing is left behind to
 * intercept a click, and a client-side route change cannot replay it.
 *
 * Reduced motion lives in one place: the global block in globals.css turns both
 * animations off and makes the frozen state identical to the resting state, so
 * the effect is skipped rather than shortened.
 */

/** The overlay's run, in milliseconds. Kept in step with `.frost-anim`. */
const FROST_MS = 1300;

/**
 * Whether this page load has already started the freeze.
 *
 * A development Strict Mode replay mounts and unmounts this component before
 * the timer has fired. Without this flag the replay would start a second run.
 * One run per page load, and the timer started by the first mount is the only
 * thing that removes the attribute.
 */
let frostStarted = false;

export function FrostIntro() {
  useEffect(() => {
    if (frostStarted) return;
    frostStarted = true;

    const root = document.documentElement;
    root.dataset.frost = "playing";

    const timer = window.setTimeout(() => {
      delete root.dataset.frost;
    }, FROST_MS);

    // Only reached if the page tears down before the run is over, which drops
    // the overlay rather than leaving it mid-animation.
    return () => {
      window.clearTimeout(timer);
      delete root.dataset.frost;
    };
  }, []);

  return null;
}
