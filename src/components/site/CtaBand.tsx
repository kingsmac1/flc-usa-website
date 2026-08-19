import { HandHeart, HeartHandshake, Sparkles } from "lucide-react";
import { Reveal } from "./motion";
import { PillLink } from "./ui";

type CtaKey = "salvation" | "prayer" | "give" | "visit";

const CTAS: Record<
  CtaKey,
  { icon: typeof Sparkles; eyebrow: string; title: string; body: string; to: string; action: string }
> = {
  salvation: {
    icon: Sparkles,
    eyebrow: "Prayer of salvation",
    title: "Give your life to Christ today",
    body: "Say a simple prayer of salvation and begin a brand-new life with Jesus. We will walk with you from here.",
    to: "/salvation",
    action: "Say the prayer",
  },
  prayer: {
    icon: HeartHandshake,
    eyebrow: "Prayer request",
    title: "Let us stand with you in prayer",
    body: "Share what you are believing God for. Our intercessory team prays over every single request received.",
    to: "/prayer-request",
    action: "Submit a request",
  },
  give: {
    icon: HandHeart,
    eyebrow: "Partner with us",
    title: "Give toward the work of the ministry",
    body: "Your giving fuels outreach, missions and every soul reached through this house.",
    to: "/give",
    action: "Give now",
  },
  visit: {
    icon: Sparkles,
    eyebrow: "Plan a visit",
    title: "There is a place for you this Sunday",
    body: "Tell us when you are coming and we will be ready to welcome you personally.",
    to: "/plan-a-visit",
    action: "Plan your visit",
  },
};

/** Reusable CTA band. Pass any combination of CTA keys. */
export function CtaBand({ items = ["salvation", "prayer"] as CtaKey[], tone = "cream" as "cream" | "white" | "deep" }) {
  return (
    <section
      className={
        tone === "deep"
          ? "bg-deep py-16 text-deep-foreground sm:py-20"
          : tone === "white"
            ? "bg-card py-16 sm:py-20"
            : "bg-cream py-16 sm:py-20"
      }
    >
      <div className="container-flc grid gap-5 md:grid-cols-2">
        {items.map((key, i) => {
          const cta = CTAS[key];
          const Icon = cta.icon;
          const dark = tone === "deep";
          return (
            <Reveal key={key} delay={i * 0.08}>
              <div
                className={
                  dark
                    ? "flex h-full flex-col rounded-[2rem] border border-deep-foreground/15 bg-deep-foreground/5 p-8"
                    : "flex h-full flex-col rounded-[2rem] border border-border bg-card p-8"
                }
              >
                <Icon className="size-7 text-accent" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold tracking-wide uppercase text-accent">
                  {cta.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold">{cta.title}</h2>
                <p className={dark ? "mt-3 text-sm text-deep-foreground/75" : "mt-3 text-sm text-muted-foreground"}>
                  {cta.body}
                </p>
                <PillLink
                  to={cta.to}
                  variant={dark ? "accent" : "primary"}
                  className="mt-6 w-fit"
                >
                  {cta.action}
                </PillLink>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
