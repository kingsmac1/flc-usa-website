import { useEffect, useState } from "react";
import logo from "@/assets/images/flcusa-logo.png";

/**
 * Shows a breathing logo on deep green with a loading bar, then wipes
 * away vertically to reveal the page.
 */
export function Preloader() {
  const [progress, setProgress] = useState(8);
  const [wiping, setWiping] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : Math.min(100, p + Math.random() * 22)));
    }, 180);
    const wipe = window.setTimeout(() => setWiping(true), 1400);
    const finish = window.setTimeout(() => setDone(true), 2300);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(wipe);
      window.clearTimeout(finish);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-deep transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: wiping ? "translateY(-100%)" : "translateY(0)" }}
    >
      <img
        src={logo}
        alt=""
        className="animate-breathe w-40 sm:w-52"
      />
      <div className="mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-deep-foreground/20">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}