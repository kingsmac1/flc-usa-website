import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendFormEmails } from "./contact.server";

const TEMPLATE_KEYS = [
  "contact_confirmation",
  "prayer_confirmation",
  "salvation_confirmation",
  "event_interest_confirmation",
  "membership_confirmation",
  "newsletter_confirmation",
  "checkin_confirmation",
  "owner_notification",
] as const;

const schema = z.object({
  formName: z.string().min(1).max(120),
  fields: z.array(z.object({ label: z.string().max(120), value: z.string().max(4000) })).max(30),
  submitterEmail: z.string().email().max(320),
  templateKey: z.enum(TEMPLATE_KEYS),
  variables: z.record(z.string(), z.string().max(400)).optional(),
  notifyOwner: z.boolean().optional(),
});

/** Emails the church office a copy of a form submission, and the submitter a confirmation. */
export const sendFormNotification = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => sendFormEmails(data));
