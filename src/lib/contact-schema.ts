import { z } from "zod";

/**
 * One contact schema, shared by the client form and the route handler, which is
 * what spec 4.10 asks for. Keeping it in its own module is what makes that
 * possible without the route importing a client component.
 *
 * Both schemas are `.strict()`, so an unexpected field is a validation failure
 * rather than something that silently travels onward (OWASP A03, mass
 * assignment).
 */
export const CONTACT_TOPICS = ["Hiring", "Project", "Collaboration", "Other"] as const;

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Tell me your name.")
      .max(80, "That is longer than 80 characters."),
    email: z
      .string()
      .trim()
      .min(1, "An email address is required so I can reply.")
      .max(160, "That is longer than 160 characters.")
      // Deliberately strict: no whitespace of any kind, which excludes CR and
      // LF and therefore rules out header injection through the address.
      .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), {
        message: "Use an email address I can reply to.",
      }),
    topic: z.enum(CONTACT_TOPICS),
    message: z
      .string()
      .trim()
      .min(20, "A little more detail helps. 20 characters minimum.")
      .max(2000, "That is longer than 2000 characters."),
    /**
     * Honeypot. A real visitor never sees this field, so anything in it means a
     * bot.
     *
     * Deliberately NOT constrained to empty here. Constraining it would make a
     * filled honeypot fail validation and return a 400, which tells the bot it
     * was caught and invites a retry. The route instead treats a non-empty value
     * as a silent success and sends nothing, which is the behaviour spec 4.10
     * asks for.
     */
    company: z.string().max(200).optional(),
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;

/** The token is added by the widget after the schema is satisfied. */
export const contactRequestSchema = contactSchema
  .extend({
    turnstileToken: z.string().max(4096).optional(),
  })
  .strict();

export type ContactRequest = z.infer<typeof contactRequestSchema>;

/**
 * Collapses a value to a single safe line before it can reach an email header.
 *
 * This is the control that stops a name such as
 * "Ada\r\nBcc: someone@example.com" from adding a recipient. React escapes
 * output for the browser, but nothing escapes a mail header, so this has to be
 * explicit (OWASP A03: injection).
 */
export function singleLine(value: string, maxLength = 80): string {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
