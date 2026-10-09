import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactRequestSchema, singleLine } from "@/lib/contact-schema";
import { SITE } from "@/lib/constants";

/**
 * Contact form handler.
 *
 * Spec 4.10: verify Turnstile, validate with the shared Zod schema, send
 * through Resend, return JSON.
 *
 * Spec 1.4 graceful degradation: with no secrets configured this still
 * validates and returns a clearly labelled development response instead of
 * throwing, so a fresh clone stays useful.
 *
 * Hardening applied here map to OWASP Top 10 2021 as follows:
 *   A01 broken access control   -> cross-site submissions are refused
 *   A03 injection               -> header values are collapsed to one line,
 *                                  unknown fields are rejected, and the JSON-LD
 *                                  script is escaped in the layout
 *   A04 insecure design         -> bounded rate limit, body size cap, timeouts
 *   A09 logging failures        -> security events are logged, PII is not
 */
export const runtime = "nodejs";

/** Nothing legitimate approaches this: the form caps out well below it. */
const MAX_BODY_BYTES = 8 * 1024;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
/** Ceiling on tracked clients so the limiter cannot become a memory leak. */
const MAX_TRACKED_CLIENTS = 5_000;

/**
 * Per-instance in-memory rate limit. It resets on a cold start and does not
 * coordinate across instances, which is an accepted trade-off for a portfolio.
 * A durable limit belongs in the host's edge config or a KV store.
 */
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();

  // Opportunistic sweep so sustained traffic from many addresses cannot grow
  // the map without bound (A04).
  if (hits.size > MAX_TRACKED_CLIENTS) {
    for (const [tracked, times] of hits) {
      const fresh = times.filter((time) => now - time < WINDOW_MS);
      if (fresh.length === 0) hits.delete(tracked);
      else hits.set(tracked, fresh);
    }
    if (hits.size > MAX_TRACKED_CLIENTS) hits.clear();
  }

  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

/**
 * Which client to charge. `x-forwarded-for` is attacker-controllable unless the
 * proxy overwrites it, so prefer `x-real-ip` and otherwise take the LAST entry,
 * which is the one the closest trusted proxy appended. A spoofed value can
 * still evade the limiter; Turnstile is the control that does not depend on it.
 */
function clientKey(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }

  return "unknown";
}

/**
 * Cross-site submission guard (A01/A04).
 *
 * Without it the endpoint is a spam relay any page can drive with a plain HTML
 * form. `Sec-Fetch-Site` settles it in every current browser; the Origin check
 * covers the rest. A request with neither header is a non-browser client, which
 * still has to pass Turnstile and the rate limit.
 */
function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/** Never let a browser or CDN cache a form response. */
function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    console.warn("[contact] rejected a cross-site submission");
    return json({ ok: false, error: "This form only accepts submissions from the site." }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Expected a JSON body." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "That message is too large." }, 413);
  }

  const key = clientKey(request);
  if (isRateLimited(key)) {
    return json(
      { ok: false, error: "Too many messages from this connection. Try again in a minute." },
      429,
    );
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: "Malformed request body." }, 400);
  }

  // Re-check the real size, since Content-Length can lie or be absent.
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "That message is too large." }, 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Malformed request body." }, 400);
  }

  const parsed = contactRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "Some fields need attention.",
        fields: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  }

  const { name, email, topic, message, company, turnstileToken } = parsed.data;

  // Honeypot: a filled field means a bot, so report success and send nothing.
  if (company && company.length > 0) {
    return json({ ok: true, delivered: false, reason: "honeypot" });
  }

  // A03: nothing from the request reaches a mail header as more than one line.
  const safeName = singleLine(name, 80);
  const safeTopic = singleLine(topic, 32);
  const safeEmail = singleLine(email, 160);

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken ?? "",
          remoteip: key === "unknown" ? undefined : key,
        }),
        // A hung verification must not hold a function open (A04).
        signal: AbortSignal.timeout(5_000),
      },
    )
      .then((response) => response.json() as Promise<{ success?: boolean }>)
      .catch(() => ({ success: false }));

    // Fails closed: any error, timeout, or rejection is treated as a failure.
    if (verification.success !== true) {
      console.warn("[contact] Turnstile verification failed");
      return json(
        { ok: false, error: "The spam check did not pass. Reload and try again." },
        400,
      );
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email;

  if (!resendKey || !from) {
    // Documented development behaviour, not a silent failure. No address is
    // logged, so this cannot become a PII trail in a shared log (A09).
    console.info(
      "[contact] No RESEND_API_KEY or CONTACT_FROM_EMAIL configured. " +
        `Validated a message about "${safeTopic}" and did not send it.`,
    );
    return json({ ok: true, delivered: false, reason: "development-mode" });
  }

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: safeEmail,
    subject: `[Portfolio] ${safeTopic} from ${safeName}`,
    text: [
      `Name: ${safeName}`,
      `Email: ${safeEmail}`,
      `Topic: ${safeTopic}`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    // The provider's message is useful to an operator and never returned to the
    // caller, so nothing internal leaks to the client.
    console.error("[contact] the email provider rejected the message:", error.message);
    return json(
      { ok: false, error: "The email provider rejected the message. Email works too." },
      502,
    );
  }

  return json({ ok: true, delivered: true });
}
