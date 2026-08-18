import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { startGiving } from "@/lib/giving.functions";
import { cn } from "@/lib/utils";
import { PillButton } from "./ui";

const AMOUNTS = ["25", "50", "100", "250"];
export const FREQUENCIES = ["One-time", "Weekly", "Monthly"] as const;
export const FUNDS = [
  "Tithe",
  "Offering",
  "Seed of Faith",
  "Partnership",
  "Mission & Outreaches",
  "Projects",
  "Others",
];

export type GiftIntent = {
  amount: number;
  currency: "USD";
  frequency: (typeof FREQUENCIES)[number];
  fund: string;
};

/**
 * Giving form. Posts to the `startGiving` server function which redirects to
 * Stripe Checkout once STRIPE_SECRET_KEY is set; until then it previews the gift.
 */
export function GiveWidget({ compact = false }: { compact?: boolean }) {
  const submit = useServerFn(startGiving);
  const [frequency, setFrequency] = useState<GiftIntent["frequency"]>("One-time");
  const [amount, setAmount] = useState("50");
  const [fund, setFund] = useState(FUNDS[0]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setStatus(null);
    try {
      const result = await submit({
        data: {
          amount: Number(amount) || 0,
          frequency,
          fund,
          email: email || undefined,
          origin: window.location.origin,
        },
      });
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setStatus(result.message);
    } catch {
      setStatus("Something went wrong starting your gift. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const chip = (active: boolean, accent = false) =>
    cn(
      "min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors",
      active
        ? accent
          ? "border-primary bg-accent text-accent-foreground"
          : "border-primary bg-primary text-primary-foreground"
        : "border-border bg-secondary text-foreground hover:bg-secondary/70",
    );

  return (
    <form
      onSubmit={onSubmit}
      className={cn("rounded-3xl border border-border bg-card", compact ? "p-6" : "p-7")}
      aria-label="Giving form"
    >
      {compact ? (
        <h2 className="font-display text-lg font-bold">Give while you worship</h2>
      ) : null}

      <fieldset className={compact ? "mt-4" : ""}>
        <legend className="text-sm font-semibold">Giving frequency</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FREQUENCIES.map((f) => (
            <button key={f} type="button" aria-pressed={frequency === f} onClick={() => setFrequency(f)} className={chip(frequency === f)}>
              {f}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={compact ? "mt-5" : "mt-7"}>
        <legend className="text-sm font-semibold">Amount (USD)</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button key={a} type="button" aria-pressed={amount === a} onClick={() => setAmount(a)} className={chip(amount === a, true)}>
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

      <label className={cn("block text-sm font-semibold", compact ? "mt-5" : "mt-7")}>
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

      <label className="mt-5 block text-sm font-semibold">
        Email for your receipt (optional)
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
        />
      </label>

      <PillButton type="submit" variant="accent" className="mt-6 w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Starting checkout…" : "Continue to secure checkout"}
      </PillButton>
      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {status ?? "Payments are processed by a certified provider — card details never touch the church."}
      </p>
    </form>
  );
}
