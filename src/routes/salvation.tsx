import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { PillButton, PillLink, Section, SectionHeading } from "@/components/site/ui";
import { SITE } from "@/data/site";

const title = "Prayer of Salvation | Fountain of Life Church USA";
const description =
  "Say the prayer of salvation and give your life to Jesus Christ. Tell us about your decision so we can walk with you.";

export const Route = createFileRoute("/salvation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/salvation" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/salvation" }],
  }),
  component: SalvationPage,
});

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent";

function SalvationPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Salvation"
          title="The most important decision you will ever make"
          intro="Jesus loves you and gave His life for you. Today you can receive Him and begin a brand new life."
        />
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="rounded-3xl border border-border bg-card p-8">
            <Sparkles className="size-6 text-accent" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold">Say this prayer out loud</h2>
            <blockquote className="mt-5 rounded-3xl bg-secondary p-6 text-base leading-relaxed">
              <p>
                Lord Jesus, I come to You today just as I am. I believe You are the Son of God, that
                You died for my sins and that God raised You from the dead. I confess my sins and I
                turn away from them. Forgive me and wash me clean by Your blood.
              </p>
              <p className="mt-4">
                I receive You today as my Lord and my Saviour. Come into my heart, fill me with Your
                Holy Spirit and teach me to live for You. From this day forward, I belong to You.
                Thank You for saving me. In Jesus' name, amen.
              </p>
            </blockquote>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>
                If you prayed that prayer sincerely, the Bible says you are now a child of God (John
                1:12) and a new creation in Christ (2 Corinthians 5:17). Heaven is celebrating over
                you today.
              </p>
              <p>
                Your next steps: begin reading the Bible daily, talk to God in prayer, and join a
                Bible-believing church family. We would love to be that family for you.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PillLink to="/devotional" variant="outline">
                <BookOpen className="size-4" aria-hidden="true" />
                Start with today's devotional
              </PillLink>
              <PillLink to="/contact">Plan a visit</PillLink>
            </div>
          </article>

          <form
            className="h-fit rounded-3xl border border-border bg-card p-7"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            aria-label="Salvation decision form"
          >
            <h2 className="font-display text-xl font-bold">I prayed this prayer</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill this in so we can send you resources and walk with you from here.
            </p>
            <label className="mt-5 block text-sm font-semibold">
              Full name
              <input required name="name" type="text" autoComplete="name" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Email
              <input required name="email" type="email" autoComplete="email" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Phone (optional)
              <input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              City / Country
              <input name="location" type="text" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              My decision today
              <select name="decision" className={fieldClass}>
                <option>I gave my life to Christ for the first time</option>
                <option>I rededicated my life to Christ</option>
                <option>I would like to speak with a pastor</option>
              </select>
            </label>
            <PillButton type="submit" variant="accent" className="mt-6 w-full">
              Send my decision
            </PillButton>
            <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
              {sent
                ? "Welcome to the family! Someone from our team will reach out to you shortly."
                : `Questions? Email ${SITE.email}.`}
            </p>
          </form>
        </div>
      </Section>
    </>
  );
}
