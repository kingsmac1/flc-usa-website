import { PLACEHOLDER } from "./site";

/**
 * UPCOMING EVENTS
 * ---------------
 * To add an event, copy a block below and edit the fields.
 *   slug     used in the URL: /events/<slug>
 *   start    ISO datetime, e.g. "2026-09-12T18:00:00"
 *   flyer    import from "@/assets/images/..." or paste an image URL
 */
export type ChurchEvent = {
  slug: string;
  title: string;
  type: string;
  start: string;
  end?: string;
  location: string;
  flyer: string;
  summary: string;
  details: string[];
  registration?: boolean;
};

export const EVENTS: ChurchEvent[] = [
  {
    slug: "destiny-awakening-conference",
    title: "Destiny Awakening Conference",
    type: "Conference",
    start: "2026-09-18T18:00:00",
    end: "2026-09-20T13:00:00",
    location: "2415 Directors Row, Indianapolis, IN 46241 (Suite H)",
    flyer: PLACEHOLDER.event,
    summary:
      "Three days of teaching, prayer and impartation for everyone pursuing God's purpose for their life.",
    details: [
      "Our annual gathering brings the family together for focused teaching on purpose, inheritance and destiny.",
      "Sessions run each evening at 6:00 PM with a closing celebration service on Sunday morning.",
      "Admission is free. Registration helps us prepare seating and materials.",
    ],
    registration: true,
  },
  {
    slug: "night-of-intercession",
    title: "Night of Intercession",
    type: "Prayer",
    start: "2026-08-29T22:00:00",
    location: "Church auditorium & online",
    flyer: PLACEHOLDER.prayer,
    summary: "A monthly all-night prayer meeting for the church, the city and the nations.",
    details: [
      "We gather on the last Friday of every month to pray through the night.",
      "Join us in person or stream the meeting live from the livestream page.",
    ],
    registration: true,
  },
  {
    slug: "women-of-life-brunch",
    title: "Women of Life Brunch",
    type: "Women",
    start: "2026-10-11T11:00:00",
    location: "Church auditorium",
    flyer: PLACEHOLDER.congregation,
    summary: "A morning of fellowship, encouragement and honest conversation for women of all ages.",
    details: [
      "Hosted by Evang. Josephine Akuma with guest ministers and testimonies.",
      "Brunch is provided. Bring a friend.",
    ],
    registration: true,
  },
  {
    slug: "youth-encounter",
    title: "Youth Encounter Weekend",
    type: "Youth",
    start: "2026-11-06T17:30:00",
    end: "2026-11-08T16:00:00",
    location: "Church auditorium",
    flyer: PLACEHOLDER.youth,
    summary: "Worship, games and real talk for teenagers and young adults.",
    details: [
      "A weekend designed for young people to encounter God without pretence.",
      "Parents are welcome at the closing session on Sunday afternoon.",
    ],
    registration: true,
  },
];

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}

export function formatEventDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
