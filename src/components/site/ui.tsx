import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        tone === "dark"
          ? "border-border bg-card text-primary"
          : "border-deep-foreground/20 bg-deep-foreground/10 text-deep-foreground",
      )}
    >
      <span aria-hidden="true" className="text-accent">
        ✦
      </span>
      {children}
    </span>
  );
}

type PillProps = {
  variant?: "primary" | "accent" | "outline" | "light";
  className?: string;
  children: ReactNode;
};

const pillBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const pillVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-deep",
  accent: "bg-accent text-accent-foreground hover:brightness-95",
  outline: "border border-primary/30 bg-transparent text-primary hover:bg-secondary",
  light: "border border-deep-foreground/30 text-deep-foreground hover:bg-deep-foreground/10",
} as const;

export function PillLink({
  variant = "primary",
  className,
  children,
  ...rest
}: PillProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(pillBase, pillVariants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function PillButton({
  variant = "primary",
  className,
  children,
  ...rest
}: PillProps & ComponentProps<"button">) {
  return (
    <button className={cn(pillBase, pillVariants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function Section({
  tone = "cream",
  className,
  children,
  ...rest
}: { tone?: "cream" | "white" | "deep" } & ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "py-16 sm:py-24",
        tone === "cream" && "bg-cream text-foreground",
        tone === "white" && "bg-card text-foreground",
        tone === "deep" && "bg-deep text-deep-foreground",
        className,
      )}
      {...rest}
    >
      <div className="container-flc">{children}</div>
    </section>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-3xl border border-border bg-card p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function StatCard({ value, label, tone = "light" }: { value: string; label: string; tone?: "light" | "accent" | "deep" }) {
  return (
    <div
      className={cn(
        "rounded-3xl p-6",
        tone === "light" && "border border-border bg-card",
        tone === "accent" && "bg-accent text-accent-foreground",
        tone === "deep" && "bg-deep text-deep-foreground",
      )}
    >
      <p className="font-display text-4xl font-black">{value}</p>
      <p className="mt-1 text-sm opacity-80">{label}</p>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
      <div>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
      </div>
      {intro ? <p className={cn("text-sm sm:text-base", tone === "dark" ? "text-muted-foreground" : "text-deep-foreground/75")}>{intro}</p> : null}
    </div>
  );
}