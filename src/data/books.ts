import { PLACEHOLDER } from "./site";

/**
 * BOOK STORE
 * ----------
 * To add a book: copy one block below and edit it.
 *   cover        Import an image from "@/assets/images/..." or paste an image URL
 *   buyUrl       Amazon (or any external store) product link
 */
export type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  category: string;
  description: string;
  cover: string;
  buyUrl: string;
};

export const BOOK_CATEGORIES = ["All", "Purpose", "Family", "Discipleship", "Devotional"] as const;

export const BOOKS: Book[] = [
  {
    id: "discovering-your-purpose",
    title: "Discovering Your Purpose",
    author: "Apostle Chuks",
    price: "$14.99",
    category: "Purpose",
    description: "A practical guide to finding and walking in the assignment God wrote over your life.",
    cover: PLACEHOLDER.book,
    buyUrl: "https://www.amazon.com/",
  },
  {
    id: "the-praying-household",
    title: "The Praying Household",
    author: "Evang. Josephine Akuma",
    price: "$12.50",
    category: "Family",
    description: "Building a home where prayer is the culture and peace is the atmosphere.",
    cover: PLACEHOLDER.prayer,
    buyUrl: "https://www.amazon.com/",
  },
  {
    id: "foundations-of-faith",
    title: "Foundations of Faith",
    author: "FLC USA Teaching Team",
    price: "$9.99",
    category: "Discipleship",
    description: "Six foundational truths every believer should stand on.",
    cover: PLACEHOLDER.bible,
    buyUrl: "https://www.amazon.com/",
  },
  {
    id: "daily-fountain",
    title: "Daily Fountain: 90 Devotions",
    author: "Fountain of Life Church USA",
    price: "$18.00",
    category: "Devotional",
    description: "Ninety days of scripture, reflection, prayer and declarations.",
    cover: PLACEHOLDER.congregation,
    buyUrl: "https://www.amazon.com/",
  },
  {
    id: "walking-in-inheritance",
    title: "Walking in Inheritance",
    author: "Apostle Chuks",
    price: "$16.25",
    category: "Purpose",
    description: "Understanding what belongs to you in Christ — and how to take hold of it.",
    cover: PLACEHOLDER.worship,
    buyUrl: "https://www.amazon.com/",
  },
  {
    id: "raising-kingdom-children",
    title: "Raising Kingdom Children",
    author: "Evang. Josephine Akuma",
    price: "$13.75",
    category: "Family",
    description: "Parenting with intention, grace and the Word of God.",
    cover: PLACEHOLDER.youth,
    buyUrl: "https://www.amazon.com/",
  },
];
