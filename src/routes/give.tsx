import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartHandshake, Repeat, ShieldCheck } from "lucide-react";
import { PillButton, PillLink, Section, SectionHeading } from "@/components/site/ui";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

const title = "Give | Fountain of Life Church USA";
const description =
  "Support the mission of Fountain of Life Church USA with a one-time or recurring gift toward ministry, outreach and missions.";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/give" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/give" }],
  }),
  component: GivePage,
});

const AMOUNTS = ["25", "50", "100", "250"];
const FREQUENCIES = ["One-time", "Weekly", "Monthly"] as const;
const FUNDS = ["Tithes & Offering", "Building Fund", "Missions & Outreach", "Benevolence"];

/** Shape a payment provider (Stripe or similar) will consume in Phase 2. */
export type GiftIntent = {
  amount: number;
  currency: "USD";
  frequency: (typeof FREQUENCIES)[number];
  fund: string;
};

function GivePage() {
  const [frequency, setFrequency] = useState<GiftIntent["frequency"]>("One-time");
  const [amount, setAmount] = useState("50");
  const [fund, setFund] = useState(FUNDS[0]);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Give"
          title="Partner with the mission"
          intro="Every gift helps us reach our city, care for families and take the gospel further."
        />
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            className="rounded-3xl border border-border bg-card p-7"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <fieldset>
              <legend className="text-sm font-semibold">Giving frequency</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={frequency === f}
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "min-h-11 rounded-full border px-5 text-sm font-semibold",
                      frequency === f
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary text-foreground",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="text-sm font-semibold">Amount (USD)</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={amount === a}
                    onClick={() => setAmount(a)}
                    className={cn(
                      "min-h-11 rounded-full border px-5 text-sm font-semibold",
                      amount === a
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-secondary text-foreground",
                    )}
                  >
                    ${a}
                  </button>
                ))}
              </div>
              <label className="mt-4 block text-sm font-semibold">
                Other amount
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
                />
              </label>
            </fieldset>

            <label className="mt-7 block text-sm font-semibold">
              Designation
              <select
                value={fund}
                onChange={(e) => setFund(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
              >
                {FUNDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>

            <PillButton type="submit" variant="accent" className="mt-7 w-full">
              Continue to secure checkout
            </PillButton>
            <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
              {submitted
                ? `Preview only: a ${frequency.toLowerCase()} gift of $${amount} to ${fund} would be handed to the payment provider here.`
                : "Checkout connects to a secure payment provider with recurring giving in Phase 2."}
            </p>
          </form>

          <div className="grid gap-6">
            {[
              { icon: Repeat, title: "Recurring giving", body: "Set weekly or monthly gifts and manage them from your account once giving goes live." },
              { icon: ShieldCheck, title: "Secure by design", body: "Card details are never stored by the church — payments are handled by a certified provider." },
              { icon: HeartHandshake, title: "Other ways to give", body: `Give in person at ${SITE.address}, or contact ${SITE.email} for bank transfer details.` },
            ].map(({ icon: Icon, title: t, body }) => (
              <div key={t} className="rounded-3xl border border-border bg-card p-6">
                <Icon className="size-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 font-display text-lg font-bold">{t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
            <PillLink to="/contact" variant="outline">
              Questions about giving?
            </PillLink>
          </div>
        </div>
      </Section>
    </>
  );
}