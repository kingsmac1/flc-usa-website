import { PLACEHOLDER } from "./site";

export type TeachingItem = {
  title: string;
  format: "Video" | "Audio" | "Article";
  duration: string;
};

export type Series = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  items: TeachingItem[];
};

/** Mocked teaching library. Replace with Supabase/YouTube data in Phase 2. */
export const SERIES: Series[] = [
  {
    slug: "foundations-of-faith",
    title: "Foundations of Faith",
    summary: "A six-part grounding in the doctrines every believer should stand on.",
    image: PLACEHOLDER.bible,
    items: [
      { title: "Faith That Pleases God", format: "Video", duration: "48 min" },
      { title: "The Authority of the Word", format: "Audio", duration: "39 min" },
      { title: "Baptism and New Life", format: "Article", duration: "8 min read" },
    ],
  },
  {
    slug: "the-praying-church",
    title: "The Praying Church",
    summary: "Cultivating a lifestyle of intercession for your home, city and nation.",
    image: PLACEHOLDER.prayer,
    items: [
      { title: "Watchmen on the Wall", format: "Video", duration: "52 min" },
      { title: "Praying the Scriptures", format: "Audio", duration: "35 min" },
    ],
  },
  {
    slug: "purpose-and-destiny",
    title: "Purpose & Destiny",
    summary: "Discovering the assignment God placed on your life before you were born.",
    image: PLACEHOLDER.worship,
    items: [
      { title: "Designed on Purpose", format: "Video", duration: "44 min" },
      { title: "Stewarding Your Gift", format: "Article", duration: "6 min read" },
      { title: "Seasons of Preparation", format: "Audio", duration: "41 min" },
    ],
  },
  {
    slug: "family-and-home",
    title: "Family & Home",
    summary: "Practical teaching for marriages, parenting and godly households.",
    image: PLACEHOLDER.congregation,
    items: [
      { title: "Covenant Marriage", format: "Video", duration: "56 min" },
      { title: "Raising Kingdom Children", format: "Audio", duration: "37 min" },
    ],
  },
];

export const getSeries = (slug: string) => SERIES.find((s) => s.slug === slug);