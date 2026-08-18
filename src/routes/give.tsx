import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Repeat, ShieldCheck } from "lucide-react";
import { GiveWidget } from "@/components/site/GiveWidget";
import { PillLink, Section, SectionHeading } from "@/components/site/ui";
import { SITE } from "@/data/site";
import { GIVING_METHODS, GIVING_NOTE, GIVING_OPTIONS } from "@/data/giving";

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

function GivePage() {
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
          <GiveWidget />

          <div className="grid gap-6">
            {[
              { icon: Repeat, title: "Recurring giving", body: "Set weekly or monthly gifts and manage them from your account." },
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

      <Section tone="white">
        <SectionHeading
          eyebrow="Giving details"
          title="Other ways to give"
          intro="Use any of the options below — every gift goes directly into the work of the ministry."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GIVING_OPTIONS.map((o) => (
            <li key={o.title} className="rounded-3xl bg-deep p-6 text-deep-foreground">
              <h3 className="font-display text-lg font-bold">{o.title}</h3>
              <p className="mt-2 text-sm text-deep-foreground/75">{o.body}</p>
            </li>
          ))}
        </ul>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {GIVING_METHODS.map((m) => (
            <li key={m.name} className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{m.name}</p>
              <p className="mt-2 font-display text-lg font-bold break-words">{m.detail}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">{GIVING_NOTE}</p>
      </Section>
    </>
  );
}
