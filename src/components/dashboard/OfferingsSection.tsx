import { Loader2, ShieldCheck } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { Badge, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { OFFERING_CATEGORIES, formatDate } from "./shared";
import type { OfferingRow } from "./types";

type Props = {
  rows: OfferingRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  todayTotal: number;
  rangeTotal: number;

  offerFrom: string;
  offerTo: string;
  setOfferFrom: (v: string) => void;
  setOfferTo: (v: string) => void;

  offerDate: string;
  setOfferDate: (v: string) => void;
  offerAmount: string;
  setOfferAmount: (v: string) => void;
  offerCategory: string;
  setOfferCategory: (v: string) => void;
  offerNotes: string;
  setOfferNotes: (v: string) => void;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

const fmt = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function OfferingsSection(props: Props) {
  const {
    rows, isLoading, isError, error,
    todayTotal, rangeTotal,
    offerFrom, offerTo, setOfferFrom, setOfferTo,
    offerDate, setOfferDate,
    offerAmount, setOfferAmount,
    offerCategory, setOfferCategory,
    offerNotes, setOfferNotes,
    submitting, submitError, submitSuccess,
    onSubmit,
  } = props;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Pastor-only section</p>
        <p className="mt-1">
          Financial entries here are visible to the pastor role only and never shown to regular
          admins or members.
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-secondary/40 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <label className="block text-sm font-semibold">
            Service date
            <input
              required
              type="date"
              value={offerDate}
              onChange={(e) => setOfferDate(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="block text-sm font-semibold">
            Amount
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="block text-sm font-semibold">
            Category
            <select
              value={offerCategory}
              onChange={(e) => setOfferCategory(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            >
              <option value="">Select…</option>
              {OFFERING_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Notes
            <input
              type="text"
              value={offerNotes}
              onChange={(e) => setOfferNotes(e.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <PillButton type="submit" disabled={submitting} className="min-w-36">
            {submitting ? (
              <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving…</>
            ) : (
              "Add offering"
            )}
          </PillButton>
          {submitSuccess && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Recorded
            </span>
          )}
          {submitError && (
            <span role="alert" className="text-sm text-destructive">{submitError}</span>
          )}
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Today's total</p>
          <p className="mt-2 font-display text-3xl font-black">{fmt(todayTotal)}</p>
        </div>
        <div className="rounded-3xl border border-accent/40 bg-accent/5 p-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Range total ({offerFrom} → {offerTo})
          </p>
          <p className="mt-2 font-display text-3xl font-black text-accent-foreground">{fmt(rangeTotal)}</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Entries in range</p>
          <p className="mt-2 font-display text-3xl font-black">{rows.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block text-sm font-semibold">
          From
          <input
            type="date"
            value={offerFrom}
            onChange={(e) => setOfferFrom(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
        <label className="block text-sm font-semibold">
          To
          <input
            type="date"
            value={offerTo}
            onChange={(e) => setOfferTo(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
      </div>

      {isLoading ? (
        <LoadingRow message="Loading offerings…" />
      ) : isError ? (
        <ErrorBanner message={error} />
      ) : rows.length === 0 ? (
        <EmptyState message="No offerings recorded in this range." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Service date</Th>
              <Th align="right">Amount</Th>
              <Th>Category</Th>
              <Th>Notes</Th>
              <Th>Recorded by</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td>{formatDate(r.service_date)}</Td>
                <Td align="right"><p className="font-semibold">{fmt(Number(r.amount))}</p></Td>
                <Td>{r.category ? <Badge tone="gold">{r.category}</Badge> : "—"}</Td>
                <Td>{r.notes || "—"}</Td>
                <Td>{r.profiles?.full_name || "—"}</Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
