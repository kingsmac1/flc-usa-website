import { createFileRoute } from "@tanstack/react-router";
import { Card, Section, SectionHeading } from "@/components/site/ui";
import { LEAD_PASTORS } from "@/data/pastors";
import { Reveal } from "@/components/site/motion";
import { CtaBand } from "@/components/site/CtaBand";

const title = "About Us | Fountain of Life Church USA";
const description =
  "Our mission, vision, history and leadership team at Fountain of Life Church USA in Indianapolis, Indiana.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const beliefs = [
  {
    title: "The Word of God",
    body: "The Bible is the inspired Word of God, the infallible rule of faith and conduct (2 Timothy 3:15-16).",
  },
  {
    title: "God Revealed Himself",
    body: "The one true God has revealed Himself as Father, Son and Holy Ghost (Deuteronomy 6:4; Matthew 28:19).",
  },
  {
    title: "Salvation by Grace",
    body: "The grace of God which brings salvation has appeared to all men through faith in Jesus Christ (Titus 2:11).",
  },
  {
    title: "Water Baptism",
    body: "Baptism by burial with Christ is observed by all who have repented and believed (Romans 6:4).",
  },
];

function AboutPage() {
  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="About FLC USA"
          title="A house built on purpose, prayer and the Word"
          intro="We are here to share the good news of Jesus Christ with all who will listen, and to guide men and women into their God-given destiny."
        />
      </Section>

      <Section tone="cream">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <Card>
              <h2 className="font-display text-2xl font-bold">Our Mission</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                To guide men and women to discover their purpose, inheritance and fulfil their
                God-given destiny in Christ through sound teaching, fervent prayer and genuine
                community.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card>
              <h2 className="font-display text-2xl font-bold">Our Vision</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A church without walls — reaching Indianapolis and the nations with the message of
                life, raising believers who are strong in faith and fruitful in service.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="What we believe"
          title="The truths that anchor this house"
          intro="A summary of our statement of faith. Full doctrinal notes will be published here."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {beliefs.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <li>
                <Card className="h-full">
                  <h3 className="font-display text-lg font-bold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
                </Card>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="Leadership"
          title="Meet our lead pastors"
          intro="Fountain of Life Church USA is led by Apostle Chuks and his wife, Evang. Josephine Akuma."
        />
        <ul className="mt-10 grid gap-8 lg:grid-cols-2">
          {LEAD_PASTORS.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.1}>
              <li className="overflow-hidden rounded-[2rem] border border-border bg-card">
                <img
                  src={l.img}
                  alt={`${l.name}, ${l.role} of Fountain of Life Church USA`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-top"
                />
                <div className="p-7">
                  <h3 className="font-display text-2xl font-bold">{l.name}</h3>
                  <p className="text-sm font-semibold text-muted-foreground">{l.role}</p>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {l.bio.map((para) => (
                      <p key={para.slice(0, 32)}>{para}</p>
                    ))}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand items={["visit", "prayer"]} tone="white" />
    </>
  );
}