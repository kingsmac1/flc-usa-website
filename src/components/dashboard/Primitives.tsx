/**
 * Reusable tiny UI bits used across all sections.
 */
import { AlertTriangle, FileText, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export function StatCard({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: ReactNode;
  tone?: "light" | "accent" | "deep";
}) {
  const toneClasses = {
    light: "border-border bg-card",
    accent: "border-accent/40 bg-accent/5",
    deep: "border-deep-foreground/20 bg-deep-foreground/5",
  };
  return (
    <div className={"rounded-3xl border p-5 " + toneClasses[tone]}>
      <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-black">{value}</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full border border-border bg-secondary p-3 text-muted-foreground">
        <FileText className="size-6" aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  fullWidth = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={"relative " + (fullWidth ? "flex-1 min-w-[200px] max-w-sm" : "max-w-xs")}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-10 w-full rounded-2xl border border-border bg-secondary pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "accent" | "gold";
}) {
  const toneClasses = {
    light: "bg-secondary text-foreground",
    accent: "bg-accent/15 text-accent-foreground",
    gold: "bg-gold/15 text-gold-foreground",
  };
  return (
    <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " + toneClasses[tone]}>
      {children}
    </span>
  );
}

export function ConfirmButton({
  label,
  confirmLabel = "Confirm",
  onConfirm,
  variant = "outline",
  icon,
}: {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  variant?: "outline" | "destructive";
  icon?: React.ReactNode;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(false), 4000);
    return () => window.clearTimeout(t);
  }, [armed]);

  if (armed) {
    return (
      <button
        type="button"
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-destructive/50 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/15"
      >
        <AlertTriangle className="size-3.5" aria-hidden="true" />
        {confirmLabel}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setArmed(true)}
      className={
        (variant === "destructive"
          ? "inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
          : "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary ")
      }
    >
      {icon}
      {label}
    </button>
  );
}
