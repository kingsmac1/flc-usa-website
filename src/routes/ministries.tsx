import { createFileRoute } from "@tanstack/react-router";
import { PillLink, Section, SectionHeading } from "@/components/site/ui";
import { PLACEHOLDER } from "@/data/site";

const title = "Ministries | Fountain of Life Church USA";
const description =
  "Explore the ministries of Fountain of Life Church USA — prayer, youth, women, men, worship, outreach and more.";

export const Route = createFileRoute("/ministries")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ministries" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/ministries" }],
  }),
  component: MinistriesPage,
});

const ministries = [
  { name: "Prayer & Intercession", body: "Standing in the gap for our city and the nations every week.", img: PLACEHOLDER.prayer },
  { name: "Worship & Creative Arts", body: "Leading the congregation into the presence of God.", img: PLACEHOLDER.choir },
  { name: "Youth & Teens", body: "Raising a generation rooted in Christ and confident in purpose.", img: PLACEHOLDER.youth },
  { name: "Women of Life", body: "Fellowship, mentoring and prayer for women of every season.", img: PLACEHOLDER.congregation },
  { name: "Men of Valour", body: "Building men who lead their homes and communities well.", img: PLACEHOLDER.worship },
  { name: "City Outreach", body: "Practical love in action across Indianapolis and beyond.", img: PLACEHOLDER.outreach },
];

function MinistriesPage() {
  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Our ministries"
          title="Find your place in the family"
          intro="Every ministry is a doorway into community, service and growth. Placeholder descriptions can be replaced with real ministry copy."
        />
      </Section>

      <Section tone="cream">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <li key={m.name} className="overflow-hidden rounded-3xl border border-border bg-card">
              <img src={m.img} alt={m.name} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-6">
                <h2 className="font-display text-lg font-bold">{m.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
                <PillLink to="/contact" variant="outline" className="mt-5">
                  Get involved
                </PillLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}