export type GiftIntentInput = {
  amount: number;
  frequency: "One-time" | "Weekly" | "Monthly";
  fund: string;
  email?: string;
  origin: string;
};

export type CheckoutResult = { configured: boolean; url: string | null; message: string };

const INTERVAL: Record<string, "week" | "month" | null> = {
  "One-time": null,
  Weekly: "week",
  Monthly: "month",
};

/**
 * Creates a Stripe Checkout Session (one-time or recurring) using the REST API,
 * so no Node-only SDK is required. Without STRIPE_SECRET_KEY it returns a
 * "not configured" result and the UI shows a friendly preview message.
 */
export async function createCheckout(
  input: GiftIntentInput,
  secretKey: string | undefined,
): Promise<CheckoutResult> {
  if (!secretKey) {
    return {
      configured: false,
      url: null,
      message: `Giving is not connected yet. A ${input.frequency.toLowerCase()} gift of $${input.amount} to ${input.fund} would be sent to the payment provider here.`,
    };
  }

  const interval = INTERVAL[input.frequency];
  const body = new URLSearchParams();
  body.set("mode", interval ? "subscription" : "payment");
  body.set("success_url", `${input.origin}/give?status=success`);
  body.set("cancel_url", `${input.origin}/give?status=cancelled`);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][unit_amount]", String(Math.round(input.amount * 100)));
  body.set("line_items[0][price_data][product_data][name]", `${input.fund} — Fountain of Life Church USA`);
  if (interval) body.set("line_items[0][price_data][recurring][interval]", interval);
  if (input.email) body.set("customer_email", input.email);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !json.url) {
    return {
      configured: true,
      url: null,
      message: json.error?.message ?? "We could not start checkout. Please try again.",
    };
  }
  return { configured: true, url: json.url, message: "Redirecting to secure checkout…" };
}
