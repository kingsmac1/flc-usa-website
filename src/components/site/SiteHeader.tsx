import { Link } from "@tanstack/react-router";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/images/flcusa-logo.png";
import { NAV_LINKS, SITE } from "@/data/site";
import { PillLink } from "./ui";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 520);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-primary xl:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`fixed inset-0 z-[100] flex flex-col bg-deep text-deep-foreground xl:hidden ${
            closing ? "animate-overlay-out" : "animate-overlay-in"
          }`}
        >
          <div className="container-flc flex items-center justify-between py-4">
            <Link to="/" onClick={close} className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
              <img src={logo} alt={`${SITE.short} logo`} className="size-11 object-contain brightness-0 invert" />
              <span className="font-display text-base font-black">
                Fountain of Life Church <span className="text-accent">USA</span>
              </span>
            </Link>
            <button
              type="button"
              autoFocus
              aria-label="Close menu"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-full border border-deep-foreground/30"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="container-flc flex-1 overflow-y-auto py-6">
            <ul className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={close}
                    activeOptions={{ exact: link.to === "/" }}
                    activeProps={{ className: "text-accent" }}
                    className="block py-3 font-display text-3xl font-black tracking-tight text-deep-foreground hover:text-accent sm:text-4xl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="container-flc border-t border-deep-foreground/15 py-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <PillLink to="/livestream" variant="accent" onClick={close} className="flex-1">
                Watch Live
              </PillLink>
              <PillLink to="/give" variant="light" onClick={close} className="flex-1">
                Give
              </PillLink>
              <PillLink to="/contact" variant="light" onClick={close} className="flex-1">
                Plan a Visit
              </PillLink>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-deep-foreground/75">
              <a className="hover:text-accent" href={`tel:${SITE.phone}`}>{SITE.phone}</a>
              <a className="hover:text-accent" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
