import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createCheckout } from "./giving.server";

/**
 * Starts a giving checkout. Set STRIPE_SECRET_KEY as a secret to go live.
 */
export const startGiving = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        amount: z.number().positive().max(1000000),
        frequency: z.enum(["One-time", "Weekly", "Monthly"]),
        fund: z.string().min(1),
        email: z.string().email().optional(),
        origin: z.string().url(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => createCheckout(data, process.env["STRIPE_SECRET_KEY"]));
