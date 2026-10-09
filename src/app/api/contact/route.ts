import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactRequestSchema } from "@/lib/contact-schema";
import { SITE } from "@/lib/constants";

/**
 * Contact form handler. Spec 4.10: verify Turnstile, validate with the shared
 * Zod schema, send through Resend, return JSON.
 *
 * Spec 1.4 graceful degradation: with no secrets configured this still
 * validates and returns a clearly labelled development response instead of
 * throwing, so a fresh clone stays useful.
 */
export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

/**
 * Per-instance in-memory rate limit. It resets whenever the function cold
 * starts and does not coordinate across instances, which is an accepted
 * trade-off for a portfolio. A durable limit would belong in the host's edge
 * config or a KV store.
 */
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from this connection. Try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  const parsed = contactRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some fields need attention.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, topic, message, company, turnstileToken } = parsed.data;

  // Honeypot: a filled field means a bot, so report success and send nothing.
  if (company && company.length > 0) {
    return NextResponse.json({ ok: true, delivered: false, reason: "honeypot" });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken ?? "" }),
      },
    )
      .then((response) => response.json() as Promise<{ success?: boolean }>)
      .catch(() => ({ success: false }));

    if (!verification.success) {
      return NextResponse.json(
        { ok: false, error: "The spam check did not pass. Reload and try again." },
        { status: 400 },
      );
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email;

  if (!resendKey || !from) {
    // Documented development behaviour, not a silent failure.
    console.info(
      `[contact] No RESEND_API_KEY or CONTACT_FROM_EMAIL configured. ` +
        `Validated a message from ${email} about "${topic}" and did not send it.`,
    );
    return NextResponse.json({
      ok: true,
      delivered: false,
      reason: "development-mode",
    });
  }

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `[Portfolio] ${topic} from ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, `Topic: ${topic}`, "", message].join("\n"),
  });

  if (error) {
    console.error("[contact] Resend rejected the message:", error);
    return NextResponse.json(
      { ok: false, error: "The email provider rejected the message. Email works too." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
