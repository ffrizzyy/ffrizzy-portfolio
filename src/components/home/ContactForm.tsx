"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { SectionHeading } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { Field, NativeSelect, TextArea, TextInput } from "@/components/ui/Field";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { CONTACT_TOPICS, contactSchema, type ContactInput } from "@/lib/contact-schema";
import { LAYOUT, SITE } from "@/lib/constants";

/**
 * Spec 4.10 contact. One Zod schema shared with the route handler, inline
 * errors under each field, a hidden honeypot, and Cloudflare Turnstile only
 * when a site key is configured. No toast: spec 2.7 says form states are
 * inline.
 *
 * States: idle, sending (the button label becomes "Sending"), sent, error, and
 * rate-limited.
 */
type Status = "idle" | "sending" | "sent" | "error" | "rate-limited";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { topic: "Hiring", company: "" },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("sending");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken }),
      });

      if (response.status === 429) {
        setStatus("rate-limited");
        return;
      }

      const data: { ok?: boolean; error?: string } = await response
        .json()
        .catch(() => ({}) as { ok?: boolean; error?: string });

      if (!response.ok || data.ok === false) {
        setStatus("error");
        setServerError(data.error ?? "The message could not be sent.");
        return;
      }

      track(ANALYTICS_EVENTS.contactSubmit);
      reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setServerError("The network request failed. Email works too.");
    }
  };

  const sending = status === "sending";

  return (
    <section id="contact" className={`${LAYOUT.section} border-t-2 border-ink`}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading className="max-w-[16ch]">Have a project or a role in mind?</SectionHeading>
          <p className="mt-4 max-w-[65ch] text-base text-ink-muted">
            Send a short note about what you need. Email, LinkedIn, or the form all work.
          </p>
        </Reveal>

        <div className="mt-12 max-w-[640px]">
          {status === "sent" ? (
            <div
              role="status"
              className="reveal-fade flex flex-col gap-3 border-2 border-ink bg-paper-raised p-6"
            >
              <p className="font-display text-xl font-extrabold tracking-tight text-ink">
                Message sent.
              </p>
              <p className="text-sm text-ink-muted">
                Thanks. I read everything and usually reply within a couple of days.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="w-fit text-sm font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
              >
                Send another
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Field label="Name" error={errors.name?.message}>
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    autoComplete="name"
                    {...register("name")}
                  />
                )}
              </Field>

              <Field label="Email" error={errors.email?.message}>
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    type="email"
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    autoComplete="email"
                    {...register("email")}
                  />
                )}
              </Field>

              <Field label="Topic" error={errors.topic?.message}>
                {({ id, describedBy, invalid }) => (
                  <NativeSelect
                    id={id}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    {...register("topic")}
                  >
                    {CONTACT_TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </NativeSelect>
                )}
              </Field>

              <Field
                label="Message"
                error={errors.message?.message}
                hint="20 characters minimum."
              >
                {({ id, describedBy, invalid }) => (
                  <TextArea
                    id={id}
                    rows={5}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    {...register("message")}
                  />
                )}
              </Field>

              {/* Honeypot. Hidden from sight and from assistive tech, but a bot
                  that reads the DOM will still fill it in. */}
              <div aria-hidden className="hidden">
                <label htmlFor="contact-company">Company</label>
                <input id="contact-company" tabIndex={-1} autoComplete="off" {...register("company")} />
              </div>

              {turnstileSiteKey ? (
                <Turnstile
                  siteKey={turnstileSiteKey}
                  onSuccess={setTurnstileToken}
                  options={{ theme: "auto" }}
                />
              ) : (
                <p className="font-mono text-xs text-ink-muted">
                  Turnstile is not configured. Submissions are accepted in development mode.
                </p>
              )}

              {status === "error" || status === "rate-limited" ? (
                <div
                  role="alert"
                  className="reveal-fade border-2 border-danger bg-paper-raised p-4 text-sm"
                >
                  <p className="text-danger">
                    {status === "rate-limited"
                      ? "Too many messages from this connection. Wait a minute, or email me directly."
                      : (serverError ?? "The message could not be sent.")}
                  </p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-2 inline-block text-ink underline decoration-signal decoration-2 underline-offset-4"
                  >
                    {SITE.email}
                  </a>
                </div>
              ) : null}

              <div>
                <Button type="submit" variant="primary" size="md" disabled={sending}>
                  {sending ? "Sending" : "Send"}
                </Button>
              </div>
            </form>
          )}

          {/* LinkedIn, GitHub and the CV all sit in the footer a few lines below,
              so listing them here printed the same three links twice on one
              screen. The address stays: it is the one contact route the footer
              does not carry, and it is what this section is for. */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
              >
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
