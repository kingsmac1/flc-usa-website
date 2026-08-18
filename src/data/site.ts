export const SITE = {
  name: "Fountain of Life Church USA",
  short: "FLC USA",
  domain: "https://flcusa.org",
  tagline:
    "Guiding men and women to discover their purpose, inheritance, and fulfil their God-given destiny in Christ.",
  address: "2415 Directors Row, Indianapolis, IN 46241 (Suite H)",
  phone: "+1 (463) 336-6108",
  email: "info@flcusa.org",
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/@fountainoflifechurchusa" },
    { label: "Instagram", href: "https://www.instagram.com/flcusa_online" },
    { label: "Facebook", href: "https://www.facebook.com/share/14UT7Tvna4U/" },
    { label: "TikTok", href: "https://www.tiktok.com/@flcusa" },
    { label: "X", href: "https://x.com/FLC_USA" },
  ],
} as const;

/**
 * FIRST-TIME VISITOR FREE GIFT
 * Replace `url` with the public link to the PDF once it is ready
 * (Google Drive / Dropbox direct link, or /free-gift.pdf in `public/`).
 */
export const FREE_GIFT = {
  url: "https://flcusa.org/free-gift.pdf",
  label: "Click here for a free gift from Apostle Chuks",
} as const;

/** Vision & mission — single source of truth. */
export const VISION = {
  text: "Our vision is to help men and women discover their purpose and inheritance in Christ and walk in them.",
  refs: "Ephesians 2:10 (KJV) · Ephesians 1:11 (KJV) · Colossians 1:12 (KJV)",
} as const;

export const MISSION = {
  text: "Our mission is to proclaim the truth of the gospel of Christ and reveal the glory of God to all nations, awakening the destinies of men and women so they may fulfill God's divine purpose.",
  refs: "Colossians 1:28-29 (TPT) · Romans 8:28 (KJV) · Ephesians 5:14 (KJV)",
} as const;

/** Primary navigation. `children` renders as a dropdown on desktop. */
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ministries", to: "/ministries" },
  { label: "Livestream", to: "/livestream" },
  { label: "Devotional", to: "/devotional" },
  { label: "Events", to: "/events" },
  {
    label: "Resources",
    to: "/teachings",
    children: [
      { label: "Teachings", to: "/teachings", description: "Series and messages on video" },
      { label: "Books", to: "/books", description: "Titles from the ministry" },
      { label: "Blog", to: "/blog", description: "Articles and church news" },
    ],
  },
  { label: "Give", to: "/give" },
  { label: "Contact", to: "/contact" },
] as const;

/** Flat list used by the mobile / tablet full-screen menu. */
export const MOBILE_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ministries", to: "/ministries" },
  { label: "Livestream", to: "/livestream" },
  { label: "Devotional", to: "/devotional" },
  { label: "Events", to: "/events" },
  { label: "Teachings", to: "/teachings" },
  { label: "Books", to: "/books" },
  { label: "Blog", to: "/blog" },
  { label: "Prayer Request", to: "/prayer-request" },
  { label: "Salvation", to: "/salvation" },
  { label: "Give", to: "/give" },
  { label: "Contact", to: "/contact" },
] as const;

/** Placeholder imagery — swap for real ministry photography any time. */
export const PLACEHOLDER = {
  worship:
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=80",
  congregation:
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80",
  prayer:
    "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1200&q=80",
  bible:
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
  choir:
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  outreach:
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
  youth:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  book: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  event:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  blog: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
} as const;
