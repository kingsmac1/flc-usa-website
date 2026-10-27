import { useEffect, useState } from "react";
import { getCookieChoice, onReopenCookieBanner, setCookieChoice, type CookieChoice } from "@/lib/cookieConsent";

const SITE = "Fountain of Life Church USA";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    // Staff areas aren't visitor pages: no banner there.
    if (/^\/(admin|dashboard|checkin)/.test(window.location.pathname)) return;
    const had = getCookieChoice() !== null;
    setAnswered(had);
    const timer = window.setTimeout(() => { if (!had) setOpen(true); }, 1800);
    const off = onReopenCookieBanner(() => setOpen(true));
    return () => { window.clearTimeout(timer); off(); };
  }, []);

  const choose = (choice: CookieChoice) => {
    setCookieChoice(choice);
    setAnswered(true);
    setOpen(false);
  };

  if (typeof window !== "undefined" && /^\/(admin|dashboard|checkin)/.test(window.location.pathname)) return null;

  return (
    <>
      {open && (
        <div
          role="dialog" aria-live="polite" aria-label="Cookie preferences"
          className="fixed bottom-4 left-4 right-4 z-[90] md:right-auto md:max-w-sm rounded-2xl bg-foreground p-5 text-background shadow-2xl"
          style={{ animation: "cookie-in 0.45s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <style>{"@keyframes cookie-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}"}</style>
          <p className="text-sm leading-relaxed text-background/80">
            <b className="text-background">Cookies.</b> We use essential cookies to keep this site working (including secure sign-in and forms). Accept all to also allow optional ones that help us improve it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => choose("all")} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Accept all</button>
            <button type="button" onClick={() => choose("essential")} className="rounded-full border border-background/30 px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-background/10">Essentials only</button>
          </div>
        </div>
      )}
      {answered && !open && (
        <button
          type="button" onClick={() => setOpen(true)} aria-label={`Cookie settings for ${SITE}`} title="Cookie settings"
          className="fixed bottom-4 left-4 z-[80] flex h-10 w-10 items-center justify-center rounded-full bg-foreground/80 text-background/90 opacity-60 shadow-lg backdrop-blur transition-opacity hover:opacity-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01"/></svg>
        </button>
      )}
    </>
  );
};

export default CookieConsent;
