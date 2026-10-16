"use client";

import dynamic from "next/dynamic";

import { SectionHeading } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/Reveal";
import { LAYOUT } from "@/lib/constants";

/**
 * Defers the contact form the way ReportMap defers Leaflet and
 * EvDciPanelDeferred defers Recharts.
 *
 * Why it needs a wrapper at all: `next/dynamic` with `ssr: false` is only
 * allowed inside a Client Component, and the Home page that renders this is a
 * Server Component.
 *
 * What this buys: the form is the only consumer of react-hook-form,
 * @hookform/resolvers/zod, zod, and @marsidev/react-turnstile in the whole
 * project, and it is the last section of the page. Leaving it eager put all
 * four libraries in the first load of a page whose visitor may never scroll
 * this far. With the split, the four move to a chunk that is fetched only after
 * the shell has painted.
 *
 * One caution for whoever measures this. In the previous build these four
 * libraries did not have a chunk of their own: they shared one with the whole
 * of Motion, because Carousel's drag and WorkList's `layout` use Motion and
 * both of those are still eager. That mixed chunk was one of the files the Home
 * route loaded eagerly, so removing the form can only take the form's own share
 * of it, and the size of that share cannot be read off statically. The split
 * definitely removes the form's four libraries from the first load; it may not
 * remove the whole file. Motion is dealt with in the report, not here, because
 * taking it out means changing how Carousel and WorkList animate.
 *
 * The heading, the intro sentence, and the mailto link stay in this shell on
 * purpose. They are CSS-only, they cost nothing, and keeping them here means
 * the section still reads correctly and sits in the same place in the document
 * with JavaScript disabled, which a fully deferred section would not.
 *
 * The fallback reserves the widget's footprint with the form's own geometry
 * rather than a guessed height: the same `flex flex-col gap-5` the real form
 * uses, four label-plus-control pairs built from the same classes Field.tsx
 * uses, and the same `h-11` submit button. The control heights are read off
 * those classes rather than eyeballed: `border-[1.5px] px-3 py-2.5` around one
 * `text-[0.95rem]` line box at the body's 1.65 line-height is 42px, and
 * `rows={5}` is 156px. Labels are real `text-sm` text drawn transparent, so
 * they are 23.1px rather than a guess. Only Turnstile, whose height is not a
 * function of the form's own classes, is reserved explicitly. The fallback is
 * `aria-hidden` because it carries no information.
 */
const LABELS = ["Name", "Email", "Topic", "Message"];
const CONTROL_HEIGHTS = ["h-[42px]", "h-[42px]", "h-[42px]", "h-[156px]"];

function ContactFormFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      {/* The label is the same `text-sm` at the body's 1.65 line-height as the
          real one, drawn transparent: 23.1px, not a guessed box. The control is
          `border-[1.5px] py-2.5` with the same line box, which is 42px for the
          input and the select, and rows={5} for the textarea. */}
      {LABELS.map((label, index) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="block text-sm font-medium text-transparent">{label}</span>
          <span
            className={`block w-full animate-pulse border-[1.5px] border-line bg-paper-sunken ${CONTROL_HEIGHTS[index]}`}
          />
        </div>
      ))}

      {/* The Turnstile widget is the one part whose height is not a function of
          the form's own classes, so it is reserved explicitly at the widget's
          interactive height. Without this the container grew by 65px the moment
          the chunk arrived and pulled the mailto link and the footer up. */}
      <div className="h-[65px]" />

      <div>
        <span className="block h-11 w-28 animate-pulse rounded-pill border-2 border-line bg-paper-sunken" />
      </div>
    </div>
  );
}

const ContactFormInner = dynamic(
  () => import("./ContactFormInner").then((module) => module.ContactFormInner),
  { ssr: false, loading: () => <ContactFormFallback /> },
);

export function ContactForm() {
  return (
    <section id="contact" className={`${LAYOUT.section} border-t-2 border-ink`}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading className="max-w-[16ch]">Have a project or a role in mind?</SectionHeading>
          <p className="mt-4 max-w-[65ch] text-base text-ink-muted">
            Send a short note about what you need. The form works, and the footer carries the
            email and the social links.
          </p>
        </Reveal>

        <div className="mt-12 max-w-[640px]">
          {/* LinkedIn, GitHub, the email address, and the CV all sit in the
              footer a few lines below, so listing them here printed the same
              links twice on one screen. The section is the form now, and the
              footer is the directory. */}
          <ContactFormInner />
        </div>
      </div>
    </section>
  );
}
