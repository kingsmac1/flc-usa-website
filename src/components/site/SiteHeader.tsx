import { Link } from "@tanstack/react-router";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/images/flcusa-logo.png";
import { NAV_LINKS, SITE } from "@/data/site";
import { PillLink } from "./ui";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-deep text-deep-foreground md:block">
        <div className="container-flc flex items-center justify-between gap-4 py-2 text-xs">
          <div className="flex items-center gap-5">
            <a className="inline-flex items-center gap-2 hover:text-accent" href={`tel:${SITE.phone}`}>
              <Phone className="size-3.5" aria-hidden="true" />
              {SITE.phone}
            </a>
            <a className="inline-flex items-center gap-2 hover:text-accent" href={`mailto:${SITE.email}`}>
              <Mail className="size-3.5" aria-hidden="true" />
              {SITE.email}
            </a>
          </div>
          <ul className="flex items-center gap-4">
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

      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-flc grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={`${SITE.name} home`}>
            <img src={logo} alt={`${SITE.short} logo`} className="size-11 shrink-0 object-contain" />
            <span className="truncate font-display text-base font-black tracking-tight text-primary sm:text-lg">
              Fountain of Life Church <span className="text-gold">USA</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label="Main" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      activeOptions={{ exact: link.to === "/" }}
                      activeProps={{ className: "bg-secondary text-primary" }}
                      className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <PillLink to="/livestream" variant="accent" className="hidden sm:inline-flex">
              Watch Live
            </PillLink>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-primary xl:hidden"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav aria-label="Mobile" className="border-t border-border bg-background xl:hidden">
            <ul className="container-flc grid gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: link.to === "/" }}
                    activeProps={{ className: "bg-secondary text-primary" }}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground/85 hover:bg-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}