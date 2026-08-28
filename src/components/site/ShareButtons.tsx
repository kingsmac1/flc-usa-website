"use client";

import { useState } from "react";
import { Check, Facebook, Link2, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareButtonsProps = {
  url: string;
  title: string;
  description?: string;
  className?: string;
};

function makeLinkHref(platform: "x" | "facebook" | "whatsapp", url: string, title: string) {
  switch (platform) {
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  }
}

const iconButton =
  "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-95";

const label: Record<"x" | "facebook" | "whatsapp", string> = {
  x: "Share on X",
  facebook: "Share on Facebook",
  whatsapp: "Share on WhatsApp",
};

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable — silently no-op */
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-semibold text-muted-foreground">Share:</span>
      <a
        href={makeLinkHref("x", url, title)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label.x}
        className={iconButton}
      >
        <X className="size-4" aria-hidden="true" />
      </a>
      <a
        href={makeLinkHref("facebook", url, title)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label.facebook}
        className={iconButton}
      >
        <Facebook className="size-4" aria-hidden="true" />
      </a>
      <a
        href={makeLinkHref("whatsapp", url, title)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label.whatsapp}
        className={iconButton}
      >
        <Share2 className="size-4" aria-hidden="true" />
      </a>
      <button
        type="button"
        aria-label={copied ? "Link copied" : "Copy link"}
        onClick={handleCopy}
        className={cn(iconButton, copied && "border-accent text-accent")}
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
