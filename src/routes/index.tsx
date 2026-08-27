import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Library, MapPin, Play, Radio, ShoppingBag, Sunrise } from "lucide-react";
import { EventCountdown, NEXT_SERVICE, ServiceCountdownCard } from "@/components/site/EventCountdown";
import { Card, Eyebrow, PillLink, Section, SectionHeading } from "@/components/site/ui";
import { LEAD_PASTORS, WELCOME } from "@/data/pastors";
import { PLACEHOLDER, SITE } from "@/data/site";
import { CtaBand } from "@/components/site/CtaBand";
import { Parallax, Reveal } from "@/components/site/motion";
import { EVENTS, formatEventDate } from "@/data/events";

const title = "Fountain of Life Church USA | Faith, Worship & Purpose";
const description =
  "A place of faith, worship and purpose in Indianapolis. Join Fountain of Life Church USA in person or online for services, devotionals and teachings.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Church",
          name: SITE.name,
          url: SITE.domain,
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "2415 Directors Row, Suite H",
            addressLocality: "Indianapolis",
            addressRegion: "IN",
            postalCode: "46241",
            addressCountry: "US",
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

const offerings = [
  {
    icon: Radio,
    title: "Livestream Services",
    body: "Join every Sunday and midweek gathering live from anywhere in the world.",
    to: "/livestream" as const,
    tone: "light" as const,
  },
  {
    icon: Sunrise,
    title: "Daily Devotional",
    body: "A fresh word, prayer and declaration for every day of the year.",
    to: "/devotional" as const,
    tone: "accent" as const,
  },
  {
    icon: Library,
    title: "Teachings Library",
    body: "Series, audio and articles that ground your faith in the Word.",
    to: "/teachings" as const,
    tone: "deep" as const,
  },
  {
    icon: ShoppingBag,
    title: "Book Store",
    body: "Books and study resources from our pastors and guest ministers.",
    to: "/books" as const,
    tone: "light" as const,
  },
];

function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-deep text-deep-foreground">
        <Parallax strength={40} className="absolute inset-0 -z-10">
          <img
            src={PLACEHOLDER.worship}
            alt="Worshippers with hands raised during a church service"
            className="size-full object-cover opacity-15"
          />
        </Parallax>
        <div className="container-flc grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <Eyebrow tone="light">Indianapolis · Sundays 10:00 AM</Eyebrow>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-black sm:text-6xl">
              Discover Your <span className="text-accent">Purpose</span>, Inheritance & Destiny in
              Christ
            </h1>
            <p className="mt-5 max-w-xl text-base text-deep-foreground/80">
              We welcome you with great joy to Fountain of Life Church USA — a family sharing the
              good news of Jesus Christ with all who will listen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PillLink to="/contact" variant="accent">
                Plan a Visit
              </PillLink>
              <Link
                to="/livestream"
                className="inline-flex items-center gap-3 text-sm font-semibold text-deep-foreground hover:text-accent"
              >
                <span className="grid size-11 place-items-center rounded-full border border-deep-foreground/30">
                  <Play className="size-4" aria-hidden="true" />
                </span>
                Watch Live
              </Link>
            </div>
          </div>

          <div className="lg:justify-self-end lg:w-full lg:max-w-sm">
            <ServiceCountdownCard target={NEXT_SERVICE.target} title={NEXT_SERVICE.title} />
          </div>
        </div>
      </section>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <Parallax strength={30}>
              <img
                src={WELCOME.image}
                alt={WELCOME.imageAlt}
                className="mx-auto aspect-[4/5] w-full max-w-md rounded-[2rem] object-cover object-top md:max-w-[62%] lg:max-w-none"
              />
            </Parallax>
          </Reveal>
          <Reveal delay={0.1}>
          <div>
            <Eyebrow>{WELCOME.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-black leading-tight sm:text-4xl">
              {WELCOME.heading}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              {WELCOME.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <p className="mt-6 font-display text-lg font-bold">{WELCOME.signature}</p>
            <p className="text-sm text-muted-foreground">{WELCOME.role}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PillLink to="/about">Meet our pastors</PillLink>
              <PillLink to="/contact" variant="outline">
                Plan a Visit
              </PillLink>
            </div>
          </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="white">
        <Reveal>
          <SectionHeading
            eyebrow="What we offer"
            title="Everything you need to grow, all in one place"
            intro="Whether you gather with us in Indianapolis or online, these are the doors into the life of the church."
          />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map((o, i) => {
            const Icon = o.icon;
            return (
              <Reveal key={o.title} delay={i * 0.08}>
                <li>
                  <div
                    className={[
                      "flex h-full flex-col rounded-3xl p-6",
                      o.tone === "light" && "border border-border bg-card",
                      o.tone === "accent" && "bg-accent text-accent-foreground",
                      o.tone === "deep" && "bg-deep text-deep-foreground",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Icon className="size-8" aria-hidden="true" />
                    <h3 className="mt-6 font-display text-lg font-bold">{o.title}</h3>
                    <p className="mt-2 text-sm opacity-80">{o.body}</p>
                    <Link
                      to={o.to}
                      className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-current/30 px-4 text-sm font-semibold"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Section tone="cream">
        <Reveal>
          <SectionHeading
            eyebrow="Upcoming events"
            title="What is coming up at the house"
            intro="Conferences, prayer nights and gatherings we'd love to see you at."
          />
        </Reveal>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {[...EVENTS]
            .sort((a, b) => (a.start < b.start ? -1 : 1))
            .slice(0, 2)
            .map((event, i) => (
              <Reveal key={event.slug} delay={i * 0.08}>
                <li className="overflow-hidden rounded-3xl border border-border bg-card">
                  <Link to="/events/$slug" params={{ slug: event.slug }} className="block">
                    <img
                      src={event.flyer}
                      alt={`${event.title} flyer`}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="p-6">
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        {event.type}
                      </span>
                      <h2 className="mt-3 font-display text-xl font-bold">{event.title}</h2>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                        {formatEventDate(event.start)}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4 text-primary" aria-hidden="true" />
                        {event.location}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">{event.summary}</p>
                      <span className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4">
                        View event
                      </span>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
        </ul>
        <Reveal delay={0.15}>
          <div className="mt-8 text-center">
            <PillLink to="/events" variant="outline">
              View all events
            </PillLink>
          </div>
        </Reveal>
      </Section>

      <EventCountdown {...NEXT_SERVICE} />

      <Section tone="white">
        <Reveal>
          <SectionHeading
            eyebrow="Our Lead Pastors"
            title="A word about our Lead Pastors"
            intro="Apostle Chuks and Evang. Josephine Akuma carry a heart to see every believer walk in purpose."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {LEAD_PASTORS.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.1}>
              <Card className="flex flex-col gap-6 sm:flex-row">
                <img
                  src={l.img}
                  alt={`${l.name}, ${l.role} of Fountain of Life Church USA`}
                  loading="lazy"
                  className="size-80 shrink-0 rounded-3xl object-cover object-top sm:size-64 lg:size-48"
                />
                <div>
                  <p className="text-base leading-relaxed">{l.bio[0]}</p>
                  <p className="mt-4 font-display font-bold">{l.name}</p>
                  <p className="text-sm text-muted-foreground">{l.role}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-accent py-14 text-accent-foreground">
        <div className="container-flc grid gap-6 md:grid-cols-[1.4fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-black sm:text-4xl">
              There is a place for you this Sunday
            </h2>
            <p className="mt-2 max-w-xl text-sm">
              Plan your visit to {SITE.address}, or partner with the work of the ministry through
              your giving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PillLink to="/contact" variant="primary">
              Plan a Visit
            </PillLink>
            <PillLink to="/give" variant="outline">
              Give Now
            </PillLink>
          </div>
        </div>
      </section>

      <Section tone="cream">
        <div className="grid gap-6 rounded-[2rem] border border-border bg-card p-8 md:grid-cols-2 md:items-center">
          <div>
            <Eyebrow>Free monthly devotional</Eyebrow>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Every month you will receive</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>A daily, uplifting devotional to meditate on and personalise.</li>
              <li>Inspiring Bible quotations to deepen the day's message.</li>
              <li>Prayers and declarations to boldly speak over your life.</li>
              <li>A Bible reading plan to guide you through the Bible in one year.</li>
            </ul>
            <PillLink to="/devotional" className="mt-6">
              <BookOpen className="size-4" aria-hidden="true" /> Read today's devotional
            </PillLink>
          </div>
          <img
            src={PLACEHOLDER.bible}
            alt="An open Bible on a wooden table"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover"
          />
        </div>
      </Section>

       <CtaBand items={["salvation", "prayer"]} tone="white" />
    </>
  );
}
