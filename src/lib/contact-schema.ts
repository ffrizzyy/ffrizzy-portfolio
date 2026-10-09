import { z } from "zod";

/**
 * One contact schema, shared by the client form and the route handler, which is
 * what spec 4.10 asks for. Keeping it in its own module is what makes that
 * possible without the route importing a client component.
 */
export const CONTACT_TOPICS = ["Hiring", "Project", "Collaboration", "Other"] as const;

export const contactSchema = z.object({
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
   * bot. Spec 4.10: a filled honeypot returns a silent success and sends no
   * email.
   */
  company: z.string().max(0, "This field must stay empty.").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** The token is added by the widget after the schema is satisfied. */
export const contactRequestSchema = contactSchema.extend({
  turnstileToken: z.string().optional(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
