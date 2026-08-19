import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendViaResend } from "./contact.server";

const schema = z.object({
  subject: z.string().min(1).max(160),
  fields: z
    .array(z.object({ label: z.string().max(120), value: z.string().max(4000) }))
    .max(30),
});

/** Sends a form submission by email through Resend when it is configured. */
export const sendChurchMessage = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => sendViaResend(data.subject, data.fields));
