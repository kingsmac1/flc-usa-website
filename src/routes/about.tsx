import { createFileRoute } from "@tanstack/react-router";
import pastors from "@/assets/images/meet-our-pastors.jpg";
import pastorChukz from "@/assets/images/pastor-chukz.jpeg";
import { Card, Section, SectionHeading, StatCard } from "@/components/site/ui";
import { PLACEHOLDER } from "@/data/site";

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

const leaders = [
  { name: "Pastor Chukz", role: "Senior Pastor", img: pastorChukz },
  { name: "Our Senior Pastors", role: "Lead Ministers", img: pastors },
  { name: "Placeholder Name", role: "Associate Pastor", img: PLACEHOLDER.congregation },
  { name: "Placeholder Name", role: "Worship Pastor", img: PLACEHOLDER.choir },
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
          <Card>
            <h2 className="font-display text-2xl font-bold">Our Mission</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              To guide men and women to discover their purpose, inheritance and fulfil their
              God-given destiny in Christ through sound teaching, fervent prayer and genuine
              community.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-bold">Our Vision</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              A church without walls — reaching Indianapolis and the nations with the message of
              life, raising believers who are strong in faith and fruitful in service.
            </p>
          </Card>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard value="12+" label="Years of ministry" />
          <StatCard value="14" label="Active ministries" tone="accent" />
          <StatCard value="6" label="Countries reached" />
          <StatCard value="2,500+" label="Members & partners" tone="deep" />
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="What we believe"
          title="The truths that anchor this house"
          intro="A summary of our statement of faith. Full doctrinal notes will be published here."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {beliefs.map((b) => (
            <li key={b.title}>
              <Card className="h-full">
                <h3 className="font-display text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="Leadership"
          title="Meet our pastors and leaders"
          intro="Placeholder profiles — real photos and bios will be swapped in."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((l, i) => (
            <li key={`${l.name}-${i}`} className="overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src={l.img}
                alt={`${l.name}, ${l.role}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="p-5">
                <h3 className="font-display text-lg font-bold">{l.name}</h3>
                <p className="text-sm text-muted-foreground">{l.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}