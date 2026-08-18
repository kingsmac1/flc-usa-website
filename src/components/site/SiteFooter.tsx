import { Link } from "@tanstack/react-router";
import logo from "@/assets/images/flcusa-logo.png";
import { FREE_GIFT, SITE } from "@/data/site";
import { PillButton } from "./ui";

const columns = [
  {
    title: "Ministries",
    links: [
      { label: "Prayer & Intercession", to: "/ministries" as const },
      { label: "Youth & Teens", to: "/ministries" as const },
      { label: "Women of Life", to: "/ministries" as const },
      { label: "Outreach", to: "/ministries" as const },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Livestream", to: "/livestream" as const },
      { label: "Daily Devotional", to: "/devotional" as const },
      { label: "Teachings", to: "/teachings" as const },
      { label: "Book Store", to: "/books" as const },
    ],
  },
  {
    title: "Church",
    links: [
      { label: "About Us", to: "/about" as const },
      { label: "Give", to: "/give" as const },
      { label: "Contact", to: "/contact" as const },
      { label: "Plan a Visit", to: "/contact" as const },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-deep text-deep-foreground">
      <div className="container-flc grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt={`${SITE.short} logo`} className="size-12 object-contain" />
            <span className="font-display text-lg font-black">Fountain of Life Church USA</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-deep-foreground/75">{SITE.tagline}</p>

          <form
            className="mt-6 max-w-sm"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <label htmlFor="footer-newsletter" className="text-sm font-semibold">
              Stay inspired — join our newsletter
            </label>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                id="footer-newsletter"
                type="email"
                placeholder="you@example.com"
                className="min-h-11 w-full rounded-full border border-deep-foreground/25 bg-deep-foreground/5 px-4 text-sm text-deep-foreground placeholder:text-deep-foreground/50 focus-visible:outline-2 focus-visible:outline-accent"
              />
              <PillButton type="submit" variant="accent" className="shrink-0">
                Subscribe
              </PillButton>
            </div>
          </form>

          <p className="mt-6 max-w-sm text-sm text-deep-foreground/80">
            Are you visiting us for the first time?{" "}
            <a
              href={FREE_GIFT.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent underline underline-offset-4"
            >
              Kindly click here for a free gift
            </a>{" "}
            from Apostle Chuks.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-display text-sm font-bold tracking-wide uppercase text-accent">{col.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-deep-foreground/80">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="font-display text-sm font-bold tracking-wide uppercase text-accent">Contact</h2>
            <address className="mt-4 space-y-2 text-sm text-deep-foreground/80 not-italic">
              <p>{SITE.address}</p>
              <p>
                <a className="hover:text-accent" href={`tel:${SITE.phone}`}>{SITE.phone}</a>
              </p>
              <p>
                <a className="hover:text-accent" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </address>
            <ul className="mt-4 flex flex-wrap gap-3 text-sm text-deep-foreground/80">
              {SITE.socials.map((s) => (
                <li key={s.label}>
                  <a className="hover:text-accent" href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-deep-foreground/15">
        <div className="container-flc flex flex-col gap-2 py-5 text-xs text-deep-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fountain of Life Church USA. All rights reserved.</p>
          <p>Indianapolis, Indiana · Sundays 10:00 AM</p>
        </div>
      </div>
    </footer>
  );
}