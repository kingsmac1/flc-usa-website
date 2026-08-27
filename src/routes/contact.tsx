import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { PillButton, PillLink, Section, SectionHeading } from "@/components/site/ui";
import { SITE } from "@/data/site";
import { CtaBand } from "@/components/site/CtaBand";

const title = "Contact Us | Fountain of Life Church USA";
const description =
  "Reach Fountain of Life Church USA in Indianapolis — visit us, call, email or send a message to the team.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent";

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Contact"
          title="We would love to hear from you"
          intro="Send a message, request prayer, or plan your first visit with us in Indianapolis."
        />
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            className="rounded-3xl border border-border bg-card p-7"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <h2 className="font-display text-xl font-bold">Send a message</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Name
                <input required name="name" type="text" autoComplete="name" className={fieldClass} />
              </label>
              <label className="text-sm font-semibold">
                Email
                <input required name="email" type="email" autoComplete="email" className={fieldClass} />
              </label>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              Message
              <textarea required name="message" rows={6} className={fieldClass} />
            </label>
            <PillButton type="submit" className="mt-6">
              Send message
            </PillButton>
            <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
              {sent
                ? "Thanks! Your message has been received — our team will get back to you shortly."
                : "We usually respond within two business days."}
            </p>
          </form>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-border bg-card p-7">
              <h2 className="font-display text-xl font-bold">Visit us</h2>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  {SITE.address}
                </li>
                <li className="flex gap-3">
                  <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}>{SITE.phone}</a>
                </li>
                <li className="flex gap-3">
                  <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </li>
              </ul>
              <PillLink to="/give" variant="outline" className="mt-6">
                Give to the ministry
              </PillLink>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <iframe
                title="Map showing the location of Fountain of Life Church USA"
                loading="lazy"
                className="h-64 w-full border-0"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-86.28%2C39.71%2C-86.22%2C39.75&layer=mapnik"
              />
            </div>
          </div>
        </div>
      </Section>

      <CtaBand items={["prayer", "give"]} tone="white" />
    </>
  );
}